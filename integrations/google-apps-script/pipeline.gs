/**
 * Axis & Sage · Pipeline
 *
 * A Google Apps Script web app bound to the Sheet "Axis & Sage · Pipeline". The website posts every lead, booking,
 * tool email and completed tool here. This script only records: it writes the rows and decides the soft rate limit.
 * Every email is sent by the website through Resend. Setup, properties and redeploying: see README.md next to this file.
 *
 * Script Property
 *   SHEET_WEBHOOK_SECRET  the same value as SHEET_WEBHOOK_SECRET in Vercel
 *
 * The website sends { payload, ts, sig } as text/plain. sig is the hex HMAC-SHA256 of ts + "." + JSON.stringify(payload).
 * This script replies { ok: true, limited } once the row is written. With limited: true the website sends no email.
 * Anything other than ok: true and the website keeps the lead in Blob and retries it from the daily cron.
 */

var MAX_AGE_MS = 5 * 60 * 1000;
var LEADS_TAB = "Leads";
var TOOLS_TAB = "Tools";
var LOG_TAB = "Delivered"; // hidden: one row per delivered id, so a retried delivery is never written twice

var LEADS_COLUMNS = ["Date", "Source", "Name", "Email", "Company", "Role", "Sentence", "When", "Heard via", "UTM source", "UTM medium", "UTM campaign", "Landing page", "Limited", "Stage", "Owner", "Next action", "Notes"];
var TOOLS_COLUMNS = ["Date", "Tool", "Answers", "Result", "UTM source"];
var STAGES = ["New lead", "Qualified", "Call booked", "Diagnostic proposed", "Diagnostic signed", "Programme proposed", "Programme signed", "Embedded", "Lost"];

var TOOLS_KEEP_DAYS = 365; // privacy notice: tool results without an email, up to 12 months
var DELIVERED_KEEP_DAYS = 90; // long enough to catch any retry the website sends

var props = PropertiesService.getScriptProperties();

/* ---------- Entry points ---------- */

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return reply({ ok: false, error: "bad_json" }); }
  if (!verify(body)) return reply({ ok: false, error: "signature" });

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var p = body.payload;
    if (alreadyDelivered(p.id)) return reply({ ok: true, limited: false, duplicate: true });
    var limited = p.type === "tool_complete" ? recordTool(p) : recordLead(p);
    markDelivered(p);
    return reply({ ok: true, limited: limited });
  } finally {
    lock.releaseLock();
  }
}

/** A health check: opening the web app URL in a browser shows this. */
function doGet() {
  return reply({ ok: true, service: "Axis & Sage pipeline" });
}

/* ---------- Signature ---------- */

function verify(body) {
  var secret = props.getProperty("SHEET_WEBHOOK_SECRET");
  if (!secret || !body || typeof body.ts !== "number" || typeof body.sig !== "string" || !body.payload) return false;
  if (Math.abs(Date.now() - body.ts) > MAX_AGE_MS) return false;
  var bytes = Utilities.computeHmacSha256Signature(body.ts + "." + JSON.stringify(body.payload), secret, Utilities.Charset.UTF_8);
  var expected = bytes.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("");
  if (expected.length !== body.sig.length) return false;
  var diff = 0;
  for (var i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ body.sig.charCodeAt(i);
  return diff === 0;
}

/* ---------- Soft rate limit (CacheService) ---------- */

/** Counts one hit against key in a fixed window. True while the count stays within max. */
function limit(key, max, windowSeconds) {
  var cache = CacheService.getScriptCache();
  var now = Date.now();
  var raw = cache.get("rl:" + key);
  var state = raw ? JSON.parse(raw) : { n: 0, reset: now + windowSeconds * 1000 };
  state.n += 1;
  var remaining = Math.max(1, Math.ceil((state.reset - now) / 1000));
  cache.put("rl:" + key, JSON.stringify(state), remaining);
  return state.n <= max;
}

/** 5 per 10 minutes per IP hash; 3 per hour per email. Over the limit the row is still added and marked Limited, and the website sends no email. */
function isLimited(p) {
  if (p.source === "booking") return false;
  var email = String(p.email || "").toLowerCase();
  var ipOk = p.ipHash ? limit("ip:" + p.ipHash, 5, 600) : true;
  var emailOk = email ? limit("email:" + email, 3, 3600) : true;
  return !(ipOk && emailOk);
}

/* ---------- Leads ---------- */

function recordLead(p) {
  var limited = isLimited(p);
  var first = (p.utm && (p.utm.first || p.utm.last)) || {};
  var isBooking = p.source === "booking";
  var isTool = p.type === "tool_email";
  var sentence = p.sentence || (isTool ? p.tool + " result" : firstLine(p.message));
  var heard = p.heard ? p.heard + (p.heardDetail ? " (" + p.heardDetail + ")" : "") : "";
  var notes = [];
  if (p.engagement) notes.push("Interested in: " + p.engagement);
  if (p.message && p.message !== sentence) notes.push(p.message);
  if (isTool && p.summary) notes.push(p.summary);
  // The site sends the call time already in Asia/Dubai, with the zone spelled out.
  if (isBooking && p.booking && (p.booking.startTimeLocal || p.booking.startTime)) notes.push("Call: " + (p.booking.startTimeLocal || p.booking.startTime + " (UTC)"));

  var row = [
    new Date(p.createdAt || Date.now()),
    isTool ? "tool · " + p.tool : p.source,
    p.name, p.email, p.company, p.role, sentence, p.when, heard,
    first.utm_source, first.utm_medium, first.utm_campaign,
    p.landingPage,
    limited ? "limited" : "",
    // A limited row is kept for the record but never enters the pipeline: no Stage.
    limited ? "" : isBooking ? "Call booked" : "New lead",
    "", "",
    notes.join("\n\n"),
  ];
  appendRow(leadsSheet(), row);
  return limited;
}

/* ---------- Tools ---------- */

function recordTool(p) {
  // Anonymous rows: drop floods from one address rather than mark them.
  if (p.ipHash && !limit("tools:" + p.ipHash, 20, 600)) return true;
  var r = p.result || {};
  var source = (p.utm && p.utm.first && p.utm.first.utm_source) || "";
  appendRow(toolsSheet(), [new Date(p.createdAt || Date.now()), p.tool, JSON.stringify(r.answers), JSON.stringify(r.result), source]);
  return false;
}

/* ---------- Sheets ---------- */

function leadsSheet() { return tab(LEADS_TAB, LEADS_COLUMNS); }
function toolsSheet() { return tab(TOOLS_TAB, TOOLS_COLUMNS); }

function tab(name, columns) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Appends one row. Never edits an existing one. Text that a spreadsheet would read as a formula is kept as text. */
function appendRow(sheet, values) {
  var safe = values.map(function (v) {
    if (v === undefined || v === null) return "";
    if (v instanceof Date) return v;
    var s = String(v).slice(0, 45000);
    return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
  });
  sheet.appendRow(safe);
  if (sheet.getName() === LEADS_TAB) {
    var row = sheet.getLastRow();
    sheet.getRange(row, LEADS_COLUMNS.indexOf("Stage") + 1).setDataValidation(stageRule());
  }
}

function stageRule() {
  return SpreadsheetApp.newDataValidation().requireValueInList(STAGES, true).setAllowInvalid(false).build();
}

function alreadyDelivered(id) {
  if (!id) return false;
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(LOG_TAB);
  if (!sheet || sheet.getLastRow() < 1) return false;
  return !!sheet.getRange(1, 1, sheet.getLastRow(), 1).createTextFinder(id).matchEntireCell(true).findNext();
}

function markDelivered(p) {
  if (!p.id) return;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(LOG_TAB);
  if (!sheet) { sheet = ss.insertSheet(LOG_TAB); sheet.hideSheet(); }
  sheet.appendRow([p.id, p.type, new Date()]);
}

/**
 * Run once from the editor after pasting the script: creates the Leads and Tools tabs with their headers, puts the
 * Stage dropdown on the whole Stage column, and schedules the daily clean-up.
 */
function setup() {
  var leads = leadsSheet();
  toolsSheet();
  var col = LEADS_COLUMNS.indexOf("Stage") + 1;
  leads.getRange(2, col, leads.getMaxRows() - 1, 1).setDataValidation(stageRule());
  leads.getRange(1, 1, leads.getMaxRows(), 1).setNumberFormat("yyyy-mm-dd hh:mm");
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === "prune") ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger("prune").timeBased().everyDays(1).atHour(4).create();
}

/* ---------- Retention ---------- */

/**
 * Daily: deletes anonymous Tools rows older than 12 months, as the privacy notice says, and old delivery ids.
 * Leads are never deleted automatically: review them by hand against the 24-month rule.
 */
function prune() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  pruneOlderThan(ss.getSheetByName(TOOLS_TAB), 1, TOOLS_KEEP_DAYS, 2);
  pruneOlderThan(ss.getSheetByName(LOG_TAB), 3, DELIVERED_KEEP_DAYS, 1);
}

/** Rows are appended in date order, so the old ones are a block at the top: delete that block in one call. */
function pruneOlderThan(sheet, dateColumn, days, firstDataRow) {
  if (!sheet || sheet.getLastRow() < firstDataRow) return 0;
  var cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  var dates = sheet.getRange(firstDataRow, dateColumn, sheet.getLastRow() - firstDataRow + 1, 1).getValues();
  var n = 0;
  while (n < dates.length && dates[n][0] instanceof Date && dates[n][0].getTime() < cutoff) n++;
  if (n) sheet.deleteRows(firstDataRow, n);
  return n;
}

/* ---------- Helpers ---------- */

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function firstLine(s) { return String(s || "").split("\n")[0].slice(0, 300); }

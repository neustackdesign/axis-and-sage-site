/**
 * Axis & Sage · Pipeline
 *
 * A Google Apps Script web app bound to the Sheet "Axis & Sage · Pipeline". The website posts every lead, booking,
 * tool email and completed tool here. Setup, properties and redeploying: see README.md next to this file.
 *
 * Script Properties
 *   SHEET_WEBHOOK_SECRET  the same value as SHEET_WEBHOOK_SECRET in Vercel
 *   FOUNDER_EMAILS        comma-separated founder addresses, copied on every lead alert
 *   FROM_ADDRESS          info@axisandsage.com
 *
 * The website sends { payload, ts, sig } as text/plain. sig is the hex HMAC-SHA256 of ts + "." + JSON.stringify(payload).
 * This script replies { ok: true } once the row is written. Anything else and the website keeps the lead in Blob
 * and retries it from the daily cron.
 */

var SITE_URL = "https://axisandsage.com";
var MAX_AGE_MS = 5 * 60 * 1000;
var LEADS_TAB = "Leads";
var TOOLS_TAB = "Tools";
var LOG_TAB = "Delivered"; // hidden: one row per delivered id, so a retried delivery is never written twice

var LEADS_COLUMNS = ["Date", "Source", "Name", "Email", "Company", "Role", "Sentence", "When", "Heard via", "UTM source", "UTM medium", "UTM campaign", "Landing page", "Limited", "Stage", "Owner", "Next action", "Notes"];
var TOOLS_COLUMNS = ["Date", "Tool", "Answers", "Result", "UTM source"];
var STAGES = ["New lead", "Qualified", "Call booked", "Diagnostic proposed", "Diagnostic signed", "Programme proposed", "Programme signed", "Embedded", "Lost"];

var props = PropertiesService.getScriptProperties();
var FROM = props.getProperty("FROM_ADDRESS") || "info@axisandsage.com";

/* ---------- Entry points ---------- */

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return reply({ ok: false, error: "bad_json" }); }
  if (!verify(body)) return reply({ ok: false, error: "signature" });

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var p = body.payload;
    if (alreadyDelivered(p.id)) return reply({ ok: true, duplicate: true });
    if (p.type === "tool_complete") recordTool(p);
    else recordLead(p);
    markDelivered(p);
    return reply({ ok: true });
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

/** 5 per 10 minutes per IP hash; 3 per hour per email. Over the limit the row is still added, marked Limited, and no email is sent. */
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
  if (isBooking && p.booking && p.booking.startTime) notes.push("Call: " + p.booking.startTime);

  var row = [
    new Date(p.createdAt || Date.now()),
    isTool ? "tool · " + p.tool : p.source,
    p.name, p.email, p.company, p.role, sentence, p.when, heard,
    first.utm_source, first.utm_medium, first.utm_campaign,
    p.landingPage,
    limited ? "limited" : "",
    isBooking ? "Call booked" : "New lead",
    "", "",
    notes.join("\n\n"),
  ];
  appendRow(leadsSheet(), row);

  if (limited) return;
  // The row is written: an email failure is logged, never retried, so a retry can't add the row twice.
  try { sendAlert(p, sentence); } catch (err) { console.error("alert failed", p.id, err); }
  try {
    if (isTool) sendToolEmail(p);
    else if (isContactOrCta(p.source) && p.sendAutoreply === true) sendAutoreply(p, sentence);
  } catch (err) { console.error("visitor email failed", p.id, err); }
}

/** Contact and CTA sources; the contact form may carry where the visitor came from ("contact · scorecard"). */
function isContactOrCta(source) {
  source = String(source || "");
  return source === "cta" || source === "contact" || source.indexOf("contact · ") === 0;
}

/* ---------- Tools ---------- */

function recordTool(p) {
  // Anonymous rows: drop floods from one address rather than mark them.
  if (p.ipHash && !limit("tools:" + p.ipHash, 20, 600)) return;
  var r = p.result || {};
  var source = (p.utm && p.utm.first && p.utm.first.utm_source) || "";
  appendRow(toolsSheet(), [new Date(p.createdAt || Date.now()), p.tool, JSON.stringify(r.answers), JSON.stringify(r.result), source]);
}

/* ---------- Email ---------- */

function founders() {
  return String(props.getProperty("FOUNDER_EMAILS") || "").split(",").map(function (s) { return s.trim(); }).filter(String).join(",");
}

function send(to, subject, text, html, extra) {
  var opts = { from: FROM, name: "Axis & Sage", replyTo: (extra && extra.replyTo) || FROM };
  if (html) opts.htmlBody = html;
  if (extra && extra.cc) opts.cc = extra.cc;
  GmailApp.sendEmail(to, subject, text, opts);
}

function sendAlert(p, sentence) {
  var label = p.source === "booking" ? "Call booked" : p.type === "tool_email" ? "Tool result (" + p.tool + ")" : "New lead";
  var utm = function (t) { return t ? [t.utm_source, t.utm_medium, t.utm_campaign].filter(String).join(" / ") || t.referrer || "direct" : "unknown"; };
  var lines = [
    label + ": " + (sentence || p.email),
    "",
    "Name: " + (p.name || ""),
    "Email: " + (p.email || ""),
    p.company ? "Company: " + p.company : "",
    p.role ? "Role: " + p.role : "",
    p.when ? "When: " + p.when : "",
    p.engagement ? "Interested in: " + p.engagement : "",
    p.heard ? "Heard via: " + p.heard + (p.heardDetail ? " (" + p.heardDetail + ")" : "") : "",
    p.message ? "\n" + p.message : "",
    p.summary ? "\n" + p.summary : "",
    "",
    "Source: " + (p.source || p.type),
    "First touch: " + utm(p.utm && p.utm.first),
    "Last touch: " + utm(p.utm && p.utm.last),
    "Referrer: " + (p.referrer || "none"),
    "Landing page: " + (p.landingPage || "unknown"),
    "Submitted on: " + (p.submissionPage || "unknown"),
    "",
    "Pipeline: " + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  ].filter(function (l, i, a) { return l !== "" || a[i - 1] !== ""; });
  send(FROM, label + ": " + (sentence || p.name || p.email), lines.join("\n"), null, { cc: founders(), replyTo: p.email || FROM });
}

function sendAutoreply(p, sentence) {
  var first = String(p.name || "").trim().split(/\s+/)[0];
  var said = stripUrls(sentence || p.message || "");
  var scorecard = SITE_URL + "/tools/conversion-scorecard";
  var text = [
    first ? "Thanks, " + first + "." : "Thanks.",
    "",
    "We have your note. One of us will reply within one working day.",
  ].concat(said ? ["", "You wrote:", "\"" + said + "\""] : []).concat([
    "",
    "While you wait, the Conversion Scorecard takes six minutes: " + scorecard,
    "",
    "Axis & Sage Advisory",
  ]).join("\n");
  var html = htmlEmail({
    heading: first ? "Thanks, " + escapeHtml(first) + "." : "Thanks.",
    paragraphs: ["We have your note. One of us will reply within one working day."].concat(said ? ["You wrote:<br><em>“" + escapeHtml(said) + "”</em>"] : []),
    action: { label: "Take the Conversion Scorecard", href: scorecard },
  });
  send(p.email, "We have your note · Axis & Sage", text, html);
}

function sendToolEmail(p) {
  var summary = p.summary || "";
  var diagnostic = p.diagnosticUrl || SITE_URL + "/contact?engagement=diagnostic#note";
  var text = [
    "Your " + p.tool + " result",
    "",
    summary,
    "",
    p.shareUrl ? "See it again: " + p.shareUrl : "",
    "Book a Diagnostic: " + diagnostic,
    "",
    "An illustrative planning estimate, not financial, legal or tax advice.",
    "",
    "Axis & Sage Advisory",
  ].filter(function (l, i, a) { return l !== "" || a[i - 1] !== ""; }).join("\n");
  var html = htmlEmail({
    heading: "Your " + escapeHtml(p.tool) + " result",
    paragraphs: ['<span style="white-space:pre-wrap;font-family:Menlo,monospace;font-size:13px;line-height:20px">' + escapeHtml(summary) + "</span>"]
      .concat(p.shareUrl ? ['<a href="' + escapeHtml(p.shareUrl) + '" style="color:#1F1F1F">See your result again</a>'] : [])
      .concat(['<span style="font-size:13px;color:#5B5A57">An illustrative planning estimate, not financial, legal or tax advice.</span>']),
    action: { label: "Book a Diagnostic", href: escapeHtml(diagnostic) },
  });
  send(p.email, "Your " + p.tool + " result · Axis & Sage", text, html);
}

/** Paper background, serif heading, mono label, one orange button. */
function htmlEmail(o) {
  var paras = o.paragraphs.map(function (t) { return '<p style="margin:0 0 16px;font:16px/25px Helvetica,Arial,sans-serif;color:#1F1F1F">' + t + "</p>"; }).join("");
  var action = o.action ? '<p style="margin:24px 0"><a href="' + o.action.href + '" style="display:inline-block;background:#E8590C;color:#1F1F1F;padding:14px 22px;font:500 15px Helvetica,Arial,sans-serif;text-decoration:none">' + o.action.label + "</a></p>" : "";
  return '<!doctype html><html><body style="margin:0;background:#ECEBE9"><div style="max-width:560px;margin:0 auto;padding:40px 24px">'
    + '<p style="margin:0 0 24px;font:12px/16px Menlo,monospace;letter-spacing:.08em;color:#5B5A57">AXIS &amp; SAGE ADVISORY</p>'
    + '<h1 style="margin:0 0 20px;font:400 28px/34px Georgia,serif;color:#1F1F1F">' + o.heading + "</h1>" + paras + action
    + '<p style="margin:32px 0 0;border-top:1px solid #D4D4D2;padding-top:16px;font:12px/18px Helvetica,Arial,sans-serif;color:#5B5A57">Axis &amp; Sage Advisory Limited · Masdar City Free Zone, Abu Dhabi, United Arab Emirates</p>'
    + "</div></body></html>";
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
 * Run once from the editor after pasting the script: creates the Leads and Tools tabs with their headers and puts the
 * Stage dropdown on the whole Stage column.
 */
function setup() {
  var leads = leadsSheet();
  toolsSheet();
  var col = LEADS_COLUMNS.indexOf("Stage") + 1;
  leads.getRange(2, col, leads.getMaxRows() - 1, 1).setDataValidation(stageRule());
  leads.getRange(1, 1, leads.getMaxRows(), 1).setNumberFormat("yyyy-mm-dd hh:mm");
}

/* ---------- Helpers ---------- */

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function firstLine(s) { return String(s || "").split("\n")[0].slice(0, 300); }

/** The auto-reply never echoes a link the visitor typed. */
function stripUrls(s) {
  return String(s || "")
    .replace(/https?:\/\/\S+/gi, "[link removed]")
    .replace(/\bwww\.\S+/gi, "[link removed]")
    .replace(/\b[a-z0-9-]+(\.[a-z0-9-]+)*\.(com|net|org|io|co|ru|xyz|info|biz|ng|ae|uk|app|dev|site|online|top|click|link)(\/\S*)?/gi, "[link removed]");
}

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

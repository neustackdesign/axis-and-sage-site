// Runs integrations/google-apps-script/pipeline.gs in a sandbox with Google's services mocked, and posts to it what the
// website posts: a body signed by src/lib/pipeline/sign.ts.
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const { signBody } = await import("../src/lib/pipeline/sign.ts");
const source = await readFile(new URL("../integrations/google-apps-script/pipeline.gs", import.meta.url), "utf8");
const SECRET = "test-secret";

function sandbox() {
  const sheets = new Map();
  const mail = [];
  const cache = new Map();
  const makeSheet = (name) => {
    const rows = [];
    let hidden = false;
    const range = (r, c, nr = 1, nc = 1) => ({
      setValues(v) { v.forEach((row, i) => { rows[r - 1 + i] = [...row]; }); return this; },
      setFontWeight() { return this; }, setDataValidation() { return this; }, setNumberFormat() { return this; },
      createTextFinder(text) { return { matchEntireCell() { return { findNext: () => rows.slice(r - 1, r - 1 + nr).some((row) => String(row[c - 1]) === text) || null }; } }; },
    });
    return { rows, getName: () => name, appendRow: (v) => rows.push(v), getLastRow: () => rows.length, getMaxRows: () => 1000, getRange: range, setFrozenRows() {}, hideSheet() { hidden = true; }, get hidden() { return hidden; } };
  };
  const ss = { getSheetByName: (n) => sheets.get(n) || null, insertSheet: (n) => { const s = makeSheet(n); sheets.set(n, s); return s; }, getUrl: () => "https://docs.google.com/spreadsheets/d/x" };
  const props = { SHEET_WEBHOOK_SECRET: SECRET, FOUNDER_EMAILS: "ifeanyi@axisandsage.com, tomiwa@axisandsage.com", FROM_ADDRESS: "info@axisandsage.com" };
  const ctx = {
    console: { error() {}, log() {} },
    JSON, Date, Math, String, Number, RegExp, Object,
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => props[k] ?? null }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cache.get(k) ?? null, put: (k, v) => cache.set(k, v) }) },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ss,
      newDataValidation: () => ({ requireValueInList(list) { this.list = list; return this; }, setAllowInvalid() { return this; }, build() { return { list: this.list }; } }),
    },
    GmailApp: { sendEmail: (to, subject, text, opts) => mail.push({ to, subject, text, opts }) },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (s) => ({ setMimeType: () => ({ body: JSON.parse(s) }) }) },
    Utilities: {
      Charset: { UTF_8: "UTF-8" },
      // Apps Script returns signed Java bytes.
      computeHmacSha256Signature: (value, key) => [...createHmac("sha256", key).update(value, "utf8").digest()].map((b) => (b > 127 ? b - 256 : b)),
    },
  };
  vm.createContext(ctx);
  vm.runInContext(source, ctx);
  const post = (body) => ctx.doPost({ postData: { contents: JSON.stringify(body) } }).body;
  return { ctx, sheets, mail, post };
}

const lead = (over = {}) => ({ type: "lead", id: `id-${Math.random().toString(36).slice(2)}`, createdAt: "2026-09-30T10:00:00.000Z", source: "contact", name: "Ada Obi", email: "ada@example.com", company: "Acme", sentence: "We need investors to commit to this round by this quarter.", when: "this quarter", ipHash: "h1", sendAutoreply: true, utm: { first: { utm_source: "linkedin", utm_medium: "social", utm_campaign: "launch" } }, landingPage: "/", ...over });

test("Apps Script accepts the website's signature, appends one Leads row and sends the alert and the auto-reply", () => {
  const s = sandbox();
  const p = lead({ name: "Ada Obi", company: "=HYPERLINK(\"x\")" });
  assert.deepEqual(s.post(signBody(p, SECRET)), { ok: true });
  const rows = s.sheets.get("Leads").rows;
  assert.deepEqual(rows[0].slice(0, 3), ["Date", "Source", "Name"]);
  assert.equal(rows.length, 2);
  const row = rows[1];
  assert.equal(row[1], "contact"); assert.equal(row[2], "Ada Obi"); assert.equal(row[4], "'=HYPERLINK(\"x\")", "formula injection is neutralised");
  assert.equal(row[6], p.sentence); assert.equal(row[9], "linkedin"); assert.equal(row[13], ""); assert.equal(row[14], "New lead");
  assert.equal(s.mail.length, 2);
  assert.equal(s.mail[0].to, "info@axisandsage.com");
  assert.equal(s.mail[0].opts.cc, "ifeanyi@axisandsage.com,tomiwa@axisandsage.com");
  assert.equal(s.mail[0].opts.from, "info@axisandsage.com");
  assert.equal(s.mail[0].opts.replyTo, "ada@example.com");
  assert.equal(s.mail[1].to, "ada@example.com");
  assert.match(s.mail[1].text, /Thanks, Ada\./);
});

test("Apps Script rejects a bad signature and a timestamp older than 5 minutes", () => {
  const s = sandbox();
  assert.deepEqual(s.post(signBody(lead(), "wrong")), { ok: false, error: "signature" });
  assert.deepEqual(s.post(signBody(lead(), SECRET, Date.now() - 6 * 60_000)), { ok: false, error: "signature" });
  const tampered = signBody(lead(), SECRET);
  tampered.payload.email = "eve@example.com";
  assert.deepEqual(s.post(tampered), { ok: false, error: "signature" });
  assert.equal(s.sheets.get("Leads"), undefined);
});

test("Apps Script never writes the same delivery twice (the cron may resend one it already has)", () => {
  const s = sandbox();
  const p = lead();
  s.post(signBody(p, SECRET));
  assert.deepEqual(s.post(signBody(p, SECRET)), { ok: true, duplicate: true });
  assert.equal(s.sheets.get("Leads").rows.length, 2);
});

test("Apps Script soft limit: the sixth lead in 10 minutes from one IP hash is added, marked limited, and sends nothing", () => {
  const s = sandbox();
  for (let i = 0; i < 6; i++) s.post(signBody(lead({ email: `p${i}@example.com` }), SECRET));
  const rows = s.sheets.get("Leads").rows.slice(1);
  assert.equal(rows.length, 6);
  assert.deepEqual(rows.map((r) => r[13]), ["", "", "", "", "", "limited"]);
  assert.equal(s.mail.length, 10);
});

test("Apps Script soft limit: the fourth lead in an hour from one email is limited", () => {
  const s = sandbox();
  for (let i = 0; i < 4; i++) s.post(signBody(lead({ ipHash: `ip${i}` }), SECRET));
  assert.deepEqual(s.sheets.get("Leads").rows.slice(1).map((r) => r[13]), ["", "", "", "limited"]);
});

test("Apps Script: bookings start at Call booked; no auto-reply without sendAutoreply", () => {
  const s = sandbox();
  s.post(signBody(lead({ source: "booking", sendAutoreply: false, sentence: "30 minute call", booking: { startTime: "2026-10-02T09:00:00Z" } }), SECRET));
  const row = s.sheets.get("Leads").rows[1];
  assert.equal(row[1], "booking"); assert.equal(row[14], "Call booked");
  assert.equal(s.mail.length, 1, "alert only");
});

test("Apps Script: tool emails send the result to the visitor with a share link and a Book a Diagnostic link", () => {
  const s = sandbox();
  s.post(signBody(lead({ type: "tool_email", source: "tool", tool: "Conversion Scorecard", sentence: undefined, summary: "Terms 25/100 · Moments 75/100", shareUrl: "https://axisandsage.com/tools/conversion-scorecard#r=abc", diagnosticUrl: "https://axisandsage.com/contact?source=scorecard#note", sendAutoreply: undefined }), SECRET));
  const row = s.sheets.get("Leads").rows[1];
  assert.equal(row[1], "tool · Conversion Scorecard");
  const visitor = s.mail.find((m) => m.to === "ada@example.com");
  assert.match(visitor.subject, /Your Conversion Scorecard result/);
  assert.match(visitor.text, /See it again: https:\/\/axisandsage\.com\/tools\/conversion-scorecard#r=abc/);
  assert.match(visitor.text, /Book a Diagnostic: /);
  assert.match(visitor.opts.htmlBody, /Book a Diagnostic/);
});

test("Apps Script: a completed tool is one anonymous Tools row and sends no email", () => {
  const s = sandbox();
  s.post(signBody({ type: "tool_complete", id: "t1", createdAt: "2026-09-30T10:00:00.000Z", tool: "Investor Readiness Score", result: { answers: { "story-0": "yes" }, result: { pct: 2 } }, ipHash: "h", utm: { first: { utm_source: "newsletter" } } }, SECRET));
  const rows = s.sheets.get("Tools").rows;
  assert.deepEqual([...rows[0]], ["Date", "Tool", "Answers", "Result", "UTM source"]);
  assert.deepEqual([...rows[1].slice(1)], ["Investor Readiness Score", "{\"story-0\":\"yes\"}", "{\"pct\":2}", "newsletter"]);
  assert.equal(s.mail.length, 0);
});

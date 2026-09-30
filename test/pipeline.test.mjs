import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { createHmac } from "node:crypto";

const [{ stripUrls, escapeHtml }, attribution, leads, core, sign, mailerlite, resend, emails] = await Promise.all([
  import("../src/lib/text.ts"),
  import("../src/lib/attribution.ts"),
  import("../src/lib/leads.ts"),
  import("../src/lib/pipeline/core.ts"),
  import("../src/lib/pipeline/sign.ts"),
  import("../src/lib/pipeline/mailerlite.ts"),
  import("../src/lib/pipeline/resend.ts"),
  import("../src/lib/pipeline/emails.ts"),
]);
const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");

test("the autoresponder never echoes a URL the visitor typed", () => {
  assert.equal(stripUrls("We need investors to commit, see https://evil.example/x and www.spam.io"), "We need investors to commit, see [link removed] and [link removed]");
  assert.equal(stripUrls("visit cheap-pills.ru/buy now"), "visit [link removed] now");
  assert.equal(stripUrls("We need our team to execute by March."), "We need our team to execute by March.");
  assert.equal(escapeHtml(`<a href="x">`), "&lt;a href=&quot;x&quot;&gt;");
});

test("attribution keeps first touch for 90 days and updates last touch on a new campaign", () => {
  const t0 = Date.parse("2026-09-01T00:00:00Z");
  const a = attribution.nextAttribution(null, { url: "https://axisandsage.com/?utm_source=linkedin&utm_campaign=launch", referrer: "https://www.linkedin.com/", now: t0, siteHost: "axisandsage.com" });
  assert.equal(a.first.utm_source, "linkedin");
  assert.equal(a.landing_page, "/?utm_source=linkedin&utm_campaign=launch");
  const b = attribution.nextAttribution(a, { url: "https://axisandsage.com/work", referrer: "https://axisandsage.com/", now: t0 + 1000, siteHost: "axisandsage.com" });
  assert.equal(b.last.utm_source, "linkedin", "internal navigation keeps last touch");
  const c = attribution.nextAttribution(b, { url: "https://axisandsage.com/?utm_source=newsletter", referrer: "", now: t0 + 2000, siteHost: "axisandsage.com" });
  assert.equal(c.first.utm_source, "linkedin");
  assert.equal(c.last.utm_source, "newsletter");
  const d = attribution.nextAttribution(c, { url: "https://axisandsage.com/?utm_source=google", referrer: "", now: t0 + 91 * 86400000, siteHost: "axisandsage.com" });
  assert.equal(d.first.utm_source, "google", "first touch expires after 90 days");
});

test("attribution sanitising drops unknown fields", () => {
  const s = attribution.sanitiseAttribution({ first: { utm_source: "x", evil: "y", at: "2026" }, page: "/contact", other: 1 });
  assert.deepEqual(s.first, { utm_source: "x", at: "2026" });
  assert.equal(s.page, "/contact");
  assert.equal("other" in s, false);
});

test("the mailto hand-over carries the visitor's sentence", () => {
  const m = leads.mailtoFor({ source: "cta", email: "a@b.co", who: "investors", what: "commit", when: "this quarter" });
  assert.match(decodeURIComponent(m), /We need investors to commit by this quarter\./);
});

/* ---------- The lead path, with Blob and Apps Script mocked ---------- */

/** An in-memory stand-in for the private Blob store that records every call in order. */
function memoryStore({ failPut = false } = {}) {
  const files = new Map();
  const calls = [];
  return {
    files, calls,
    async put(pathname, body) { calls.push(["put", pathname]); if (failPut) throw new Error("blob down"); files.set(pathname, body); },
    async list(prefix) { calls.push(["list", prefix]); return [...files.keys()].filter((k) => k.startsWith(prefix)); },
    async read(pathname) { calls.push(["read", pathname]); return files.get(pathname) ?? null; },
    async remove(pathname) { calls.push(["remove", pathname]); files.delete(pathname); },
  };
}
const payload = (id = "abc123") => ({ type: "lead", id, createdAt: "2026-09-30T10:00:00.000Z", source: "contact", email: "ada@example.com", name: "Ada" });
const now = () => new Date("2026-09-30T10:00:00.000Z");

test("3-second rule: under 3 seconds, or no timing at all, counts as too fast", () => {
  assert.equal(core.MIN_FILL_MS, 3000);
  assert.equal(core.tooFast(1000, 3999), true);
  assert.equal(core.tooFast(1000, 4000), false);
  assert.equal(core.tooFast(undefined, 4000), true);
  assert.equal(core.tooFast("1000", 9000), true);
});

test("Blob first: the lead is stored before it is forwarded, under pending/leads/<ISO time>-<id>.json", async () => {
  const store = memoryStore();
  const order = [];
  const forward = async () => { order.push(["forward", store.files.size]); return { ok: false, limited: false }; };
  const r = await core.deliver(payload(), { store, forward, now });
  assert.equal(r.stored, true); assert.equal(r.delivered, false);
  assert.equal(r.pathname, "pending/leads/2026-09-30T10-00-00-000Z-abc123.json");
  assert.deepEqual(order, [["forward", 1]], "the file exists when the forward runs");
  assert.deepEqual(JSON.parse(store.files.get(r.pathname)), payload(), "the full record waits for the cron");
});

test("Forward then delete: the Blob file goes once Apps Script confirms", async () => {
  const store = memoryStore();
  const r = await core.deliver(payload(), { store, forward: async () => ({ ok: true, limited: false }), now });
  assert.equal(r.delivered, true);
  assert.equal(r.limited, false);
  assert.equal(store.files.size, 0);
  assert.deepEqual(store.calls.map((c) => c[0]), ["put", "remove"]);
});

test("A forward that throws or times out still counts as stored, so the visitor sees success", async () => {
  const store = memoryStore();
  const r = await core.deliver(payload(), { store, forward: async () => { throw new Error("timeout"); }, now });
  assert.deepEqual([r.stored, r.delivered, store.files.size], [true, false, 1]);
});

test("If the Blob write fails, nothing is forwarded and the route hands over to mailto", async () => {
  const store = memoryStore({ failPut: true });
  let forwarded = false;
  const r = await core.deliver(payload(), { store, forward: async () => { forwarded = true; return { ok: true, limited: false }; }, now });
  assert.deepEqual([r.stored, r.delivered, forwarded], [false, false, false]);
  const route = await read("src/app/api/contact/route.ts");
  assert.match(route, /if \(!result\.stored\)[^\n]*fallback: true[^\n]*status: 503/);
  assert.match(route, /tooFast\(raw\.renderedAt, raw\.submittedAt\)/);
});

test("Signature format: { payload, ts, sig } with sig = HMAC-SHA256 hex of ts + '.' + JSON.stringify(payload)", () => {
  const p = payload();
  const body = sign.signBody(p, "s3cret", 1759226400000);
  assert.deepEqual(Object.keys(body), ["payload", "ts", "sig"]);
  assert.equal(body.sig, createHmac("sha256", "s3cret").update(`1759226400000.${JSON.stringify(p)}`).digest("hex"));
  assert.match(body.sig, /^[0-9a-f]{64}$/);
  // What Apps Script does: parse the body, re-stringify the payload, compare, and reject anything older than 5 minutes.
  const parsed = JSON.parse(JSON.stringify(body));
  assert.equal(sign.verifyBody(parsed, "s3cret", 1759226400000 + 60_000), true);
  assert.equal(sign.verifyBody(parsed, "s3cret", 1759226400000 + 5 * 60_000 + 1), false, "older than 5 minutes");
  assert.equal(sign.verifyBody({ ...parsed, payload: { ...p, email: "eve@example.com" } }, "s3cret", 1759226400000), false, "tampered");
  assert.equal(sign.verifyBody(parsed, "other", 1759226400000), false, "wrong secret");
});

test("forwardToSheet posts plain text, follows Apps Script's 302 and needs { ok: true }", async () => {
  const seen = [];
  const reply = (status, body) => async (url, init) => { seen.push({ url, init }); return new Response(JSON.stringify(body), { status }); };
  const opts = { url: "https://script.google.com/macros/s/x/exec", secret: "s3cret", now: () => 1759226400000 };
  assert.deepEqual(await core.forwardToSheet(payload(), { ...opts, fetchImpl: reply(200, { ok: true, limited: false }) }), { ok: true, limited: false });
  const { init } = seen[0];
  assert.equal(init.method, "POST");
  assert.equal(init.redirect, "follow");
  assert.match(init.headers["Content-Type"], /^text\/plain/);
  assert.ok(init.signal instanceof AbortSignal);
  const sent = JSON.parse(init.body);
  assert.equal(sent.sig, sign.signBody(payload(), "s3cret", 1759226400000).sig);
  assert.deepEqual(await core.forwardToSheet(payload(), { ...opts, fetchImpl: reply(200, { ok: true, limited: true }) }), { ok: true, limited: true });
  assert.equal((await core.forwardToSheet(payload(), { ...opts, fetchImpl: reply(200, { ok: false }) })).ok, false);
  assert.equal((await core.forwardToSheet(payload(), { ...opts, fetchImpl: reply(500, { ok: true }) })).ok, false);
  assert.equal((await core.forwardToSheet(payload(), { ...opts, url: "", fetchImpl: reply(200, { ok: true }) })).ok, false, "unconfigured");
  assert.equal(core.FORWARD_TIMEOUT_MS, 8000);
});

test("Cron retry re-forwards pending leads, re-sends pending subscribers and counts what's left", async () => {
  const store = memoryStore();
  store.files.set("pending/leads/a.json", JSON.stringify(payload("good")));
  store.files.set("pending/leads/b.json", JSON.stringify(payload("stuck")));
  store.files.set("pending/leads/c.json", "{not json");
  store.files.set("pending/subscribers/d.json", JSON.stringify({ email: "sub@example.com" }));
  store.files.set("pending/emails/e.json", JSON.stringify({ to: ["info@axisandsage.com"], subject: "New lead", text: "x" }));
  store.files.set("pending/emails/f.json", JSON.stringify({ to: ["bounce@example.com"], subject: "Your result", text: "x" }));
  const logged = [];
  const counts = await core.retryPending({
    store,
    forward: async (p) => ({ ok: p.id === "good", limited: false }),
    subscribe: async (email) => email === "sub@example.com",
    send: async (mail) => mail.to[0] === "info@axisandsage.com",
    log: (e, c) => logged.push([e, c]),
  });
  assert.deepEqual(counts, { leadsDelivered: 1, leadsPending: 1, subscribersSent: 1, subscribersPending: 0, emailsSent: 1, emailsPending: 1, unreadable: 1 });
  assert.deepEqual([...store.files.keys()].sort(), ["pending/emails/f.json", "pending/leads/b.json", "pending/leads/c.json"]);
  assert.equal(logged[0][0], "cron_retry");
  const cron = await read("src/app/api/cron/retry/route.ts");
  assert.match(cron, /Bearer \$\{config\.cronSecret\}|CRON_SECRET/);
  assert.match(await read("vercel.json"), /"\/api\/cron\/retry"/);
});

test("Newsletter: MailerLite first, parked in pending/subscribers/ when it fails", async () => {
  const store = memoryStore();
  assert.deepEqual(await core.subscribeOrPark("a@b.co", undefined, { store, subscribe: async () => true, now }), { ok: true, parked: false });
  assert.deepEqual(await core.subscribeOrPark("a@b.co", undefined, { store, subscribe: async () => false, now, id: "x1" }), { ok: true, parked: true });
  assert.ok(store.files.has("pending/subscribers/2026-09-30T10-00-00-000Z-x1.json"));
  assert.deepEqual(await core.subscribeOrPark("a@b.co", undefined, { store: memoryStore({ failPut: true }), subscribe: async () => false, now }), { ok: false, parked: false });
});

test("MailerLite gets the email and the group", async () => {
  let req;
  const sub = mailerlite.mailerLiteSubscribe({ apiKey: "k", groupId: "123", fetchImpl: async (url, init) => { req = { url, init }; return new Response("{}", { status: 201 }); } });
  assert.equal(await sub("a@b.co"), true);
  assert.equal(req.url, "https://connect.mailerlite.com/api/subscribers");
  assert.deepEqual(JSON.parse(req.init.body), { email: "a@b.co", groups: ["123"] });
  assert.equal(req.init.headers.Authorization, "Bearer k");
  assert.equal(await mailerlite.mailerLiteSubscribe({ apiKey: "", groupId: "" })("a@b.co"), false);
});

test("IP addresses are stored only as a salted SHA-256 hash", () => {
  const h = sign.hashIp("203.0.113.9", "salt");
  assert.match(h, /^[0-9a-f]{64}$/);
  assert.equal(h, sign.hashIp("203.0.113.9", "salt"));
  assert.notEqual(h, sign.hashIp("203.0.113.9", "pepper"));
  assert.doesNotMatch(h, /203/);
});

test("The IP hash goes to the Sheet with the live forward only; the Blob copy never holds it", async () => {
  const store = memoryStore();
  let forwarded;
  const r = await core.deliver({ ...payload(), ipHash: "stale" }, { store, forward: async (p) => { forwarded = p; return { ok: false, limited: false }; }, now }, { ipHash: "abc" });
  assert.equal(forwarded.ipHash, "abc");
  assert.equal("ipHash" in JSON.parse(store.files.get(r.pathname)), false);
});

test("A lead the Sheet marks limited is stored and delivered, and flagged so no email goes", async () => {
  const r = await core.deliver(payload(), { store: memoryStore(), forward: async () => ({ ok: true, limited: true }), now });
  assert.deepEqual([r.stored, r.delivered, r.limited], [true, true, true]);
  const lp = await read("src/lib/server/leadpath.ts");
  assert.match(lp, /if \(result\.limited\)[^\n]*return/);
});

test("Email: sent through Resend, or parked in pending/emails/ for the cron when the send fails", async () => {
  const store = memoryStore();
  const mail = { to: ["ada@example.com"], subject: "s", text: "t" };
  assert.deepEqual(await core.sendOrPark(mail, { store, send: async () => true, now }), { sent: true, parked: false });
  assert.deepEqual(await core.sendOrPark(mail, { store, send: async () => false, now, id: "m1" }), { sent: false, parked: true });
  assert.deepEqual(JSON.parse(store.files.get("pending/emails/2026-09-30T10-00-00-000Z-m1.json")), mail);
  assert.deepEqual(await core.sendOrPark(mail, { store: memoryStore({ failPut: true }), send: async () => { throw new Error("down"); }, now }), { sent: false, parked: false });
});

test("Resend gets the sender, recipients, Reply-To and both bodies", async () => {
  let req;
  const send = resend.resendSend({ apiKey: "re_x", from: "Axis & Sage <info@axisandsage.com>", fetchImpl: async (url, init) => { req = { url, init }; return new Response("{}", { status: 200 }); } });
  assert.equal(await send({ to: ["info@axisandsage.com"], cc: ["a@axisandsage.com"], replyTo: "ada@example.com", subject: "New lead", text: "t", html: "<p>h</p>" }), true);
  assert.equal(req.url, "https://api.resend.com/emails");
  assert.equal(req.init.headers.Authorization, "Bearer re_x");
  assert.deepEqual(JSON.parse(req.init.body), { from: "Axis & Sage <info@axisandsage.com>", to: ["info@axisandsage.com"], cc: ["a@axisandsage.com"], reply_to: "ada@example.com", subject: "New lead", text: "t", html: "<p>h</p>" });
  assert.equal(await resend.resendSend({ apiKey: "", from: "x" })({ to: ["a@b.co"], subject: "s", text: "t" }), false);
});

test("The alert goes to info@, copying the founders, with Reply-To set to the visitor", () => {
  const m = emails.alertMail({ ...payload(), sentence: "We need investors to commit.", utm: { first: { utm_source: "linkedin" } } }, { to: "info@axisandsage.com", cc: ["ifeanyi@axisandsage.com", "tomiwa@axisandsage.com"] });
  assert.deepEqual(m.to, ["info@axisandsage.com"]);
  assert.deepEqual(m.cc, ["ifeanyi@axisandsage.com", "tomiwa@axisandsage.com"]);
  assert.equal(m.replyTo, "ada@example.com");
  assert.equal(m.subject, "New lead: We need investors to commit.");
  assert.match(m.text, /First touch: linkedin/);
});

test("The auto-reply thanks the visitor, never repeats a link, and points to the Scorecard", () => {
  const m = emails.autoreplyMail({ ...payload(), name: "Ada Obi", message: "See https://evil.example/x please" }, "https://axisandsage.com");
  assert.deepEqual(m.to, ["ada@example.com"]);
  assert.match(m.text, /^Thanks, Ada\./);
  assert.doesNotMatch(m.text + m.html, /evil\.example/);
  assert.match(m.text, /https:\/\/axisandsage\.com\/tools\/conversion-scorecard/);
});

test("The tool email carries the result, a link back to it, a Book a Diagnostic link and the disclaimer", () => {
  const m = emails.toolResultMail({ ...payload(), type: "tool_email", tool: "Conversion Scorecard", summary: "Terms 25/100 <b>", shareUrl: "https://axisandsage.com/tools/conversion-scorecard#r=abc" }, "https://axisandsage.com");
  assert.equal(m.subject, "Your Conversion Scorecard result · Axis & Sage");
  assert.match(m.text, /See it again: https:\/\/axisandsage\.com\/tools\/conversion-scorecard#r=abc/);
  assert.match(m.text, /Book a Diagnostic: https:\/\/axisandsage\.com\/contact\?engagement=diagnostic#note/);
  assert.match(m.text, /not financial, legal or tax advice/);
  assert.match(m.html, /Terms 25\/100 &lt;b&gt;/, "visitor text is escaped in HTML");
});

test("The Apps Script records only: it verifies the signature, rate-limits softly and sends no email", async () => {
  const gs = await read("integrations/google-apps-script/pipeline.gs");
  assert.match(gs, /Utilities\.computeHmacSha256Signature/);
  assert.match(gs, /5 \* 60 \* 1000/);
  assert.match(gs, /CacheService/);
  assert.match(gs, /limit\("ip:" \+ p\.ipHash, 5, 600\)/);
  assert.match(gs, /limit\("email:" \+ email, 3, 3600\)/);
  assert.doesNotMatch(gs, /GmailApp|MailApp/);
  for (const stage of ["New lead", "Qualified", "Call booked", "Diagnostic proposed", "Diagnostic signed", "Programme proposed", "Programme signed", "Embedded", "Lost"]) assert.ok(gs.includes(`"${stage}"`), stage);
  const cal = await read("src/app/api/cal/route.ts");
  assert.match(cal, /verifyHexSignature/);
});

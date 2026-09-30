import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [{ stripUrls, escapeHtml }, attribution, leads] = await Promise.all([
  import("../src/lib/text.ts"),
  import("../src/lib/attribution.ts"),
  import("../src/lib/leads.ts"),
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

test("every entry point runs through the pipeline gate", async () => {
  for (const route of ["src/app/api/contact/route.ts", "src/app/api/newsletter/route.ts", "src/app/api/tool-result/route.ts"]) {
    assert.match(await read(route), /await gate\(request, lead\)/, route);
  }
  const pipeline = await read("src/lib/server/pipeline.ts");
  assert.match(pipeline, /verifyTurnstile/);
  assert.match(pipeline, /checkRateLimit/);
  assert.match(pipeline, /if \(!id && !notified\)/, "mailto only when both database and email fail");
  assert.match(pipeline, /stripUrls/);
  assert.match(pipeline, /after\(async/, "HubSpot never blocks the response");
  const rl = await read("src/lib/server/ratelimit.ts");
  assert.match(rl, /max: 5, windowMs: 10 \* 60_000/);
  assert.match(rl, /max: 3, windowMs: 60 \* 60_000/);
  const cal = await read("src/app/api/cal/route.ts");
  assert.match(cal, /verifyHexSignature/);
});

test("the mailto hand-over carries the visitor's sentence", () => {
  const m = leads.mailtoFor({ source: "cta", email: "a@b.co", who: "investors", what: "commit", when: "this quarter" });
  assert.match(decodeURIComponent(m), /We need investors to commit by this quarter\./);
});

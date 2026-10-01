// Final pre-launch corrections: Cal.com booking data, drawer semantics, work provenance, founder claims, the price.
// Content checks run on the canonical Sanity seed (see test/sanity.test.mjs for the migration itself).
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// Opt into the local Sanity seed for this test process only. Vercel Production builds run the tests with
// VERCEL_ENV=production, which the production guard (src/sanity/env.ts) rightly refuses with the seed; this file's
// process drops it so the offline content tests can run. The shell that runs `next build` is unaffected.
delete process.env.VERCEL_ENV;
process.env.SANITY_CONTENT_SOURCE = "seed";

const [cal, emails, load, vocab, lift] = await Promise.all([
  import("../src/lib/pipeline/cal.ts"),
  import("../src/lib/pipeline/emails.ts"),
  import("../src/sanity/load.ts"),
  import("../src/lib/content/vocab.ts"),
  import("../src/lib/tools/lift.ts"),
]);
const read = (p) => readFile(new URL(`../${p}`, import.meta.url), "utf8");

const booking = (responses, startTime = "2026-10-02T09:00:00Z") => ({
  triggerEvent: "BOOKING_CREATED",
  payload: { title: "30 Min Meeting between Axis & Sage and Ada Obi", startTime, attendees: [{ name: "Ada Obi", email: "ada@example.com" }], responses },
});

/* ---------- Cal.com ---------- */

test("Cal: object-valued answers are never stringified; empty values are skipped", () => {
  const b = cal.parseCalBooking(booking({
    name: { label: "Your name", value: "Ada Obi" },
    email: { label: "Email address", value: "ada@example.com" },
    location: { label: "Location", value: { type: "integrations:google:meet", optionValue: "" } },
    guests: { label: "Additional guests", value: [] },
    rescheduleReason: { label: "Reason", value: "" },
    company: { label: "Company", value: "Acme Holdings" },
    phone: { label: "Phone", value: "   " },
    budget: { label: "Budget", value: 25000 },
    plain: "A plain answer",
    nothing: null,
  }));
  assert.equal(b.message, "Company: Acme Holdings\nBudget: 25000\nplain: A plain answer");
  assert.doesNotMatch(b.message, /\[object Object\]|Location|Additional guests|Reason|Phone/);
  assert.equal(cal.answerText({ value: { nested: true } }), null);
  assert.equal(cal.answerText({ label: "x" }), null);
  assert.equal(cal.answerText(["a"]), null);
  assert.equal(cal.answerText({ value: "  yes  " }), "yes");
});

test("Cal: the sentence is the answer to the required question, not the event title", () => {
  const byLabel = cal.parseCalBooking(booking({ "who-needs-to-act": { label: "Who needs to act, and what do you need them to do?", value: "We need investors to commit to this round." }, notes: { label: "Anything else?", value: "Board meets Friday." } }));
  assert.equal(byLabel.sentence, "We need investors to commit to this round.");
  assert.equal(byLabel.message, "Anything else?: Board meets Friday.", "the sentence isn't repeated in Notes");
  const byOtherKey = cal.parseCalBooking(booking({ q1: { label: "who needs to act and what do you need them to do", value: "Our team to adopt the new system." } }));
  assert.equal(byOtherKey.sentence, "Our team to adopt the new system.");
  const none = cal.parseCalBooking(booking({ notes: { label: "Notes", value: "Hello" } }));
  assert.equal(none.sentence, undefined, "no fallback to the event title");
  assert.notEqual(none.sentence, "30 Min Meeting between Axis & Sage and Ada Obi");
});

test("Cal: the call time is shown in Asia/Dubai with the zone explicit", () => {
  const b = cal.parseCalBooking(booking({}, "2026-10-02T09:00:00Z"));
  assert.equal(b.booking.startTime, "2026-10-02T09:00:00Z");
  assert.equal(b.booking.timeZone, "Asia/Dubai");
  assert.equal(b.booking.startTimeLocal, "Fri, 2 Oct 2026, 13:00 GST (Asia/Dubai, UTC+4)");
  assert.equal(cal.formatCallTime("2026-12-31T21:30:00Z"), "Fri, 1 Jan 2027, 01:30 GST (Asia/Dubai, UTC+4)", "date rolls over in Dubai");
  assert.equal(cal.formatCallTime("not a date"), undefined);
  const alert = emails.alertMail({ type: "lead", id: "x", createdAt: "", source: "booking", email: "ada@example.com", booking: b.booking }, { to: "info@example.com" });
  assert.match(alert.text, /Call: Fri, 2 Oct 2026, 13:00 GST \(Asia\/Dubai, UTC\+4\)/);
});

test("Cal: no attendee email, no lead", () => {
  assert.equal(cal.parseCalBooking({ payload: { attendees: [{}] } }), null);
});

test("Cal route uses the parser and never the event title as the sentence", async () => {
  const route = await read("src/app/api/cal/route.ts");
  assert.match(route, /parseCalBooking/);
  assert.doesNotMatch(route, /sentence: p\.title|String\(v/);
});

/* ---------- Drawer ---------- */

test("The mobile drawer is a labelled modal dialog, keeping Escape, focus and scroll lock", async () => {
  const header = await read("src/components/layout/SiteHeader.tsx");
  assert.match(header, /id="nav-drawer"[^>]*role="dialog"[^>]*aria-modal="true"[^>]*aria-label="Site menu"/);
  assert.match(header, /e\.key !== "Escape"/);
  assert.match(header, /drawerButton\.current\?\.focus\(\)/);
  assert.match(header, /classList\.toggle\("nav-is-open", drawer\)/);
  assert.match(header, /querySelector<HTMLElement>\("a, button"\)\?\.focus\(\)/);
});

/* ---------- Provenance ---------- */

test("Provenance labels are the two agreed values", () => {
  assert.deepEqual(vocab.provenances.map((p) => p.label), ["AXIS & SAGE ENGAGEMENT", "PRINCIPAL TRACK RECORD"]);
  assert.equal(vocab.provenanceLabel("axisAndSage"), "AXIS & SAGE ENGAGEMENT");
  assert.equal(vocab.provenanceLabel("principalTrackRecord"), "PRINCIPAL TRACK RECORD");
  assert.equal(vocab.provenanceLabel(undefined), null);
});

test("Provenance follows the final decision; held-back work is off the site", async () => {
  const index = await load.getWorkIndex();
  const of = (slug) => index.find((w) => w.slug === slug)?.provenance;
  for (const slug of ["gv-solutions", "nature-roots", "uganda-investor-summit", "oui-life"]) assert.equal(of(slug), "axisAndSage", slug);
  for (const slug of ["venture-garden-group", "national-social-investment-programme", "galaxy-backbone-1gov", "farmcrowdy", "mular", "earlybean", "kolibri", "lion-hospitality-partners", "adpipe"]) assert.equal(of(slug), "principalTrackRecord", slug);
  for (const slug of ["lasric", "university-innovation-platform", "africa-agrighg-summit"]) assert.equal(index.some((w) => w.slug === slug), false, slug);
  for (const w of index) assert.ok(w.provenance, `${w.slug} is labelled`);
});

test("Provenance renders on work cards, case cards and case pages", async () => {
  const blocks = await read("src/components/ds/blocks.tsx");
  assert.match(blocks, /provenanceLabel\(item\.provenance\)/);
  assert.match(await read("src/app/(site)/work/[slug]/page.tsx"), /provenanceLabel\(c\.provenance\)/);
  assert.match(await read("src/app/(home)/page.tsx"), /home\.selectedWork\.map/);
});

/* ---------- Founder decisions ---------- */

test("Founder titles are Co-founder, with the practice separately", async () => {
  for (const p of await load.getPeople()) {
    assert.equal(p.title, "Co-founder", p.name);
    assert.ok(p.practice, p.name);
  }
  assert.doesNotMatch(JSON.stringify((await load.getPeople()).map((p) => p.title)), /CEO|CTO|General Manager|\bGM\b/);
});

test("No unverified fund-waterfall, JV-economics or beneficiary-total claims", async () => {
  assert.doesNotMatch(JSON.stringify(await load.getPeople()), /waterfall|joint-venture economics|JV economics|structuring executive/i);
});

test("The Diagnostic shows its fixed fee; the lift tool's break-even uses it in USD and AED only", async () => {
  const { columns, diagnostic } = await load.getEngagements();
  assert.equal(columns.find((e) => e.name === "Conversion Diagnostic").price, "US$5,000 fixed · AED 18,500 for UAE engagements");
  assert.doesNotMatch(JSON.stringify(columns), /From US\$|Starting at|\[price\]/);
  assert.equal(lift.paybackActions(100, diagnostic.price, "USD"), 50);
  assert.equal(lift.paybackActions(100, diagnostic.uaePrice, "AED"), 185);
  assert.equal(lift.paybackActions(100, { amount: null, currency: "NGN" }, "NGN"), null, "no break-even in a currency without a published fee");
});

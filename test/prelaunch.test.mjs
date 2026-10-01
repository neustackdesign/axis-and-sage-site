// Final pre-launch corrections: Cal.com booking data, drawer semantics, work provenance, founder claims, the hero asset.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const [cal, emails, work, people, engagements, site, lift] = await Promise.all([
  import("../src/lib/pipeline/cal.ts"),
  import("../src/lib/pipeline/emails.ts"),
  import("../src/content/work.ts"),
  import("../src/content/people.ts"),
  import("../src/content/engagements.ts"),
  import("../src/content/site.ts"),
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
  assert.deepEqual(Object.values(work.provenanceLabels), ["AXIS & SAGE ENGAGEMENT", "PRINCIPAL TRACK RECORD"]);
  for (const w of work.workIndex) if (w.provenance) assert.ok(w.provenance in work.provenanceLabels, w.slug);
});

test("Only work with an unambiguous provenance is labelled, and only labelled cases are featured", () => {
  assert.equal(work.provenanceOf("gv-solutions"), "AXIS & SAGE ENGAGEMENT");
  for (const slug of ["venture-garden-group", "farmcrowdy", "mular", "earlybean", "kolibri"]) assert.equal(work.provenanceOf(slug), "PRINCIPAL TRACK RECORD", slug);
  for (const slug of ["nature-roots", "uganda-investor-summit", "oui-life", "adpipe", "lasric", "lion-hospitality-partners"]) assert.equal(work.provenanceOf(slug), null, slug);
  assert.ok(work.featuredWork.length > 0);
  for (const c of work.featuredWork) assert.ok(work.provenanceOf(c.slug), c.slug);
  assert.deepEqual(work.featuredWork.map((c) => c.slug), ["gv-solutions", "venture-garden-group", "farmcrowdy", "mular"]);
});

test("Provenance renders on work cards, case cards and case pages", async () => {
  const blocks = await read("src/components/ds/blocks.tsx");
  assert.match(blocks, /provenanceLabels\[item\.provenance\]/);
  assert.match(blocks, /provenanceOf\(item\.slug\)/);
  assert.match(await read("src/app/(site)/work/[slug]/page.tsx"), /provenanceOf\(c\.slug\)/);
  assert.match(await read("src/app/(home)/page.tsx"), /featuredWork\.map/);
});

/* ---------- Founder decisions ---------- */

test("Unresolved founder titles show as Co-founder, with the practice separately", () => {
  for (const p of people.people) {
    assert.equal(p.title, "Co-founder", p.name);
    assert.ok(p.practice, p.name);
  }
  assert.doesNotMatch(JSON.stringify(people.people.map((p) => p.title)), /CEO|General Manager/);
});

test("No unverified fund-waterfall or JV-economics claims", () => {
  assert.doesNotMatch(JSON.stringify(people.people), /waterfall|joint-venture economics|JV economics/i);
});

test("The Diagnostic shows as a fixed fee, with no figure and no break-even line", () => {
  const diagnostic = engagements.engagements.find((e) => e.name === "Conversion Diagnostic");
  assert.equal(diagnostic.price, "Fixed fee");
  assert.doesNotMatch(JSON.stringify(engagements.engagements), /US\$5,000|\[price\]/);
  assert.equal(lift.paybackActions(100, engagements.prices.diagnostic, "USD"), null, "break-even hidden while the fee is unset");
});

/* ---------- Hero asset ---------- */

test("The hero points at the self-hosted landscape crop, with a landscape remote fallback", async () => {
  assert.equal(site.heroImage.src, "/images/axis-sage/lagos-sunset-chibuzo-nwaneri.jpg");
  assert.ok(site.heroImage.width >= 1920 && site.heroImage.width > site.heroImage.height);
  assert.match(site.heroImage.remote, /w=3200&h=1800/);
  const css = await read("src/styles/components.css");
  const rule = css.slice(css.indexOf(".cover-image {"), css.indexOf("}", css.indexOf(".cover-image {")));
  assert.doesNotMatch(rule, /blur/);
  assert.match(rule, /saturate\(0\.88\) contrast\(0\.95\)/);
});

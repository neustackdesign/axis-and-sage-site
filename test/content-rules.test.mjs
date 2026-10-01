import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

process.env.SANITY_CONTENT_SOURCE = "seed";

const [load, seed, leads] = await Promise.all([
  import("../src/sanity/load.ts"),
  import("../src/sanity/seed-dataset.ts"),
  import("../src/lib/leads.ts"),
]);
// Content lives in Sanity; these rules run on the canonical seed the site is published from.
const docs = seed.seedDataset();
const testimonials = docs.filter((d) => d._type === "testimonialQuote");

async function filesIn(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await filesIn(p));
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

test("no em dashes in our copy; they stay only inside client quotes", async () => {
  for (const file of [...await filesIn("src/app"), ...await filesIn("src/components")]) {
    assert.doesNotMatch(await readFile(file, "utf8"), /—/, `${file} contains an em dash`);
  }
  for (const d of docs.filter((x) => x._type !== "testimonialQuote")) assert.doesNotMatch(JSON.stringify(d), /—/, `${d._type} ${d._id} contains an em dash`);
  assert.ok(testimonials.some((t) => t.quote.includes("—")), "client quotes keep theirs");
});

test("no lorem ipsum anywhere", async () => {
  for (const file of [...await filesIn("src")]) assert.doesNotMatch(await readFile(file, "utf8"), /lorem ipsum/i, file);
});

test("Lion Hospitality figures stay off the homepage", async () => {
  const home = await load.getHome();
  const source = await readFile("src/app/(home)/page.tsx", "utf8");
  assert.doesNotMatch(source + JSON.stringify([home.stats, home.selectedWork, home.logoStrip]), /31,324|1\.66bn|Lion Hospitality/);
});

test("every homepage figure carries a source line and a role tag", async () => {
  const home = await load.getHome();
  assert.match(home.statsSource, /^SOURCES:/);
  for (const s of home.stats) assert.match(s.tag, /· (FOUNDED|RAN|BUILT|ADVISED|EMBEDDED)$/);
});

test("every selected case has a matching case page and work entry", async () => {
  const [home, cases, index] = await Promise.all([load.getHome(), load.getCaseList(), load.getWorkIndex()]);
  for (const c of home.selectedWork) {
    assert.ok(cases.some((x) => x.slug === c.slug), `${c.slug} case page`);
    assert.ok(index.find((w) => w.slug === c.slug)?.hasCase, `${c.slug} work card links to its case`);
  }
});

test("lead validation speaks plain language and gates each source", () => {
  assert.deepEqual(leads.validateLead({ source: "newsletter", email: "a@b.co" }), {});
  assert.equal(leads.validateLead({ source: "newsletter", email: "a@b" }).email, "Enter an email like name@company.com.");
  const contact = leads.validateLead({ source: "contact", email: "a@b.co" });
  assert.ok(contact.name && contact.message && contact.consent);
  const cta = leads.validateLead({ source: "cta", email: "a@b.co", who: "investors" });
  assert.ok(cta.what && !cta.who);
  assert.equal(leads.sentenceOf({ who: "investors", what: "commit", when: "this quarter" }), "We need investors to commit by this quarter.");
  assert.match(leads.mailtoFor({ source: "cta", email: "a@b.co", who: "investors", what: "commit" }), /^mailto:info@axisandsage\.com\?subject=/);
});

test("site contact details match the brief", async () => {
  const settings = await load.getSettings();
  assert.equal(settings.contactEmail, "info@axisandsage.com");
  assert.equal(settings.bookingUrl, "https://cal.com/axisandsage/30min");
  assert.match(settings.legalLine, /© 2026 Axis & Sage Advisory Limited · Masdar City Free Zone, Abu Dhabi, United Arab Emirates/);
});

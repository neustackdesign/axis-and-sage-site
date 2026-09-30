import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

const [work, site, leads] = await Promise.all([
  import("../src/content/work.ts"),
  import("../src/content/site.ts"),
  import("../src/lib/leads.ts"),
]);

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
  const quotes = Object.values(work.testimonials).map((t) => t.quote);
  for (const file of [...await filesIn("src/content"), ...await filesIn("src/app"), ...await filesIn("src/components")]) {
    let source = await readFile(file, "utf8");
    for (const q of quotes) source = source.split(q).join("");
    assert.doesNotMatch(source, /—/, `${file} contains an em dash outside a client quote`);
  }
});

test("no lorem ipsum anywhere", async () => {
  for (const file of [...await filesIn("src")]) assert.doesNotMatch(await readFile(file, "utf8"), /lorem ipsum/i, file);
});

test("Lion Hospitality figures stay off the homepage", async () => {
  const home = await readFile("src/app/(home)/page.tsx", "utf8");
  const homeData = JSON.stringify([work.homeStats, work.selectedWork, work.logoStrip]);
  assert.doesNotMatch(home + homeData, /31,324|1\.66bn|Lion Hospitality/);
});

test("every homepage figure carries a source line and a role tag", () => {
  assert.match(work.homeStatsSource, /^SOURCES:/);
  for (const s of work.homeStats) assert.match(s.tag, /· (FOUNDED|RAN|BUILT|ADVISED|EMBEDDED)$/);
});

test("every selected case has a matching case page and work entry", () => {
  for (const c of work.selectedWork) {
    assert.ok(work.caseBySlug(c.slug), `${c.slug} case page`);
    assert.ok(work.workBySlug(c.slug)?.hasCase, `${c.slug} work card links to its case`);
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

test("site contact details match the brief", () => {
  assert.equal(site.contact.email, "info@axisandsage.com");
  assert.match(site.legalLine, /© 2026 Axis & Sage Advisory Limited · Masdar City Free Zone, Abu Dhabi, United Arab Emirates/);
});

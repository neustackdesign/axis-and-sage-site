// Sanity migration: the canonical seed, the GROQ the site runs, the production guard and the seeder's planning.
// Runs offline: the same queries the site sends to Sanity are evaluated against the local seed with groq-js.
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

process.env.SANITY_CONTENT_SOURCE = "seed";

const [build, verify, plan, seed, queries, load, env, vocab, studioVocab] = await Promise.all([
  import("../migration/seed/build.ts"),
  import("../migration/seed/verify.ts"),
  import("../migration/seed/plan.ts"),
  import("../src/sanity/seed-dataset.ts"),
  import("../src/sanity/queries.ts"),
  import("../src/sanity/load.ts"),
  import("../src/sanity/env.ts"),
  import("../src/lib/content/vocab.ts"),
  import("../studio/schemaTypes/v2/vocab.ts"),
]);
const q = (query, params) => seed.querySeed(query, params);

async function filesIn(dir, re = /\.(ts|tsx|mts)$/) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await filesIn(p, re));
    else if (re.test(e.name)) out.push(p);
  }
  return out;
}

/* ---------- Canonical content ---------- */

test("every canonical check passes on the seed", async () => {
  const failed = (await verify.verifyCanonical(q)).filter((c) => !c.ok);
  assert.deepEqual(failed, []);
});

test("canonical counts, singletons and zero broken references", async () => {
  const docs = seed.seedDataset().filter((d) => d._type !== "sanity.imageAsset");
  for (const [type, n] of Object.entries(build.EXPECTED_COUNTS)) assert.equal(docs.filter((d) => d._type === type).length, n, type);
  for (const id of Object.values(build.SINGLETON_IDS)) assert.ok(docs.some((d) => d._id === id), id);
  const ids = new Set(seed.seedDataset().map((d) => d._id));
  for (const d of docs) for (const r of verify.collectRefs(d)) assert.ok(ids.has(r), `${d._id} → ${r}`);
});

test("the homepage features exactly the six canonical cases, in order, none held back", async () => {
  const home = await load.getHome();
  assert.deepEqual(home.selectedWork.map((w) => w.slug), ["gv-solutions", "nature-roots", "uganda-investor-summit", "farmcrowdy", "mular", "venture-garden-group"]);
  assert.deepEqual(home.selectedWork.map((w) => w.provenance), ["axisAndSage", "axisAndSage", "axisAndSage", "principalTrackRecord", "principalTrackRecord", "principalTrackRecord"]);
  assert.doesNotMatch(JSON.stringify(home.logoStrip), /LASRIC/);
  const index = await load.getWorkIndex();
  for (const held of ["lasric", "university-innovation-platform", "africa-agrighg-summit"]) assert.ok(!index.some((w) => w.slug === held), `${held} is off the work index`);
  assert.equal(index.length, 13);
});

test("founder titles: Co-founder, with the practice; never CEO, GM or CTO", async () => {
  const people = await load.getPeople();
  assert.deepEqual(people.map((p) => `${p.title} · ${p.practice}`), ["Co-founder · Strategy & Investment", "Co-founder · Product & Technology"]);
  assert.doesNotMatch(JSON.stringify(people.map((p) => [p.title, p.practice, p.cardBody, p.bio])), /\b(CEO|GM|CTO)\b|waterfall|structuring executive/);
  assert.equal(people[0].bioParagraphs.length, 5);
});

test("the Diagnostic: US$5,000 fixed, AED 18,500 for UAE engagements, the credit rule exact", async () => {
  const e = await load.getEngagements();
  const d = e.columns.find((c) => c.slug === "conversion-diagnostic");
  assert.equal(d.price, "US$5,000 fixed · AED 18,500 for UAE engagements");
  assert.equal(d.time, "10 working days");
  assert.equal(e.diagnostic.creditRule, "100% of the Diagnostic fee is credited against a Conversion Programme of US$15,000 or more, contracted within 30 days of the Diagnostic readout.");
  assert.deepEqual(e.diagnostic.price, { amount: 5000, currency: "USD" });
  assert.deepEqual(e.diagnostic.uaePrice, { amount: 18500, currency: "AED" });
  assert.equal(e.columns.find((c) => c.slug === "conversion-programme").price, "Fixed fee, quoted after the Diagnostic");
  assert.equal(e.columns.find((c) => c.slug === "embedded-leadership").price, "Monthly, quoted");
  for (const s of e.specialists) assert.equal(s.price, "Quoted on a 30-minute call", s.name);
  assert.doesNotMatch(JSON.stringify(e), /From US\$|Starting at|\[price\]/);
});

test("Strategy & Investment never describes regulated activity; the capital answer is exact", async () => {
  const si = (await load.getPractices()).find((p) => p.slug === "strategy-and-investment");
  assert.deepEqual(si.whatWeDo, build.CANONICAL.strategyCapabilities);
  assert.doesNotMatch(JSON.stringify(si), /investment advi[cs]|investment management|capital placement|fund formation|securities advice|legal (services|structuring)/i);
  const faqs = await load.getFaqs("engagements");
  assert.equal(faqs.find((f) => f.q === "Do you raise capital or place investments?").a, "No. We prepare businesses, materials and commercial structures for investor conversations. Clients and their licensed advisers manage solicitation, placement and regulated activity.");
  assert.equal((await load.getFaqs("conversionDesign")).length, 4);
});

test("legal pages and the guide are Portable Text with working links", async () => {
  const privacy = await load.getLegal("privacy");
  const links = verify.collectRefs(privacy) && JSON.stringify(privacy.sections).match(/"href":"[^"]+"/g);
  assert.ok(links.includes('"href":"mailto:info@axisandsage.com"'));
  const terms = await load.getLegal("terms");
  assert.match(JSON.stringify(terms.sections), /"href":"\/privacy"/);
  const guide = await load.getGuide("what-the-conversion-diagnostic-fee-pays-for");
  assert.deepEqual(guide.body.filter((b) => b._type !== "block").map((b) => b._type), ["asEngagementTimeline", "asCallout", "asToolEmbed", "asArticleEnd"]);
  assert.equal(guide.body.find((b) => b._type === "asEngagementTimeline").days.length, 5);
  assert.equal(guide.body.find((b) => b._type === "asToolEmbed").tool.slug, "conversion-scorecard");
});

/* ---------- The site reads v2 only, from Sanity in production ---------- */

test("site queries never name a legacy v1 type", async () => {
  const groq = Object.values(queries).filter((v) => typeof v === "string").join("\n");
  for (const t of verify.LEGACY_TYPES) assert.doesNotMatch(groq, new RegExp(`_type\\s*(==|in)\\s*\\[?\\s*"${t}"`), t);
  for (const file of await filesIn("src")) {
    const src = await readFile(file, "utf8");
    for (const t of verify.LEGACY_TYPES) assert.doesNotMatch(src, new RegExp(`_type\\s*==\\s*["']${t}["']`), `${file}: ${t}`);
  }
});

test("no route or component imports the frozen content snapshot or the old src/content modules", async () => {
  for (const file of [...await filesIn("src")]) {
    const src = await readFile(file, "utf8");
    assert.doesNotMatch(src, /from ["']@\/content\/|content-snapshot/, file);
    if (!file.endsWith("seed-dataset.ts")) assert.doesNotMatch(src, /from ["'][^"']*migration\/seed/, file);
  }
});

test("production refuses the local seed; only development and tests may use it", () => {
  const saved = { ...process.env };
  try {
    process.env.SANITY_CONTENT_SOURCE = "seed";
    process.env.VERCEL_ENV = "production";
    assert.throws(() => env.contentSource(), /not allowed in production/);
    process.env.VERCEL_ENV = "preview";
    assert.equal(env.contentSource(), "seed");
    delete process.env.SANITY_CONTENT_SOURCE;
    assert.equal(env.contentSource(), "sanity");
  } finally {
    process.env = saved;
  }
  assert.equal(env.projectId, "dltrl1ld");
  assert.equal(env.dataset, "production");
  assert.equal(env.REVALIDATE_SECONDS, 60);
});

test("the client reads published content only, and pages revalidate every 60 seconds", async () => {
  const client = await readFile("src/sanity/client.ts", "utf8");
  assert.match(client, /perspective: "published"/);
  assert.doesNotMatch(client, /token:/);
  for (const file of (await filesIn("src/app", /^(page|opengraph-image)\.tsx$/)).filter((f) => !f.includes("not-found"))) {
    assert.match(await readFile(file, "utf8"), /export const revalidate = 60;/, file);
  }
});

test("a missing singleton fails the page instead of falling back", async () => {
  const fetch = await readFile("src/sanity/load.ts", "utf8");
  for (const what of ["Site settings", "Homepage", "Conversion Design", "Page \\\""]) assert.match(fetch, new RegExp(`MissingContentError\\(\`?${what}`), what);
  assert.match(fetch, /desktop and mobile hero images/);
  const missing = await q(queries.settingsQuery, { id: "not-a-document" });
  assert.equal(missing, null);
});

test("the hero is two Sanity crops with art direction; the landscape crop is never stretched on mobile", async () => {
  const hero = await readFile("src/components/sections/HomepageHero.tsx", "utf8");
  assert.match(hero, /<picture>/);
  assert.match(hero, /<source media=\{MOBILE_QUERY\} srcSet=\{mobileSet\} \/>/);
  assert.match(hero, /MOBILE_QUERY = "\(max-width: 767px\)"/);
  assert.doesNotMatch(hero, /unsplash\.com\/photo|images\.unsplash/);
  const css = await readFile("src/styles/components.css", "utf8");
  const rule = css.slice(css.indexOf(".cover-image {"), css.indexOf("}", css.indexOf(".cover-image {")));
  assert.match(rule, /object-fit: cover/);
  assert.doesNotMatch(rule, /blur/);
  assert.match(css, /padding-top: calc\(var\(--cover-header\) \+ 48px\)/, "mobile: 48px from the bar to the eyebrow");
  assert.deepEqual(build.HERO_ASSETS, { desktop: "migration/assets/hero/lagos-sunset-desktop-3200x1800.jpg", mobile: "migration/assets/hero/lagos-sunset-mobile-1200x1800.jpg" });
  const config = await readFile("next.config.ts", "utf8");
  assert.match(config, /cdn\.sanity\.io/);
  assert.doesNotMatch(config, /unsplash/);
});

test("the Studio's vocabularies match the site's", () => {
  for (const key of ["glyphNames", "roles", "actions", "provenances", "caseArtifacts", "libraryTypes", "libraryStatuses", "faqPlacements", "practiceSections", "engagementTiers", "sitePageKeys"]) {
    assert.deepEqual(studioVocab[key], vocab[key], key);
  }
});

/* ---------- Seeder ---------- */

test("seeder: a second run against its own output is all unchanged, and keeps the same ids", () => {
  const docs = build.buildSeed();
  let n = 0;
  const first = plan.plan([], docs, () => `id-${++n}`);
  assert.equal(first.filter((p) => p.status === "create").length, 71);
  const dataset = first.map((p) => ({ ...p.body, _id: `drafts.${p.id}`, _rev: "x", _updatedAt: "2026-10-01T00:00:00Z" }));
  const second = plan.plan(dataset, docs, () => assert.fail("no new ids on a re-run"));
  assert.deepEqual(second.map((p) => p.status), second.map(() => "unchanged"));
  assert.deepEqual(second.map((p) => p.id), first.map((p) => p.id));
});

test("seeder: matches by seedKey (never duplicates), detects edits, and stops on conflicts", () => {
  const docs = build.buildSeed();
  const first = plan.plan([], docs);
  const published = first.map((p) => ({ ...JSON.parse(JSON.stringify(p.body, (k, v) => (k === "_weak" ? undefined : v))), _id: p.id }));
  const edited = published.map((d) => (d._id === build.SINGLETON_IDS.settings ? { ...d, legalLine: "changed" } : d));
  const again = plan.plan(edited, docs);
  assert.equal(again.find((p) => p.id === build.SINGLETON_IDS.settings).status, "update");
  assert.equal(again.filter((p) => p.status === "create").length, 0);
  const clash = [...published, { ...published.find((d) => d.seedKey === "person:ifeanyi-monyei"), _id: "someone-else" }];
  assert.throws(() => plan.plan(clash, docs), /Two documents carry seedKey person:ifeanyi-monyei/);
});

test("seeder: drafts hold weak references; singletons keep their fixed ids; ordinary documents don't", () => {
  const p = plan.plan([], build.buildSeed());
  const home = p.find((x) => x.seed._type === "homePageV2");
  assert.equal(home.id, "axisSageHome");
  assert.ok(home.body.selectedWork.every((r) => r._weak === true && !r._ref.startsWith("seed:")));
  const person = p.find((x) => x.seed._type === "person");
  assert.match(person.id, /^[0-9a-f-]{36}$/);
  for (const x of p) assert.ok(!verify.LEGACY_TYPES.includes(x.seed._type));
});

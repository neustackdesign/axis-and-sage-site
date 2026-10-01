// The canonical migration bundle (migration/seed/canonical-v2-export.json, from `pnpm sanity:export`).
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { evaluate, parse } from "groq-js";

const [exp, build, verify] = await Promise.all([
  import("../migration/seed/export.ts"),
  import("../migration/seed/build.ts"),
  import("../migration/seed/verify.ts"),
]);
const raw = await readFile(new URL(`../${exp.EXPORT_PATH}`, import.meta.url), "utf8");
const bundle = JSON.parse(raw);
const docs = bundle.documents;
const placeholders = Object.values(exp.HERO_PLACEHOLDERS);

test("the committed bundle is exactly what `pnpm sanity:export` generates", () => {
  assert.equal(raw, exp.serialiseExport(exp.buildExport(bundle.manifest.generatedFromCommit)), "regenerate with pnpm sanity:export");
  assert.equal(exp.serialiseExport(exp.buildExport("x")), exp.serialiseExport(exp.buildExport("x")), "deterministic");
  assert.match(bundle.manifest.generatedFromCommit, /^[0-9a-f]{40}$/, "generated from committed inputs");
  assert.match(bundle.manifest.contentChecksum, /^sha256:[0-9a-f]{64}$/);
});

test("manifest: project, dataset, 71 documents, canonical per-type counts", () => {
  const m = bundle.manifest;
  assert.equal(m.projectId, "dltrl1ld");
  assert.equal(m.dataset, "production");
  assert.equal(docs.length, 71);
  assert.equal(m.documentCount, 71);
  assert.deepEqual(m.typeCounts, build.EXPECTED_COUNTS);
  const counts = {};
  for (const d of docs) counts[d._type] = (counts[d._type] || 0) + 1;
  assert.deepEqual(counts, build.EXPECTED_COUNTS);
});

test("ids: unique, valid, deterministic, no drafts; singletons keep theirs; ordinary documents keep seedKey", () => {
  const ids = docs.map((d) => d._id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) {
    assert.match(id, /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/, id);
    assert.ok(!id.startsWith("drafts."), id);
  }
  for (const id of [...Object.values(build.SINGLETON_IDS), ...["engagements", "work", "people", "library", "contact", "newsletter", "thankYou", "notFound"].map(build.sitePageId)]) assert.ok(ids.includes(id), id);
  for (const d of docs.filter((x) => x.seedKey)) assert.equal(d._id, `axisSage-${d.seedKey.replace(/:/g, "-")}`);
  assert.equal(docs.filter((d) => !d.seedKey).length, 3 + 8, "only the singletons and site pages have no seedKey");
});

test("every reference resolves; no seed: refs; exactly two hero placeholders; no legacy types", () => {
  const ids = new Set(docs.map((d) => d._id));
  const assetRefs = new Set(bundle.manifest.assets.map((a) => a.ref));
  const refs = verify.collectRefs(docs);
  for (const r of refs) assert.ok(ids.has(r) || assetRefs.has(r) || placeholders.includes(r), `unresolved ${r}`);
  assert.doesNotMatch(raw, /"seed:/);
  assert.doesNotMatch(raw, /_upload/);
  assert.deepEqual(refs.filter((r) => placeholders.includes(r)).sort(), [...placeholders].sort());
  assert.equal((raw.match(/__HERO_(DESKTOP|MOBILE)_ASSET__/g) || []).length, 2);
  const home = docs.find((d) => d._id === build.SINGLETON_IDS.home);
  assert.equal(home.desktopHeroImage.asset._ref, "__HERO_DESKTOP_ASSET__");
  assert.equal(home.mobileHeroImage.asset._ref, "__HERO_MOBILE_ASSET__");
  for (const d of docs) assert.ok(!verify.LEGACY_TYPES.includes(d._type), d._type);
  for (const a of bundle.manifest.assets) assert.match(a.ref, /^image-[0-9a-f]{40}-\d+x\d+-(jpg|png)$/);
});

test("canonical verification passes on the bundle", async () => {
  // Stand-ins for the image assets an import uploads first, so the reference check sees them.
  const dataset = [...docs, ...[...bundle.manifest.assets.map((a) => a.ref), ...placeholders].map((_id) => ({ _id, _type: "sanity.imageAsset" }))];
  const q = async (query, params = {}) => (await evaluate(parse(query, { params }), { dataset, params })).get();
  assert.deepEqual((await verify.verifyCanonical(q)).filter((c) => !c.ok), []);
});

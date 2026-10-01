// Seeds the canonical v2 content into the EXISTING Sanity project (dltrl1ld / production).
//
//   pnpm sanity:seed                 dry run (default): validates the seed, compares it with the dataset, writes nothing
//   pnpm sanity:seed --apply         writes drafts (drafts.<id>) for every created or changed document, uploads the hero crops
//   pnpm sanity:seed --publish       publishes the v2 drafts the seed owns, then verifies the published dataset
//   pnpm sanity:seed --offline       validates the seed only (no network), e.g. in CI
//   pnpm sanity:verify               read-only canonical checks against the published dataset
//
// Never creates another project or dataset. Never reads, writes or deletes legacy v1 documents (homePage, siteSettings,
// service, project, testimonial, faq). Never duplicates: ordinary documents are matched by seedKey, singletons by _id.
// Needs SANITY_API_WRITE_TOKEN (an Editor token for dltrl1ld) for --apply and --publish; set it in the environment, never in code.
import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { createClient } from "next-sanity";
import { buildSeed, EXPECTED_COUNTS, HERO_ASSETS, SINGLETON_IDS, type SeedDoc } from "../migration/seed/build.ts";
import { assetIdFor, imageSize, plan as planSeed, type Existing, type Plan } from "../migration/seed/plan.ts";
import { collectRefs, LEGACY_TYPES, V2_TYPES, verifyCanonical } from "../migration/seed/verify.ts";
import { querySeed } from "../src/sanity/seed-dataset.ts";

const PROJECT_ID = "dltrl1ld";
const DATASET = "production";
const API_VERSION = "2025-02-19";

const args = new Set(process.argv.slice(2));
const mode = args.has("--verify") ? "verify" : args.has("--publish") ? "publish" : args.has("--apply") ? "apply" : "dry-run";
const offline = args.has("--offline");

const ok = (m: string) => console.log(`  ✓ ${m}`);
const warn = (m: string) => console.log(`  ! ${m}`);
function fail(m: string): never {
  console.error(`\n✕ ${m}\nNothing was written.`);
  process.exit(1);
}

/* ---------------------------------------------------------------- Local validation (always) */

function heroStatus() {
  const problems: string[] = [];
  for (const [kind, rel] of Object.entries(HERO_ASSETS)) {
    const path = resolve(rel);
    if (!existsSync(path)) { problems.push(`${kind} hero crop missing: ${rel}`); continue; }
    const size = imageSize(path);
    if (!size) { problems.push(`${kind} hero crop is not a readable JPEG or PNG: ${rel}`); continue; }
    const want = kind === "desktop" ? { width: 3200, height: 1800 } : { width: 1200, height: 1800 };
    if (size.width !== want.width || size.height !== want.height) problems.push(`${kind} hero crop is ${size.width}×${size.height}; expected ${want.width}×${want.height} (${kind === "desktop" ? "landscape" : "portrait"})`);
  }
  return problems;
}

async function validateSeed(docs: SeedDoc[]) {
  console.log("Seed");
  const counts: Record<string, number> = {};
  for (const d of docs) counts[d._type] = (counts[d._type] || 0) + 1;
  for (const [type, n] of Object.entries(EXPECTED_COUNTS)) if (counts[type] !== n) fail(`Seed has ${counts[type] ?? 0} ${type}; expected ${n}.`);
  ok(`${docs.length} documents across ${Object.keys(EXPECTED_COUNTS).length} types match the expected counts`);
  for (const d of docs) {
    if ((LEGACY_TYPES as readonly string[]).includes(d._type)) fail(`The seed contains a legacy type (${d._type}).`);
    if (!V2_TYPES.includes(d._type)) fail(`The seed contains an unknown type (${d._type}).`);
    if (!d._id && !d.seedKey) fail(`A ${d._type} has neither a singleton _id nor a seedKey.`);
  }
  const keys = docs.map((d) => d.seedKey ?? d._id);
  const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);
  if (dupes.length) fail(`Duplicate seed keys: ${dupes.join(", ")}`);
  const known = new Set(keys);
  const missing = docs.flatMap((d) => collectRefs(d).filter((r) => r.startsWith("seed:") && !known.has(r.slice(5))).map((r) => `${d.seedKey ?? d._id} → ${r}`));
  if (missing.length) fail(`Invalid references in the seed:\n    ${missing.join("\n    ")}`);
  ok("every reference resolves within the seed");
  const checks = await verifyCanonical((q, p) => querySeed(q, p));
  const failed = checks.filter((c) => !c.ok);
  if (failed.length) fail(`Canonical checks failed on the seed:\n    ${failed.map((c) => `${c.name}: ${c.detail ?? ""}`).join("\n    ")}`);
  ok(`${checks.length} canonical checks pass (titles, price, credit rule, provenance, homepage six, held-back work, copy)`);
}

function report(plans: Plan[]) {
  console.log("\nPlan");
  const byType: Record<string, Record<string, number>> = {};
  for (const p of plans) (byType[p.seed._type] ??= { create: 0, update: 0, unchanged: 0 })[p.status]++;
  for (const [type, c] of Object.entries(byType)) console.log(`  ${type.padEnd(18)} create ${c.create}  update ${c.update}  unchanged ${c.unchanged}`);
  const total = { create: 0, update: 0, unchanged: 0 };
  for (const p of plans) total[p.status]++;
  console.log(`  ${"TOTAL".padEnd(18)} create ${total.create}  update ${total.update}  unchanged ${total.unchanged}`);
  return total;
}

/* ---------------------------------------------------------------- Main */

const docs = buildSeed();
console.log(`Axis & Sage · Sanity seed · project ${PROJECT_ID} / dataset ${DATASET} · mode: ${mode}${offline ? " (offline)" : ""}\n`);
if (mode !== "verify") await validateSeed(docs);

const hero = heroStatus();
console.log("\nHero crops");
if (hero.length) hero.forEach(warn); else ok("desktop 3200×1800 and mobile 1200×1800 crops present");

if (offline) {
  report(planSeed([], docs));
  console.log("\nOffline: the seed is valid. Nothing was read from or written to Sanity.");
  process.exit(0);
}

const token = process.env.SANITY_API_WRITE_TOKEN;
if ((mode === "apply" || mode === "publish") && !token) fail("SANITY_API_WRITE_TOKEN is not set. Create an Editor token for project dltrl1ld in sanity.io/manage and set it in the environment.");
const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, useCdn: false, token, perspective: token ? "raw" : "published" });

if (mode === "verify") {
  const checks = await verifyCanonical((q, p) => client.fetch(q, p ?? {}, { perspective: "published" }));
  checks.forEach((c) => (c.ok ? ok(c.name) : warn(`${c.name}: ${c.detail ?? ""}`)));
  process.exit(checks.every((c) => c.ok) ? 0 : 1);
}

let plans: Plan[];
try {
  // Only v2 types are read; legacy v1 documents are never fetched, compared or written.
  const existing: Existing[] = await client.fetch(`*[_type in $types]`, { types: V2_TYPES }, { perspective: "raw" });
  plans = planSeed(existing, docs);
} catch (e) {
  fail(`Couldn't plan against the dataset (${(e as Error).message}). Check network access to ${PROJECT_ID}.api.sanity.io and the token.`);
}
const total = report(plans);

if (mode === "dry-run") {
  console.log("\nDry run: nothing was written. Run with --apply to write drafts.");
  process.exit(0);
}

if (mode === "apply") {
  const changed = plans.filter((p) => p.status !== "unchanged");
  const files = [...new Set(changed.flatMap((p) => p.uploads))];
  for (const path of files) {
    const asset = await client.assets.upload("image", readFileSync(path), { filename: basename(path) });
    if (asset._id !== assetIdFor(path)) fail(`Uploaded ${basename(path)} as ${asset._id}, expected ${assetIdFor(path)}.`);
    ok(`uploaded ${basename(path)}`);
  }
  const tx = client.transaction();
  for (const p of changed) tx.createOrReplace({ ...p.body, _id: `drafts.${p.id}` } as never);
  if (changed.length) await tx.commit({ visibility: "sync" });
  console.log(`\nApplied: ${total.create} created and ${total.update} updated as drafts; ${total.unchanged} unchanged. Review them in the Studio, then run --publish.`);
  process.exit(0);
}

// --publish: refuse unless every canonical record is present and valid.
if (hero.length) fail(`Refusing to publish: the homepage needs both hero crops.\n    ${hero.join("\n    ")}`);
const notInDataset = plans.filter((p) => p.status === "create");
if (notInDataset.length) fail(`Refusing to publish: ${notInDataset.length} canonical documents aren't in the dataset yet. Run --apply first.`);
const raw: Existing[] = await client.fetch(`*[_id in $ids]`, { ids: plans.flatMap((p) => [p.id, `drafts.${p.id}`]) }, { perspective: "raw" });
const tx = client.transaction();
let published = 0;
for (const p of plans) {
  const draft = raw.find((d) => d._id === `drafts.${p.id}`);
  if (!draft) continue; // already published and unchanged
  const doc = JSON.parse(JSON.stringify(draft, (k, v) => (k === "_weak" || k === "_strengthenOnPublish" ? undefined : v)));
  tx.createOrReplace({ ...doc, _id: p.id });
  tx.delete(`drafts.${p.id}`);
  published++;
}
if (published) await tx.commit({ visibility: "sync" });
ok(`published ${published} documents (legacy v1 documents untouched)`);

console.log("\nVerify (published)");
const checks = await verifyCanonical((q, p) => client.fetch(q, p ?? {}, { perspective: "published" }));
checks.forEach((c) => (c.ok ? ok(c.name) : warn(`${c.name}: ${c.detail ?? ""}`)));
if (!checks.every((c) => c.ok)) { console.error("\n✕ Published, but canonical checks failed. Fix in the Studio and re-run `pnpm sanity:verify`."); process.exit(1); }
console.log(`\nDone. Singletons: ${Object.values(SINGLETON_IDS).join(", ")}.`);

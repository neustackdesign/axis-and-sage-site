import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("the project pins pnpm and includes a lockfile", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  assert.match(packageJson.packageManager, /^pnpm@\d+\.\d+\.\d+$/);
  assert.ok((await read("pnpm-lock.yaml")).includes("lockfileVersion:"));
});

test("fallback content contains the verified project set", async () => {
  const source = await read("src/content/canonical-content.json");
  for (const title of ["Nature Roots", "Earlybean", "Uganda Investor Summit"]) {
    assert.match(source, new RegExp(title));
  }
  assert.doesNotMatch(source, /Refit|JJ Gerrish|Great Portland Street/i);
});

test("refined preview content keeps residue out and preserves approval gates", async () => {
  const source = await read("src/content/canonical-content.json");
  const seed = await read("scripts/seed-sanity.mjs");
  assert.match(seed, /approved: false/);
  assert.match(source, /"officeLocations": \["Dubai, UAE"\]/);
  assert.match(source, /"offices": \["Dubai, UAE"\]/);
  assert.match(source, /"previewOnly": true/);
  assert.match(source, /"homepagePlacement": "featured"/);
  assert.match(source, /info@axisandsage\.com/);
  assert.doesNotMatch(source, /Refit|Great Portland Street|Abu Dhaboi/i);
  assert.doesNotMatch(await read("src/components/home/ServiceIndex.tsx"), /Description pending editorial confirmation/);
});

test("contact handling has honest validation and configuration states", async () => {
  const source = await read("src/app/api/contact/route.ts");
  assert.match(source, /status: 400/);
  assert.match(source, /status: 503/);
  assert.match(source, /RESEND_API_KEY/);
  assert.match(source, /company/);
});

test("reference audit and responsive capture records exist", async () => {
  const audit = await read("reference/legacy-audit.md");
  const inventory = await read("reference/content-inventory.md");
  assert.match(audit, /897,435|897435/);
  assert.match(audit, /Framer/);
  assert.match(inventory, /withheld|confirmation/i);
  for (const capture of [
    "reference/screenshots/legacy/legacy-live-390-top.png",
    "reference/screenshots/rebuild/rebuild-1440-home.png",
    "reference/screenshots/rebuild/rebuild-1024-home.png",
    "reference/screenshots/rebuild/rebuild-390-home.png",
  ]) {
    const file = await readFile(new URL(capture, root));
    assert.ok(file.length > 1000, `${capture} should not be empty`);
  }
});

test("controlled parity gates are documented and public fallbacks are conservative", async () => {
  const publicSource = [
    "src/app/globals.css",
    "src/app/layout.tsx",
    "src/components/home/AboutOverview.tsx",
    "src/components/home/EditorialHero.tsx",
    "src/components/home/ServiceIndex.tsx",
    "src/components/home/SelectedWork.tsx",
    "src/components/home/ClientPerspectives.tsx",
    "src/components/home/Questions.tsx",
    "src/components/home/ContactSection.tsx",
  ].join("\n");
  const sections = await Promise.all(publicSource.split("\n").map((path) => read(path)));
  const designSpec = await read("reference/design-system/axis-sage-application-spec.md");
  const structuralDelta = await read("reference/design-system/structural-delta.md");
  const motion = await read("reference/motion-family-revision.md");
  const audit = await read("scripts/audit-design-system.mjs");
  assert.doesNotMatch(sections.join("\n"), /Instrument Serif|Mona Sans|linear-gradient|testimonial-ticker|contact-panel/);
  assert.match(await read("src/components/home/ServiceIndex.tsx"), /detailApproved === true/);
  assert.match(designSpec, /960px/);
  assert.match(structuralDelta, /Deleted `HomeSections\.tsx`/);
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(audit, /prohibited/);
});

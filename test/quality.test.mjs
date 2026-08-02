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
  const source = await read("src/content/fallback-data.ts");
  for (const title of ["Nature Roots", "Earlybean", "Uganda Investor Summit"]) {
    assert.match(source, new RegExp(title));
  }
  assert.doesNotMatch(source, /Refit|JJ Gerrish|Great Portland Street/i);
});

test("source-aligned content keeps residue out and preserves current Axis & Sage details", async () => {
  const source = await read("src/content/fallback-data.ts");
  assert.match(source, /approved: false/);
  assert.match(source, /officeLocations: \["Abu Dhabi, Dubai, UAE"\]/);
  assert.match(source, /offices: \["Abu Dhabi, Dubai, UAE"\]/);
  assert.match(source, /info@axisandsage\.com/);
  assert.doesNotMatch(source, /Refit|Great Portland Street|Abu Dhaboi/i);
  assert.doesNotMatch(await read("src/components/sections/HomeSections.tsx"), /Description pending editorial confirmation/);
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
  const sections = await read("src/components/sections/HomeSections.tsx");
  const report = await read("reference/visual-parity-report.md");
  const motion = await read("reference/motion-parity-spec.md");
  const metadata = await read("reference/metadata-parity-report.md");
  assert.doesNotMatch(sections, /game-changers|unparalleled|Axis &amp; Sage \/ Navigation|mobile-navigation-note/);
  assert.match(sections, /service\.detailApproved === true/);
  assert.match(report, /CODEX SELF-ASSESSMENT — USER REVIEW PENDING/);
  assert.match(report, /Header \| NOT MATCHED/);
  assert.match(motion, /prefers-reduced-motion/);
  assert.match(metadata, /Instrument Serif/);
});

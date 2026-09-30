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

test("design system rules hold across the public presentation", async () => {
  const audit = await read("scripts/audit-design-system.mjs");
  const tokens = await read("src/styles/tokens.css");
  assert.match(audit, /prohibited/);
  assert.match(tokens, /--orange-500: #E8590C/);
  assert.match(tokens, /--font-serif: "Source Serif 4"/);
  assert.match(tokens, /prefers-reduced-motion/);
  assert.match(await read("reference/motion-family-revision.md"), /prefers-reduced-motion/);
});

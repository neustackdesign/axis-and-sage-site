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

test("legacy residue appears nowhere outside /reference", async () => {
  const { readdir } = await import("node:fs/promises");
  const skip = new Set(["node_modules", ".next", ".git", "reference", "pnpm-lock.yaml"]);
  const files = [];
  const walk = async (dir) => {
    for (const e of await readdir(new URL(dir, root), { withFileTypes: true })) {
      if (skip.has(e.name)) continue;
      const rel = `${dir}${e.name}`;
      if (e.isDirectory()) await walk(`${rel}/`);
      else if (/\.(ts|tsx|mjs|js|json|md|css|txt|example)$/.test(e.name) && !rel.endsWith("quality.test.mjs")) files.push(rel);
    }
  };
  await walk("");
  for (const file of files) {
    assert.doesNotMatch(await read(file), /Refit|JJ Gerrish|refit\.com|Great Portland|execution muscle/i, file);
  }
});

test("contact handling has honest validation and failure states", async () => {
  const route = await read("src/app/api/contact/route.ts");
  const pipeline = await read("src/lib/server/pipeline.ts");
  assert.match(pipeline, /status: 400/);
  assert.match(route, /status: 503/);
  assert.match(route, /fallback: true/);
  assert.match(await read("src/lib/server/email.ts"), /RESEND_API_KEY/);
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

// Production gate: fails the build if any prerendered page still contains a placeholder.
// Runs after `next build`. Active when VERCEL_ENV=production, or with --force for a local report.
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const force = process.argv.includes("--force");
if (process.env.VERCEL_ENV !== "production" && !force) {
  console.log("Placeholder check skipped (not a production build). Run with --force to report.");
  process.exit(0);
}

export const PLACEHOLDERS = [
  "[price]", "[number]", "[URL]", "[Title]", "[Firm]", "[CEO]", "[BOOKING LINK]", "[booking URL]", "[placeholder]",
  "DRAFT", "PORTRAIT ·", "PAINTING:",
  // Also unfilled in this build:
  "[Author]", "[Agency name]", "[first issue date]", "[Privacy text", "[Terms text",
];

const root = join(process.cwd(), ".next", "server", "app");
async function htmlFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...await htmlFiles(p));
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const text = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/\s+/g, " ");
const findings = [];
let files;
try { files = await htmlFiles(root); } catch { console.error(`No build output at ${root}. Run next build first.`); process.exit(1); }
for (const file of files) {
  const visible = text(await readFile(file, "utf8"));
  for (const token of PLACEHOLDERS) {
    let i = visible.indexOf(token);
    while (i !== -1) {
      findings.push({ page: "/" + relative(root, file).replace(/\.html$/, "").replace(/(^|\/)index$/, ""), token, context: visible.slice(Math.max(0, i - 50), i + token.length + 30).trim() });
      i = visible.indexOf(token, i + token.length);
    }
  }
}

if (findings.length) {
  const byToken = new Map();
  for (const f of findings) byToken.set(f.token, [...(byToken.get(f.token) || []), f]);
  console.error(`\nPlaceholder check failed: ${findings.length} placeholder(s) in ${new Set(findings.map((f) => f.page)).size} page(s).\n`);
  for (const [token, list] of byToken) {
    console.error(`  ${token}  (${list.length})`);
    for (const f of list.slice(0, 6)) console.error(`    ${f.page}: …${f.context}…`);
    if (list.length > 6) console.error(`    …and ${list.length - 6} more`);
  }
  console.error("\nFill these inputs (see README, 'Launch inputs') and rebuild.\n");
  process.exit(force ? 0 : 1);
}
console.log(`Placeholder check passed: ${files.length} pages clean.`);

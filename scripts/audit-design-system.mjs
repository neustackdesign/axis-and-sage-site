import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = join(process.cwd(), "src");
// Axis & Sage design system rules (reference/design-system/axis-sage-ds). Rules, not shadows; motion runs once.
const prohibited = [
  ["Instrument Serif", /Instrument[_ ]Serif/],
  ["Mona Sans", /Mona[_ ]Sans/],
  ["drop shadows (use 1px rules)", /box-shadow:\s*(?!none|inset)[^;]*\d+px[^;]*\d+px[^;]*\d+px/],
  ["gradient meshes", /radial-gradient|conic-gradient/],
  ["autoplay tickers and carousels", /ticker|carousel|animation-iteration-count:\s*infinite|\binfinite\b/],
  ["old rounded project-card system", /project-card|project-media|project-content/],
  ["old testimonial-card system", /testimonial-card|testimonial-track/],
  ["old FAQ-card system", /faq-item|faq-grid/],
  ["old dark contact-panel system", /contact-panel|contact-form-wrap|contact-copy/],
  ["old section-band classes", /section-intro|section-label|section-band|services-grid|services-media/],
];

async function filesIn(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesIn(path));
    else if (/\.(css|tsx|ts|jsx|js)$/.test(entry.name)) files.push(path);
  }
  return files;
}

const findings = [];
for (const file of await filesIn(root)) {
  const source = await readFile(file, "utf8");
  for (const [label, pattern] of prohibited) {
    if (pattern.test(source)) findings.push(`${relative(process.cwd(), file)}: ${label}`);
  }
}

if (findings.length) {
  console.error("Design-system audit failed:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exitCode = 1;
} else {
  console.log("Design-system audit passed: no prohibited public presentation remnants found.");
}


import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";

const root = join(process.cwd(), "src");
const prohibited = [
  ["Instrument Serif", /Instrument[_ ]Serif/],
  ["Mona Sans", /Mona[_ ]Sans/],
  ["rejected sage accent token", /--(?:axis-)?sage\b|#727866/i],
  ["decorative gradients", /linear-gradient|radial-gradient/],
  ["autoplay ticker keyframes", /about-ticker|testimonial-ticker|ticker/],
  ["old rounded project-card system", /project-card|project-media|project-content/],
  ["old testimonial-card system", /testimonial-card|testimonial-track/],
  ["old FAQ-card system", /faq-item|faq-answer|faq-grid/],
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


import { readFile } from "node:fs/promises";

const sourcePath = "reference/legacy/axisandsage-page.html";
const source = await readFile(sourcePath, "utf8");
const references = [...source.matchAll(/(?:src|srcset|href|poster|content)\s*=\s*["']([^"']+)/gi)]
  .flatMap((match) => match[1].split(",").map((value) => value.trim().split(" ")[0]))
  .filter(Boolean);
const unique = [...new Set(references)];
const framer = unique.filter((url) => url.includes("framerusercontent.com"));
const images = framer.filter((url) => /\/images\//.test(url));
const runtime = framer.filter((url) => /\/sites\/|events\.framer/.test(url));
console.log(JSON.stringify({ sourcePath, bytes: Buffer.byteLength(source), references: references.length, uniqueReferences: unique.length, uniqueFramerUrls: framer.length, images: images.length, runtime: runtime.length, duplicateReferences: references.length - unique.length }, null, 2));

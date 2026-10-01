// Regenerates migration/seed/canonical-v2-export.json from buildSeed(). Deterministic: the same inputs give the same
// file. generatedFromCommit is the last commit touching the seed's inputs ("-dirty" if they have uncommitted changes).
// Reads nothing from Sanity and writes nothing to it.
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { buildExport, EXPORT_INPUTS, EXPORT_PATH, serialiseExport } from "../migration/seed/export.ts";

const git = (...args: string[]) => execFileSync("git", args, { encoding: "utf8" }).trim();
const commit = git("log", "-1", "--format=%H", "--", ...EXPORT_INPUTS);
const dirty = git("status", "--porcelain", "--", ...EXPORT_INPUTS) !== "";
const bundle = buildExport(`${commit}${dirty ? "-dirty" : ""}`);
writeFileSync(EXPORT_PATH, serialiseExport(bundle));

console.log(`Wrote ${EXPORT_PATH}`);
console.log(`  documents: ${bundle.manifest.documentCount}`);
console.log(`  generatedFromCommit: ${bundle.manifest.generatedFromCommit}`);
console.log(`  contentChecksum: ${bundle.manifest.contentChecksum}`);
if (dirty) console.warn("  ! seed inputs have uncommitted changes: commit them and regenerate before handing this bundle over");

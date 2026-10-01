// The canonical v2 migration bundle (migration/seed/canonical-v2-export.json): every buildSeed() document with
// deterministic ids and resolved references, ready to import into dltrl1ld / production without the seeder's
// id lookup. Regenerate with `pnpm sanity:export`; the same inputs always give the same file.
//
// Ids: singletons keep their fixed ids; every other document gets `axisSage-<seedKey with ":" as "-">` (no dots, so
// the documents stay publicly readable, and never a drafts. id). References point at those ids.
// Images: the two hero crops aren't in the repository, so their asset references are the placeholders
// __HERO_DESKTOP_ASSET__ and __HERO_MOBILE_ASSET__, to be swapped for the uploaded asset ids at import. Every other
// image is a file in /public: its reference is the id Sanity gives that exact file on upload (image-<sha1>-<w>x<h>-<ext>),
// and manifest.assets lists the file to upload.
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { buildSeed, EXPECTED_COUNTS, HERO_ASSETS, type SeedDoc } from "./build";
import { assetIdFor } from "./plan";

export const PROJECT_ID = "dltrl1ld";
export const DATASET = "production";
export const EXPORT_PATH = "migration/seed/canonical-v2-export.json";
export const HERO_PLACEHOLDERS = { desktop: "__HERO_DESKTOP_ASSET__", mobile: "__HERO_MOBILE_ASSET__" } as const;
/** The files the bundle is generated from (generatedFromCommit is the last commit that touched any of them). */
export const EXPORT_INPUTS = ["migration/content-snapshot", "migration/seed/build.ts", "migration/seed/pt.ts", "public/images/axis-sage/portraits"];

export type ExportDoc = Record<string, unknown> & { _id: string; _type: string };
export type ExportBundle = {
  manifest: {
    projectId: string;
    dataset: string;
    documentCount: number;
    typeCounts: Record<string, number>;
    generatedFromCommit: string;
    contentChecksum: string;
    assets: { ref: string; file: string }[];
  };
  documents: ExportDoc[];
};

/** The deterministic id for a seed document. */
export const exportId = (d: Pick<SeedDoc, "_id" | "seedKey">) => d._id ?? `axisSage-${String(d.seedKey).replace(/:/g, "-")}`;

export function buildExport(generatedFromCommit: string): ExportBundle {
  const seed = buildSeed();
  const ids = new Map(seed.map((d) => [String(d.seedKey ?? d._id), exportId(d)]));
  const heroRef: Record<string, string> = { [HERO_ASSETS.desktop]: HERO_PLACEHOLDERS.desktop, [HERO_ASSETS.mobile]: HERO_PLACEHOLDERS.mobile };
  const assets = new Map<string, string>();

  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk);
    if (!value || typeof value !== "object") return value;
    const o = value as Record<string, unknown>;
    if (typeof o._ref === "string" && o._ref.startsWith("seed:")) {
      const id = ids.get(o._ref.slice(5));
      if (!id) throw new Error(`Unresolvable reference ${o._ref}`);
      return { ...o, _ref: id };
    }
    const upload = (o.asset as { _upload?: string } | undefined)?._upload;
    if (upload) {
      let ref = heroRef[upload];
      if (!ref) {
        const path = resolve(upload);
        const id = existsSync(path) ? assetIdFor(path) : null;
        if (!id) throw new Error(`Image ${upload} is missing or unreadable`);
        assets.set(id, upload);
        ref = id;
      }
      const rest = Object.fromEntries(Object.entries(o).filter(([k]) => k !== "asset").map(([k, v]) => [k, walk(v)]));
      return { ...rest, asset: { _type: "reference", _ref: ref } };
    }
    return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, walk(v)]));
  };

  const documents = seed.map((d) => {
    const { _id, _type, ...fields } = d;
    void _id;
    return { _id: exportId(d), _type, ...(walk(fields) as Record<string, unknown>) } as ExportDoc;
  });
  const typeCounts = Object.fromEntries(Object.keys(EXPECTED_COUNTS).map((t) => [t, documents.filter((x) => x._type === t).length]));
  return {
    manifest: {
      projectId: PROJECT_ID,
      dataset: DATASET,
      documentCount: documents.length,
      typeCounts,
      generatedFromCommit,
      contentChecksum: `sha256:${createHash("sha256").update(JSON.stringify(documents)).digest("hex")}`,
      assets: [...assets].map(([ref, file]) => ({ ref, file })).sort((a, b) => a.file.localeCompare(b.file)),
    },
    documents,
  };
}

export const serialiseExport = (bundle: ExportBundle) => `${JSON.stringify(bundle, null, 2)}\n`;

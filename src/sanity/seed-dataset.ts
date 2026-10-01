// Development and test only: the canonical seed (migration/seed) as an in-memory Sanity dataset, queried with the
// same GROQ as production via groq-js. Production never loads this (see contentSource() in ./env).
import { existsSync } from "node:fs";
import { join } from "node:path";
import { evaluate, parse } from "groq-js";
import { buildSeed, type SeedDoc } from "../../migration/seed/build";

type Doc = Record<string, unknown> & { _id: string; _type: string };

const SEED_UPDATED_AT = "2026-09-30T00:00:00Z";

/** The _id a seed document gets in the local dataset (Sanity assigns real ids when the seeder writes them). */
export const seedId = (d: SeedDoc) => d._id ?? `seed.${String(d.seedKey).replace(/:/g, ".")}`;

let memo: Doc[] | null = null;

/** Seed documents with seed:<key> references resolved and local images turned into asset documents. */
export function seedDataset(): Doc[] {
  if (memo) return memo;
  const docs = buildSeed();
  const ids = new Map<string, string>();
  for (const d of docs) ids.set(d.seedKey ?? d._id!, seedId(d));
  const assets: Doc[] = [];

  const walk = (value: unknown): unknown => {
    if (Array.isArray(value)) return value.map(walk).filter((v) => v !== undefined);
    if (!value || typeof value !== "object") return value;
    const obj = value as Record<string, unknown>;
    if (typeof obj._ref === "string" && obj._ref.startsWith("seed:")) {
      const id = ids.get(obj._ref.slice(5));
      if (!id) throw new Error(`Seed reference to a missing document: ${obj._ref}`);
      return { ...obj, _ref: id };
    }
    const asset = obj.asset as { _upload?: string } | undefined;
    if (asset?._upload) {
      // Only files already served from /public can be shown locally. The hero crops are uploaded by the seeder.
      if (!asset._upload.startsWith("public/") || !existsSync(join(/*turbopackIgnore: true*/ process.cwd(), asset._upload))) return undefined;
      const id = `image-seed-${assets.length}`;
      assets.push({ _id: id, _type: "sanity.imageAsset", url: asset._upload.slice("public".length) });
      const rest = Object.fromEntries(Object.entries(obj).filter(([k]) => k !== "asset").map(([k, v]) => [k, walk(v)]));
      return { ...rest, asset: { _type: "reference", _ref: id } };
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      const w = walk(v);
      if (w !== undefined) out[k] = w;
    }
    return out;
  };

  const resolved = docs.map((d) => {
    const { seedKey, ...rest } = d;
    return { ...(walk(rest) as Doc), _id: seedId(d), _updatedAt: SEED_UPDATED_AT, ...(seedKey ? { seedKey } : {}) };
  });
  memo = [...resolved, ...assets];
  return memo;
}

/** Run a GROQ query against the local seed. */
export async function querySeed<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  const result = await evaluate(parse(query, { params }), { dataset: seedDataset(), params });
  return (await result.get()) as T;
}

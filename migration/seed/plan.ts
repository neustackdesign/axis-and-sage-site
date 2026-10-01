// Seeder planning, separate from the CLI so it can be tested offline: id resolution (singleton _id, else seedKey, else a
// new Sanity-style id), reference resolution, image asset ids, and the create / update / unchanged comparison.
import { createHash, randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { SeedDoc } from "./build";

/** Width and height of a JPEG or PNG, read from the file header. */
export function imageSize(path: string): { width: number; height: number } | null {
  const b = readFileSync(path);
  if (b[0] === 0x89 && b.toString("ascii", 1, 4) === "PNG") return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  let i = 2;
  while (i < b.length) {
    if (b[i] !== 0xff) { i++; continue; }
    const marker = b[i + 1];
    const len = b.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

/** Sanity's asset id for a file: image-<sha1>-<w>x<h>-<ext>. Lets the dry run compare images without uploading. */
export function assetIdFor(path: string) {
  const size = imageSize(path);
  const ext = path.split(".").pop()!.toLowerCase().replace("jpeg", "jpg");
  return size ? `image-${createHash("sha1").update(readFileSync(path)).digest("hex")}-${size.width}x${size.height}-${ext}` : null;
}

export type Existing = Record<string, unknown> & { _id: string; _type: string; seedKey?: string };
export type Plan = { seed: SeedDoc; id: string; body: Record<string, unknown>; status: "create" | "update" | "unchanged"; uploads: string[] };

const SYSTEM = new Set(["_id", "_rev", "_createdAt", "_updatedAt", "_system"]);
/** Order-insensitive for object keys, order-sensitive for arrays; ignores system fields and the Studio's weak-ref markers. */
function normalise(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(normalise);
  if (!v || typeof v !== "object") return v;
  return Object.fromEntries(Object.entries(v as Record<string, unknown>).filter(([k]) => !SYSTEM.has(k) && k !== "_weak" && k !== "_strengthenOnPublish").sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, normalise(x)]));
}
const same = (a: unknown, b: unknown) => JSON.stringify(normalise(a)) === JSON.stringify(normalise(b));

/** Resolve seed:<key> references to real ids and image uploads to Sanity asset ids (computed from the file). */
export function materialise(value: unknown, idOf: (key: string) => string, uploads: string[], asDraft: boolean): unknown {
  if (Array.isArray(value)) return value.map((v) => materialise(v, idOf, uploads, asDraft)).filter((v) => v !== undefined);
  if (!value || typeof value !== "object") return value;
  const o = value as Record<string, unknown>;
  if (typeof o._ref === "string" && o._ref.startsWith("seed:")) {
    // Drafts reference documents that may not be published yet: weak until publish, as the Studio does.
    return { ...o, _ref: idOf(o._ref.slice(5)), ...(asDraft ? { _weak: true } : {}) };
  }
  const asset = o.asset as { _upload?: string } | undefined;
  if (asset?._upload) {
    const path = resolve(asset._upload);
    if (!existsSync(path)) return undefined; // reported by heroStatus(); a portrait that's gone is simply left out
    const assetId = assetIdFor(path);
    if (!assetId) return undefined;
    uploads.push(path);
    const rest = Object.fromEntries(Object.entries(o).filter(([k]) => k !== "asset").map(([k, x]) => [k, materialise(x, idOf, uploads, asDraft)]));
    return { ...rest, asset: { _type: "reference", _ref: assetId } };
  }
  return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, materialise(x, idOf, uploads, asDraft)]).filter(([, x]) => x !== undefined));
}

/**
 * Decide create / update / unchanged for every seed document against what the dataset holds (drafts and published).
 * Pure: no network. Throws on two documents claiming one seedKey, or a reference that can't resolve.
 */
export function plan(existing: Existing[], docs: SeedDoc[], newId: () => string = randomUUID): Plan[] {  const baseId = (id: string) => id.replace(/^drafts\./, "");
  // Never duplicate: two different documents claiming one seedKey stop the run.
  const byKey = new Map<string, string>();
  for (const e of existing) {
    if (!e.seedKey) continue;
    const id = baseId(e._id);
    if (byKey.has(e.seedKey) && byKey.get(e.seedKey) !== id) throw new Error(`Two documents carry seedKey ${e.seedKey}: ${byKey.get(e.seedKey)} and ${id}. Resolve it in the Studio first.`);
    byKey.set(e.seedKey, id);
  }
  const ids = new Map<string, string>();
  for (const d of docs) ids.set(d.seedKey ?? d._id!, d._id ?? byKey.get(d.seedKey!) ?? newId());
  const idOf = (key: string) => {
    const id = ids.get(key);
    if (!id) throw new Error(`Unresolvable reference seed:${key}`);
    return id;
  };
  const current = (id: string) => existing.find((e) => e._id === `drafts.${id}`) ?? existing.find((e) => e._id === id);

  return docs.map((seed): Plan => {
    const id = ids.get(seed.seedKey ?? seed._id!)!;
    const uploads: string[] = [];
    const fields = Object.fromEntries(Object.entries(seed).filter(([k]) => k !== "_id"));
    const body = materialise(fields, idOf, uploads, true) as Record<string, unknown>;
    const now = current(id);
    const status = !now ? "create" : same({ ...body, _type: seed._type }, now) ? "unchanged" : "update";
    return { seed, id, body: { ...body, _type: seed._type }, status, uploads };
  });
}


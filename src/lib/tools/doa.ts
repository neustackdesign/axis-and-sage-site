import { doaAreaWeight, doaLimitShares, doaMonetaryAreas, doaUnbudgetedArea, type DoaCode } from "@/content/tools";

/** Rounds to n significant figures (limits use 2). */
export function roundSig(value: number, digits = 2) {
  if (!value || !Number.isFinite(value)) return 0;
  const p = Math.pow(10, digits - Math.ceil(Math.log10(Math.abs(value))));
  return Math.round(value * p) / p;
}

/** Monetary limits from annual revenue: 0.05%, 0.25%, 1% and 5%, rounded to 2 significant figures. */
export const revenueLimits = (revenue: number) => doaLimitShares.map((s) => roundSig(revenue * s, 2));

export type DoaCell = { code: DoaCode; limit: number | null; note?: string };

/**
 * Default cell for an area and a level. `levels` are the active approval levels, highest first.
 * Monetary areas: the top level approves without a cap. Below it, the four revenue limits go to the lowest four levels
 * (lowest level, smallest limit); any extra levels between those and the top recommend. With fewer than four levels
 * below the top, they take the highest limits. Unbudgeted spend goes one level up: each level takes the limit of the
 * level below it, and the lowest level recommends.
 */
export function limitTier(levelIndex: number, levelCount: number, unbudgeted: boolean): number | "top" | "recommend" {
  if (levelIndex === 0) return "top";
  const tiers = doaLimitShares.length;
  const below = levelCount - 1;
  const fromBottom = levelCount - 1 - levelIndex;
  let tier = below >= tiers ? fromBottom : fromBottom + (tiers - below);
  if (tier >= tiers) return "recommend";
  if (unbudgeted) tier -= 1;
  return tier < 0 ? "recommend" : tier;
}

export function defaultCell(area: string, levelIndex: number, levels: string[], revenue: number | null): DoaCell {
  const n = levels.length;
  if (doaMonetaryAreas.includes(area)) {
    const tier = limitTier(levelIndex, n, area === doaUnbudgetedArea);
    if (tier === "top") return { code: "A", limit: null, note: n > 1 ? "Above the delegated limits" : undefined };
    if (tier === "recommend") return { code: "R", limit: null };
    return { code: "A", limit: revenue && revenue > 0 ? revenueLimits(revenue)[tier] : null };
  }
  const approver = Math.min(n - 1, Math.round((doaAreaWeight[area] ?? 0.5) * (n - 1)));
  if (levelIndex === approver) return { code: "A", limit: null };
  if (levelIndex === approver + 1) return { code: "R", limit: null };
  if (levelIndex < approver) return { code: "I", limit: null };
  if (levelIndex === approver + 2) return { code: "C", limit: null };
  return { code: "–", limit: null };
}

/** Group rule (interim until file 06): in a group, the Group CEO is informed of every decision the CEO approves. */
export function applyGroupRules(cell: DoaCell, level: string, row: DoaCell[], levels: string[], structure: "single" | "group"): DoaCell {
  if (structure !== "group" || level !== "Group CEO" || cell.code !== "–") return cell;
  const ceo = levels.indexOf("CEO");
  return ceo >= 0 && row[ceo]?.code === "A" ? { ...cell, code: "I" } : cell;
}

export function buildMatrix(areas: string[], levels: string[], revenue: number | null, structure: "single" | "group") {
  return areas.map((area) => {
    const row = levels.map((_, i) => defaultCell(area, i, levels, revenue));
    return row.map((c, i) => applyGroupRules(c, levels[i], row, levels, structure));
  });
}

export const footnotes = [
  "Limits are per transaction, in the currency of your revenue, and include tax.",
  "Spend outside the approved budget needs approval one level higher than the same spend within budget.",
  "Nobody approves a decision in which they have a personal interest; it goes one level up.",
];

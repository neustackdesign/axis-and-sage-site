import {
  doaBands, doaGroupCeoShare, doaMonetaryAreas, doaNonMonetary, doaSubsidiaryLabel, doaUnbudgetedArea, money,
  type CurrencyCode, type DoaArea, type DoaCode, type DoaLevel,
} from "@/lib/tools/spec";

/** Rounds to n significant figures (limits use 2). */
export function roundSig(value: number, digits = 2) {
  if (!value || !Number.isFinite(value)) return 0;
  return Number(value.toPrecision(digits));
}

export type Structure = "single" | "group";

/** Where a monetary limit comes from, so the spreadsheet can rebuild it as a formula. */
export type BandRef = { level: DoaLevel; basis: "revenue" | "group" };

export type DoaCell = { code: DoaCode; limit: number | null; op?: "≤" | ">"; unit?: "money" | "pct"; note?: string; band?: BandRef };

/** Levels that hold a monetary limit. Board committees never do. */
const bandLevels: DoaLevel[] = ["Manager", "Function head", "CFO", "CEO / MD", "Group CEO", "Board"];

/** The budgeted limit a level holds, rounded to 2 significant figures. The Board has no cap. */
export function bandLimit(level: DoaLevel, revenue: number | null, groupRevenue: number | null): { limit: number | null; band: BandRef } | null {
  const band = doaBands.find((b) => b.level === level);
  if (band) return { limit: revenue && revenue > 0 ? roundSig(revenue * band.share) : null, band: { level, basis: "revenue" } };
  if (level === "Group CEO") return { limit: groupRevenue && groupRevenue > 0 ? roundSig(groupRevenue * doaGroupCeoShare) : null, band: { level, basis: "group" } };
  return null;
}

/** The budgeted limits by level for a revenue figure, lowest first. */
export const revenueLimits = (revenue: number) => doaBands.map((b) => roundSig(revenue * b.share));

/** Column label: in a group, CEO / MD is the subsidiary MD. */
export const levelLabel = (level: DoaLevel, structure: Structure) => (structure === "group" && level === "CEO / MD" ? doaSubsidiaryLabel : level);

/**
 * A monetary row. Each level approves up to its band; the Board approves above the highest band in the row.
 * Unbudgeted spend goes one level up: each level takes the limit of the level below it, and the lowest recommends.
 */
function monetaryRow(levels: DoaLevel[], revenue: number | null, groupRevenue: number | null, unbudgeted: boolean): DoaCell[] {
  const chain = levels.filter((l) => bandLevels.includes(l)).reverse(); // lowest first
  const capped = chain.filter((l) => l !== "Board");
  const cells = new Map<DoaLevel, DoaCell>();
  capped.forEach((level, k) => {
    const source = unbudgeted ? capped[k - 1] : level;
    if (!source) { cells.set(level, { code: "R", limit: null }); return; }
    const b = bandLimit(source, revenue, groupRevenue)!;
    cells.set(level, { code: "A", op: "≤", unit: "money", limit: b.limit, band: b.band });
  });
  if (chain.includes("Board")) {
    const approvers = capped.map((l) => cells.get(l)!).filter((c) => c.code === "A");
    const top = approvers.reduce<DoaCell | undefined>((best, c) => (!best || (c.limit ?? 0) > (best.limit ?? 0) ? c : best), undefined);
    cells.set("Board", top ? { code: "A", op: ">", unit: "money", limit: top.limit, band: top.band } : { code: "A", limit: null });
  }
  return levels.map((l) => cells.get(l) ?? { code: "–", limit: null });
}

function nonMonetaryRow(area: DoaArea, levels: DoaLevel[], structure: Structure): DoaCell[] {
  const defaults = doaNonMonetary[area] || {};
  const cell = (level: DoaLevel): DoaCell => {
    const d = defaults[level];
    if (!d) return { code: "–", limit: null };
    return d.pct ? { code: d.code, limit: d.pct.value, op: d.pct.op, unit: "pct", note: d.note } : { code: d.code, limit: null, note: d.note };
  };
  const row = levels.map(cell);
  // Group rule: the Group CEO sits between the Board and the subsidiary MD. It is informed of what the MD approves,
  // and recommends what the MD sends on to the Board.
  if (structure === "group" && levels.includes("Group CEO")) {
    const md = defaults["CEO / MD"], board = defaults.Board;
    const g: DoaCell = md?.code === "A" ? { code: "I", limit: null } : md?.code === "R" && board?.code === "A" ? { code: "R", limit: null } : { code: "–", limit: null };
    row[levels.indexOf("Group CEO")] = g;
  }
  return row;
}

/** Default cell for an area and a level. `levels` are the active levels, highest first. */
export function defaultCell(area: DoaArea, levelIndex: number, levels: DoaLevel[], revenue: number | null, structure: Structure = "single", groupRevenue: number | null = null) {
  return buildMatrix([area], levels, revenue, structure, groupRevenue)[0][levelIndex];
}

export function buildMatrix(areas: DoaArea[], levels: DoaLevel[], revenue: number | null, structure: Structure, groupRevenue: number | null = null) {
  const active = levels.filter((l) => structure === "group" || l !== "Group CEO");
  return areas.map((area) => {
    const row = doaMonetaryAreas.includes(area) || area === doaUnbudgetedArea
      ? monetaryRow(active, revenue, groupRevenue, area === doaUnbudgetedArea)
      : nonMonetaryRow(area, active, structure);
    return levels.map((l) => (active.includes(l) ? row[active.indexOf(l)] : { code: "–" as DoaCode, limit: null }));
  });
}

/** The level that approves an amount in a monetary row: the lowest level whose limit covers it. */
export function approverFor(amount: number, row: DoaCell[], levels: DoaLevel[]) {
  for (let i = levels.length - 1; i >= 0; i--) {
    const c = row[i];
    if (c.code !== "A" || c.unit !== "money") continue;
    if (c.op === "≤" && c.limit !== null && amount <= c.limit) return levels[i];
    if (c.op === ">" && c.limit !== null && amount > c.limit) return levels[i];
  }
  return null;
}

/** Cell text, for example "A ≤ ₦25M", "A > ₦500M", "A ≤ 5%" or "A · within plan". Exports pass full = true for unabbreviated values. */
export function formatCell(c: DoaCell, currency: CurrencyCode, full = false) {
  let limit = "";
  if (c.limit !== null && c.op) {
    const value = c.unit === "pct" ? `${c.limit}%` : full ? `${currency} ${Math.round(c.limit).toLocaleString("en-GB")}` : money(c.limit, currency);
    limit = ` ${c.op} ${value}`;
  }
  return `${c.code}${limit}${c.note ? ` · ${c.note}` : ""}`;
}

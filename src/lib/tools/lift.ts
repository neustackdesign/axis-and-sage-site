import type { LiftMode } from "@/content/tools";

export type LiftInput = { mode: LiftMode; base: number; rate: number; value: number; lift: number; target: number };

const clampPct = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0));
const pos = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);

/**
 * Customers: today = N × r0 / 100; extra = N × Δ / 100; value_month = extra × V; value_year × 12; per_point = N × 0.01 × V.
 * Investors: extra commitments = N × Δ / 100; extra capital = extra × T; per_point = N × 0.01 × T.
 * Our team: gap = N × (r1 − r0) / 100; value_month = gap × V; value_year × 12.
 */
export function liftModel(i: LiftInput) {
  const N = pos(i.base), V = pos(i.value), r0 = clampPct(i.rate);
  const today = (N * r0) / 100;
  if (i.mode === "team") {
    const r1 = clampPct(i.target);
    const extra = (N * Math.max(0, r1 - r0)) / 100;
    const valueMonth = extra * V;
    return { mode: i.mode, r0, r1, points: Math.max(0, r1 - r0), today, extra, valueMonth, valueYear: valueMonth * 12, perPoint: N * 0.01 * V };
  }
  const points = pos(i.lift);
  const extra = (N * points) / 100;
  const valueMonth = extra * V;
  return { mode: i.mode, r0, r1: clampPct(r0 + points), points, today, extra, valueMonth, valueYear: valueMonth * 12, perPoint: N * 0.01 * V };
}

/** Customers mode: payback_actions = ceil(F / V). Null while the price or the value is missing, or the currencies differ. */
export function paybackActions(value: number, price: { amount: number | null; currency: string }, currency: string) {
  if (price.amount === null || price.amount <= 0 || price.currency !== currency || !(value > 0)) return null;
  return Math.ceil(price.amount / value);
}

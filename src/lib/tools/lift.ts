import type { LiftMode } from "@/content/tools";

export type LiftInput = { mode: LiftMode; base: number; rate: number; value: number; lift: number; target: number };

/** Effective lift in points: Our team uses the target rate r1; the other modes add points to today's rate r0. */
export function liftPoints(i: LiftInput) {
  const r0 = clampPct(i.rate);
  const r1 = i.mode === "team" ? clampPct(i.target) : clampPct(r0 + Math.max(0, i.lift));
  return Math.max(0, r1 - r0);
}

const clampPct = (n: number) => Math.min(100, Math.max(0, Number.isFinite(n) ? n : 0));

export function liftModel(i: LiftInput) {
  const base = Math.max(0, i.base || 0), value = Math.max(0, i.value || 0);
  const points = liftPoints(i);
  const r0 = clampPct(i.rate);
  const extraActions = (base * points) / 100;
  const extraMonth = extraActions * value;
  const perPointMonth = (base / 100) * value;
  return { r0, r1: r0 + points, points, extraActions, extraMonth, extraYear: extraMonth * 12, perPointMonth, perPointYear: perPointMonth * 12 };
}

/** Months until the extra value pays back the Diagnostic fee. Null while the price is unset, the currencies differ, or nothing moves. */
export function breakEvenMonths(extraMonth: number, price: { amount: number | null; currency: string }, currency: string) {
  if (price.amount === null || price.amount <= 0 || price.currency !== currency || extraMonth <= 0) return null;
  return Math.ceil((price.amount / extraMonth) * 10) / 10;
}

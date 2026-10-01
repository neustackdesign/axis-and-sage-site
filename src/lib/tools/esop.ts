export type EsopInput = {
  shares: number; founders: number; poolPct: number; grantPct: number; strike: number | null; valuation: number; exit: number;
  years: number; cliffMonths: number; frequencyMonths?: number; round: boolean; dilutionPct: number;
};

export function validateEsop(i: EsopInput) {
  const e: Record<string, string> = {};
  if (!(i.shares > 0)) e.shares = "Enter the shares in issue today.";
  if (i.founders < 0 || i.founders > i.shares) e.founders = "Founders can't hold more shares than exist.";
  if (i.poolPct < 0 || i.poolPct >= 100) e.poolPct = "The pool must be under 100%.";
  if (i.grantPct < 0 || (i.poolPct > 0 && i.grantPct > i.poolPct)) e.grantPct = "The grant can't be bigger than the pool.";
  if (i.round && (i.dilutionPct < 0 || i.dilutionPct >= 100)) e.dilutionPct = "Dilution must be under 100%.";
  if (!(i.years >= 1)) e.years = "Vesting needs at least one year.";
  if (i.cliffMonths < 0) e.cliffMonths = "The cliff can't be negative.";
  return e;
}

/** vested(m) = 0 while m < cliff, otherwise G × min(1, m / (years × 12)), counted in whole vesting periods. */
export function vested(m: number, grant: number, years: number, cliffMonths: number, frequencyMonths = 1) {
  if (m < cliffMonths) return 0;
  const counted = Math.floor(m / frequencyMonths) * frequencyMonths;
  return Math.round(grant * Math.min(1, counted / (years * 12)));
}

/**
 * P = p / (100 − p) × S, rounded; FD = S + P; G = g / 100 × FD, rounded.
 * strike = Vc / FD unless a strike is given; exit_price = Ve / FD × (1 − d) with the extra round on.
 * grant_value = G × max(0, exit_price − strike).
 */
export function esopModel(i: EsopInput) {
  const P = i.poolPct > 0 ? Math.round((i.poolPct / (100 - i.poolPct)) * i.shares) : 0;
  const FD = i.shares + P;
  const G = Math.round((i.grantPct / 100) * FD);
  const priceToday = FD ? i.valuation / FD : 0;
  const strike = i.strike ?? priceToday;
  const d = i.round ? i.dilutionPct / 100 : 0;
  const exitPrice = FD ? (i.exit / FD) * (1 - d) : 0;
  const months = Math.round(i.years * 12);
  const freq = i.frequencyMonths || 1;
  return {
    P, FD, G, priceToday, strike, exitPrice,
    foundersBefore: i.shares ? i.founders / i.shares : 0,
    foundersAfter: FD ? i.founders / FD : 0,
    grantValue: G * Math.max(0, exitPrice - strike),
    vesting: Array.from({ length: months + 1 }, (_, m) => ({ month: m, vested: vested(m, G, i.years, i.cliffMonths, freq) })),
  };
}

/** "About" figures in the sentence: 3 significant figures. */
export const about = (n: number) => (n ? Number(n.toPrecision(3)) : 0);

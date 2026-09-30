export type EsopInput = { shares: number; founders: number; poolPct: number; grantPct: number; strike: number | null; valuation: number; exit: number; years: number; cliffMonths: number; round: boolean; dilutionPct: number };

export function validateEsop(i: EsopInput) {
  const e: Record<string, string> = {};
  if (!(i.shares > 0)) e.shares = "Enter the shares in issue today.";
  if (i.founders < 0 || i.founders > i.shares) e.founders = "Founders can't hold more shares than exist.";
  if (i.poolPct < 0 || i.poolPct >= 100) e.poolPct = "The pool must be under 100%.";
  if (i.grantPct < 0 || (i.poolPct > 0 && i.grantPct > i.poolPct)) e.grantPct = "The grant can't be bigger than the pool.";
  if (i.round && (i.dilutionPct < 0 || i.dilutionPct >= 100)) e.dilutionPct = "Dilution must be under 100%.";
  if (!(i.years >= 1)) e.years = "Vesting needs at least one year.";
  return e;
}

/**
 * Pool: created so it is poolPct of the company after creation. Dilution: one optional round issues new shares
 * equal to dilutionPct of the post-round company. Value = shares × (price per share − strike), never below zero.
 */
export function esopModel(i: EsopInput) {
  const pool = i.poolPct / 100, grant = i.grantPct / 100, dilution = i.round ? i.dilutionPct / 100 : 0;
  const poolShares = pool > 0 ? (i.shares * pool) / (1 - pool) : 0;
  const total = i.shares + poolShares;
  const grantShares = total * grant;
  const priceToday = total ? i.valuation / total : 0;
  const strike = i.strike ?? priceToday;
  const exitShares = total / (1 - dilution);
  const priceExit = exitShares ? i.exit / exitShares : 0;
  const cliffYears = i.cliffMonths / 12;
  const vesting = Array.from({ length: Math.round(i.years) }, (_, k) => ({ year: k + 1, vestedPct: k + 1 < cliffYears ? 0 : Math.min(1, (k + 1) / i.years) }));
  return {
    poolShares, total, grantShares, priceToday, strike, priceExit,
    foundersBefore: i.shares ? i.founders / i.shares : 0,
    foundersAfter: total ? i.founders / total : 0,
    foundersAtExit: exitShares ? i.founders / exitShares : 0,
    grantPctAtExit: exitShares ? grantShares / exitShares : 0,
    valueToday: grantShares * Math.max(0, priceToday - strike),
    valueExit: grantShares * Math.max(0, priceExit - strike),
    vesting,
  };
}

"use client";

import { useId, useState } from "react";
import { money, currencies, type CurrencyCode } from "@/content/tools";
import { NumberField, Segmented, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const int = (n: number) => Math.round(n).toLocaleString("en-GB");

/** ESOP & Share Pool Calculator. Plain arithmetic; the sentence at the end is for the hire. */
export function EsopCalculator() {
  const id = useId();
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [v, setV] = useState({ shares: 1000000 as number | "", founders: 800000 as number | "", pool: 10 as number | "", grant: 0.5 as number | "", valuation: 5000000 as number | "", exit: 50000000 as number | "", years: 4 as number | "", cliff: 12 as number | "", round: false, dilution: 20 as number | "" });
  const set = (k: keyof typeof v, n: number | "" | boolean) => setV((s) => ({ ...s, [k]: n }));
  const num = (x: number | "") => (x === "" ? 0 : x);

  const shares = num(v.shares), founders = num(v.founders), pool = num(v.pool) / 100, grant = num(v.grant) / 100;
  const errors: Record<string, string> = {};
  if (shares <= 0) errors.shares = "Enter the shares in issue today.";
  if (founders > shares) errors.founders = "Founders can't hold more shares than exist.";
  if (pool >= 1) errors.pool = "The pool must be under 100%.";
  if (grant > pool && pool > 0) errors.grant = "The grant can't be bigger than the pool.";
  const valid = !Object.keys(errors).length;

  const poolShares = pool > 0 ? (shares * pool) / (1 - pool) : 0;
  const total = shares + poolShares;
  const before = shares ? founders / shares : 0;
  const after = total ? founders / total : 0;
  const grantShares = total * grant;
  const dilute = v.round ? 1 - num(v.dilution) / 100 : 1;
  const valueToday = grant * num(v.valuation);
  const valueExit = grant * dilute * num(v.exit);
  const years = Math.max(1, Math.round(num(v.years)));
  const cliffYears = num(v.cliff) / 12;
  const bars = Array.from({ length: years }, (_, i) => ({ year: i + 1, vested: i + 1 < cliffYears ? 0 : Math.min(1, (i + 1) / years), cliff: Math.ceil(cliffYears) === i + 1 }));
  const sentence = `You're being offered ${int(grantShares)} shares, about ${pct(grant)} of the company. They vest over ${years} years with a ${num(v.cliff)}-month cliff. If the company sells for ${money(num(v.exit), currency)}${v.round ? ` after one more round of ${num(v.dilution)}% dilution` : ""}, they would be worth about ${money(valueExit, currency)} before tax.`;
  const summary = () => [`Shares today: ${int(shares)}; founders: ${int(founders)}`, `Pool: ${num(v.pool)}% (${int(poolShares)} shares)`, `Founders: ${pct(before)} before, ${pct(after)} after the pool`, `Grant: ${num(v.grant)}% = ${int(grantShares)} shares`, `Value today: ${money(valueToday, currency)}; at exit: ${money(valueExit, currency)}`, sentence].join("\n");

  return (
    <div className="tool-grid-io">
      <ToolPanel>
        <div className="tool-inputs">
          <div className="field"><span className="field-label">Currency</span><Segmented label="Currency" value={currency} onChange={setCurrency} options={currencies.map((c) => ({ key: c.code, label: c.code }))} /></div>
          <div className="form-grid">
            <NumberField id={`${id}-shares`} label="Shares in issue today" value={v.shares} onChange={(n) => set("shares", n)} error={errors.shares} />
            <NumberField id={`${id}-founders`} label="Founders' shares" value={v.founders} onChange={(n) => set("founders", n)} error={errors.founders} />
            <NumberField id={`${id}-pool`} label="Pool" value={v.pool} onChange={(n) => set("pool", n)} step={0.5} suffix="%" help="Share of the company after the pool is created." error={errors.pool} />
            <NumberField id={`${id}-grant`} label="Grant" value={v.grant} onChange={(n) => set("grant", n)} step={0.05} suffix="%" help="The hire's share of the company." error={errors.grant} />
            <NumberField id={`${id}-valuation`} label="Current valuation" value={v.valuation} onChange={(n) => set("valuation", n)} prefix={currency} />
            <NumberField id={`${id}-exit`} label="Exit valuation" value={v.exit} onChange={(n) => set("exit", n)} prefix={currency} />
            <NumberField id={`${id}-years`} label="Vesting" value={v.years} onChange={(n) => set("years", n)} min={1} max={10} suffix="years" />
            <NumberField id={`${id}-cliff`} label="Cliff" value={v.cliff} onChange={(n) => set("cliff", n)} max={48} suffix="months" />
          </div>
          <label className="check"><input type="checkbox" checked={v.round} onChange={(e) => set("round", e.target.checked)} /><span>Allow for one more round of dilution before exit</span></label>
          {v.round ? <NumberField id={`${id}-dilution`} label="Dilution in that round" value={v.dilution} onChange={(n) => set("dilution", n)} suffix="%" /> : null}
        </div>
      </ToolPanel>
      <div className="tool-output on-dark" aria-live="polite">
        {valid ? (
          <>
            <div className="output-row"><span className="t-label">FOUNDERS&apos; OWNERSHIP</span><span className="output-num">{pct(before)} → {pct(after)}</span><span className="t-small">Before and after the pool</span></div>
            <div className="output-row"><span className="t-label">POOL SHARES</span><span className="output-num">{int(poolShares)}</span></div>
            <div className="output-row"><span className="t-label">THE GRANT</span><span className="output-num">{int(grantShares)}</span><span className="t-small">Worth {money(valueToday, currency)} today</span></div>
            <div className="output-row"><span className="t-label">VALUE AT EXIT</span><span className="output-num is-key">{money(valueExit, currency)}</span></div>
            <div className="output-row">
              <span className="t-label">VESTING</span>
              <div className="vesting-chart" role="img" aria-label={`Vesting over ${years} years with a ${num(v.cliff)}-month cliff`}>
                {bars.map((b) => <span key={b.year} className={b.cliff ? "is-cliff" : undefined} style={{ height: `${Math.max(2, b.vested * 100)}%` }} />)}
              </div>
              <div className="vesting-axis t-label"><span>YEAR 1</span><span>YEAR {years}</span></div>
            </div>
            <div className="output-row"><span className="t-label">TELL THE HIRE</span><p className="output-sentence">{sentence}</p></div>
            <ToolEmail tool="ESOP & Share Pool Calculator" label="Email me this" summary={summary} successText="Done. It's on its way to your inbox." />
          </>
        ) : <p className="t-body-l">Fix the highlighted inputs to see the numbers.</p>}
      </div>
    </div>
  );
}

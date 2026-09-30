"use client";

import { useCallback, useId, useState } from "react";
import { money, currencies, type CurrencyCode } from "@/content/tools";
import { esopModel, validateEsop, type EsopInput } from "@/lib/tools/esop";
import { esopWorkbook } from "@/lib/tools/xlsx";
import { NumberField, Segmented, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolEvents } from "./useTool";

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
const int = (n: number) => Math.round(n).toLocaleString("en-GB");
type Num = number | "";
type State = { currency: CurrencyCode; shares: Num; founders: Num; pool: Num; grant: Num; strike: Num; valuation: Num; exit: Num; years: Num; cliff: Num; round: boolean; dilution: Num };
const initial: State = { currency: "USD", shares: 1000000, founders: 800000, pool: 10, grant: 0.5, strike: "", valuation: 5000000, exit: 50000000, years: 4, cliff: 12, round: false, dilution: 20 };
const num = (x: Num) => (x === "" ? 0 : x);

/** ESOP & Share Pool Calculator. All maths in lib/tools/esop. */
export function EsopCalculator() {
  const id = useId();
  const events = useToolEvents("ESOP & Share Pool Calculator");
  const [v, setV] = useState<State>(initial);
  useHashRestore<State>(useCallback((r) => setV({ ...initial, ...r }), []));
  const set = <K extends keyof State>(k: K, n: State[K]) => { events.start(); setV((s) => ({ ...s, [k]: n })); };

  const input: EsopInput = { shares: num(v.shares), founders: num(v.founders), poolPct: num(v.pool), grantPct: num(v.grant), strike: v.strike === "" ? null : v.strike, valuation: num(v.valuation), exit: num(v.exit), years: Math.max(1, Math.round(num(v.years))), cliffMonths: num(v.cliff), round: v.round, dilutionPct: num(v.dilution) };
  const errors = validateEsop(input);
  const valid = !Object.keys(errors).length;
  const m = esopModel(input);
  const sentence = `You're being offered ${int(m.grantShares)} shares, about ${pct(input.grantPct / 100)} of the company, at a strike price of ${money(m.strike, v.currency)} a share. They vest over ${input.years} years with a ${input.cliffMonths}-month cliff. If the company sells for ${money(input.exit, v.currency)}${v.round ? ` after one more round of ${input.dilutionPct}% dilution` : ""}, they would be worth about ${money(m.valueExit, v.currency)} before tax.`;
  const summary = () => [`Shares today: ${int(input.shares)}; founders: ${int(input.founders)}`, `Pool: ${input.poolPct}% (${int(m.poolShares)} shares)`, `Founders: ${pct(m.foundersBefore)} before, ${pct(m.foundersAfter)} after the pool`, `Grant: ${input.grantPct}% = ${int(m.grantShares)} shares`, `Price per share today: ${money(m.priceToday, v.currency)}; strike: ${money(m.strike, v.currency)}`, `Value today: ${money(m.valueToday, v.currency)}; at exit: ${money(m.valueExit, v.currency)}`, "", sentence].join("\n");

  return (
    <div className="tool-grid-io">
      <ToolPanel>
        <div className="tool-inputs">
          <div className="field"><span className="field-label">Currency</span><Segmented label="Currency" value={v.currency} onChange={(c) => set("currency", c)} options={currencies.map((c) => ({ key: c.code, label: c.code }))} /></div>
          <div className="form-grid">
            <NumberField id={`${id}-shares`} label="Shares in issue today" value={v.shares} onChange={(n) => set("shares", n)} error={errors.shares} />
            <NumberField id={`${id}-founders`} label="Founders' shares" value={v.founders} onChange={(n) => set("founders", n)} error={errors.founders} />
            <NumberField id={`${id}-pool`} label="Pool" value={v.pool} onChange={(n) => set("pool", n)} step={0.5} suffix="%" help="Share of the company after the pool is created." error={errors.poolPct} />
            <NumberField id={`${id}-grant`} label="Grant" value={v.grant} onChange={(n) => set("grant", n)} step={0.05} suffix="%" help="The hire's share of the company." error={errors.grantPct} />
            <NumberField id={`${id}-valuation`} label="Current valuation" value={v.valuation} onChange={(n) => set("valuation", n)} prefix={v.currency} />
            <NumberField id={`${id}-strike`} label="Strike price per share" value={v.strike} onChange={(n) => set("strike", n)} step={0.01} prefix={v.currency} help={`Blank uses today's price: ${money(m.priceToday, v.currency)}.`} />
            <NumberField id={`${id}-exit`} label="Exit valuation" value={v.exit} onChange={(n) => set("exit", n)} prefix={v.currency} />
            <NumberField id={`${id}-years`} label="Vesting" value={v.years} onChange={(n) => set("years", n)} min={1} max={10} suffix="years" error={errors.years} />
            <NumberField id={`${id}-cliff`} label="Cliff" value={v.cliff} onChange={(n) => set("cliff", n)} max={48} suffix="months" />
          </div>
          <label className="check"><input type="checkbox" checked={v.round} onChange={(e) => set("round", e.target.checked)} /><span>Allow for one more round of dilution before exit</span></label>
          {v.round ? <NumberField id={`${id}-dilution`} label="Dilution in that round" value={v.dilution} onChange={(n) => set("dilution", n)} suffix="%" error={errors.dilutionPct} /> : null}
        </div>
      </ToolPanel>
      <div className="tool-output on-dark" aria-live="polite">
        {valid ? (
          <>
            <div className="output-row"><span className="t-label">FOUNDERS&apos; OWNERSHIP</span><span className="output-num">{pct(m.foundersBefore)} → {pct(m.foundersAfter)}</span><span className="t-small">Before and after the pool{v.round ? `; ${pct(m.foundersAtExit)} after the next round` : ""}</span></div>
            <div className="output-row"><span className="t-label">POOL SHARES</span><span className="output-num">{int(m.poolShares)}</span></div>
            <div className="output-row"><span className="t-label">THE GRANT</span><span className="output-num">{int(m.grantShares)}</span><span className="t-small">Worth {money(m.valueToday, v.currency)} today at a {money(m.strike, v.currency)} strike</span></div>
            <div className="output-row"><span className="t-label">VALUE AT EXIT</span><span className="output-num is-key">{money(m.valueExit, v.currency)}</span></div>
            <div className="output-row">
              <span className="t-label">VESTING</span>
              <div className="vesting-chart" role="img" aria-label={`Vesting over ${input.years} years with a ${input.cliffMonths}-month cliff`}>
                {m.vesting.map((b) => <span key={b.year} className={Math.ceil(input.cliffMonths / 12) === b.year ? "is-cliff" : undefined} style={{ height: `${Math.max(2, b.vestedPct * 100)}%` }} />)}
              </div>
              <div className="vesting-axis t-label"><span>YEAR 1</span><span>YEAR {input.years}</span></div>
            </div>
            <div className="output-row"><span className="t-label">TELL THE HIRE</span><p className="output-sentence">{sentence}</p></div>
            <ToolEmail tool="ESOP & Share Pool Calculator" label="Send me the model" summary={summary} result={() => ({ input, model: { ...m, vesting: undefined } })} shareUrl={() => toolShareUrl(v)} download={{ filename: "esop-model.xlsx", build: () => esopWorkbook({ ...input, currency: v.currency }) }} />
          </>
        ) : <p className="t-body-l">Fix the highlighted inputs to see the numbers.</p>}
      </div>
    </div>
  );
}

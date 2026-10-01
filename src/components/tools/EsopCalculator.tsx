"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { count, currencies, esopDefaults, esopFrequencies, esopSentence, money, type CurrencyCode, type EsopFrequency } from "@/lib/tools/spec";
import { about, esopModel, validateEsop, type EsopInput } from "@/lib/tools/esop";
import { esopWorkbook } from "@/lib/tools/xlsx";
import { NumberField, Segmented, ToolDisclaimer, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolComplete } from "./useTool";

const pct = (n: number) => `${(n * 100).toFixed(2)}%`;
type Num = number | "";
type State = { currency: CurrencyCode; shares: Num; founders: Num; pool: Num; grant: Num; strike: Num; valuation: Num; exit: Num; years: Num; cliff: Num; frequency: EsopFrequency; round: boolean; dilution: Num };
const initial: State = { currency: "USD", strike: "", ...esopDefaults };
const num = (x: Num) => (x === "" ? 0 : x);
const sprintHref = "/contact?engagement=Investor%20Readiness%20Sprint&source=esop#note";

/** ESOP & Share Pool Calculator. All maths in lib/tools/esop. */
export function EsopCalculator() {
  const id = useId();
  const complete = useToolComplete("ESOP & Share Pool Calculator");
  const [v, setV] = useState<State>(initial);
  const [touched, setTouched] = useState(false);
  useHashRestore<State>(useCallback((r) => setV({ ...initial, ...r }), []));
  const set = <K extends keyof State>(k: K, n: State[K]) => { setTouched(true); setV((s) => ({ ...s, [k]: n })); };

  const frequency = esopFrequencies.find((f) => f.key === v.frequency) || esopFrequencies[0];
  const input: EsopInput = { shares: num(v.shares), founders: num(v.founders), poolPct: num(v.pool), grantPct: num(v.grant), strike: v.strike === "" ? null : v.strike, valuation: num(v.valuation), exit: num(v.exit), years: Math.max(1, Math.round(num(v.years))), cliffMonths: num(v.cliff), frequencyMonths: frequency.months, round: v.round, dilutionPct: num(v.dilution) };
  const errors = validateEsop(input);
  const valid = !Object.keys(errors).length;
  const m = esopModel(input);
  const cur = (n: number, decimals?: number) => money(n, v.currency, { decimals });
  const sentence = esopSentence
    .replace("{G}", count(m.G)).replace("{years}", String(input.years)).replace("{cliff}", String(input.cliffMonths))
    .replace("{Ve}", cur(input.exit)).replace("{grant_value}", cur(about(m.grantValue)));
  const marks = [input.cliffMonths - 1, input.cliffMonths, 24, input.years * 12].filter((x, i, a) => x >= 0 && x <= input.years * 12 && a.indexOf(x) === i).sort((a, b) => a - b);

  useEffect(() => {
    if (!touched || !valid) return;
    const t = setTimeout(() => complete({ ...input, currency: v.currency }, { P: m.P, FD: m.FD, G: m.G, strike: m.strike, exitPrice: m.exitPrice, grantValue: Math.round(m.grantValue) }), 4000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touched, valid, complete, JSON.stringify(input), v.currency]);

  const summary = () => [
    `Shares in issue today: ${count(input.shares)}; founders: ${count(input.founders)}`,
    `Pool: ${input.poolPct}% of fully diluted = ${count(m.P)} new shares; fully diluted ${count(m.FD)}`,
    `Founders: ${pct(m.foundersBefore)} → ${pct(m.foundersAfter)}`,
    `Grant: ${input.grantPct}% = ${count(m.G)} options`,
    `Strike: ${cur(m.strike, 2)}; exit price: ${cur(m.exitPrice, 2)}${v.round ? ` after one more round of ${input.dilutionPct}% dilution` : ""}`,
    `Grant value at exit: ${cur(m.grantValue)} before tax`,
    `Vesting: ${frequency.label.toLowerCase()} over ${input.years} years, ${input.cliffMonths}-month cliff`,
    ...marks.map((mo) => `  Month ${mo}: ${count(m.vesting[mo]?.vested ?? 0)} vested`),
    "",
    sentence,
  ].join("\n");

  return (
    <div className="tool-grid-io">
      <ToolPanel>
        <div className="tool-inputs">
          <div className="field"><span className="field-label">Currency</span><Segmented label="Currency" value={v.currency} onChange={(c) => set("currency", c)} options={currencies.map((c) => ({ key: c.code, label: c.code }))} /></div>
          <div className="form-grid">
            <NumberField id={`${id}-shares`} label="Shares in issue today" value={v.shares} onChange={(n) => set("shares", n)} error={errors.shares} />
            <NumberField id={`${id}-founders`} label="Founders' combined shares" value={v.founders} onChange={(n) => set("founders", n)} error={errors.founders} />
            <NumberField id={`${id}-pool`} label="Pool size after creation" value={v.pool} onChange={(n) => set("pool", n)} step={0.5} suffix="%" help="Share of fully diluted. Issued as new shares." error={errors.poolPct} />
            <NumberField id={`${id}-grant`} label="One grant" value={v.grant} onChange={(n) => set("grant", n)} step={0.05} suffix="%" help="Share of fully diluted." error={errors.grantPct} />
            <NumberField id={`${id}-valuation`} label="Current valuation" value={v.valuation} onChange={(n) => set("valuation", n)} prefix={v.currency} />
            <NumberField id={`${id}-strike`} label="Strike price per share" value={v.strike} onChange={(n) => set("strike", n)} step={0.01} prefix={v.currency} help={`Optional. Blank uses current valuation ÷ fully diluted: ${cur(m.priceToday, 2)}.`} />
            <NumberField id={`${id}-exit`} label="Exit valuation scenario" value={v.exit} onChange={(n) => set("exit", n)} prefix={v.currency} />
            <NumberField id={`${id}-years`} label="Vesting" value={v.years} onChange={(n) => set("years", n)} min={1} max={10} suffix="years" error={errors.years} />
            <NumberField id={`${id}-cliff`} label="Cliff" value={v.cliff} onChange={(n) => set("cliff", n)} max={48} suffix="months" error={errors.cliffMonths} />
          </div>
          <div className="field"><span className="field-label">Vesting frequency</span><Segmented label="Vesting frequency" value={v.frequency} onChange={(f) => set("frequency", f)} options={esopFrequencies.map((f) => ({ key: f.key, label: f.label }))} /></div>
          <label className="check"><input type="checkbox" checked={v.round} onChange={(e) => set("round", e.target.checked)} /><span>One more round before exit</span></label>
          {v.round ? <NumberField id={`${id}-dilution`} label="Dilution in that round" value={v.dilution} onChange={(n) => set("dilution", n)} suffix="%" error={errors.dilutionPct} /> : null}
        </div>
      </ToolPanel>
      <div className="tool-output on-dark" aria-live="polite">
        {valid ? (
          <>
            <div className="output-row"><span className="t-label">FOUNDERS</span><span className="output-num">{pct(m.foundersBefore)} → {pct(m.foundersAfter)}</span><span className="t-small">Before and after the pool</span></div>
            <div className="output-row"><span className="t-label">POOL · FULLY DILUTED</span><span className="output-num">{count(m.P)}</span><span className="t-small">{count(m.FD)} shares fully diluted</span></div>
            <div className="output-row"><span className="t-label">THE GRANT</span><span className="output-num">{count(m.G)}</span><span className="t-small">Strike {cur(m.strike, 2)} · exit price {cur(m.exitPrice, 2)}</span></div>
            <div className="output-row"><span className="t-label">VALUE AT EXIT, BEFORE TAX</span><span className="output-num is-key">{cur(m.grantValue)}</span></div>
            <div className="output-row">
              <span className="t-label">VESTING</span>
              <div className="vesting-chart" role="img" aria-label={`Vesting ${frequency.label.toLowerCase()} over ${input.years} years with a ${input.cliffMonths}-month cliff`}>
                {Array.from({ length: input.years }, (_, y) => m.vesting[(y + 1) * 12]).map((b, y) => <span key={y} className={Math.ceil(input.cliffMonths / 12) === y + 1 ? "is-cliff" : undefined} style={{ height: `${Math.max(2, m.G ? ((b?.vested ?? 0) / m.G) * 100 : 0)}%` }} />)}
              </div>
              <div className="vesting-axis t-label"><span>YEAR 1</span><span>YEAR {input.years}</span></div>
              <ul className="t-small" style={{ marginTop: 12 }}>{marks.map((mo) => <li key={mo}>Month {mo}: {count(m.vesting[mo]?.vested ?? 0)} vested</li>)}</ul>
            </div>
            <div className="output-row"><span className="t-label">TELL THE HIRE</span><p className="output-sentence">{sentence}</p></div>
            <div className="tool-actions" style={{ marginTop: 0 }}>
              <Link className="btn btn-primary" href={sprintHref}>Book an Investor Readiness Sprint</Link>
              <ToolEmail tool="ESOP & Share Pool Calculator" label="Email me this model" summary={summary} result={() => ({ input, P: m.P, FD: m.FD, G: m.G, strike: m.strike, exitPrice: m.exitPrice, grantValue: m.grantValue })} shareUrl={() => toolShareUrl(v)} download={{ filename: "esop-model.xlsx", build: () => esopWorkbook({ ...input, currency: v.currency }) }} />
            </div>
            <ToolDisclaimer />
          </>
        ) : <p className="t-body-l">Fix the highlighted inputs to see the numbers.</p>}
      </div>
    </div>
  );
}

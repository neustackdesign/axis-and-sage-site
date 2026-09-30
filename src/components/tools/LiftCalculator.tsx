"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";
import { formatPrice, prices } from "@/content/engagements";
import { bookCallHref } from "@/content/site";
import { currencies, liftModes, money, type CurrencyCode, type LiftMode } from "@/content/tools";
import { breakEvenMonths, liftModel } from "@/lib/tools/lift";
import { liftWorkbook } from "@/lib/tools/xlsx";
import { Segmented, SliderField, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolEvents } from "./useTool";

type Values = { base: number; rate: number; value: number; lift: number; target: number };
type State = { mode: LiftMode; currency: CurrencyCode; values: Record<LiftMode, Values> };

const initialState = (): State => ({ mode: "customers", currency: "USD", values: Object.fromEntries(liftModes.map((m) => [m.key, { ...m.defaults }])) as Record<LiftMode, Values> });

/** What's a lift worth? Live outputs from lib/tools/lift. */
export function LiftCalculator() {
  const id = useId();
  const events = useToolEvents("What's a lift worth?");
  const [s, setS] = useState<State>(initialState);
  useHashRestore<State>(useCallback((r) => setS((cur) => ({ ...cur, ...r, values: { ...cur.values, ...r.values } })), []));

  const def = liftModes.find((m) => m.key === s.mode)!;
  const v = s.values[s.mode];
  const set = (k: keyof Values, n: number) => { events.start(); setS((cur) => ({ ...cur, values: { ...cur.values, [cur.mode]: { ...cur.values[cur.mode], [k]: Number.isFinite(n) ? Math.max(0, n) : 0 } } })); };
  const m = liftModel({ mode: s.mode, ...v });
  const breakEven = breakEvenMonths(m.extraMonth, prices.diagnostic, s.currency);
  const valueError = v.value <= 0 ? "Enter a value above zero." : "";
  const baseError = v.base <= 0 ? "Enter how many people reach the decision." : "";

  const summary = () => [
    `Mode: ${def.label}`, `${def.base}: ${v.base}`, `${def.rate}: ${m.r0}%`, s.mode === "team" ? `Target: ${m.r1}%` : `Lift: +${m.points} points`,
    `${def.value}: ${money(v.value, s.currency)}`, "",
    `Extra ${def.action} per month: ${m.extraActions.toFixed(1)}`, `Extra value per month: ${money(m.extraMonth, s.currency)}`, `Extra value per year: ${money(m.extraYear, s.currency)}`,
    `Each point of lift is worth ${money(m.perPointMonth, s.currency)} a month (${money(m.perPointYear, s.currency)} a year).`,
    ...(breakEven !== null ? [`At this lift, the Diagnostic (${formatPrice(prices.diagnostic)}) pays back in ${breakEven} months.`] : []),
  ].join("\n");

  return (
    <div className="tool-grid-io">
      <ToolPanel>
        <div className="tool-inputs">
          <div className="field"><span className="field-label">Who needs to act?</span><Segmented label="Who needs to act" value={s.mode} onChange={(mode) => { events.step(mode); setS((cur) => ({ ...cur, mode })); }} options={liftModes.map((x) => ({ key: x.key, label: x.label }))} /></div>
          <div className="field"><span className="field-label">Currency</span><Segmented label="Currency" value={s.currency} onChange={(currency) => setS((cur) => ({ ...cur, currency }))} options={currencies.map((c) => ({ key: c.code, label: c.code }))} /></div>
          <div className={`field${baseError ? " is-error" : ""}`}>
            <label className="field-label" htmlFor={`${id}-base`}>{def.base}</label>
            <input id={`${id}-base`} className="field-control" style={{ fontFamily: "var(--font-mono)" }} type="number" inputMode="numeric" min={0} value={v.base} onChange={(e) => set("base", Number(e.target.value))} aria-invalid={!!baseError} />
            {baseError ? <span className="field-help">✕ {baseError}</span> : null}
          </div>
          <SliderField id={`${id}-rate`} label={def.rate} value={v.rate} min={0} max={100} onChange={(n) => set("rate", n)} format={(n) => `${n}%`} />
          <div className={`field${valueError ? " is-error" : ""}`}>
            <label className="field-label" htmlFor={`${id}-value`}>{def.value}</label>
            <div className="number-field"><span className="number-affix">{s.currency}</span><input id={`${id}-value`} className="field-control" type="number" inputMode="decimal" min={0} value={v.value} onChange={(e) => set("value", Number(e.target.value))} aria-invalid={!!valueError} /></div>
            {valueError ? <span className="field-help">✕ {valueError}</span> : null}
          </div>
          {s.mode === "team"
            ? <SliderField id={`${id}-target`} label={def.target!} value={v.target} min={0} max={100} onChange={(n) => set("target", n)} format={(n) => `${n}%`} />
            : <SliderField id={`${id}-lift`} label="Lift you want, in percentage points" value={v.lift} min={0} max={30} onChange={(n) => set("lift", n)} format={(n) => `+${n} pts`} />}
        </div>
      </ToolPanel>
      <div className="tool-output on-dark" aria-live="polite">
        <p className="t-label">WHAT THE LIFT IS WORTH · {def.label.toUpperCase()}</p>
        <div className="output-row"><span className="t-label">EXTRA {def.action.toUpperCase()} PER MONTH</span><span className="output-num">{m.extraActions.toLocaleString("en-GB", { maximumFractionDigits: 1 })}</span><span className="t-small">From {m.r0}% to {m.r1}%</span></div>
        <div className="output-row"><span className="t-label">EXTRA VALUE PER MONTH</span><span className="output-num">{money(m.extraMonth, s.currency)}</span></div>
        <div className="output-row"><span className="t-label">EXTRA VALUE PER YEAR</span><span className="output-num is-key">{money(m.extraYear, s.currency)}</span></div>
        <div className="output-row"><span className="t-label">EACH POINT OF LIFT</span><p className="output-sentence">Each point of lift is worth {money(m.perPointMonth, s.currency)} a month, {money(m.perPointYear, s.currency)} a year.</p></div>
        {breakEven !== null ? <div className="output-row"><span className="t-label">BREAK-EVEN</span><p className="output-sentence">At this lift, the Diagnostic ({formatPrice(prices.diagnostic)}) pays for itself in {breakEven} months.</p></div> : null}
        <div className="tool-actions" style={{ marginTop: 0 }}>
          <ToolEmail
            tool="What's a lift worth?" label="Send me the model" summary={summary} result={() => ({ ...s, model: m })} shareUrl={() => toolShareUrl(s)}
            download={{ filename: "lift-model.xlsx", build: () => liftWorkbook({ mode: s.mode, modeLabel: def.label, baseLabel: def.base, rateLabel: def.rate, valueLabel: def.value, base: v.base, rate: v.rate, lift: v.lift, target: v.target, value: v.value, currency: s.currency, diagnosticPrice: prices.diagnostic.currency === s.currency ? prices.diagnostic.amount : null }) }}
          />
          <Link className="text-link" href={bookCallHref}>Book a call<span className="text-link-arrow" aria-hidden="true">▸</span></Link>
        </div>
      </div>
    </div>
  );
}

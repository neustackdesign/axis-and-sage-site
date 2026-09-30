"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { bookCallHref } from "@/content/site";
import { currencies, liftModes, money, type CurrencyCode, type LiftMode } from "@/content/tools";
import { Segmented, SliderField, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";

/** What's a lift worth? Live outputs from four inputs. */
export function LiftCalculator() {
  const id = useId();
  const [mode, setMode] = useState<LiftMode>("customers");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [values, setValues] = useState(() => Object.fromEntries(liftModes.map((m) => [m.key, { ...m.defaults }])) as Record<LiftMode, { base: number; rate: number; value: number; lift: number }>);
  const def = liftModes.find((m) => m.key === mode)!;
  const v = values[mode];
  const set = (k: keyof typeof v, n: number) => setValues((all) => ({ ...all, [mode]: { ...all[mode], [k]: Number.isFinite(n) ? Math.max(0, n) : 0 } }));

  const lift = Math.min(v.lift, 100 - v.rate);
  const extraActions = (v.base * lift) / 100;
  const extraMonth = extraActions * v.value;
  const perPoint = (v.base / 100) * v.value;
  const valueError = v.value <= 0 ? "Enter a value above zero." : "";
  const baseError = v.base <= 0 ? "Enter how many people reach the decision." : "";

  const summary = () => [`Mode: ${def.label}`, `${def.base}: ${v.base}`, `${def.rate}: ${v.rate}%`, `${def.value}: ${money(v.value, currency)}`, `Lift: ${lift} points`, `Extra ${def.action} per month: ${extraActions.toFixed(1)}`, `Extra value per month: ${money(extraMonth, currency)}; per year: ${money(extraMonth * 12, currency)}`, `Each point of lift: ${money(perPoint, currency)} per month`].join("\n");

  return (
    <div className="tool-grid-io">
      <ToolPanel>
        <div className="tool-inputs">
          <div className="field"><span className="field-label">Who needs to act?</span><Segmented label="Who needs to act" value={mode} onChange={setMode} options={liftModes.map((m) => ({ key: m.key, label: m.label }))} /></div>
          <div className="field"><span className="field-label">Currency</span><Segmented label="Currency" value={currency} onChange={setCurrency} options={currencies.map((c) => ({ key: c.code, label: c.code }))} /></div>
          <div className={`field${baseError ? " is-error" : ""}`}>
            <label className="field-label" htmlFor={`${id}-base`}>{def.base}</label>
            <input id={`${id}-base`} className="field-control" style={{ fontFamily: "var(--font-mono)" }} type="number" inputMode="numeric" min={0} value={v.base} onChange={(e) => set("base", Number(e.target.value))} aria-invalid={!!baseError} />
            {baseError ? <span className="field-help">✕ {baseError}</span> : null}
          </div>
          <SliderField id={`${id}-rate`} label={def.rate} value={v.rate} min={0} max={100} onChange={(n) => set("rate", n)} format={(n) => `${n}%`} />
          <div className={`field${valueError ? " is-error" : ""}`}>
            <label className="field-label" htmlFor={`${id}-value`}>{def.value}</label>
            <div className="number-field"><span className="number-affix">{currency}</span><input id={`${id}-value`} className="field-control" type="number" inputMode="decimal" min={0} value={v.value} onChange={(e) => set("value", Number(e.target.value))} aria-invalid={!!valueError} /></div>
            {valueError ? <span className="field-help">✕ {valueError}</span> : null}
          </div>
          <SliderField id={`${id}-lift`} label="Lift you want, in percentage points" value={v.lift} min={0} max={30} onChange={(n) => set("lift", n)} format={(n) => `+${n} pts`} />
        </div>
      </ToolPanel>
      <div className="tool-output on-dark" aria-live="polite">
        <p className="t-label">WHAT THE LIFT IS WORTH · {def.label.toUpperCase()}</p>
        <div className="output-row"><span className="t-label">EXTRA {def.action.toUpperCase()} PER MONTH</span><span className="output-num">{extraActions.toLocaleString("en-GB", { maximumFractionDigits: 1 })}</span><span className="t-small">From {v.rate}% to {v.rate + lift}%</span></div>
        <div className="output-row"><span className="t-label">EXTRA VALUE PER MONTH</span><span className="output-num">{money(extraMonth, currency)}</span></div>
        <div className="output-row"><span className="t-label">EXTRA VALUE PER YEAR</span><span className="output-num is-key">{money(extraMonth * 12, currency)}</span></div>
        <div className="output-row"><span className="t-label">EACH POINT OF LIFT IS WORTH</span><span className="output-num">{money(perPoint, currency)}<span className="t-small"> / month</span></span></div>
        <div className="tool-actions" style={{ marginTop: 0 }}>
          <ToolEmail tool="What's a lift worth?" label="Send me the model" summary={summary} successText="Done. The model is on its way to your inbox." />
          <Link className="text-link" href={bookCallHref}>Book a call<span className="text-link-arrow" aria-hidden="true">▸</span></Link>
        </div>
      </div>
    </div>
  );
}

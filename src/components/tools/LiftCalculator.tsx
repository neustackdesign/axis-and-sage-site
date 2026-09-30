"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useState } from "react";
import { prices } from "@/content/engagements";
import { scorecardHref } from "@/content/site";
import { count, currencies, liftBreakEvenCopy, liftModes, liftPerPointCopy, money, type CurrencyCode, type LiftField, type LiftMode } from "@/content/tools";
import { liftModel, paybackActions } from "@/lib/tools/lift";
import { liftWorkbook } from "@/lib/tools/xlsx";
import { Segmented, SliderField, ToolDisclaimer, ToolPanel } from "./ToolBits";
import { ToolEmail } from "./ToolEmail";
import { toolShareUrl, useHashRestore, useToolComplete } from "./useTool";

type Values = { base: number; rate: number; value: number; lift: number; target: number };
type State = { mode: LiftMode; currency: CurrencyCode; values: Record<LiftMode, Values> };

const initialState = (): State => ({ mode: "customers", currency: "USD", values: Object.fromEntries(liftModes.map((m) => [m.key, { ...m.defaults }])) as Record<LiftMode, Values> });

/** What's a lift worth? Live outputs from lib/tools/lift. */
export function LiftCalculator() {
  const id = useId();
  const complete = useToolComplete("What's a lift worth?");
  const [s, setS] = useState<State>(initialState);
  const [touched, setTouched] = useState(false);
  useHashRestore<State>(useCallback((r) => setS((cur) => ({ ...cur, ...r, values: { ...cur.values, ...r.values } })), []));

  const def = liftModes.find((m) => m.key === s.mode)!;
  const v = s.values[s.mode];
  const set = (k: keyof Values, n: number) => { setTouched(true); setS((cur) => ({ ...cur, values: { ...cur.values, [cur.mode]: { ...cur.values[cur.mode], [k]: Number.isFinite(n) ? Math.max(0, n) : 0 } } })); };
  const m = liftModel({ mode: s.mode, ...v });
  const cur = (n: number) => money(n, s.currency);
  const payback = s.mode === "customers" ? paybackActions(v.value, prices.diagnostic, s.currency) : null;
  const labels = Object.fromEntries(def.fields.map((f) => [f.key, f.label]));
  const perPointLine = liftPerPointCopy.replace("{per_point}", cur(m.perPoint));
  const breakEvenLine = payback !== null ? liftBreakEvenCopy.replace("{payback_actions}", count(payback)).replace("{actions}", "actions") : null;

  // A calculator has no finish line: record one row once someone has changed an input and paused.
  useEffect(() => {
    if (!touched) return;
    const t = setTimeout(() => complete({ mode: s.mode, currency: s.currency, ...v }, { today: m.today, extra: m.extra, valueMonth: m.valueMonth, valueYear: m.valueYear, perPoint: m.perPoint }), 4000);
    return () => clearTimeout(t);
  }, [touched, complete, s.mode, s.currency, v, m.today, m.extra, m.valueMonth, m.valueYear, m.perPoint]);

  const outputs: { label: string; value: string; key?: boolean; sub?: string }[] = s.mode === "team"
    ? [
        { label: "GAP IN PEOPLE", value: count(m.extra, 1), sub: `From ${m.r0}% to ${m.r1}% of ${count(v.base)}` },
        { label: "VALUE PER MONTH", value: cur(m.valueMonth) },
        { label: "VALUE PER YEAR", value: cur(m.valueYear), key: true },
      ]
    : s.mode === "investors"
      ? [
          { label: "EXTRA COMMITMENTS", value: count(m.extra, 1), sub: `From ${m.r0}% to ${m.r1}% of ${count(v.base)} conversations` },
          { label: "EXTRA CAPITAL", value: cur(m.valueMonth), key: true },
          { label: "EACH POINT OF LIFT", value: cur(m.perPoint) },
        ]
      : [
          { label: "ACTING TODAY, PER MONTH", value: count(m.today, 1) },
          { label: "EXTRA PER MONTH", value: count(m.extra, 1), sub: `From ${m.r0}% to ${m.r1}%` },
          { label: "EXTRA VALUE PER MONTH", value: cur(m.valueMonth) },
          { label: "EXTRA VALUE PER YEAR", value: cur(m.valueYear), key: true },
        ];

  const summary = () => [
    `Mode: ${def.label}`,
    ...def.fields.map((f) => `${f.label}: ${f.kind === "money" ? cur(v[f.key]) : f.kind === "pct" ? `${v[f.key]}%` : f.kind === "points" ? `${v[f.key]} points` : count(v[f.key])}`),
    "",
    ...outputs.map((o) => `${o.label[0]}${o.label.slice(1).toLowerCase()}: ${o.value}`),
    ...(s.mode === "customers" ? [perPointLine] : []),
    ...(breakEvenLine ? [breakEvenLine] : []),
    "",
    `Find where the lift is lost with the Conversion Scorecard: ${window.location.origin}${scorecardHref}`,
  ].join("\n");

  const field = (f: LiftField) => {
    if (f.kind === "pct") return <SliderField key={f.key} id={`${id}-${f.key}`} label={f.label} value={v[f.key]} min={0} max={100} onChange={(n) => set(f.key, n)} format={(n) => `${n}%`} />;
    if (f.kind === "points") return <SliderField key={f.key} id={`${id}-${f.key}`} label={f.label} value={v[f.key]} min={f.min ?? 1} max={f.max ?? 30} onChange={(n) => set(f.key, n)} format={(n) => `+${n} pts`} />;
    const error = !(v[f.key] > 0) ? (f.kind === "money" ? "Enter a value above zero." : "Enter a number above zero.") : "";
    return (
      <div key={f.key} className={`field${error ? " is-error" : ""}`}>
        <label className="field-label" htmlFor={`${id}-${f.key}`}>{f.label}</label>
        <div className="number-field">
          {f.kind === "money" ? <span className="number-affix">{s.currency}</span> : null}
          <input id={`${id}-${f.key}`} className="field-control" style={{ fontFamily: "var(--font-mono)" }} type="number" inputMode="decimal" min={0} value={v[f.key]} onChange={(e) => set(f.key, Number(e.target.value))} aria-invalid={!!error} />
        </div>
        {error ? <span className="field-help">✕ {error}</span> : f.hint ? <span className="field-help">{f.hint}</span> : null}
      </div>
    );
  };

  return (
    <div className="tool-grid-io">
      <ToolPanel>
        <div className="tool-inputs">
          <div className="field"><span className="field-label">Who needs to act?</span><Segmented label="Who needs to act" value={s.mode} onChange={(mode) => setS((c) => ({ ...c, mode }))} options={liftModes.map((x) => ({ key: x.key, label: x.label }))} /></div>
          <div className="field"><span className="field-label">Currency</span><Segmented label="Currency" value={s.currency} onChange={(currency) => setS((c) => ({ ...c, currency }))} options={currencies.map((c) => ({ key: c.code, label: c.code }))} /></div>
          {def.fields.map(field)}
        </div>
      </ToolPanel>
      <div className="tool-output on-dark" aria-live="polite">
        <p className="t-label">WHAT THE LIFT IS WORTH · {def.label.toUpperCase()}</p>
        {outputs.map((o) => (
          <div key={o.label} className="output-row"><span className="t-label">{o.label}</span><span className={`output-num${o.key ? " is-key" : ""}`}>{o.value}</span>{o.sub ? <span className="t-small">{o.sub}</span> : null}</div>
        ))}
        {s.mode === "customers" ? <div className="output-row"><span className="t-label">EACH POINT OF LIFT</span><p className="output-sentence">{perPointLine}</p></div> : null}
        {breakEvenLine ? <div className="output-row"><span className="t-label">BREAK-EVEN</span><p className="output-sentence">{breakEvenLine}</p></div> : null}
        <div className="tool-actions" style={{ marginTop: 0 }}>
          <Link className="btn btn-primary" href="/contact?engagement=diagnostic&source=lift#note">Book a Diagnostic</Link>
          <ToolEmail
            tool="What's a lift worth?" label="Send me the model" summary={summary} result={() => ({ mode: s.mode, currency: s.currency, inputs: v, outputs: m })} shareUrl={() => toolShareUrl(s)}
            download={{ filename: "lift-model.xlsx", build: () => liftWorkbook({ mode: s.mode, modeLabel: def.label, labels, base: v.base, rate: v.rate, lift: v.lift, target: v.target, value: v.value, currency: s.currency, diagnosticPrice: prices.diagnostic.currency === s.currency ? prices.diagnostic.amount : null }) }}
          />
        </div>
        <ToolDisclaimer />
      </div>
    </div>
  );
}

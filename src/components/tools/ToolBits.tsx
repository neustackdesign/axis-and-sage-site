"use client";

import type { CSSProperties, ReactNode } from "react";
import { TOOL_DISCLAIMER } from "@/lib/tools/spec";

/** Stepper · ProgressBar. The active step is orange; done steps are charcoal with a tick. */
export function Stepper({ steps, active, progress }: { steps: string[]; active: number; progress: number }) {
  return (
    <div>
      <ol className="stepper" style={{ "--n": steps.length } as CSSProperties}>
        {steps.map((s, i) => {
          const state = i < active ? "done" : i === active ? "active" : "todo";
          return (
            <li key={s} className={`step is-${state}`} aria-current={state === "active" ? "step" : undefined}>
              <span className="step-mark" aria-hidden="true">{state === "done" ? "✓" : i + 1}</span>
              <span className="step-text"><span className="step-name">{s}</span><span className="step-state">{state === "done" ? "DONE" : state === "active" ? "ACTIVE" : "TO DO"}</span></span>
            </li>
          );
        })}
      </ol>
      <div className="progress">
        <div className="progress-label t-label">STEP {Math.min(active + 1, steps.length)} OF {steps.length} · {Math.round(progress)}%</div>
        <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label="Progress"><div style={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  );
}

/** Quadrant: Terms on x, Moments on y. Each zone labelled in words; the position marked with a ring and a label. */
export function Quadrant({ terms, moments }: { terms: number; moments: number }) {
  const zone = terms >= 60 ? (moments >= 60 ? 1 : 3) : (moments >= 60 ? 0 : 2);
  const labels = ["GOOD TIMING, WEAK TERMS", "READY TO CONVERT", "REDESIGN BOTH", "GOOD TERMS, WRONG MOMENT"];
  return (
    <figure className="quadrant" aria-label={`Terms ${terms}, Moments ${moments}: ${labels[zone].toLowerCase()}`}>
      <span className="quadrant-y t-label">MOMENTS ▸</span>
      <div className="quadrant-box">
        {labels.map((l, i) => <span key={l} className={i === zone ? "is-you" : undefined}>{l}</span>)}
        <span className="quadrant-dot" style={{ left: `${terms}%`, bottom: `${moments}%` }} aria-hidden="true" />
        <span className="quadrant-you" style={{ left: `${Math.min(88, Math.max(12, terms))}%`, bottom: `${moments}%`, top: "auto" }} aria-hidden="true">YOU · {terms}, {moments}</span>
      </div>
      <span className="quadrant-x t-label">TERMS ▸</span>
    </figure>
  );
}

export function ToolPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`tool-panel ${className}`.trim()}>{children}</div>;
}

export function NumberField({ id, label, value, onChange, min = 0, max, step = 1, help, error, suffix, prefix }: { id: string; label: string; value: number | ""; onChange: (v: number | "") => void; min?: number; max?: number; step?: number; help?: string; error?: string; suffix?: string; prefix?: string }) {
  return (
    <div className={`field${error ? " is-error" : ""}`}>
      <label className="field-label" htmlFor={id}>{label}</label>
      <div className="number-field">
        {prefix ? <span className="number-affix">{prefix}</span> : null}
        <input id={id} className="field-control" type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} aria-invalid={!!error} />
        {suffix ? <span className="number-affix">{suffix}</span> : null}
      </div>
      {error ? <span className="field-help">✕ {error}</span> : help ? <span className="field-help">{help}</span> : null}
    </div>
  );
}

export function SliderField({ id, label, value, onChange, min, max, step = 1, format }: { id: string; label: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; format: (v: number) => string }) {
  return (
    <div className="slider-field">
      <div className="slider-head"><label className="field-label" htmlFor={id}>{label}</label><span className="slider-value" aria-hidden="true">{format(value)}</span></div>
      <div className="slider-row">
        <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-valuetext={format(value)} />
        <input className="field-control" type="number" inputMode="decimal" min={min} max={max} step={step} value={value} aria-label={`${label}, exact value`} onChange={(e) => { const n = Number(e.target.value); if (!Number.isNaN(n)) onChange(Math.min(max, Math.max(min, n))); }} />
      </div>
      <div className="slider-scale t-label"><span>{format(min)}</span><span>{format(max)}</span></div>
    </div>
  );
}

export function Segmented<T extends string>({ options, value, onChange, label }: { options: { key: T; label: string }[]; value: T | null; onChange: (v: T) => void; label: string }) {
  return (
    <div className="segmented" role="group" aria-label={label} style={{ "--n": options.length } as CSSProperties}>
      {options.map((o) => <button key={o.key} type="button" aria-pressed={value === o.key} onClick={() => onChange(o.key)}>{o.label}</button>)}
    </div>
  );
}

/** The small line under every result. */
export function ToolDisclaimer() {
  return <p className="tool-disclaimer t-small muted">{TOOL_DISCLAIMER}</p>;
}

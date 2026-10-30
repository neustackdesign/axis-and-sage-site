import React from "react";
/** Timeline: what was decided, then what people did. Baseline dotted; the new number is orange where the action happened. */
export function Timeline({ label, steps = [], baseline, source }) {
  const max = Math.max(...steps.map((s) => s.value), baseline.value) * 1.15;
  const baseBottom = (baseline.value / max) * 100;
  return (
    <figure className="timeline" style={{ "--steps": steps.length, margin: 0 }}>
      <div className="timeline-steps">{steps.map((s) => <div key={s.when}><span className="t-label muted">{s.when}</span><span className="timeline-said">“{s.said}”</span></div>)}</div>
      <div className="timeline-axis t-label">{label}</div>
      <div className="timeline-chart" aria-hidden="true">
        <div className="timeline-baseline" style={{ bottom: baseBottom + "%" }}><span className="timeline-baseline-label t-label">{baseline.label}</span></div>
        {steps.map((s) => (
          <div className="timeline-col" key={s.when}>
            <div className={"timeline-pin" + (s.action ? " is-action" : "")}>
              <span className="timeline-pin-value">{s.valueLabel}</span>
              <span className="timeline-pin-stem" style={{ height: Math.max(12, (s.value / max) * 170) + "px" }} />
              <span className="timeline-pin-dot" />
            </div>
          </div>
        ))}
      </div>
      <div className="timeline-did">{steps.map((s) => <div key={s.when}>{s.did}</div>)}</div>
      {source ? <p className="timeline-source t-label" style={{ padding: "0 16px 16px" }}>{source}</p> : null}
    </figure>
  );
}
/** Day-by-day timeline for the Diagnostic. The last dot (the readout) is orange. */
export function DayTimeline({ days = [] }) {
  return <ol className="day-timeline">{days.map((d) => <li key={d.when}><span className="t-label">{d.when}</span><p>{d.what}</p></li>)}</ol>;
}

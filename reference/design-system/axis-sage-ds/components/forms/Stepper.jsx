import React from "react";
/** Stepper: numbered circles; done = midnight, active = orange. ProgressBar: 3px midnight bar on cloud-50. */
export function Stepper({ steps = [], active = 0 }) {
  return (
    <ol className="stepper" style={{ "--n": steps.length }}>
      {steps.map((s, i) => {
        const st = i < active ? "done" : i === active ? "active" : "";
        return <li key={s} className={"step" + (st ? " is-" + st : "")}><span className="step-mark">{i < active ? "✓" : i + 1}</span><span className="step-text"><span className="step-name">{s}</span><span className="step-state">{i < active ? "DONE" : i === active ? "NOW" : "NEXT"}</span></span></li>;
      })}
    </ol>
  );
}
export function ProgressBar({ label, value = 0 }) {
  return <div className="progress"><span className="progress-label t-label">{label}</span><div className="progress-bar"><div style={{ width: value + "%" }} /></div></div>;
}

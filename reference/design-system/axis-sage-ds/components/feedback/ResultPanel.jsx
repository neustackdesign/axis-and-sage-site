import React from "react";
/** ResultPanel: sage panel with two mono scores and bars; children go in the two-column body below. */
export function ResultPanel({ scores = [], children }) {
  return (
    <div className="result-panel">
      <div className="result-scores">
        {scores.map((s) => (
          <div className="result-score" key={s.label}>
            <span className="t-label">{s.label}</span>
            <span className="result-score-num">{s.value}<span>/{s.max || 100}</span></span>
            <div className="result-bar"><div style={{ width: (s.value / (s.max || 100)) * 100 + "%" }} /></div>
          </div>
        ))}
      </div>
      {children ? <div className="result-body">{children}</div> : null}
    </div>
  );
}
/** Quadrant: 2×2 dotted grid, your quadrant tinted orange-100, orange dot at (x, y) in 0–100. */
export function Quadrant({ x = 50, y = 50, labels = ["", "", "", ""], you = 0, xLabel = "MOMENTS", yLabel = "TERMS" }) {
  return (
    <div className="quadrant">
      <span className="quadrant-y t-label">{yLabel}</span>
      <div className="quadrant-box">
        {labels.map((l, i) => <span key={i} className={i === you ? "is-you" : ""}>{l}</span>)}
        <span className="quadrant-dot" style={{ left: x + "%", bottom: y + "%", padding: 0 }} />
      </div>
      <span className="quadrant-x t-label">{xLabel}</span>
    </div>
  );
}
/** Blockers: numbered ruled list of the three things to fix first. */
export function Blockers({ items = [] }) {
  return <ol className="blockers">{items.map((b, i) => <li key={i}><span>{String(i + 1).padStart(2, "0")}</span><span>{b.text}{b.check ? <span className="blocker-check" style={{ display: "block" }}>{b.check}</span> : null}</span></li>)}</ol>;
}

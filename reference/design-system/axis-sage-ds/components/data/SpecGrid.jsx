import React from "react";
/** SpecGrid · SpecCell: 1px rules between cells, no fills. Mono label, sans value, optional index. */
export function SpecGrid({ cells = [], cols = 4 }) {
  return (
    <div className="spec-grid" style={{ "--cols": cols }}>
      {cells.map((c, i) => (
        <div className="spec-cell" key={i}>
          <div className="spec-cell-head t-label"><span>{c.label}</span>{c.index ? <span>{c.index}</span> : null}</div>
          <div className="spec-cell-value">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
/** Spec list: numbered rows under a strong rule. */
export function SpecList({ items = [], numbered = true }) {
  return <ol className="spec-list">{items.map((item, i) => <li key={i}><span className="t-label">{numbered ? String(i + 1).padStart(2, "0") : "▸"}</span><span>{item}</span></li>)}</ol>;
}

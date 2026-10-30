import React from "react";
/** StatTile: mono numeral, one-line label, source line, role tag. */
export function StatTile({ numeral, label, tag, source, wide }) {
  return (
    <div className={"stat-tile" + (wide ? " stat-tile-wide" : "")}>
      {tag ? <span className="t-label muted">{tag}</span> : null}
      <p className="t-stat">{numeral}</p>
      <p className="stat-tile-label">{label}</p>
      {source ? <p className="stat-tile-source t-label">SOURCE: {source}</p> : null}
    </div>
  );
}
export function StatGrid({ children, cols = 3 }) {
  return <div className="stat-grid" style={{ "--cols": cols }}>{children}</div>;
}

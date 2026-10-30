import React from "react";
const ROWS = [["price", "Price"], ["time", "Time"], ["bring", "You bring"], ["weDo", "We do"], ["youGet", "You get"]];
/** EngagementTable: plan table. The recommended column is inverted to midnight and carries the only orange button. */
export function EngagementTable({ columns = [] }) {
  return (
    <div className="engagement-table" role="table" style={{ gridTemplateColumns: "minmax(120px, 0.7fr) repeat(" + columns.length + ", minmax(0, 1fr))" }}>
      <div className="et-cell et-rowhead">ENGAGEMENT</div>
      {columns.map((c) => <div key={c.name} className={"et-cell et-head" + (c.recommended ? " et-reco" : "")}><span className="et-name">{c.name}</span>{c.recommended ? <span className="chip et-reco-flag">RECOMMENDED</span> : null}</div>)}
      {ROWS.map(([k, l]) => (
        <React.Fragment key={k}>
          <div className="et-cell et-rowhead">{l}</div>
          {columns.map((c) => <div key={c.name} className={"et-cell" + (k === "price" ? " et-price" : "") + (c.recommended ? " et-reco" : "")}>{c[k]}</div>)}
        </React.Fragment>
      ))}
      <div className="et-cell" />
      {columns.map((c) => <div key={c.name} className={"et-cell et-cta" + (c.recommended ? " et-reco" : "")}><a href={c.cta && c.cta.href || "#"} className={"btn " + (c.recommended ? "btn-primary" : "btn-secondary")} style={c.recommended ? undefined : (null)}>{c.cta && c.cta.label}</a></div>)}
    </div>
  );
}

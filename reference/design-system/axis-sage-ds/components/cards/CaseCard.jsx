import React from "react";
/** CaseCard.Paper · CaseCard.Midnight: Needed / Changed / Moved. */
export function CaseCard({ item, index = 1, dark, href, provenance }) {
  return (
    <article className={"case-card" + (dark ? " case-card-dark" : "")}>
      <div className="case-card-head t-label"><span>CASE · {String(index).padStart(2, "0")}</span>{provenance ? <span className="provenance">{provenance}</span> : null}</div>
      <div className="case-card-body">
        <h3 className="t-h3">{item.name}</h3>
        <dl className="case-card-rows" style={{ margin: 0 }}>
          <dt className="t-label">NEEDED</dt><dd>{item.needed}</dd>
          <dt className="t-label">CHANGED</dt><dd>{item.changed}</dd>
          <dt className="t-label">MOVED</dt><dd className="moved">{item.moved}</dd>
        </dl>
        <div className="case-card-foot">
          <ul className="chip-row">{(item.chips || []).map((c) => <li key={c.label}><span className={"chip" + (c.kind === "conversion" ? " chip-conversion" : "")}>{c.label}</span></li>)}</ul>
          {href ? <a className="text-link" href={href}>Read the case<span className="text-link-arrow" aria-hidden="true">▸</span></a> : null}
        </div>
      </div>
    </article>
  );
}

import React from "react";
/** WorkCard: sector, provenance, name, one-line result, role + action chips. Hover tints cloud-200. */
export function WorkCard({ name, sector, provenance, line, roles = [], actions = [], href }) {
  const inner = (
    <>
      <div className="work-card-head t-label"><span>{String(sector || "").toUpperCase()}</span></div>
      {provenance ? <p className="provenance t-label">{provenance}</p> : null}
      <h3 className="t-h3">{name}</h3>
      <p className="work-card-line">{line}</p>
      <ul className="chip-row">
        {roles.map((r) => <li key={r}><span className="chip">{r}</span></li>)}
        {actions.map((a) => <li key={a}><span className="chip chip-conversion">{a.toUpperCase()}</span></li>)}
      </ul>
      {href ? <span className="work-card-more" aria-hidden="true">READ THE CASE ▸</span> : null}
    </>
  );
  return href ? <a href={href} className="work-card">{inner}</a> : <article className="work-card">{inner}</article>;
}

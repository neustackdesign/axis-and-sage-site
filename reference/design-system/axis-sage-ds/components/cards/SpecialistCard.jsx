import React from "react";
/** SpecialistCard: raised Cloud card for a specialist engagement — name, price and time, intro, ruled points. */
export function SpecialistCard({ name, price, time, intro, points, cta }) {
  return (
    <article className="specialist-card">
      <h3 className="t-h3">{name}</h3>
      <p className="specialist-meta t-label"><span>{price}</span><span>{time}</span></p>
      <p>{intro}</p>
      {points ? <ul>{points.map((p) => <li key={p}>{p}</li>)}</ul> : null}
      {cta ? <div style={{ marginTop: "auto" }}><a className="text-link" href={cta.href || "#"}>{cta.label}<span className="text-link-arrow">▸</span></a></div> : null}
    </article>
  );
}

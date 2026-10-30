import React from "react";
/** Page hero (Cloud, no painting): rail label, serif H1, muted sub, optional meta row. */
export function PageHero({ label, title, sub, meta }) {
  return (
    <section className="page-hero tone-cloud">
      <div className="wrap page-hero-grid">
        <div><p className="t-label eyebrow eyebrow-strong">{label}</p></div>
        <div>
          <h1 className="t-h1">{title}</h1>
          {sub ? <p className="page-hero-sub t-body-l">{sub}</p> : null}
          {meta ? <div className="page-hero-meta">{meta}</div> : null}
        </div>
      </div>
    </section>
  );
}

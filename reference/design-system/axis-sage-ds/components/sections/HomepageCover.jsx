import React from "react";
/** Homepage cover: one framed surface — artwork as the field (graded, grained, shaded from the left), message at lower left, mono metadata at the bottom corners. Put <SiteHeader variant="hero" /> as a sibling before it inside a relative wrapper. */
export function HomepageCover({ image, eyebrow = [], headline, sub, primary, secondary, practices = [], credit, onPrimary, onSecondary }) {
  return (
    <section className="cover">
      <div className="cover-frame on-dark">
        <div className="cover-art">
          {image ? <img className="cover-image" src={image} alt="" /> : null}
          <span className="cover-shade" aria-hidden="true" />
          <span className="cover-grain" aria-hidden="true" />
        </div>
        <div className="cover-body">
          <div className="cover-copy">
            <p className="t-label cover-eyebrow">{eyebrow.join(" · ")}</p>
            <h1 className="hero-title cover-title reveal">{headline}</h1>
            {sub ? <p className="t-body-l cover-sub">{sub}</p> : null}
            <div className="cover-actions">
              {primary ? <a className="btn btn-primary" href="#" onClick={(e) => { e.preventDefault(); onPrimary && onPrimary(); }}>{primary}</a> : null}
              {secondary ? <a className="btn btn-secondary" href="#" onClick={(e) => { e.preventDefault(); onSecondary && onSecondary(); }}>{secondary} ▸</a> : null}
            </div>
          </div>
          <div className="cover-meta t-label">
            <p>{practices.join(" · ")}</p>
            {credit ? <p className="cover-credit">{credit}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

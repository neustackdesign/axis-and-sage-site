import React from "react";
/** Testimonial: strong rule, serif quote, portrait + name + title. */
export function Testimonial({ quote, name, title, company, portrait }) {
  return (
    <figure className="testimonial" style={{ margin: 0 }}>
      <blockquote style={{ margin: 0 }}>“{quote}”</blockquote>
      <figcaption className="testimonial-person">
        {portrait ? <div className="portrait testimonial-portrait"><img src={portrait} alt={name} /></div> : null}
        <span><span className="testimonial-name" style={{ display: "block" }}>{name}</span><span className="testimonial-title" style={{ display: "block" }}>{company ? title + ", " + company : title}</span></span>
      </figcaption>
    </figure>
  );
}
/** TestimonialFeature: one large quote with a 176px portrait. */
export function TestimonialFeature({ quote, name, title, company, portrait }) {
  return (
    <figure className={"testimonial-feature" + (portrait ? "" : " no-portrait")} style={{ margin: 0 }}>
      {portrait ? <div className="portrait"><img src={portrait} alt={name} /></div> : null}
      <div className="stack-24">
        <blockquote style={{ margin: 0 }}>“{quote}”</blockquote>
        <figcaption><span className="testimonial-name" style={{ display: "block" }}>{name}</span><span className="testimonial-title">{company ? title + ", " + company : title}</span></figcaption>
      </div>
    </figure>
  );
}

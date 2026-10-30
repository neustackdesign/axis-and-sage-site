import React from "react";
/** SectionHeader: the left-rail pattern. Rail (3 cols): eyebrow and a short paragraph. Content (9 cols): serif headline. */
export function SectionHeader({ id, label, railText, title, lede, level = 2, children }) {
  const H = level === 1 ? "h1" : "h2";
  return (
    <div className="section-header rail-grid">
      <div className="section-header-rail">
        <p className="t-label eyebrow eyebrow-strong">{label}</p>
        {railText ? <p className="t-small muted">{railText}</p> : null}
      </div>
      <div>
        <H id={id} className={"section-header-title " + (level === 1 ? "t-h1" : "t-h2")}>{title}</H>
        {lede ? <div className="section-header-lede t-body-l muted">{lede}</div> : null}
        {children}
      </div>
    </div>
  );
}
/** Body that sits in the content column under a SectionHeader. */
export function RailBody({ children, full, className = "" }) {
  return <div className={("section-body rail-grid " + className).trim()}><div className={full ? "rail-grid-full" : "rail-grid-content"}>{children}</div></div>;
}

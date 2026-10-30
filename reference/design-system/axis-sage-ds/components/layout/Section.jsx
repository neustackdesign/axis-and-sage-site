import React from "react";
const ALIAS = { paper: "cloud", charcoal: "midnight" };
/** Section: full-width band with a tone and the 1280px wrap. Cloud by default. */
export function Section({ id, tone = "cloud", tight, children, className = "" }) {
  const t = ALIAS[tone] || tone;
  return <section id={id} className={["section", tight ? "section-tight" : "", "tone-" + t, className].filter(Boolean).join(" ")}><div className="wrap">{children}</div></section>;
}

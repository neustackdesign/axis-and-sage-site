import React from "react";
import { Glyph } from "../brand/Glyph.jsx";
/** ToolCard: sage panel, glyph, mono label, one sentence, one link. */
export function ToolCard({ title, line, kind, badge = "FREE", glyph = "moment", cta = "Open", href = "#" }) {
  return (
    <a href={href} className="tool-card">
      <div className="tool-card-head"><span className="t-label">{kind}</span><span className="chip">{badge}</span></div>
      <Glyph name={glyph} size="sm" />
      <h3 className="t-h3">{title}</h3>
      <p>{line}</p>
      <span className="text-link">{cta}<span className="text-link-arrow" aria-hidden="true">▸</span></span>
    </a>
  );
}

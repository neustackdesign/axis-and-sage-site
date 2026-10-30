import React from "react";
import { Glyph } from "../brand/Glyph.jsx";
/** The gap: four ruled cells, a glyph at top and a serif line at the bottom. */
export function GapGrid({ cards = [] }) {
  return <ul className="gap-grid">{cards.map((c) => <li className="gap-card" key={c.text}><Glyph name={c.glyph} /><p>{c.text}</p></li>)}</ul>;
}

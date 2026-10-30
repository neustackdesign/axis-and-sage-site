import React from "react";
import { GLYPHS } from "./Glyph.jsx";
/** GlyphBadge: a dot-matrix glyph in a circle. Highlight covers, topic avatars, slide markers. */
export function GlyphBadge({ name = "action", size = 72, ground = "midnight", title }) {
  const rows = GLYPHS[name] || GLYPHS.action;
  const dark = ground === "midnight";
  const bg = dark ? "var(--midnight-900)" : ground === "lilac" ? "var(--lilac-200)" : "var(--cloud-50)";
  const on = dark ? "var(--sky-200)" : "var(--midnight-900)";
  const dots = [];
  rows.forEach((r, y) => r.split("").forEach((c, x) => {
    if (c === ".") return;
    dots.push(<circle key={x + "-" + y} cx={22 + x * 7} cy={22 + y * 7} r={2.3} fill={c === "o" ? "var(--action)" : on} />);
  }));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true} style={{ display: "block", flex: "none" }}>
      <circle cx="50" cy="50" r="50" fill={bg} />
      {!dark && <circle cx="50" cy="50" r="49.5" fill="none" stroke="var(--haze-300)" />}
      {dots}
    </svg>
  );
}

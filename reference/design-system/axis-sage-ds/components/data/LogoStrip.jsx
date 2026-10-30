import React from "react";
/** LogoStrip: client names set in type (no logos supplied), in a ruled 5-column grid. The separator stays with the word before it. */
export function LogoStrip({ names = [] }) {
  return <ul className="logo-strip">{names.map((n) => <li key={n}>{n.replace(/ · /g, "\u00a0· ")}</li>)}</ul>;
}

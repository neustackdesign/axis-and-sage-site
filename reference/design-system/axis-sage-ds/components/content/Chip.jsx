import React from "react";
/** Chip.Role (outlined) · Chip.Conversion (sage filled). As a button it becomes a filter chip with an orange selected state. */
export function Chip({ label, kind = "role", pressed, onClick }) {
  const cls = "chip" + (kind === "conversion" ? " chip-conversion" : "");
  if (onClick) return <button type="button" className={cls} aria-pressed={!!pressed} onClick={onClick}>{label}</button>;
  return <span className={cls}>{label}</span>;
}
export function ChipRow({ chips = [], label }) {
  return <ul className="chip-row" aria-label={label}>{chips.map((c) => <li key={c.label}><Chip label={c.label} kind={c.kind} /></li>)}</ul>;
}

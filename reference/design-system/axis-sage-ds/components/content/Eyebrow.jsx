import React from "react";
/** Eyebrow: mono, 12/16, uppercase, +8%. An index number and a topic, separated by a middle dot. */
export function Eyebrow({ children, rule, strong, as = "p", className = "", style }) {
  const Tag = as;
  return <Tag style={style} className={["t-label eyebrow", rule ? "eyebrow-rule" : "", strong ? "eyebrow-strong" : "", className].filter(Boolean).join(" ")}>{children}</Tag>;
}

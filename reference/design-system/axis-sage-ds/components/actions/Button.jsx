import React from "react";
/** Button.Primary · Button.Secondary · Button.Dark. Square, 48px. One primary per view: the next action. */
export function Button({ variant = "primary", size, block, href, disabled, children, onClick, type = "button", className = "" }) {
  const cls = ["btn", "btn-" + variant, size ? "btn-" + size : "", block ? "btn-block" : "", className].filter(Boolean).join(" ");
  if (href && !disabled) return <a className={cls} href={href} onClick={onClick}>{children}</a>;
  return <button type={type} className={cls} disabled={disabled} onClick={onClick}>{children}</button>;
}

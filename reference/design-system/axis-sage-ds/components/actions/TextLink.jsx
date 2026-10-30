import React from "react";
/** TextLink: underline, orange underline on hover, trailing ▸. */
export function TextLink({ href = "#", arrow = true, children, onClick, className = "" }) {
  return (
    <a href={href} onClick={onClick} className={("text-link " + className).trim()}>
      {children}{arrow ? <span className="text-link-arrow" aria-hidden="true">▸</span> : null}
    </a>
  );
}

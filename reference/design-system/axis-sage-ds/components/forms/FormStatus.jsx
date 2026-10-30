import React from "react";
/** FormStatus: inline result line, plus the mailto fallback panel when storage fails. */
export function FormStatus({ state = "success", children, fallbackHref }) {
  if (state === "fallback") return <div className="form-fallback"><span>{children}</span><a className="text-link" href={fallbackHref || "mailto:info@axisandsage.com"}>Open it in your email app<span className="text-link-arrow">▸</span></a></div>;
  return <p className={"form-status is-" + state} role="status">{children}</p>;
}

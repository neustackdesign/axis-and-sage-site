import React from "react";
/** Field: label, cloud-50 control with a 1px midnight bottom rule, help line. Error/success carry a message, not colour alone. */
export function Field({ label, required, help, state, as = "input", options = [], dark, ...rest }) {
  const cls = ["field", state ? "is-" + state : "", dark ? "on-dark" : ""].filter(Boolean).join(" ");
  let control;
  if (as === "textarea") control = <textarea className="field-control" {...rest} />;
  else if (as === "select") control = <select className="field-control" {...rest}>{options.map((o) => <option key={o}>{o}</option>)}</select>;
  else control = <input className="field-control" {...rest} />;
  return (
    <label className={cls}>
      <span className="field-label">{label}{required === false ? <span className="req"> (optional)</span> : null}</span>
      {control}
      {help ? <span className="field-help">{state === "error" ? "✕ " : state === "success" ? "✓ " : ""}{help}</span> : null}
    </label>
  );
}

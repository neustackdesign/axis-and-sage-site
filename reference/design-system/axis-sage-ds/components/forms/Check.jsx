import React from "react";
/** Check: 22px square checkbox, midnight fill with ✓ when checked. */
export function Check({ label, checked, defaultChecked, onChange, error }) {
  return <label className={"check" + (error ? " is-error" : "")}><input type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={onChange} /><span>{label}</span></label>;
}

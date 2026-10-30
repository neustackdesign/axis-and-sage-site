import React from "react";
/** Segmented: equal cells in a 1px midnight frame; selected cell inverts to midnight. Used for Yes/Partly/No and 1–5 scales. */
export function Segmented({ options = [], value, onChange = () => {}, error, scaleLabels }) {
  return (
    <div>
      <div className={"segmented" + (error ? " is-error" : "")} style={{ "--n": options.length }}>
        {options.map((o) => <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}>{o}</button>)}
      </div>
      {scaleLabels ? <div className="segmented-scale-labels t-label"><span>{scaleLabels[0]}</span><span>{scaleLabels[1]}</span></div> : null}
    </div>
  );
}

import React from "react";
const PLANES = [["01", "THE DECISION", "decision"], ["02", "THE TERMS", "terms"], ["03", "THE MOMENT", "moment"], ["04", "THE ACTION", "action"]];
/** PlaneStack: the method in four parallelogram layers. The action plane is orange. Steps sit in a spec column to the right. */
export function PlaneStack({ steps = [] }) {
  return (
    <div className="plane-stack is-live">
      <div className="planes" role="img" aria-label="Four planes: the decision, the terms, the moment, the action.">
        {PLANES.map(([i, n, k]) => <div className="plane-row" key={i}><span className="t-label">{i}</span><div className={"plane plane-" + k}>{n}</div></div>)}
      </div>
      <ol className="plane-steps">{steps.map((s) => <li key={s.index}><span className="t-label">{s.index}</span><div><h3>{s.title}</h3><p>{s.body}</p></div></li>)}</ol>
    </div>
  );
}

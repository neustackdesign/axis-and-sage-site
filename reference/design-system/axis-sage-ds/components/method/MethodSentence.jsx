import React from "react";
const WHEN = ["this month", "this quarter", "this year", "no date yet"];
/** MethodSentence: "WE NEED [who] TO [do what] BY [when]" as mono selects, with the answer panel below. */
export function MethodSentence({ rows = [], panel = true }) {
  const [row, setRow] = React.useState(0);
  const [when, setWhen] = React.useState("this quarter");
  const cur = rows[row] || {};
  return (
    <div>
      <div className="method-sentence" role="group" aria-label="Build the sentence">
        <span className="ms-slot"><span aria-hidden="true">WE NEED</span><span className="ms-select is-chosen"><select value={row} onChange={(e) => setRow(Number(e.target.value))}>{rows.map((r, i) => <option key={r.who} value={i}>{r.who}</option>)}</select></span></span>
        <span className="ms-slot"><span aria-hidden="true">TO</span><span className="ms-select is-chosen"><select value={row} onChange={(e) => setRow(Number(e.target.value))}>{rows.map((r, i) => <option key={r.action} value={i}>{r.action}</option>)}</select></span></span>
        <span className="ms-slot"><span aria-hidden="true">BY</span><span className="ms-select is-chosen"><select value={when} onChange={(e) => setWhen(e.target.value)}>{WHEN.map((o) => <option key={o} value={o}>{o}</option>)}</select></span></span>
      </div>
      {panel ? (
        <div className="ms-panel" aria-live="polite">
          <div><span className="t-label muted">What usually stops them</span><p>{cur.stops}</p></div>
          <div><span className="t-label muted">Where we'd look first</span><p>{cur.look}</p></div>
          <div className="ms-panel-foot"><a className="text-link" href="#">Score your own in six minutes<span className="text-link-arrow">▸</span></a></div>
        </div>
      ) : null}
    </div>
  );
}

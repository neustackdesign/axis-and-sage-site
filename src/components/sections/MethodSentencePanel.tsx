"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { sentenceRows } from "@/content/method";
import { whenOptions } from "@/content/site";

/** MethodSentence with its answer panel. Choosing an option updates "What usually stops them" and "Where we'd look first". */
export function MethodSentencePanel() {
  const id = useId();
  const [row, setRow] = useState(0);
  const [when, setWhen] = useState<string>("this quarter");
  const current = sentenceRows[row];
  const scoreHref = `/tools/conversion-scorecard?who=${encodeURIComponent(current.who.toLowerCase())}&what=${encodeURIComponent(current.action)}&when=${encodeURIComponent(when)}`;

  return (
    <div>
      <div className="method-sentence" role="group" aria-label="Build the sentence">
        <span className="ms-slot"><span aria-hidden="true">WE NEED</span>
          <label className="sr-only" htmlFor={`${id}-who`}>We need</label>
          <span className="ms-select is-chosen">
            <select id={`${id}-who`} value={row} onChange={(e) => setRow(Number(e.target.value))}>
              {sentenceRows.map((r, i) => <option key={r.who} value={i}>{r.who}</option>)}
            </select>
          </span>
        </span>
        <span className="ms-slot"><span aria-hidden="true">TO</span>
          <label className="sr-only" htmlFor={`${id}-what`}>to</label>
          <span className="ms-select is-chosen">
            <select id={`${id}-what`} value={row} onChange={(e) => setRow(Number(e.target.value))}>
              {sentenceRows.map((r, i) => <option key={r.action} value={i}>{r.action}</option>)}
            </select>
          </span>
        </span>
        <span className="ms-slot"><span aria-hidden="true">BY</span>
          <label className="sr-only" htmlFor={`${id}-when`}>by</label>
          <span className="ms-select is-chosen">
            <select id={`${id}-when`} value={when} onChange={(e) => setWhen(e.target.value)}>
              {whenOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </span>
        </span>
      </div>
      <div className="ms-panel" aria-live="polite">
        <div><span className="t-label muted">What usually stops them</span><p>{current.stops}</p></div>
        <div><span className="t-label muted">Where we&apos;d look first</span><p>{current.look}</p></div>
        <div className="ms-panel-foot"><Link className="text-link" href={scoreHref}>Score your own in six minutes<span className="text-link-arrow" aria-hidden="true">▸</span></Link></div>
      </div>
    </div>
  );
}

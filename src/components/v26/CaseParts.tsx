"use client";

import { useState } from "react";
import type { CaseResult } from "@/lib/content/types";
import { DotField } from "./DotField";

/** The flow, redrawn from the case description: before and after as three screens each. Wipes on change. */
export function CaseFlow({ before, after, caption }: { before: string[]; after: string[]; caption?: string }) {
  const [view, setView] = useState<"before" | "after">("after");
  const screens = view === "before" ? before : after;
  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        {caption ? <p className="lbl">{caption}</p> : <span />}
        <div className="seg" role="group" aria-label="Show the flow">
          <button type="button" aria-pressed={view === "before"} onClick={() => setView("before")}>Before</button>
          <button type="button" aria-pressed={view === "after"} onClick={() => setView("after")}>After</button>
        </div>
      </div>
      <div className="stage">
        <ol key={view} className="flow wipe" aria-label={`${view === "before" ? "Before" : "After"}: ${screens.join(", then ")}`}>
          {screens.map((t, i) => {
            const last = i === screens.length - 1;
            const media = /farm|harvest/i.test(t) && !(view === "after" && last); // the screen that asks, asks
            return (
              <li key={t} className={`phone${view === "before" && last ? " later" : ""}`}>
                <span className="t">{i + 1} · {t}</span>
                {media ? <span className="media" /> : <><span className="bar" /><span className="bar" style={{ width: "60%" }} /><span className="fill" /><span className="cta">{view === "after" ? t : "Continue"}</span></>}
              </li>
            );
          })}
        </ol>
        <p className="cap" style={{ color: "var(--text-muted)" }}>{view === "before" ? `Before · ${before.join(", then ").toLowerCase()}` : `After · ${after.join(", then ").toLowerCase()}`}</p>
      </div>
    </div>
  );
}

/** What moved, on Midnight: the figure and its before/after control, then the same result drawn per 100. */
export function CaseResultField({ r }: { r: CaseResult }) {
  const [after, setAfter] = useState(true);
  const [head, tail] = r.numeral.split("→").map((x) => x.trim());
  return (
    <>
      <div className="l edge">
        <p className="lbl rv">What moved</p>
        <p className="big rv d1">{tail ? <>{head} → <b>{tail}</b></> : r.numeral}</p>
        <p className="lead rv d2">{r.label}</p>
        {r.source ? <p className="small muted rv d2">{r.source}</p> : null}
        <div className="seg rv d3" role="group" aria-label="Show before or after" style={{ alignSelf: "flex-start" }}>
          <button type="button" aria-pressed={!after} onClick={() => setAfter(false)}>Before</button>
          <button type="button" aria-pressed={after} onClick={() => setAfter(true)}>After</button>
        </div>
      </div>
      <DotField before={r.before} after={r.after} show={after} className="df dark" />
    </>
  );
}

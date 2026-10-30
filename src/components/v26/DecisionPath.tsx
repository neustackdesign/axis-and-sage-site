"use client";

import { useState } from "react";
import type { HomeView } from "@/sanity/load";

type Path = NonNullable<HomeView["decisionPath"]>;
const PATH = "M56 180 L600 180 C 645 180 664 200 664 240 L664 330 C 664 375 645 400 600 400 L120 400 C 75 400 56 420 56 460 L56 540 C 56 585 75 610 120 610 L664 610";

/**
 * The hero's dark field: pick who needs to act and the path redraws as their sentence, what stops them, where we look
 * and the action. Desktop draws the dotted path; mobile stacks the same four stations down a vertical line.
 */
export function DecisionPath({ path }: { path: Path }) {
  const [i, setI] = useState(0);
  const [snap, setSnap] = useState(false);
  const a = path.actors[i] ?? path.actors[0];
  const pick = (n: number) => { setI(n); setSnap(true); window.setTimeout(() => setSnap(false), 40); };
  const alt = `Decision path. We need ${a.who} to ${a.act}. What usually stops them: ${a.stops} Where we look: ${a.look} The action: ${a.done}`;
  const chips = (
    <div className="chips dark" role="group" aria-label="Choose who needs to act">
      {path.actors.map((x, n) => <button key={x.label} type="button" aria-pressed={n === i} onClick={() => pick(n)}>{x.label}</button>)}
    </div>
  );
  return (
    <div className={`r${snap ? " snap" : ""}`}>
      <div className="dp" role="img" aria-label={alt}>
        <svg viewBox="0 0 720 780" preserveAspectRatio="none" aria-hidden="true">
          <path className="path-d" d={PATH} fill="none" stroke="var(--midnight-600)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path className="trace" pathLength={1200} d={PATH} fill="none" stroke="var(--bloom-500)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="nd" style={{ left: "7.8%", top: "23.1%" }} aria-hidden="true" />
        <span className="nd n2" style={{ left: "92.2%", top: "42.3%" }} aria-hidden="true" />
        <span className="nd n3" style={{ left: "7.8%", top: "69.2%" }} aria-hidden="true" />
        <span className="nd end" style={{ left: "92.2%", top: "78.2%" }} aria-hidden="true" />
        <div className="top"><p className="lbl">{path.label}</p>{chips}</div>
        <div key={i} aria-hidden="true">
          <div className="lb swapin" style={{ left: "7.8%", top: "27%" }}><span className="k">01 · The decision</span><span className="t">We need {a.who} to {a.act}.</span></div>
          <div className="lb end swapin" style={{ right: "12.5%", top: "37%", animationDelay: "80ms" }}><span className="k">02 · What usually stops them</span><span className="t s">{a.stops}</span></div>
          <div className="lb swapin" style={{ left: "15%", top: "55%", animationDelay: "160ms" }}><span className="k">03 · Where we look</span><span className="t s">{a.look}</span></div>
          <div className="lb end swapin" style={{ right: "7.8%", top: "82%", animationDelay: "240ms" }}><span className="k act">04 · The action</span><span className="t">{a.done}</span></div>
        </div>
      </div>
      <div className="vp-wrap">
        <p className="lbl vp-only">{path.label}</p>
        <div className="vp-only">{chips}</div>
        <div className="vp" key={i} aria-live="polite">
          <div className="swapin"><span className="k">01 · The decision</span><span className="t">We need {a.who} to {a.act}.</span></div>
          <div className="swapin" style={{ animationDelay: "80ms" }}><span className="k">02 · What usually stops them</span><span>{a.stops}</span></div>
          <div className="swapin" style={{ animationDelay: "160ms" }}><span className="k">03 · Where we look</span><span>{a.look}</span></div>
          <div className="end swapin" style={{ animationDelay: "240ms" }}><span className="k act">04 · The action</span><span className="t">{a.done}</span></div>
        </div>
      </div>
    </div>
  );
}

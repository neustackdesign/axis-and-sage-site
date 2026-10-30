"use client";

import { useState } from "react";
import type { Readout as ReadoutData } from "@/lib/content/types";
import { DotField } from "./DotField";

const half = (tag: string) => (tag === "TERMS" ? "Terms" : "Moment");

/** The four regions of a case readout. The active stage takes three rows of six; the others compress to a preview. */
export function ReadoutRegions({ r, step, short }: { r: ReadoutData; step: number; short?: boolean }) {
  const cls = (n: number) => (n === step ? "act" : "dorm");
  const rows = [0, 1, 2, 3].map((n) => (n === step ? "3fr" : "1fr")).join(" ");
  const blockers = short ? r.inTheWay.slice(0, 2) : r.inTheWay;
  return (
    <div className="rd lite" style={{ gridTemplateRows: rows }}>
      <div className={cls(0)}><div className="rk"><span className="lbl ink">01 · The sentence</span><span className="lbl">Day 1</span></div><p className="sent">{r.sentence}</p></div>
      <div className={cls(1)}><div className="rk"><span className="lbl ink">02 · In the way</span><span className="lbl">Days 2–9</span></div>
        <ul>{blockers.map((b) => <li key={b}><span className="chip">Moment</span><span>{b}</span></li>)}</ul></div>
      <div className={cls(2)}><div className="rk"><span className="lbl ink">03 · What changed</span><span className="lbl">Built with the team</span></div>
        <ul>{r.changes.filter((c) => c.tag !== "TERMS").map((c) => <li key={c.text}><span className="chip">{half(c.tag)}</span><span>{c.text}</span></li>)}</ul></div>
      <div className={cls(3)}><div className="rk"><span className="lbl ink">04 · What moved</span><span className="lbl">Last page</span></div>
        {r.result ? <div className="moved"><p className="stat">{r.result.numeral}</p><DotField before={r.result.before} after={r.result.after} /></div> : null}
      </div>
    </div>
  );
}

/** Homepage: the method as a rail of four stages beside the readout, on Midnight. The rail never moves. */
export function Readout({ r, stages, label, title, note, link }: { r: ReadoutData; stages: { index: string; title: string }[]; label: string; title: string; note?: string; link: { href: string; label: string } }) {
  const [step, setStep] = useState(0);
  return (
    <div className="g12">
      <div className="s4 stack" style={{ gap: 20, paddingRight: 16 }}>
        <p className="lbl rv">{label}</p>
        <h2 className="h2 xs rv d1">{title}</h2>
        <div className="steps rv d2" role="tablist" aria-label={title}>
          {stages.map((s, n) => (
            <button key={s.index} type="button" role="tab" id={`stage-${n}`} aria-selected={n === step} aria-controls="readout" className={`step${n === step ? " on" : ""}`} onClick={() => setStep(n)}>
              <span className="n">{s.index}</span><span className="tt">{s.title}</span>
            </button>
          ))}
        </div>
        <p className="small muted rv d3">{note} <a className="tl more" href={link.href}>{link.label}</a></p>
      </div>
      <div className="s8 rv d2" id="readout" role="tabpanel" aria-labelledby={`stage-${step}`} aria-live="polite">
        <ReadoutRegions r={r} step={step} />
      </div>
    </div>
  );
}

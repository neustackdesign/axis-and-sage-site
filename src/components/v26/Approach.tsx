"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Readout } from "@/lib/content/types";
import type { MethodView } from "@/sanity/load";
import { ReadoutRegions } from "./Readout";
import { useScrollStage } from "./scroll";

/** Terms and moments: the mark's two ribbons are the diagram. Scrolling past hands focus from terms to moments; a pick
 *  holds its half while the other recedes. */
export function TermsMoments({ halves, ribbon }: { halves: NonNullable<MethodView["halves"]>; ribbon: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scrolled = useScrollStage(ref, 2);
  const [picked, setFocus] = useState<"t" | "m" | null>(null);
  const focus = picked ?? (scrolled ? "m" : "t");
  return (
    <div ref={ref} className={`tmv ${focus === "t" ? "fT" : "fM"}`}>
      <div className="stack rv" style={{ gap: 0 }}>
        <p className="lbl" style={{ marginBottom: 16 }}>{halves.label}</p>
        <button type="button" aria-pressed={focus === "t"} onClick={() => setFocus("t")}>
          <span className="lbl" style={{ color: "var(--sunset-700)" }}>Terms</span>
          <span className="h3" style={{ display: "block", marginTop: 6 }}>{halves.terms.title}</span>
          <span className="small muted" style={{ display: "block", marginTop: 6 }}>{halves.terms.line}</span>
        </button>
        <button type="button" aria-pressed={focus === "m"} onClick={() => setFocus("m")}>
          <span className="lbl ink">Moments</span>
          <span className="h3" style={{ display: "block", marginTop: 6 }}>{halves.moments.title}</span>
          <span className="small muted" style={{ display: "block", marginTop: 6 }}>{halves.moments.line}</span>
        </button>
      </div>
      <svg className="rv d1" viewBox="0 0 2221 971" role="img" aria-label="Two ribbons, terms and moments, crossing where people act." style={{ width: "100%", height: "auto" }}>
        <path className="pm" d={ribbon} transform="translate(820 0)" fill="var(--bloom-500)" opacity="0.7" />
        <path className="pt" d={ribbon} fill="var(--sunset-500)" opacity="0.7" />
      </svg>
    </div>
  );
}

/** Four stages beside the sticky readout. The stage in the centre band expands its region; scrolling back reverses it. */
export function Stages({ steps, r, label, children }: { steps: MethodView["methodStepsExpanded"]; r: Readout; label?: string; children?: ReactNode }) {
  const [step, setStep] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setStep(Number((e.target as HTMLElement).dataset.stage)); }), { rootMargin: "-45% 0px -45% 0px" });
    refs.current.forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, []);
  return (
    <div className="pr">
      <div>
        {label ? <p className="lbl">{label}</p> : null}
        {steps.map((s, i) => (
          <article key={s.index} ref={(n) => { refs.current[i] = n; }} data-stage={i} className={`st${i === step ? "" : " dorm"}`} aria-current={i === step ? "step" : undefined}>
            <p className="lbl ink">{s.index}</p>
            <h2 className="h2 xs">{s.title}</h2>
            <p className="small">{s.body}</p>
            {s.owner || s.artefact || s.measure ? (
              <dl>
                {s.owner ? <><dt>Owner</dt><dd>{s.owner}</dd></> : null}
                {s.artefact ? <><dt>You get</dt><dd>{s.artefact}</dd></> : null}
                {s.measure ? <><dt>Measured</dt><dd>{s.measure}</dd></> : null}
              </dl>
            ) : null}
          </article>
        ))}
      </div>
      <div>
        <div role="img" aria-label={`The ${r.name} readout, stage ${steps[step]?.index}: ${steps[step]?.title}`}>
          <ReadoutRegions r={r} step={step} short />
        </div>
        {children}
      </div>
    </div>
  );
}

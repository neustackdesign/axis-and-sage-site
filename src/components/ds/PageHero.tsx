import type { ReactNode } from "react";
import { Eyebrow } from "./primitives";

/** Page hero on paper, no painting: mono label in the rail, serif H1 and sub in the content column. */
export function PageHero({ label, title, sub, children, display }: { label: string; title: ReactNode; sub?: ReactNode; children?: ReactNode; display?: boolean }) {
  return (
    <section className="tone-paper" aria-labelledby="page-title">
      <div className="wrap page-hero">
        <div className="page-hero-grid">
          <Eyebrow strong>{label}</Eyebrow>
          <div>
            <h1 id="page-title" className={`${display ? "t-display" : "t-h1"} reveal`}>{title}</h1>
            {sub ? <p className="page-hero-sub t-body-l">{sub}</p> : null}
            {children ? <div className="page-hero-meta">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

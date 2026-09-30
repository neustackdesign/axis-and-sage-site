import type { CSSProperties, ReactNode } from "react";
import type { CaseStat, SelectedCase, StatTileData, Testimonial as TestimonialData, WorkItem } from "@/content/work";
import { actionLabel } from "@/content/work";
import type { ToolMeta } from "@/content/library";
import type { EngagementColumn, Specialist } from "@/content/engagements";
import { engagementRows } from "@/content/engagements";
import { ButtonLink, Chip, ChipRow, Eyebrow, Glyph, Portrait, SmartLink, TextLink } from "./primitives";

const cssVars = (vars: Record<string, string | number>) => vars as CSSProperties;

/** SpecGrid · SpecCell: 1px rules between cells, no fills. Mono label, sans value, optional index. */
export function SpecGrid({ cells, cols = 4 }: { cells: { label: string; value: ReactNode; index?: string }[]; cols?: number }) {
  return (
    <div className="spec-grid" style={cssVars({ "--cols": cols })}>
      {cells.map((c, i) => (
        <div className="spec-cell" key={i}>
          <div className="spec-cell-head t-label"><span>{c.label}</span>{c.index ? <span>{c.index}</span> : null}</div>
          <div className="spec-cell-value">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

/** Spec list: numbered rows under a strong rule. */
export function SpecList({ items, numbered = true }: { items: ReactNode[]; numbered?: boolean }) {
  return <ol className="spec-list">{items.map((item, i) => <li key={i}><span className="t-label">{numbered ? String(i + 1).padStart(2, "0") : "▸"}</span><span>{item}</span></li>)}</ol>;
}

/** StatTile: mono numeral, one-line label, source line, role tag. */
export function StatTile({ stat, wide }: { stat: StatTileData | (CaseStat & { tag?: string }); wide?: boolean }) {
  const tag = "tag" in stat ? stat.tag : undefined;
  return (
    <div className={`stat-tile${wide ? " stat-tile-wide" : ""}`}>
      {tag ? <span className="t-label muted">{tag}</span> : null}
      <p className="t-stat">{stat.numeral}</p>
      <p className="stat-tile-label">{stat.label}</p>
      {stat.source ? <p className="stat-tile-source t-label">SOURCE: {stat.source}</p> : null}
    </div>
  );
}

export function StatGrid({ children, cols = 3 }: { children: ReactNode; cols?: number }) {
  return <div className="stat-grid" style={cssVars({ "--cols": cols })}>{children}</div>;
}

/** CaseCard.Paper · CaseCard.Charcoal: Needed / Changed / Moved. */
export function CaseCard({ item, index, dark, href }: { item: SelectedCase; index: number; dark?: boolean; href?: string }) {
  return (
    <article className={`case-card${dark ? " case-card-dark" : ""}`}>
      <div className="case-card-head t-label"><span>CASE · {String(index).padStart(2, "0")}</span></div>
      <div className="case-card-body">
        <h3 className="t-h3">{item.name}</h3>
        <dl className="case-card-rows">
          <dt className="t-label">NEEDED</dt><dd>{item.needed}</dd>
          <dt className="t-label">CHANGED</dt><dd>{item.changed}</dd>
          <dt className="t-label">MOVED</dt><dd className="moved">{item.moved}</dd>
        </dl>
        <div className="case-card-foot">
          <ChipRow chips={item.chips} label="Role and action" />
          {href ? <TextLink href={href}>Read the case<span className="sr-only">: {item.name}</span></TextLink> : null}
        </div>
      </div>
    </article>
  );
}

/** WorkCard: name, sector, role chip, action chip and a one-line result. */
export function WorkCard({ item }: { item: WorkItem }) {
  const inner = (
    <>
      <div className="work-card-head t-label"><span>{item.sector.toUpperCase()}</span></div>
      <h3 className="t-h3">{item.name}</h3>
      <p className="work-card-line">{item.line}</p>
      <ul className="chip-row" aria-label="Role and action">
        {item.roles.map((r) => <li key={r}><Chip chip={{ label: r, kind: "role" }} /></li>)}
        {item.actions.map((a) => <li key={a}><Chip chip={{ label: actionLabel(a).toUpperCase(), kind: "conversion" }} /></li>)}
      </ul>
      {item.hasCase ? <span className="work-card-more" aria-hidden="true">READ THE CASE ▸</span> : null}
    </>
  );
  return item.hasCase ? <SmartLink href={`/work/${item.slug}`} className="work-card">{inner}</SmartLink> : <article className="work-card">{inner}</article>;
}

/** Testimonial: portrait, serif quote, name, title, company. */
export function Testimonial({ t }: { t: TestimonialData }) {
  return (
    <figure className="testimonial">
      <blockquote>“{t.quote}”</blockquote>
      <figcaption className="testimonial-person">
        {t.portrait ? <Portrait className="testimonial-portrait" src={t.portrait} alt={t.name} /> : null}
        <span>
          <span className="testimonial-name" style={{ display: "block" }}>{t.name}</span>
          <span className="testimonial-title" style={{ display: "block" }}>{t.title}, {t.company}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialFeature({ t }: { t: TestimonialData }) {
  return (
    <figure className={`testimonial-feature${t.portrait ? "" : " no-portrait"}`}>
      {t.portrait ? <Portrait src={t.portrait} alt={t.name} /> : null}
      <div className="stack-24">
        <blockquote>“{t.quote}”</blockquote>
        <figcaption><span className="testimonial-name" style={{ display: "block" }}>{t.name}</span><span className="testimonial-title">{t.title}, {t.company}</span></figcaption>
      </div>
    </figure>
  );
}

/** LogoStrip: names set in type when logos are unavailable. */
export function LogoStrip({ names }: { names: string[] }) {
  return <ul className="logo-strip">{names.map((n) => <li key={n}>{n}</li>)}</ul>;
}

/** ToolCard: sage panel, glyph, mono label, one sentence, one link. */
export function ToolCard({ tool }: { tool: ToolMeta }) {
  return (
    <SmartLink href={`/tools/${tool.slug}`} className="tool-card">
      <div className="tool-card-head"><span className="t-label">{tool.kind}</span><span className="chip">{tool.badge}</span></div>
      <Glyph name={tool.glyph} size="sm" />
      <h3 className="t-h3">{tool.title}</h3>
      <p>{tool.line}</p>
      <span className="text-link">{tool.cta}<span className="text-link-arrow" aria-hidden="true">▸</span></span>
    </SmartLink>
  );
}

/** EngagementTable: plan table. The recommended column is inverted to charcoal and carries the only orange button. */
export function EngagementTable({ columns }: { columns: EngagementColumn[] }) {
  const ordered = [...columns].sort((a, b) => Number(!!b.recommended) - Number(!!a.recommended));
  return (
    <>
      <div className="engagement-table" role="table" aria-label="Engagements and pricing">
        <div role="row" style={{ display: "contents" }}>
          <div className="et-cell et-rowhead" role="columnheader">ENGAGEMENT</div>
          {columns.map((c) => (
            <div key={c.name} role="columnheader" className={`et-cell et-head${c.recommended ? " et-reco" : ""}`}>
              <span className="et-name">{c.name}</span>
              {c.recommended ? <span className="chip et-reco-flag">RECOMMENDED</span> : null}
            </div>
          ))}
        </div>
        {engagementRows.map((row) => (
          <div role="row" key={row.key} style={{ display: "contents" }}>
            <div className="et-cell et-rowhead" role="rowheader">{row.label}</div>
            {columns.map((c) => <div key={c.name} role="cell" className={`et-cell${row.key === "price" ? " et-price" : ""}${c.recommended ? " et-reco" : ""}`}>{c[row.key]}</div>)}
          </div>
        ))}
        <div role="row" style={{ display: "contents" }}>
          <div className="et-cell" role="cell" />
          {columns.map((c) => (
            <div key={c.name} role="cell" className={`et-cell et-cta${c.recommended ? " et-reco" : ""}`}>
              <ButtonLink href={c.cta.href} variant={c.recommended ? "primary" : "secondary"}>{c.cta.label}</ButtonLink>
            </div>
          ))}
        </div>
      </div>
      <div className="engagement-cards">
        {ordered.map((c) => (
          <article key={c.name} className={`engagement-card${c.recommended ? " is-reco on-dark" : ""}`}>
            <div className="engagement-card-head">
              {c.recommended ? <span className="chip et-reco-flag" style={{ alignSelf: "flex-start" }}>RECOMMENDED</span> : null}
              <h3 className="t-h3">{c.name}</h3>
            </div>
            <dl>
              {engagementRows.map((row) => <div key={row.key} style={{ display: "contents" }}><dt className="t-label">{row.label}</dt><dd>{c[row.key]}</dd></div>)}
            </dl>
            <div className="engagement-card-cta"><ButtonLink href={c.cta.href} variant={c.recommended ? "primary" : "secondary"}>{c.cta.label}</ButtonLink></div>
          </article>
        ))}
      </div>
    </>
  );
}

export function SpecialistCard({ s, cta }: { s: Specialist; cta?: { label: string; href: string } }) {
  return (
    <article className="specialist-card">
      <h3 className="t-h3">{s.name}</h3>
      <p className="specialist-meta t-label"><span>{s.price}</span><span>{s.time}</span></p>
      <p>{s.intro}</p>
      {s.points ? <ul>{s.points.map((p) => <li key={p}>{p}</li>)}</ul> : null}
      {cta ? <div style={{ marginTop: "auto" }}><TextLink href={cta.href}>{cta.label}</TextLink></div> : null}
    </article>
  );
}

/** FAQ: native details/summary, one question per row. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f, i) => (
        <details key={f.q}>
          <summary><span className="t-label">{String(i + 1).padStart(2, "0")}</span><h3>{f.q}</h3></summary>
          <p className="faq-answer">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Timeline: what was decided, then what people did. Baseline dotted; the new number is orange where the action happened. */
export function Timeline({ label, steps, baseline, source }: { label: string; baseline: { value: number; label: string }; steps: { when: string; said: string; value: number; valueLabel: string; did: string; action?: boolean }[]; source?: string }) {
  const max = Math.max(...steps.map((s) => s.value), baseline.value) * 1.15;
  const baseBottom = (baseline.value / max) * 100;
  return (
    <figure className="timeline" style={cssVars({ "--steps": steps.length })}>
      <div className="timeline-steps">
        {steps.map((s) => <div key={s.when}><span className="t-label muted">{s.when}</span><span className="timeline-said">“{s.said}”</span></div>)}
      </div>
      <div className="timeline-axis t-label">{label}</div>
      <div className="timeline-chart" aria-hidden="true">
        <div className="timeline-baseline" style={{ bottom: `${baseBottom}%` }}><span className="timeline-baseline-label t-label">{baseline.label}</span></div>
        {steps.map((s) => (
          <div className="timeline-col" key={s.when}>
            <div className={`timeline-pin${s.action ? " is-action" : ""}`}>
              <span className="timeline-pin-value">{s.valueLabel}</span>
              <span className="timeline-pin-stem" style={{ height: `${Math.max(12, (s.value / max) * 170)}px` }} />
              <span className="timeline-pin-dot" />
            </div>
          </div>
        ))}
      </div>
      <div className="timeline-did">{steps.map((s) => <div key={s.when}>{s.did}</div>)}</div>
      <figcaption className="sr-only">{steps.map((s) => `${s.when}: ${s.said}. ${s.did}: ${s.valueLabel}.`).join(" ")}</figcaption>
      {source ? <p className="timeline-source t-label" style={{ padding: "0 16px 16px" }}>{source}</p> : null}
    </figure>
  );
}

/** Day-by-day timeline for the Diagnostic. The readout is the action point. */
export function DayTimeline({ days }: { days: { when: string; what: string }[] }) {
  return <ol className="day-timeline">{days.map((d) => <li key={d.when}><span className="t-label">{d.when}</span><p>{d.what}</p></li>)}</ol>;
}

/** Dotted orbit rings: four audiences, the action point in orange. */
export function OrbitRings({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="560" height="280" viewBox="0 0 560 280" aria-hidden="true" focusable="false">
      {[120, 240, 360, 480].map((cx) => <circle key={cx} cx={cx} cy="170" r="90" fill="none" stroke="#A9A7A2" strokeWidth="1.5" strokeDasharray="0.5 7" strokeLinecap="round" />)}
      <circle cx="480" cy="80" r="5" fill="#E8590C" />
    </svg>
  );
}

export function GlyphLabel({ glyph, label }: { glyph: Parameters<typeof Glyph>[0]["name"]; label: string }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 16 }}><Glyph name={glyph} size="sm" /><Eyebrow as="span" strong>{label}</Eyebrow></span>;
}

import Link from "next/link";
import type { CasePage, Cta } from "@/lib/content/types";
import { actionLabel, provenanceLabel } from "@/lib/content/vocab";
import { CaseFlow, CaseResultField } from "./CaseParts";

const half = (tag: string) => (tag === "TERMS" ? "Terms" : "Moment");

/** The 2026 case: context, the claim on Midnight, the change redrawn, the result per 100, evidence kept apart. */
export function CaseV26({ c, cta }: { c: CasePage; cta: Cta }) {
  const d = c.design!;
  const provenance = provenanceLabel(c.provenance);
  const lead = c.ledBy;
  const whose = c.provenance === "principalTrackRecord" && lead ? `${lead.name.split(" ")[0]}'s role before Axis & Sage, not a firm engagement` : c.provenance === "axisAndSage" ? "An Axis & Sage engagement" : "";
  const meta = [
    { k: "Sector", v: c.sector },
    d.roleLine ? { k: "Role", v: d.roleLine } : null,
    lead ? { k: "Led by", v: <Link className="tl" href={`/people/${lead.slug}`}>{lead.name}</Link> } : null,
  ].filter((x): x is NonNullable<typeof x> => !!x);
  const stats = (c.stats ?? []).slice(0, 6 - meta.length);
  const ev = d.evidence;
  const ledger = [
    ev?.measured ? { k: "Measured", body: <p className="small">{ev.measured}</p> } : null,
    ev?.observed ? { k: "Observed", body: <p className="small">{ev.observed}</p> } : null,
    c.quote ? { k: "Client testimony", body: <><p className="small">“{c.quote.quote}”</p><p className="lbl">{c.quote.name} · {c.quote.title}</p></> } : null,
    ev?.notClaimed ? { k: "Not claimed", body: <p className="small">{ev.notClaimed}</p> } : null,
  ].filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <div className="v26">
      <section className="ch bleed" data-sec="hero" aria-labelledby="page-title">
        <div className="l edge">
          <p className="lbl rv"><Link className="tl" href="/work">Work</Link> · Case study</p>
          <h1 id="page-title" className="h1 rv d1" style={{ fontSize: "clamp(40px, 3.7vw, 52px)", lineHeight: 1.12, marginTop: 40 }}>{d.headline}</h1>
          {c.intro ? <p className="lead rv d2" style={{ marginTop: 24 }}>{c.intro}</p> : null}
          {provenance ? <p className="lbl" style={{ marginTop: "auto", paddingTop: 40 }}><span className="chip" style={{ marginRight: 8 }}>{provenance}</span>{whose}</p> : null}
        </div>
        <div className="r rv d1">
          <p className="name" aria-hidden="true">{c.name}</p>
          {d.place ? <p className="cap">{d.place}</p> : null}
        </div>
      </section>

      <section className="wrap" data-sec="meta" style={{ paddingBlock: "40px 64px" }} aria-label="At a glance">
        <dl className="meta6 rv">
          {meta.map((m) => <div key={m.k}><dt className="lbl">{m.k}</dt><dd className="small">{m.v}</dd></div>)}
          {stats.map((s) => <div key={s.numeral}><dt className="stat" style={{ fontSize: 24, lineHeight: "30px" }}>{s.numeral}</dt><dd className="small muted">{s.label}</dd></div>)}
        </dl>
      </section>

      {d.wayHeadline && c.inTheWay ? (
        <section className="sec t-mid" data-sec="way" aria-labelledby="way-title">
          <div className="wrap con">
            <div className="stack"><p className="lbl rv">What was in the way</p><h2 id="way-title" className="disp rv d1">{d.wayHeadline}</h2></div>
            <ol className="rv d2">{c.inTheWay.map((w, i) => <li key={w}><span className="lbl ink">{String(i + 1).padStart(2, "0")}</span><span>{w}</span></li>)}</ol>
          </div>
        </section>
      ) : null}

      {d.flow || c.changes ? (
        <section className="sec" data-sec="changed" aria-labelledby="changed-title">
          <h2 id="changed-title" className="sr-only">What changed</h2>
          <div className="wrap int">
            {d.flow ? <div className="rv d1"><CaseFlow before={d.flow.before} after={d.flow.after} caption={d.flow.caption} /></div> : <div />}
            {c.changes ? <ol className="chlist rv d2" style={{ alignSelf: "end" }}>{c.changes.map((ch) => <li key={ch.text}><span className="chip" style={{ alignSelf: "flex-start" }}>{half(ch.tag)}</span><span className="small">{ch.text}</span></li>)}</ol> : null}
          </div>
        </section>
      ) : null}

      {d.result ? (
        <section className="res t-mid bleed" data-sec="result" aria-label="What moved">
          <CaseResultField r={d.result} />
        </section>
      ) : null}

      {ledger.length ? (
        <section className="sec t-alt" data-sec="evidence" aria-labelledby="ev-title">
          <div className="wrap g12" style={{ rowGap: 24 }}>
            <div className="s3"><h2 id="ev-title" className="lbl ink rv">Evidence, kept apart</h2></div>
            <div className="s9 rv d1 led-grid" style={{ display: "grid", gridTemplateColumns: `repeat(${ledger.length}, minmax(0, 1fr))`, gap: 24 }}>
              {ledger.map((x) => <div className="led" key={x.k}><p className="lbl ink">{x.k}</p>{x.body}</div>)}
            </div>
          </div>
        </section>
      ) : null}

      {d.next ? (
        <section className="t-creme" data-sec="next" aria-label="Next case">
          <div className="wrap">
            <Link className="nx rv" href={`/work/${d.next.slug}`}>
              <span className="stack" style={{ gap: 10 }}>
                <span className="lbl">{["Next", provenanceLabel(d.next.provenance), d.next.actions[0] ? actionLabel(d.next.actions[0]) : null].filter(Boolean).join(" · ")}</span>
                <span className="disp">{d.next.name}</span>
                <span className="small">{d.next.line}</span>
              </span>
              <span className="stat" aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      ) : null}

      {d.closing ? (
        <section className="t-sun" data-sec="close" aria-labelledby="close-title">
          <div className="wrap close">
            <div className="stack" style={{ gap: 12 }}><h2 id="close-title" className="h2 rv">{d.closing.headline}</h2>{d.closing.line ? <p className="rv d1">{d.closing.line}</p> : null}</div>
            <div className="rv d2"><Link className="btn btn-primary" href={cta.href}>{cta.label}</Link></div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

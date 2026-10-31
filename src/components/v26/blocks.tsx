import Link from "next/link";
import type { ReactNode } from "react";
import type { Person, ProofStat, Testimonial } from "@/lib/content/types";

/** Section head: a two-line serif headline on 8 of 12 columns, the numbered folio closing the row on the right. */
export function Head({ id, title, label, children, level = 2 }: { id?: string; title?: string; label?: string; children?: ReactNode; level?: 1 | 2 }) {
  const H = level === 1 ? "h1" : "h2";
  return (
    <div className="head">
      <div className="stack"><H id={id} className="h2 rv">{title}</H>{children}</div>
      {label ? <p className="lbl ink rv">{label}</p> : null}
    </div>
  );
}

/** Page opening: headline and subcopy run the full grid width, the same measure as the media below. */
export function Opening({ label, title, sub, children }: { label: string; title: ReactNode; sub?: ReactNode; children?: ReactNode }) {
  return (
    <section className="wrap" data-sec="opening" aria-labelledby="page-title">
      <div className="opening">
        <div className="stack"><h1 id="page-title" className="h1 rv">{title}</h1>{sub ? <p className="sub rv d1">{sub}</p> : null}{children ? <div className="rv d2">{children}</div> : null}</div>
        <div><p className="lbl ink rv d1">{label}</p></div>
      </div>
    </section>
  );
}

/** Testimony mosaic: one quotation field leads (7 of 12), small proof fields substantiate (5 of 12, stacked). */
export function Testimony({ quote, stats }: { quote: Testimonial; stats: ProofStat[] }) {
  return (
    <div className="mos rv">
      <figure className="q">
        <blockquote className="quote">“{quote.quote}”</blockquote>
        <figcaption className="lbl ink">{quote.name} · {quote.title}{quote.company ? `, ${quote.company}` : ""}</figcaption>
      </figure>
      <div className="sm">
        {stats.map((x) => {
          const body = <><span className="lbl">{x.label}</span><span><span className="stat" style={{ display: "block" }}>{x.numeral}</span><span className="small muted">{x.line}</span></span></>;
          return x.href ? <Link key={x.label} href={x.href}>{body}</Link> : <div key={x.label}>{body}</div>;
        })}
      </div>
    </div>
  );
}

/** Founders, equal presence: two 4:5 fields. A portrait when supplied; until then the approved initials fallback. */
export function Founders({ id, title, label, people }: { id?: string; title?: string; label?: string; people: Person[] }) {
  return (
    <div className="g12" style={{ rowGap: 40 }}>
      <div className="s12"><Head id={id} title={title} label={label} /></div>
      {people.map((p, i) => (
        <article key={p.slug} className={`s5 stack rv d${i + 1}${i === 1 ? " push8" : ""}`} style={{ gap: 18 }}>
          <div className="pf">{p.portrait ? <img src={p.portrait} alt={`Portrait of ${p.name}`} loading="lazy" /> : <span className="mono" role="img" aria-label={`${p.name}, initials`}>{p.initials}</span>}</div>
          <p className="lbl">{p.half === "terms" ? "Terms" : "Moments"} · {p.practice}</p>
          <h3 className="h2"><Link href={`/people/${p.slug}`}>{p.name}</Link></h3>
          {p.homeLine ? <p className="lead">{p.homeLine}</p> : <p className="lead">{p.line}</p>}
          {p.credentialLine ? <p className="small">{p.credentialLine}</p> : null}
        </article>
      ))}
    </div>
  );
}

/** Two invitations on Midnight, offset so they read as a pair rather than a grid. */
export function Invitations({ items }: { items: { label: string; title: string; line: string; href: string; link: string }[] }) {
  return (
    <div className="inv">
      {items.map((x, i) => (
        <Link key={x.title} href={x.href} className={`rv d${i + 1}`}>
          <span className="lbl">{x.label}</span>
          <span className="h3">{x.title}</span>
          <span className="small">{x.line}</span>
          <span className="tl more go">{x.link}</span>
        </Link>
      ))}
    </div>
  );
}

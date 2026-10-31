import type { Metadata } from "next";
import Link from "next/link";
import { Glyph } from "@/components/ds/primitives";
import { DecisionPath } from "@/components/v26/DecisionPath";
import { ProofBand } from "@/components/v26/ProofBand";
import { Readout } from "@/components/v26/Readout";
import { CTABand } from "@/components/ds/CTABand";
import { SetPiece } from "@/components/v26/SetPiece";
import { Founders, Head, Testimony } from "@/components/v26/blocks";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getEngagements, getHome, getMethod, getPractices, getSettings } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  return pageMetadata({ title: home.seo.title, absoluteTitle: true, path: "/", description: home.seo.description });
}

/** "01 · SOUND FAMILIAR": sections are numbered in order of appearance. */
const numbered = (labels: (string | undefined)[]) => {
  let n = 0;
  return labels.map((l) => (l ? `${String(++n).padStart(2, "0")} · ${l}` : ""));
};

export default async function HomePage() {
  const [home, method, engagements, practices, settings] = await Promise.all([getHome(), getMethod(), getEngagements(), getPractices(), getSettings()]);
  const s = home.sections;
  const families = practices.filter((p) => p.section === "whatWeDo");
  const d = engagements.diagnostic;
  const diagnosticOffer = engagements.paths.flatMap((x) => x.offers).find((o) => o.name === d.name);
  const [lSit, lWork, lMethod, lStart, lFounders] = numbered([
    home.situations.length ? s.situations?.label : undefined,
    home.featuredCases.length ? s.work?.label : undefined,
    home.methodCase ? s.method?.label : undefined,
    s.start?.label,
    s.founders?.label,
  ]);

  return (
    <>
    <div className="v26">
      <Breadcrumbs trail={[]} />

      {/* Hero: content field anchored to the bottom, the decision path on Midnight */}
      <section className="hero bleed" data-sec="hero" aria-labelledby="hero-title">
        <div className="l edge">
          <p className="lbl rv">{home.eyebrow.slice(0, 2).join(" · ")}</p>
          <div className="stack">
            <h1 id="hero-title" className="h1 rv d1">{home.headline}</h1>
            <p className="rv d2">{home.supportingCopy}</p>
            <div className="row rv d3" style={{ gap: 24, marginTop: 4 }}>
              <Link className="btn btn-primary" href={home.primaryCta.href}>{home.primaryCta.label} <span className="arr" aria-hidden="true">→</span></Link>
              <Link className="tl more" href={home.secondaryCta.href}>{home.secondaryCta.label}</Link>
            </div>
          </div>
          <p className="lbl">{settings.locations.join(" · ")}</p>
        </div>
        {home.decisionPath ? <DecisionPath path={home.decisionPath} /> : <div className="r" />}
      </section>

      {home.situations.length ? (
        <section className="sec t-lilac" data-sec="situations" aria-labelledby="sit-title">
          <div className="wrap">
            <div className="head" style={{ marginBottom: 0 }}>
              <div className="stack"><h2 id="sit-title" className="h2 rv">{s.situations?.title}</h2>{s.situations?.intro ? <p className="muted rv d1" style={{ maxWidth: "40ch" }}>{s.situations.intro}</p> : null}</div>
              <p className="lbl ink rv">{lSit}</p>
            </div>
            <div className="sits build rv d2">
              {home.situations.map((x) => (
                <Link key={x.text} href={x.href}>
                  <Glyph name={x.glyph} />
                  <span className="pt">{x.text}</span>
                  <span className="lbl ink">{x.family} ▸</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {home.proofBand ? (
        <section className="sec t-mid" data-sec="proof" aria-label="Proof">
          <div className="wrap"><ProofBand band={home.proofBand} /></div>
        </section>
      ) : null}

      {home.featuredCases.length ? (
        <section className="sec" data-sec="work" id="work" aria-labelledby="work-title">
          <div className="wrap">
            <Head id="work-title" title={s.work?.title} label={lWork} />
            {home.featuredCases.map((p, i) => <SetPiece key={p.slug} p={p} mediaFirst={i % 2 === 1} />)}
          </div>
        </section>
      ) : null}

      {home.testimony?.quote ? (
        <section className="sec t-sage" data-sec="quote" aria-label="What clients say">
          <div className="wrap"><Testimony quote={home.testimony.quote} stats={home.testimony.stats.slice(0, 2)} /></div>
        </section>
      ) : null}

      {home.methodCase ? (
        <section className="sec t-mid" data-sec="method" aria-label={s.method?.title}>
          <div className="wrap">
            <Readout r={home.methodCase} stages={method.methodSteps} label={lMethod} title={s.method?.title ?? ""} note={s.method?.intro}
              link={{ href: "/conversion-design", label: home.conversionLinkLabel }} />
          </div>
        </section>
      ) : null}

      <section className="sec" data-sec="start" id="start" aria-labelledby="start-title">
        <div className="wrap g12" style={{ rowGap: 56 }}>
          <div className="s12"><Head id="start-title" title={s.start?.title} label={lStart} /></div>
          <div className="s12 g12 rv d1" style={{ alignItems: "start", borderTop: "1px solid var(--midnight-900)", paddingTop: 32, marginTop: -16 }}>
            <div className="s4 stack" style={{ paddingRight: 24 }}>
              <p className="h3">{d.name}</p>
              <p className="lbl ink">Fixed fee · {diagnosticOffer?.time}</p>
              <p>You get {d.youGet.charAt(0).toLowerCase() + d.youGet.slice(1)}.</p>
              {diagnosticOffer ? <Link className="btn btn-primary" href={diagnosticOffer.cta.href} style={{ alignSelf: "flex-start", marginTop: 8 }}>{diagnosticOffer.cta.label}</Link> : null}
            </div>
            <div className="s8 stack" style={{ gap: 14 }}>
              <div className="dg" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i} className={i === 0 || i === 9 ? "r" : ""} />)}</div>
              {home.startLabels.length ? <p className="dgl lbl">{home.startLabels.map((l) => <span key={l}>{l}</span>)}</p> : null}
            </div>
          </div>
          <nav className="s12 rv d2" aria-label="Services">
            {families.map((p) => (
              <Link key={p.slug} className="fx" href={`/what-we-do/${p.slug}`}>
                <span className="h3">{p.label}</span>
                <span className="small">{p.sub} <span className="muted">{p.ledBy ? p.ledBy.charAt(0).toUpperCase() + p.ledBy.slice(1) : p.ledByPeople.map((x) => x.name).join(", ")}</span></span>
                <span className="lbl ink" aria-hidden="true">▸</span>
              </Link>
            ))}
            {home.aiNote ? <p className="small muted" style={{ marginTop: 16 }}>{home.aiNote}</p> : null}
          </nav>
        </div>
      </section>

      <section className="sec t-creme" data-sec="founders" id="founders" aria-labelledby="founders-title">
        <div className="wrap"><Founders id="founders-title" title={s.founders?.title} label={lFounders} people={home.people} /></div>
      </section>

    </div>
    <CTABand label={s.cta?.label} />
    </>
  );
}

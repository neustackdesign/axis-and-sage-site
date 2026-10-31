import type { Metadata } from "next";
import Link from "next/link";
import { RIBBON } from "@/components/ds/blocks";
import { CTABand } from "@/components/ds/CTABand";
import { Stages, TermsMoments } from "@/components/v26/Approach";
import { Opening } from "@/components/v26/blocks";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo";
import { getHome, getMethod, getPeople, getPractices } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMethod();
  return pageMetadata({ title: m.seo.title, absoluteTitle: true, path: "/conversion-design", description: m.seo.description });
}

export default async function ConversionDesignPage() {
  const [m, people, practices, home] = await Promise.all([getMethod(), getPeople(), getPractices(), getHome()]);
  const readout = m.example.readout;
  const families = practices.filter((p) => p.section === "whatWeDo");
  const leads = (practice: (typeof families)[number], slug: string) =>
    practice.ledByPeople.length > 1 ? "Both" : practice.ledByPeople.some((x) => x.slug === slug) ? "Leads" : "";

  return (
    <>
    <div className="v26">
      <Breadcrumbs trail={[{ name: "Conversion Design", path: "/conversion-design" }]} />
      <JsonLd data={faqLd(m.faqs)} />
      <Opening label={m.hero.label} title={m.hero.title} sub={m.hero.sub} />

      {m.halves ? (
        <section className="sec" data-sec="halves" aria-label={m.halves.label}>
          <div className="wrap"><TermsMoments halves={m.halves} ribbon={RIBBON} /></div>
        </section>
      ) : null}

      {readout ? (
        <section className="sec t-mid" data-sec="stages" aria-label="How we work">
          <div className="wrap">
            <Stages steps={m.methodStepsExpanded} r={readout} label={m.stagesLabel}>
              <Link href={`/work/${readout.slug}`} className="inset lite">
                <span className="stack" style={{ gap: 4 }}><span className="lbl">Inspect the proof</span><span className="h3" style={{ fontSize: "1.375rem" }}>{m.example.caseLinkLabel ?? readout.name}</span></span>
                <span className="stat s" aria-hidden="true">→</span>
              </Link>
            </Stages>
          </div>
        </section>
      ) : null}

      {m.why ? (
        <section className="sec t-lilac" data-sec="why" id="why" aria-labelledby="why-title">
          <div className="wrap"><p className="lbl ink rv">{m.why.label}</p><h2 id="why-title" className="disp rv d1" style={{ marginTop: 20, maxWidth: "13em" }}>{m.why.title}</h2></div>
        </section>
      ) : null}

      <section className="sec t-creme" data-sec="people" aria-label="The founders">
        <div className="wrap g12" style={{ rowGap: 40 }}>
          {people.map((p, i) => (
            <div key={p.slug} className={`s4 stack rv d${i + 1}`} style={{ gap: 12 }}>
              <div className="pf">{p.portrait ? <img src={p.portrait} alt={`Portrait of ${p.name}`} loading="lazy" /> : <span className="mono" role="img" aria-label={`${p.name}, initials`}>{p.initials}</span>}</div>
              <h3 className="h3"><Link href={`/people/${p.slug}`}>{p.name}</Link></h3>
              <p className="small">{p.line}</p>
            </div>
          ))}
          <div className="s4 rv d3" style={{ alignSelf: "end" }}>
            <table className="resp">
              <thead><tr><th scope="col">Family</th>{people.map((p) => <th key={p.slug} scope="col">{p.name.split(" ")[0]}</th>)}</tr></thead>
              <tbody>
                {families.map((f) => (
                  <tr key={f.slug}><th scope="row" style={{ fontFamily: "var(--font-sans)", fontSize: "0.9375rem", letterSpacing: 0, textTransform: "none", fontWeight: 400 }}>{f.label}</th>
                    {people.map((p) => { const v = leads(f, p.slug); return <td key={p.slug} className={v ? "on" : ""}>{v || "–"}</td>; })}</tr>
                ))}
              </tbody>
            </table>
            {home.foundersNote ? <p className="small" style={{ marginTop: 16 }}>{home.foundersNote}</p> : null}
          </div>
          <div className="s12 g12" style={{ paddingTop: 20, borderTop: "1px solid var(--brown-800)" }}>
            {people.map((p) => <p key={p.slug} className="s4 small">{[p.credentialLine, p.education].filter(Boolean).join(" ")}</p>)}
            {m.closingLine ? <p className="s4 small">{m.closingLine}</p> : null}
          </div>
        </div>
      </section>

      {m.faqs.length ? (
        <section className="sec" data-sec="faq" aria-labelledby="faq-title">
          <div className="wrap g12">
            <div className="s4"><h2 id="faq-title" className="h2 xs rv">{m.sections.faq?.title}</h2></div>
            <ul className="s8 faq-list rv d1">
              {m.faqs.map((f) => <li key={f.q}><details><summary>{f.q}</summary><p>{f.a}</p></details></li>)}
            </ul>
          </div>
        </section>
      ) : null}

    </div>
    <CTABand />
    </>
  );
}

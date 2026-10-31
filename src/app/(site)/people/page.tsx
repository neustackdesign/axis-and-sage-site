import { CTABand } from "@/components/ds/CTABand";
import { PageHero } from "@/components/ds/PageHero";
import Link from "next/link";
import { Eyebrow, Section } from "@/components/ds/primitives";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getPeople, getSitePage } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("people");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/people", description: p.seo.description });
}

// Named specialists join this page once they're confirmed. The block hides while the list is empty.
const specialists: { name: string; role: string }[] = [];

export default async function PeoplePage() {
  const [page, people] = await Promise.all([getSitePage("people"), getPeople()]);
  return (
    <>
      <Breadcrumbs trail={[{ name: "People", path: "/people" }]} />
      <PageHero label={page.hero.label} title={page.hero.title} sub={page.hero.sub} />
      {/* Equal presence: both founders in one chapter, the same field and weight, side by side. */}
      <div className="v26">
        <section className="sec t-creme" data-sec="founders" aria-label="The founders">
          <div className="wrap g12" style={{ rowGap: 56 }}>
            {people.map((p, i) => (
              <article key={p.slug} className={`s6 stack rv d${i + 1}`} style={{ gap: 20 }} aria-labelledby={`${p.slug}-name`}>
                <div className="pf" style={{ maxWidth: "26rem" }}>{p.portrait ? <img src={p.portrait} alt={`Portrait of ${p.name}`} loading="lazy" /> : <span className="mono" role="img" aria-label={`${p.name}, initials`}>{p.initials}</span>}</div>
                <p className="lbl">{String(i + 1).padStart(2, "0")} · {p.half === "terms" ? "Terms" : "Moments"} · {p.practice}</p>
                <div>
                  <h2 id={`${p.slug}-name`} className="h2 s">{p.name}</h2>
                  <p className="small" style={{ marginTop: 8 }}>{p.title}</p>
                </div>
                <p className="h3">{p.line}</p>
                <p className="lead" style={{ maxWidth: "34em" }}>{p.cardBody}</p>
                <Link className="tl more" href={`/people/${p.slug}`}>{p.name.split(" ")[0]}&apos;s profile</Link>
              </article>
            ))}
          </div>
        </section>
      </div>
      {specialists.length ? (
        <Section labelledBy="specialists-title">
          <div className="section-header">
            <div>
              <h2 id="specialists-title" className="t-h2">{page.sectionMap.specialists?.title}</h2>
              <ul className="spec-list" style={{ marginTop: 32 }}>{specialists.map((s, k) => <li key={s.name}><span className="t-label">{String(k + 1).padStart(2, "0")}</span><span><strong>{s.name}</strong> · {s.role}</span></li>)}</ul>
            </div>
            <div className="section-header-rail"><Eyebrow strong>{page.sectionMap.specialists?.label}</Eyebrow></div>
          </div>
        </Section>
      ) : null}
      <CTABand />
    </>
  );
}

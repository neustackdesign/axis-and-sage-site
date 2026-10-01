import { CTABand } from "@/components/ds/CTABand";
import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Portrait, Section, TextLink } from "@/components/ds/primitives";
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
      {people.map((p, i) => (
        <Section key={p.slug} tone={p.half === "moments" ? "charcoal" : "paper"} labelledBy={`${p.slug}-name`}>
          <div className="person-row">
            <Portrait alt={p.name} initials={p.initials} dark={p.half === "moments"} src={p.portrait} />
            <div className="stack-24">
              <Eyebrow>{String(i + 1).padStart(2, "0")} · {p.half === "terms" ? "TERMS" : "MOMENTS"}</Eyebrow>
              <div>
                <h2 id={`${p.slug}-name`} className="t-h2">{p.name}</h2>
                <p className="muted" style={{ marginTop: 8 }}>{p.title}</p>
                <p className="t-label muted" style={{ marginTop: 6 }}>{p.practice.toUpperCase()}</p>
              </div>
              <p className="founder-line">{p.line}</p>
              <div className="prose stack-16">{p.bioParagraphs.map((para) => <p key={para}>{para}</p>)}</div>
              <TextLink href={`/people/${p.slug}`}>{p.name.split(" ")[0]}&apos;s profile</TextLink>
            </div>
          </div>
        </Section>
      ))}
      {specialists.length ? (
        <Section labelledBy="specialists-title">
          <div className="section-header rail-grid">
            <Eyebrow strong>{page.sectionMap.specialists?.label}</Eyebrow>
            <div>
              <h2 id="specialists-title" className="t-h2">{page.sectionMap.specialists?.title}</h2>
              <ul className="spec-list" style={{ marginTop: 32 }}>{specialists.map((s, k) => <li key={s.name}><span className="t-label">{String(k + 1).padStart(2, "0")}</span><span><strong>{s.name}</strong> · {s.role}</span></li>)}</ul>
            </div>
          </div>
        </Section>
      ) : null}
      <CTABand />
    </>
  );
}

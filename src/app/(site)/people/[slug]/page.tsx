import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/ds/CTABand";
import { SpecList, WorkCard } from "@/components/ds/blocks";
import { Eyebrow, Portrait, RailBody, Section, SectionHeader, SmartLink } from "@/components/ds/primitives";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { personLd } from "@/lib/seo";
import { getPeople, getPerson } from "@/sanity/load";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)
export async function generateStaticParams() { return (await getPeople()).map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPerson((await params).slug);
  if (!p) return {};
  return pageMetadata({ title: p.seo.title ?? p.name, absoluteTitle: !!p.seo.title, path: `/people/${p.slug}`, description: p.seo.description ?? `${p.name}, ${p.title}, ${p.practice}. ${p.line}` });
}

export default async function PersonPage({ params }: Props) {
  const p = await getPerson((await params).slug);
  if (!p) notFound();
  const moments = p.half === "moments";
  const work = p.relatedWork;
  const facts = [p.extra, p.education ? { label: "Education", value: p.education } : null, p.basedIn ? { label: "Based in", value: p.basedIn } : null].filter((f) => !!f);
  return (
    <>
      <Breadcrumbs trail={[{ name: "People", path: "/people" }, { name: p.name, path: `/people/${p.slug}` }]} />
      <JsonLd data={personLd(p)} />
      <section className="tone-paper" aria-labelledby="page-title">
        <div className="wrap page-hero">
          <div className="profile-hero">
            <Portrait alt={p.name} initials={p.initials} dark={moments} src={p.portrait} />
            <div>
              <Eyebrow strong>PEOPLE · {moments ? "MOMENTS" : "TERMS"}</Eyebrow>
              <h1 id="page-title" className="t-display reveal" style={{ marginTop: 20 }}>{p.name}</h1>
              <p className="muted t-body-l" style={{ marginTop: 12 }}>{p.title}</p>
              <p className="t-label muted" style={{ marginTop: 6 }}>{p.practice.toUpperCase()}</p>
              <p className="founder-line" style={{ marginTop: 32 }}>{p.line}</p>
              <div className="page-hero-meta">
                {p.links.filter((l) => l.href).map((l) => <SmartLink key={l.label} className="text-link" href={l.href}>{l.label}<span className="text-link-arrow" aria-hidden="true">▸</span></SmartLink>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section labelledBy="bio-title">
        <SectionHeader id="bio-title" label="01 · BIOGRAPHY" title={p.line}>
          <div className="stack-16" style={{ marginTop: 24, maxWidth: 760 }}>{p.bioParagraphs.map((para) => <p key={para} className="t-body-l">{para}</p>)}</div>
        </SectionHeader>
      </Section>

      <Section labelledBy="selected-title">
        <SectionHeader id="selected-title" label="02 · SELECTED WORK" title="Selected work." />
        <RailBody><SpecList items={p.selectedWork} /></RailBody>
      </Section>

      <Section tone="alt" labelledBy="facts-title">
        <h2 id="facts-title" className="sr-only">Background</h2>
        <div className="spec-grid" style={{ ["--cols" as string]: facts.length }}>
          {facts.map((f, i) => <div className="spec-cell" key={f.label}><div className="spec-cell-head t-label"><span>{f.label.toUpperCase()}</span><span>{String(i + 1).padStart(2, "0")}</span></div><div className="spec-cell-value">{f.value}</div></div>)}
        </div>
      </Section>

      {work.length ? (
        <Section labelledBy="work-title">
          <SectionHeader id="work-title" label="03 · IN THE WORK INDEX" title="Related work." />
          <RailBody full><div className="work-grid">{work.map((w) => <WorkCard key={w.slug} item={w} />)}</div></RailBody>
        </Section>
      ) : null}

      <CTABand />
    </>
  );
}

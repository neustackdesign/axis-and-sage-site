import type { Metadata } from "next";
import { Suspense } from "react";
import { CTABand } from "@/components/ds/CTABand";
import { WorkCard } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { Section } from "@/components/ds/primitives";
import { WorkFilter } from "@/components/sections/WorkFilter";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getSitePage, getWorkIndex } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("work");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/work", description: p.seo.description });
}

export default async function WorkPage() {
  const [p, work] = await Promise.all([getSitePage("work"), getWorkIndex()]);
  return (
    <>
      <Breadcrumbs trail={[{ name: "Work", path: "/work" }]} />
      <PageHero label={p.hero.label} title={p.hero.title} sub={p.hero.sub} />
      <Section tight labelledBy="work-grid-title">
        <h2 id="work-grid-title" className="sr-only">All work</h2>
        <Suspense fallback={<div className="work-grid">{work.map((w) => <WorkCard key={w.slug} item={w} />)}</div>}>
          <WorkFilter items={work} />
        </Suspense>
      </Section>
      <CTABand />
    </>
  );
}

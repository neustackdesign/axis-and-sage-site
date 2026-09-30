import { Suspense } from "react";
import { CTABand } from "@/components/ds/CTABand";
import { WorkCard } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { Section } from "@/components/ds/primitives";
import { WorkFilter } from "@/components/sections/WorkFilter";
import { workIndex } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Work",
  path: "/work",
  description: "Work by Axis & Sage and its founders. Every case is tagged with our role: founded, ran, built, advised or embedded.",
});

export default function WorkPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Work", path: "/work" }]} />
      <PageHero label="WORK" title="Who needed to act, and what moved." sub="Work by Axis & Sage and its founders. Every case is tagged with our role: founded, ran, built, advised or embedded." />
      <Section tight labelledBy="work-grid-title">
        <h2 id="work-grid-title" className="sr-only">All work</h2>
        <Suspense fallback={<div className="work-grid">{workIndex.map((w) => <WorkCard key={w.slug} item={w} />)}</div>}>
          <WorkFilter items={workIndex} />
        </Suspense>
      </Section>
      <CTABand />
    </>
  );
}

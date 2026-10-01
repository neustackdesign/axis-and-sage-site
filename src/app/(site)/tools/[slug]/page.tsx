import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CTABand } from "@/components/ds/CTABand";
import { PageHero } from "@/components/ds/PageHero";
import { DeckOutline } from "@/components/tools/DeckOutline";
import { DoaBuilder } from "@/components/tools/DoaBuilder";
import { EsopCalculator } from "@/components/tools/EsopCalculator";
import { LiftCalculator } from "@/components/tools/LiftCalculator";
import { ReadinessScore } from "@/components/tools/ReadinessScore";
import { Scorecard } from "@/components/tools/Scorecard";
import { ScorecardEntry } from "@/components/tools/ScorecardEntry";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { webApplicationLd } from "@/lib/seo";
import { getCaseList, getEngagements, getTool, getTools } from "@/sanity/load";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)
export async function generateStaticParams() { return (await getTools()).map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = await getTool((await params).slug);
  if (!t) return {};
  return pageMetadata({ title: t.seo.title ?? t.title, absoluteTitle: !!t.seo.title, path: `/tools/${t.slug}`, description: t.seo.description ?? t.line });
}

/** The calculators, formulas and scoring stay in code. Sanity holds each tool's editorial copy. */
async function ToolBody({ slug }: { slug: string }) {
  switch (slug) {
    case "conversion-scorecard": {
      const cases = (await getCaseList()).map(({ slug: s, name }) => ({ slug: s, name }));
      return <Suspense fallback={<Scorecard cases={cases} />}><ScorecardEntry cases={cases} /></Suspense>;
    }
    case "conversion-value-calculator": {
      const { diagnostic } = await getEngagements();
      return <LiftCalculator diagnosticPrices={[diagnostic.price, ...(diagnostic.uaePrice ? [diagnostic.uaePrice] : [])]} />;
    }
    case "delegation-of-authority-builder": return <DoaBuilder />;
    case "esop-calculator": return <EsopCalculator />;
    case "investor-readiness-score": return <ReadinessScore />;
    case "pitch-deck-outline": {
      const { specialists } = await getEngagements();
      const sprint = specialists.find((s) => s.slug === "investor-readiness-sprint");
      return <DeckOutline sprint={sprint} />;
    }
    default: return null;
  }
}

export default async function ToolPage({ params }: Props) {
  const t = await getTool((await params).slug);
  if (!t) notFound();
  return (
    <>
      <Breadcrumbs trail={[{ name: "Library", path: "/library" }, { name: t.title, path: `/tools/${t.slug}` }]} />
      <JsonLd data={webApplicationLd(t)} />
      <PageHero label={`FREE TOOL · ${t.kind}`} title={t.title} sub={t.line} />
      <section className="tool-section" aria-label={t.title}>
        <div className="wrap">
          <ToolBody slug={t.slug} />
          {t.instructions ? <p className="tool-note" style={{ marginTop: 32, maxWidth: 680 }}>{t.instructions}</p> : null}
        </div>
      </section>
      <CTABand />
    </>
  );
}

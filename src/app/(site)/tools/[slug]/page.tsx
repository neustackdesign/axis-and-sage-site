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
import { toolBySlug, tools } from "@/content/library";
import { TOOL_DRAFT_NOTE } from "@/content/tools";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return tools.map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = toolBySlug((await params).slug);
  if (!t) return {};
  return pageMetadata({ title: t.title, path: `/tools/${t.slug}`, description: t.line });
}

const components: Record<string, React.ReactNode> = {
  "conversion-scorecard": <Suspense fallback={<Scorecard />}><ScorecardEntry /></Suspense>,
  "conversion-value-calculator": <LiftCalculator />,
  "delegation-of-authority-builder": <DoaBuilder />,
  "esop-calculator": <EsopCalculator />,
  "investor-readiness-score": <ReadinessScore />,
  "pitch-deck-outline": <DeckOutline />,
};

export default async function ToolPage({ params }: Props) {
  const t = toolBySlug((await params).slug);
  if (!t) notFound();
  return (
    <>
      <PageHero label={`FREE TOOL · ${t.kind}`} title={t.title} sub={t.line} />
      <section className="tool-section" aria-label={t.title}>
        <div className="wrap">
          {components[t.slug]}
          <p className="tool-draft t-label">{TOOL_DRAFT_NOTE}</p>
          <p className="tool-note" style={{ marginTop: 8, maxWidth: 680 }}>No sign-up to use it. Leave an email only if you want the full model or a copy of your results.</p>
        </div>
      </section>
      <CTABand />
    </>
  );
}

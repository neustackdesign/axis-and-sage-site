import type { Metadata } from "next";
import { CTABand } from "@/components/ds/CTABand";
import { DayTimeline, Faq, PathGrid } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { RailBody, Section, SectionHeader, TextLink } from "@/components/ds/primitives";
import { pageMetadata } from "@/lib/metadata";
import { diagnosticGuideHref } from "@/lib/routes";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo";
import { getEngagements, getFaqs, getSitePage } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("engagements");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/engagements", description: p.seo.description });
}

const label = (n: number, text?: string) => `${String(n).padStart(2, "0")} · ${text ?? ""}`;

export default async function EngagementsPage() {
  const [p, e, faqs] = await Promise.all([getSitePage("engagements"), getEngagements(), getFaqs("engagements")]);
  const s = p.sectionMap;
  return (
    <>
      <Breadcrumbs trail={[{ name: "Engagements and pricing", path: "/engagements" }]} />
      <JsonLd data={faqLd(faqs)} />
      <PageHero label={p.hero.label} title={p.hero.title} sub={p.hero.sub} />

      {/* Three paths: Diagnose, Deliver, Partner. Specialist offers sit inside their path as variants. */}
      <Section tight labelledBy="paths-title">
        <h2 id="paths-title" className="sr-only">Three ways to work with us</h2>
        <PathGrid paths={e.paths.map((x) => ({ ...s[x.key], ...x }))} detail />
      </Section>

      {/* The recommended rung in full: days, fee and credit, said once. */}
      <Section id="fee" tone="midnight" labelledBy="diag-title">
        <SectionHeader id="diag-title" label={label(1, s.diagnostic?.label)} title={s.diagnostic?.title}>
          <p className="t-body-l muted" style={{ marginTop: 24, maxWidth: "45rem" }}>{e.diagnostic.feeExplainer}</p>
          <p className="t-body-l" style={{ marginTop: 16, maxWidth: "45rem" }}>{e.diagnostic.priceText}. {e.diagnostic.creditRule}</p>
        </SectionHeader>
        <RailBody full><DayTimeline days={e.diagnostic.days} /></RailBody>
        <RailBody><p><TextLink href={diagnosticGuideHref}>{p.strings.guideLink ?? "Read the guide"}</TextLink></p></RailBody>
      </Section>

      <Section labelledBy="faq-title">
        <SectionHeader id="faq-title" label={label(2, s.faq?.label)} title={s.faq?.title} />
        <RailBody><Faq items={faqs} /></RailBody>
      </Section>

      <CTABand />
    </>
  );
}

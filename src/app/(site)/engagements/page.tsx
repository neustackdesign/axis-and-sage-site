import type { Metadata } from "next";
import { CTABand } from "@/components/ds/CTABand";
import { DayTimeline, EngagementTable, Faq, SpecialistCard } from "@/components/ds/blocks";
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

      <Section tight labelledBy="table-title">
        <h2 id="table-title" className="sr-only">Engagements</h2>
        <EngagementTable columns={e.columns} />
        <p className="engagement-note">{e.diagnostic.creditRule}</p>
      </Section>

      <Section labelledBy="spec-title">
        <SectionHeader id="spec-title" label={label(1, s.specialist?.label)} title={s.specialist?.title} />
        <div className="specialist-grid" style={{ ["--cols" as string]: 3 }}>
          {e.specialists.map((sp) => <SpecialistCard key={sp.name} s={sp} cta={{ label: sp.cta?.label ?? p.strings.specialistCta ?? "Talk to us", href: sp.cta?.href ?? `/contact?engagement=${encodeURIComponent(sp.name)}` }} />)}
        </div>
      </Section>

      <Section tone="alt" labelledBy="diag-title">
        <SectionHeader id="diag-title" label={label(2, s.diagnostic?.label)} title={s.diagnostic?.title} />
        <RailBody full><DayTimeline days={e.diagnostic.days} /></RailBody>
      </Section>

      <Section labelledBy="fee-title">
        <SectionHeader id="fee-title" label={label(3, s.fee?.label)} title={s.fee?.title}>
          <p className="t-body-l muted" style={{ marginTop: 24, maxWidth: 720 }}>{e.diagnostic.feeExplainer}</p>
          <p className="t-body-l" style={{ marginTop: 16, maxWidth: 720 }}>{e.diagnostic.priceText}.</p>
          <p className="t-body-l muted" style={{ marginTop: 16, maxWidth: 720 }}>{e.diagnostic.creditRule}</p>
          <p style={{ marginTop: 24 }}><TextLink href={diagnosticGuideHref}>{p.strings.guideLink ?? "Read the guide"}</TextLink></p>
        </SectionHeader>
      </Section>

      <Section labelledBy="faq-title">
        <SectionHeader id="faq-title" label={label(4, s.faq?.label)} title={s.faq?.title} />
        <RailBody><Faq items={faqs} /></RailBody>
      </Section>

      <CTABand />
    </>
  );
}

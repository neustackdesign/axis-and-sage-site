import type { Metadata } from "next";
import { PageHero } from "@/components/ds/PageHero";
import { Section, SmartLink } from "@/components/ds/primitives";
import { pageMetadata } from "@/lib/metadata";
import { diagnosticGuideHref, scorecardHref } from "@/lib/routes";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getSitePage } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("thankYou");
  return { ...pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/thank-you", description: p.seo.description }), robots: { index: false, follow: false } };
}

export default async function ThankYouPage() {
  const p = await getSitePage("thankYou");
  const t = p.strings;
  return (
    <>
      <Breadcrumbs trail={[{ name: "Thank you", path: "/thank-you" }]} />
      <PageHero label={p.hero.label} title={p.hero.title} sub={p.hero.sub} />
      <Section tight labelledBy="next-title">
        <h2 id="next-title" className="sr-only">While you wait</h2>
        <div className="case-grid">
          <SmartLink href={scorecardHref} className="tool-card"><span className="t-label">{t.scorecardLabel}</span><span className="t-h3">{t.scorecardTitle}</span><span className="text-link" style={{ marginTop: "auto" }}>{t.scorecardLink}<span className="text-link-arrow" aria-hidden="true">▸</span></span></SmartLink>
          <SmartLink href={diagnosticGuideHref} className="tool-card"><span className="t-label">{t.guideLabel}</span><span className="t-h3">{t.guideTitle}</span><span className="text-link" style={{ marginTop: "auto" }}>{t.guideLink}<span className="text-link-arrow" aria-hidden="true">▸</span></span></SmartLink>
        </div>
      </Section>
    </>
  );
}

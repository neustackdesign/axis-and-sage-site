import type { Metadata } from "next";
import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Section, TextLink } from "@/components/ds/primitives";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getNewsletterIssues, getSettings, getSitePage } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("newsletter");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/newsletter", description: p.seo.description });
}

export default async function NewsletterPage() {
  const [p, settings, issues] = await Promise.all([getSitePage("newsletter"), getSettings(), getNewsletterIssues()]);
  return (
    <>
      <Breadcrumbs trail={[{ name: "Newsletter", path: "/newsletter" }]} />
      <PageHero label={p.hero.label} title={p.hero.title} display sub={p.hero.sub}>
        <div style={{ width: "100%", maxWidth: 560 }}><NewsletterForm primary /></div>
      </PageHero>
      <Section tone="alt" labelledBy="archive-title">
        <div className="section-header rail-grid">
          <Eyebrow strong as="div"><span id="archive-title">{p.strings.archiveLabel}</span></Eyebrow>
          {issues.length ? (
            <ol className="spec-list">{issues.map((i, k) => <li key={i.title}><span className="t-label">{String(issues.length - k).padStart(2, "0")}</span><span><TextLink href={i.href}>{i.title}</TextLink> <span className="t-label muted">· {i.publishedAt}</span></span></li>)}</ol>
          ) : (
            <div className="work-empty" style={{ borderTop: "1px solid var(--charcoal-900)", paddingTop: 24 }}>
              <p className="t-h3">{p.strings.emptyTitle}</p>
              <p className="muted">{settings.newsletter.archiveEmpty}</p>
            </div>
          )}
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { CTABand } from "@/components/ds/CTABand";
import { ToolCard } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { RailBody, Section, SectionHeader, SmartLink, TextLink } from "@/components/ds/primitives";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { TemplateRequest } from "@/components/sections/TemplateRequest";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getGuides, getSettings, getSitePage, getTemplates, getTools } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("library");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/library", description: p.seo.description });
}

const label = (n: number, text?: string) => `${String(n).padStart(2, "0")} · ${text ?? ""}`;

export default async function LibraryPage() {
  const [p, settings, tools, guides, templates] = await Promise.all([getSitePage("library"), getSettings(), getTools(), getGuides(), getTemplates()]);
  const s = p.sectionMap;
  return (
    <>
      <Breadcrumbs trail={[{ name: "Library", path: "/library" }]} />
      <PageHero label={p.hero.label} title={p.hero.title} sub={p.hero.sub} />

      <Section id="tools" tone="sage" labelledBy="tools-title">
        <SectionHeader id="tools-title" label={label(1, s.tools?.label)} title={s.tools?.title} />
        <RailBody full><div className="tool-grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></RailBody>
      </Section>

      <Section id="guides" labelledBy="guides-title">
        <SectionHeader id="guides-title" label={label(2, s.guides?.label)} title={s.guides?.title} />
        <RailBody full>
          <div className="work-grid">
            {guides.map((g) => {
              const inner = (
                <>
                  <div className="work-card-head t-label"><span>GUIDE · {g.category}</span>{g.published ? null : <span>COMING SOON</span>}</div>
                  <h3 className="t-h3">{g.title}</h3>
                  {g.published ? <span className="work-card-more" style={{ marginTop: "auto" }}>{p.strings.readGuide}</span> : <span className="work-card-line" style={{ marginTop: "auto" }}>{p.strings.comingSoon}</span>}
                </>
              );
              return g.published ? <SmartLink key={g.slug} href={`/guides/${g.slug}`} className="work-card">{inner}</SmartLink> : <article key={g.slug} className="work-card">{inner}</article>;
            })}
          </div>
        </RailBody>
      </Section>

      {templates.length ? (
        <Section id="templates" tone="alt" labelledBy="templates-title">
          <SectionHeader id="templates-title" label={label(3, s.templates?.label)} title={s.templates?.title} lede={s.templates?.intro} />
          <RailBody><TemplateRequest templates={templates} /></RailBody>
        </Section>
      ) : null}

      <Section id="newsletter" labelledBy="news-title">
        <div className="newsletter-inline">
          <div>
            <p className="t-label muted">{label(templates.length ? 4 : 3, s.newsletter?.label)}</p>
            <h2 id="news-title" className="t-h2" style={{ marginTop: 12 }}>{settings.newsletter.name}</h2>
            <p className="muted" style={{ marginTop: 8 }}>{settings.newsletter.line}</p>
            <p style={{ marginTop: 16 }}><TextLink href="/newsletter">{p.strings.archiveLink}</TextLink></p>
          </div>
          <NewsletterForm />
        </div>
      </Section>

      <CTABand />
    </>
  );
}

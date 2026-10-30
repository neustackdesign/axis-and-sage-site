import type { Metadata } from "next";
import { CTABand } from "@/components/ds/CTABand";
import { ToolCard } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { RailBody, Section, SectionHeader, SmartLink } from "@/components/ds/primitives";
import { TemplateRequest } from "@/components/sections/TemplateRequest";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getGuides, getSitePage, getTemplates, getTools } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("library");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/library", description: p.seo.description });
}

const label = (n: number, text?: string) => `${String(n).padStart(2, "0")} · ${text ?? ""}`;

export default async function LibraryPage() {
  const [p, tools, guides, templates] = await Promise.all([getSitePage("library"), getTools(), getGuides(), getTemplates()]);
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
          {/* Published guides only; unpublished ones collapse into one line instead of a wall of "coming soon" cards. */}
          <div className="work-grid">
            {guides.filter((g) => g.published).map((g) => (
              <SmartLink key={g.slug} href={`/guides/${g.slug}`} className="work-card">
                <div className="work-card-head t-label"><span>GUIDE · {g.category}</span></div>
                <h3 className="t-h3">{g.title}</h3>
                <span className="work-card-more" style={{ marginTop: "auto" }}>{p.strings.readGuide}</span>
              </SmartLink>
            ))}
          </div>
          {guides.some((g) => !g.published) ? <p className="t-small muted" style={{ marginTop: 24 }}>{p.strings.comingSoon}</p> : null}
        </RailBody>
      </Section>

      {templates.length ? (
        <Section id="templates" tone="alt" labelledBy="templates-title">
          <SectionHeader id="templates-title" label={label(3, s.templates?.label)} title={s.templates?.title} lede={s.templates?.intro} />
          <RailBody><TemplateRequest templates={templates} /></RailBody>
        </Section>
      ) : null}

      <CTABand />
    </>
  );
}

import { CTABand } from "@/components/ds/CTABand";
import { ToolCard } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { RailBody, Section, SectionHeader, SmartLink, TextLink } from "@/components/ds/primitives";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { TemplateRequest } from "@/components/sections/TemplateRequest";
import { availableTemplates, guides, tools } from "@/content/library";
import { newsletter } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Library",
  path: "/library",
  description: "Free tools for the decision in front of you. Built from the frameworks we use with clients. No sign-up to use them.",
});

export default function LibraryPage() {
  return (
    <>
      <PageHero label="LIBRARY" title="Free tools for the decision in front of you." sub="Built from the frameworks we use with clients. No sign-up to use them. Leave an email only if you want the full model or a copy of your results." />

      <Section id="tools" tone="sage" labelledBy="tools-title">
        <SectionHeader id="tools-title" label="01 · TOOLS" title="Tools." />
        <RailBody full><div className="tool-grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></RailBody>
      </Section>

      <Section id="guides" labelledBy="guides-title">
        <SectionHeader id="guides-title" label="02 · GUIDES" title="Guides." />
        <RailBody full>
          <div className="work-grid">
            {guides.map((g) => {
              const inner = (
                <>
                  <div className="work-card-head t-label"><span>GUIDE · {g.category}</span>{g.published ? null : <span>COMING SOON</span>}</div>
                  <h3 className="t-h3">{g.title}</h3>
                  {g.published ? <span className="work-card-more" style={{ marginTop: "auto" }}>READ THE GUIDE ▸</span> : <span className="work-card-line" style={{ marginTop: "auto" }}>Coming soon. Subscribe to get it first.</span>}
                </>
              );
              return g.published ? <SmartLink key={g.slug} href={`/guides/${g.slug}`} className="work-card">{inner}</SmartLink> : <article key={g.slug} className="work-card">{inner}</article>;
            })}
          </div>
        </RailBody>
      </Section>

      {availableTemplates.length ? (
        <Section id="templates" tone="alt" labelledBy="templates-title">
          <SectionHeader id="templates-title" label="03 · TEMPLATES" title="Templates." lede="Downloads. Leave your work email and we send you a copy." />
          <RailBody><TemplateRequest templates={availableTemplates} /></RailBody>
        </Section>
      ) : null}

      <Section id="newsletter" labelledBy="news-title">
        <div className="newsletter-inline">
          <div>
            <p className="t-label muted">{availableTemplates.length ? "04" : "03"} · NEWSLETTER</p>
            <h2 id="news-title" className="t-h2" style={{ marginTop: 12 }}>{newsletter.name}</h2>
            <p className="muted" style={{ marginTop: 8 }}>{newsletter.line}</p>
            <p style={{ marginTop: 16 }}><TextLink href="/newsletter">The archive</TextLink></p>
          </div>
          <NewsletterForm />
        </div>
      </Section>

      <CTABand />
    </>
  );
}

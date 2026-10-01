import type { Metadata } from "next";
import { CTABand } from "@/components/ds/CTABand";
import { CaseCard, EngagementTable, LogoStrip, SpecialistCard, StatGrid, StatTile, Testimonial, ToolCard } from "@/components/ds/blocks";
import { PlaneStack } from "@/components/ds/method";
import { HomepageHero } from "@/components/sections/HomepageHero";
import { Eyebrow, Glyph, RailBody, Section, SectionHeader, TextLink } from "@/components/ds/primitives";
import { FounderCards } from "@/components/sections/FounderCards";
import { MethodSentencePanel } from "@/components/sections/MethodSentencePanel";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getEngagements, getHome, getMethod, getTools } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome();
  return pageMetadata({ title: home.seo.title, absoluteTitle: true, path: "/", description: home.seo.description });
}

/** "01 · THE GAP": sections are numbered in order of appearance. */
const label = (n: number, text?: string) => `${String(n).padStart(2, "0")} · ${text ?? ""}`;

export default async function HomePage() {
  const [home, method, engagements, tools] = await Promise.all([getHome(), getMethod(), getEngagements(), getTools()]);
  const s = home.sections;
  return (
    <>
      <Breadcrumbs trail={[]} />
      {/* 1 · Hero: one cover, with the navigation inside it */}
      <HomepageHero home={home} />

      {/* 2 · LogoStrip */}
      <Section tight labelledBy="logos-title">
        <div className="rail-grid" style={{ alignItems: "center" }}>
          <Eyebrow strong as="div"><span id="logos-title">{home.logoStrip.label}</span></Eyebrow>
          <LogoStrip names={home.logoStrip.names} />
        </div>
      </Section>

      {/* 3 · The gap */}
      <Section labelledBy="gap-title">
        <SectionHeader id="gap-title" label={label(1, s.gap?.label)} title={s.gap?.title}>
          {s.gap?.intro ? <p className="t-body-l muted" style={{ marginTop: 24, maxWidth: 720 }}>{s.gap.intro}</p> : null}
        </SectionHeader>
        <RailBody full>
          <ul className="gap-grid">
            {home.gapCards.map((c) => <li className="gap-card" key={c.text}><Glyph name={c.glyph} /><p>{c.text}</p></li>)}
          </ul>
        </RailBody>
      </Section>

      {/* 4 · Conversion Design */}
      <Section tone="alt" labelledBy="cd-title">
        <SectionHeader id="cd-title" label={label(2, s.conversionDesign?.label)} title={s.conversionDesign?.title}>
          {s.conversionDesign?.intro ? <p className="t-body-l muted" style={{ marginTop: 24, maxWidth: 760 }}>{s.conversionDesign.intro}</p> : null}
        </SectionHeader>
        <RailBody>
          <MethodSentencePanel rows={method.sentenceRows} />
        </RailBody>
        <RailBody>
          <PlaneStack steps={method.methodSteps} />
          <p style={{ marginTop: 32 }}><TextLink href="/conversion-design">{home.conversionLinkLabel}</TextLink></p>
        </RailBody>
      </Section>

      {/* 5 · The founders */}
      <Section labelledBy="founders-title">
        <SectionHeader id="founders-title" label={label(3, s.founders?.label)} title={s.founders?.title} />
        <RailBody full>
          <FounderCards people={home.people} />
          <p className="founders-note">{home.foundersNote}</p>
        </RailBody>
      </Section>

      {/* 6 · What moved (charcoal) */}
      <Section tone="charcoal" labelledBy="moved-title">
        <SectionHeader id="moved-title" label={label(4, s.moved?.label)} title={s.moved?.title} />
        <RailBody full>
          <StatGrid cols={4}>
            {home.stats.map((stat, i) => <StatTile key={stat.numeral} stat={stat} wide={i === 1} />)}
          </StatGrid>
          <p className="stat-grid-note t-label">{home.statsSource}</p>
        </RailBody>
      </Section>

      {/* 7 · Selected work: exactly the six chosen in Sanity, in order */}
      <Section labelledBy="work-title">
        <SectionHeader id="work-title" label={label(5, s.work?.label)} title={s.work?.title} />
        <RailBody full>
          <div className="case-grid">
            {home.selectedWork.map((c, i) => <CaseCard key={c.slug} item={c} index={i + 1} href={`/work/${c.slug}`} />)}
          </div>
          <p style={{ marginTop: 32 }}><TextLink href="/work">All work</TextLink></p>
        </RailBody>
      </Section>

      {/* 8 · Testimonials */}
      <Section tight labelledBy="said-title">
        <h2 id="said-title" className="sr-only">What clients say</h2>
        <div className="testimonial-grid">{home.testimonials.map((t) => <Testimonial key={t.name} t={t} />)}</div>
      </Section>

      {/* 9 · How to start */}
      <Section labelledBy="start-title">
        <SectionHeader id="start-title" label={label(6, s.start?.label)} title={s.start?.title} />
        <RailBody full>
          <EngagementTable columns={engagements.columns} />
          <p className="engagement-note">{engagements.diagnostic.creditRule}</p>
          {/* The homepage shows the first two specialist engagements; the Engagements page lists them all. */}
          <div className="specialist-grid">{engagements.specialists.slice(0, 2).map((sp) => <SpecialistCard key={sp.name} s={sp} />)}</div>
          <p style={{ marginTop: 32 }}><TextLink href="/engagements">Engagements and pricing</TextLink></p>
        </RailBody>
      </Section>

      {/* 10 · Library teaser (sage) */}
      <Section tone="sage" labelledBy="library-title">
        <SectionHeader id="library-title" label={label(7, s.library?.label)} title={s.library?.title} />
        <RailBody full>
          <div className="tool-grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </RailBody>
      </Section>

      {/* 11 · CTABand.Orange */}
      <CTABand />
    </>
  );
}

import { CTABand } from "@/components/ds/CTABand";
import { CaseCard, EngagementTable, LogoStrip, SpecialistCard, StatGrid, StatTile, Testimonial, ToolCard } from "@/components/ds/blocks";
import { PlaneStack } from "@/components/ds/method";
import { HomepageHero } from "@/components/sections/HomepageHero";
import { Eyebrow, Glyph, RailBody, Section, SectionHeader, TextLink } from "@/components/ds/primitives";
import { FounderCards } from "@/components/sections/FounderCards";
import { MethodSentencePanel } from "@/components/sections/MethodSentencePanel";
import { diagnosticCreditNote, engagements, specialistCards } from "@/content/engagements";
import { tools } from "@/content/library";
import { gapCards, methodSteps } from "@/content/method";
import { homeStats, homeStatsSource, homeTestimonials, logoStrip, selectedWork } from "@/content/work";
import { pageTitles } from "@/content/titles";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({ title: pageTitles.home.title, absoluteTitle: true, path: "/", description: pageTitles.home.description });

export default function HomePage() {
  return (
    <>
      <Breadcrumbs trail={[]} />
      {/* 1 · Hero: one cover, with the navigation inside it */}
      <HomepageHero />

      {/* 2 · LogoStrip */}
      <Section tight labelledBy="logos-title">
        <div className="rail-grid" style={{ alignItems: "center" }}>
          <Eyebrow strong as="div"><span id="logos-title">WORK BY AXIS &amp; SAGE AND ITS FOUNDERS</span></Eyebrow>
          <LogoStrip names={logoStrip} />
        </div>
      </Section>

      {/* 3 · The gap */}
      <Section labelledBy="gap-title">
        <SectionHeader id="gap-title" label="01 · THE GAP" title={<>Growth stalls in the gap between what a business decides, what it builds and what it says.</>}>
          <p className="t-body-l muted" style={{ marginTop: 24, maxWidth: 720 }}>A board approves a new structure and managers keep deciding the old way. A product launches and customers stop at the payment screen. A raise opens and investors take the meeting, then go quiet. The decision was sound. The action never happened.</p>
        </SectionHeader>
        <RailBody full>
          <ul className="gap-grid">
            {gapCards.map((c) => <li className="gap-card" key={c.text}><Glyph name={c.glyph} /><p>{c.text}</p></li>)}
          </ul>
        </RailBody>
      </Section>

      {/* 4 · Conversion Design */}
      <Section tone="alt" labelledBy="cd-title">
        <SectionHeader id="cd-title" label="02 · CONVERSION DESIGN" title="A conversion is the action your business needs from someone. It isn't always a sale.">
          <p className="t-body-l muted" style={{ marginTop: 24, maxWidth: 760 }}>Conversion Design starts with that action and works backwards. People act when two things are true: the terms are right and the moment is clear. Terms are what&apos;s on offer and who decides: the price, the equity, the incentive, the authority. Moments are where the decision happens: the pitch, the screen, the conversation, the form. We design both.</p>
        </SectionHeader>
        <RailBody>
          <MethodSentencePanel />
        </RailBody>
        <RailBody>
          <PlaneStack steps={methodSteps} />
          <p style={{ marginTop: 32 }}><TextLink href="/conversion-design">How Conversion Design works</TextLink></p>
        </RailBody>
      </Section>

      {/* 5 · The founders */}
      <Section labelledBy="founders-title">
        <SectionHeader id="founders-title" label="03 · THE FOUNDERS" title="Two halves of every decision." />
        <RailBody full>
          <FounderCards />
          <p className="founders-note">Every engagement is led by one of us, and usually both.</p>
        </RailBody>
      </Section>

      {/* 6 · What moved (charcoal) */}
      <Section tone="charcoal" labelledBy="moved-title">
        <SectionHeader id="moved-title" label="04 · WHAT MOVED" title="Founded, ran, built, advised. Here's what moved." />
        <RailBody full>
          <StatGrid cols={4}>
            {homeStats.map((s, i) => <StatTile key={s.numeral} stat={s} wide={i === 1} />)}
          </StatGrid>
          <p className="stat-grid-note t-label">{homeStatsSource}</p>
        </RailBody>
      </Section>

      {/* 7 · Selected work */}
      <Section labelledBy="work-title">
        <SectionHeader id="work-title" label="05 · SELECTED WORK" title="Who needed to act, and what changed." />
        <RailBody full>
          <div className="case-grid">
            {selectedWork.map((c, i) => <CaseCard key={c.slug} item={c} index={i + 1} href={`/work/${c.slug}`} />)}
          </div>
          <p style={{ marginTop: 32 }}><TextLink href="/work">All work</TextLink></p>
        </RailBody>
      </Section>

      {/* 8 · Testimonials */}
      <Section tight labelledBy="said-title">
        <h2 id="said-title" className="sr-only">What clients say</h2>
        <div className="testimonial-grid">{homeTestimonials.map((t) => <Testimonial key={t.name} t={t} />)}</div>
      </Section>

      {/* 9 · How to start */}
      <Section labelledBy="start-title">
        <SectionHeader id="start-title" label="06 · HOW TO START" title={<>Start with one sentence.<br />Know the price before we start.</>} />
        <RailBody full>
          <EngagementTable columns={engagements} />
          <p className="engagement-note">{diagnosticCreditNote}</p>
          <div className="specialist-grid">{specialistCards.map((s) => <SpecialistCard key={s.name} s={s} />)}</div>
          <p style={{ marginTop: 32 }}><TextLink href="/engagements">Engagements and pricing</TextLink></p>
        </RailBody>
      </Section>

      {/* 10 · Library teaser (sage) */}
      <Section tone="sage" labelledBy="library-title">
        <SectionHeader id="library-title" label="07 · LIBRARY" title="Free tools for the decision in front of you." />
        <RailBody full>
          <div className="tool-grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div>
        </RailBody>
      </Section>

      {/* 11 · CTABand.Orange */}
      <CTABand />
    </>
  );
}

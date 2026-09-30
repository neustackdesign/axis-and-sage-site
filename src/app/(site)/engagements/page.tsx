import { CTABand } from "@/components/ds/CTABand";
import { DayTimeline, EngagementTable, Faq, SpecialistCard } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { RailBody, Section, SectionHeader, TextLink } from "@/components/ds/primitives";
import { diagnosticCreditNote, diagnosticDays, diagnosticFeePays, engagements, faqs, leadershipSession, specialistCards } from "@/content/engagements";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Engagements and pricing",
  path: "/engagements",
  description: "Every engagement begins with the action you need and a fixed fee. Nothing starts without both.",
});

export default function EngagementsPage() {
  return (
    <>
      <PageHero label="ENGAGEMENTS AND PRICING" title={<>Start with one sentence.<br className="br-desktop" /> Know the price before we start.</>} sub="Every engagement begins with the action you need and a fixed fee. Nothing starts without both." />

      <Section tight labelledBy="table-title">
        <h2 id="table-title" className="sr-only">Engagements</h2>
        <EngagementTable columns={engagements} />
        <p className="engagement-note">{diagnosticCreditNote}</p>
      </Section>

      <Section labelledBy="spec-title">
        <SectionHeader id="spec-title" label="01 · SPECIALIST" title="Specialist engagements." />
        <div className="specialist-grid" style={{ ["--cols" as string]: 3 }}>
          {[...specialistCards, leadershipSession].map((s) => <SpecialistCard key={s.name} s={s} cta={{ label: "Talk to us", href: `/contact?engagement=${encodeURIComponent(s.name)}` }} />)}
        </div>
      </Section>

      <Section tone="alt" labelledBy="diag-title">
        <SectionHeader id="diag-title" label="02 · THE DIAGNOSTIC" title="What happens in the Diagnostic." />
        <RailBody full><DayTimeline days={diagnosticDays} /></RailBody>
      </Section>

      <Section labelledBy="fee-title">
        <SectionHeader id="fee-title" label="03 · THE FEE" title="What the Diagnostic fee pays for.">
          <p className="t-body-l muted" style={{ marginTop: 24, maxWidth: 720 }}>{diagnosticFeePays}</p>
          <p style={{ marginTop: 24 }}><TextLink href="/guides/what-the-conversion-diagnostic-fee-pays-for">Read the guide</TextLink></p>
        </SectionHeader>
      </Section>

      <Section labelledBy="faq-title">
        <SectionHeader id="faq-title" label="04 · QUESTIONS" title="Frequently asked questions." />
        <RailBody><Faq items={faqs} /></RailBody>
      </Section>

      <CTABand />
    </>
  );
}

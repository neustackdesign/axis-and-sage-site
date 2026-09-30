import { CTABand } from "@/components/ds/CTABand";
import { Faq, Timeline } from "@/components/ds/blocks";
import { PlaneStack } from "@/components/ds/method";
import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Glyph, RailBody, Section, SectionHeader, SmartLink } from "@/components/ds/primitives";
import { faqs } from "@/content/engagements";
import { actionCards, conversionActors, methodStepsExpanded } from "@/content/method";
import { pageTitles } from "@/content/titles";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: pageTitles.conversionDesign.title,
  absoluteTitle: true,
  path: "/conversion-design",
  description: pageTitles.conversionDesign.description,
});

export default function ConversionDesignPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Conversion Design", path: "/conversion-design" }]} />
      <JsonLd data={faqLd([faqs[0], faqs[1], faqs[2], faqs[6]])} />
      <PageHero label="THE METHOD" title="Start from the action." display sub="Conversion Design is how we get investors, partners, teams and customers to act. We name the action, find what's in the way in the terms or the moment, fix it, and measure what moved." />

      <Section labelledBy="counts-title">
        <SectionHeader id="counts-title" label="01 · WHAT COUNTS" title="A conversion is the action your business needs from someone." />
        <RailBody>
          <ul className="actor-list">
            {conversionActors.map((a) => (
              <li key={a.actor}>
                <Glyph name={a.glyph} size="sm" />
                <span className="actor-name">{a.actor}</span>
                <span className="actor-examples">{a.examples}</span>
              </li>
            ))}
          </ul>
          <p className="t-h3" style={{ marginTop: 32 }}>It isn&apos;t always a sale. It&apos;s always a person doing something.</p>
        </RailBody>
      </Section>

      <Section labelledBy="halves-title">
        <SectionHeader id="halves-title" label="02 · TERMS AND MOMENTS" title="People act when the terms are right and the moment is clear." />
        <RailBody full>
          <div className="halves">
            <div className="half half-paper">
              <Eyebrow strong>TERMS</Eyebrow>
              <Glyph name="terms" />
              <p className="t-h3">What&apos;s on offer and who decides.</p>
              <p>Price, equity, incentives, risk, authority, deal structure. Terms decide whether people <em>want</em> to act.</p>
            </div>
            <div className="half half-dark on-dark">
              <Eyebrow>MOMENTS</Eyebrow>
              <Glyph name="moment" />
              <p className="t-h3">Where the decision happens.</p>
              <p>The pitch, the screen, the form, the conversation, the timing of the ask. Moments decide whether people <em>can</em> act, and whether they&apos;re asked at the right time.</p>
            </div>
          </div>
          <p className="t-small muted" style={{ marginTop: 20, maxWidth: 720 }}>This mirrors BJ Fogg&apos;s behaviour model: people act when motivation, ability and a prompt meet. Terms supply the motivation. Moments supply the ability and the prompt.</p>
        </RailBody>
      </Section>

      <Section labelledBy="steps-title">
        <SectionHeader id="steps-title" label="03 · THE FOUR STEPS" title="The four steps." />
        <RailBody>
          <PlaneStack steps={methodStepsExpanded} />
        </RailBody>
      </Section>

      <Section tone="charcoal" labelledBy="timeline-title">
        <SectionHeader id="timeline-title" label="04 · EXAMPLE · FARMCROWDY" title="Decided: grow sponsorship on mobile." />
        <RailBody full>
          <Timeline
            label="WHAT WAS DECIDED → WHAT PEOPLE DID"
            baseline={{ value: 18, label: "BASELINE 18%" }}
            steps={[
              { when: "BEFORE", said: "Grow sponsorship on mobile", value: 18, valueLabel: "18%", did: "Baseline: 18% of first-time mobile visitors sponsored." },
              { when: "AFTER THE REDESIGN", said: "Redesign the first-time mobile sponsorship flow", value: 60, valueLabel: "60%", did: "First-time mobile sponsorship conversion: 60%.", action: true },
            ]}
            source="SOURCE: INTERNAL FUNNEL TRACKING"
          />
          <p style={{ marginTop: 24 }}><SmartLink className="text-link" href="/work/farmcrowdy">Read the Farmcrowdy case<span className="text-link-arrow" aria-hidden="true">▸</span></SmartLink></p>
        </RailBody>
      </Section>

      <Section labelledBy="cro-title">
        <div className="section-header rail-grid">
          <Eyebrow strong>05 · A COMMON QUESTION</Eyebrow>
          <div className="stack-16" style={{ maxWidth: 720 }}>
            <h3 id="cro-title" className="t-h2">Is this conversion rate optimisation?</h3>
            <p className="t-body-l muted">Conversion rate optimisation improves pages. It works on the moment. We start earlier, with the terms: the structure, the incentives and the deal that decide whether people want to act. Then we design the moment.</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="bytype-title">
        <SectionHeader id="bytype-title" label="06 · BY TYPE OF ACTION" title="By type of action." />
        <RailBody full>
          <div className="gap-grid">
            {actionCards.map((c) => (
              <SmartLink key={c.key} href={`/work?action=${c.key}`} className="gap-card action-card">
                <Glyph name={c.glyph} />
                <span className="t-h3">{c.label}</span>
                <span className="t-small muted">{c.line}</span>
                <span className="text-link" style={{ marginTop: "auto" }}>See the work<span className="text-link-arrow" aria-hidden="true">▸</span></span>
              </SmartLink>
            ))}
          </div>
        </RailBody>
      </Section>

      <Section labelledBy="faq-title">
        <SectionHeader id="faq-title" label="07 · QUESTIONS" title="Frequently asked questions." />
        <RailBody>
          <Faq items={[faqs[0], faqs[1], faqs[2], faqs[6]]} />
        </RailBody>
      </Section>

      <CTABand />
    </>
  );
}

import type { Metadata } from "next";
import { CTABand } from "@/components/ds/CTABand";
import { Faq, Timeline } from "@/components/ds/blocks";
import { PlaneStack } from "@/components/ds/method";
import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Glyph, RailBody, Section, SectionHeader, SmartLink } from "@/components/ds/primitives";
import { RichText } from "@/components/ds/RichText";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { faqLd } from "@/lib/seo";
import { getMethod } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const m = await getMethod();
  return pageMetadata({ title: m.seo.title, absoluteTitle: true, path: "/conversion-design", description: m.seo.description });
}

const label = (n: number, text?: string) => `${String(n).padStart(2, "0")} · ${text ?? ""}`;
const para = { block: { normal: ({ children }: { children?: React.ReactNode }) => <p>{children}</p> } };

export default async function ConversionDesignPage() {
  const m = await getMethod();
  const s = m.sections;
  return (
    <>
      <Breadcrumbs trail={[{ name: "Conversion Design", path: "/conversion-design" }]} />
      <JsonLd data={faqLd(m.faqs)} />
      <PageHero label={m.hero.label} title={m.hero.title} display sub={m.hero.sub} />

      <Section labelledBy="counts-title">
        <SectionHeader id="counts-title" label={label(1, s.counts?.label)} title={s.counts?.title} />
        <RailBody>
          <ul className="actor-list">
            {m.actors.map((a) => (
              <li key={a.actor}>
                <Glyph name={a.glyph} size="sm" />
                <span className="actor-name">{a.actor}</span>
                <span className="actor-examples">{a.examples}</span>
              </li>
            ))}
          </ul>
          <p className="t-h3" style={{ marginTop: 32 }}>{m.actorsClosing}</p>
        </RailBody>
      </Section>

      <Section labelledBy="halves-title">
        <SectionHeader id="halves-title" label={label(2, s.halves?.label)} title={s.halves?.title} />
        <RailBody full>
          <div className="halves">
            <div className="half half-paper">
              <Eyebrow strong>TERMS</Eyebrow>
              <Glyph name="terms" />
              <p className="t-h3">{m.terms.title}</p>
              <RichText value={m.terms.body} components={para} />
            </div>
            <div className="half half-dark on-dark">
              <Eyebrow>MOMENTS</Eyebrow>
              <Glyph name="moment" />
              <p className="t-h3">{m.moments.title}</p>
              <RichText value={m.moments.body} components={para} />
            </div>
          </div>
          <p className="t-small muted" style={{ marginTop: 20, maxWidth: 720 }}>{m.behaviourNote}</p>
        </RailBody>
      </Section>

      <Section labelledBy="steps-title">
        <SectionHeader id="steps-title" label={label(3, s.steps?.label)} title={s.steps?.title} />
        <RailBody>
          <PlaneStack steps={m.methodStepsExpanded} />
        </RailBody>
      </Section>

      <Section tone="charcoal" labelledBy="timeline-title">
        <SectionHeader id="timeline-title" label={label(4, s.example?.label)} title={s.example?.title} />
        <RailBody full>
          <Timeline
            label={m.example.timelineLabel}
            baseline={{ value: m.example.baselineValue, label: m.example.baselineLabel }}
            steps={m.example.steps.map((x) => ({ ...x, action: !!x.action }))}
            source={m.example.source}
          />
          {m.example.caseSlug ? <p style={{ marginTop: 24 }}><SmartLink className="text-link" href={`/work/${m.example.caseSlug}`}>{m.example.caseLinkLabel}<span className="text-link-arrow" aria-hidden="true">▸</span></SmartLink></p> : null}
        </RailBody>
      </Section>

      <Section labelledBy="cro-title">
        <div className="section-header rail-grid">
          <Eyebrow strong>{label(5, s.question?.label)}</Eyebrow>
          <div className="stack-16" style={{ maxWidth: 720 }}>
            <h3 id="cro-title" className="t-h2">{m.question.title}</h3>
            <p className="t-body-l muted">{m.question.body}</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="bytype-title">
        <SectionHeader id="bytype-title" label={label(6, s.byType?.label)} title={s.byType?.title} />
        <RailBody full>
          <div className="gap-grid">
            {m.actionCards.map((c) => (
              <SmartLink key={c.key} href={`/work?action=${c.key}`} className="gap-card action-card">
                <Glyph name={c.glyph} />
                <span className="t-h3">{c.label}</span>
                <span className="t-small muted">{c.line}</span>
                <span className="text-link" style={{ marginTop: "auto" }}>{m.actionCardLinkLabel}<span className="text-link-arrow" aria-hidden="true">▸</span></span>
              </SmartLink>
            ))}
          </div>
        </RailBody>
      </Section>

      <Section labelledBy="faq-title">
        <SectionHeader id="faq-title" label={label(7, s.faq?.label)} title={s.faq?.title} />
        <RailBody>
          <Faq items={m.faqs} />
        </RailBody>
      </Section>

      <CTABand />
    </>
  );
}

import { CTABand } from "@/components/ds/CTABand";
import { SpecGrid, SpecList, ToolCard, WorkCard } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { RailBody, Section, SectionHeader, SmartLink, TextLink } from "@/components/ds/primitives";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import type { Practice } from "@/lib/content/types";

/** A practice page, and the Embedded leadership page under Engagements, which shares its layout. */
export function PracticeView({ p, others: siblings, trail }: { p: Practice; others: Practice[]; trail: { name: string; path: string }[] }) {
  const leads = p.ledByPeople;
  const proof = p.proof;
  const tools = p.tools;
  const others = siblings.filter((x) => x.slug !== p.slug);
  let n = 0;
  const idx = () => String(++n).padStart(2, "0");

  return (
    <>
      <Breadcrumbs trail={trail} />
      <PageHero label={p.eyebrow} title={p.h1} display sub={p.sub}>
        {leads.length ? (
          <span className="t-small muted">Led by {p.ledBy === "both founders" ? "both founders: " : ""}{leads.map((l, i) => <span key={l.slug}>{i ? " and " : ""}<SmartLink className="text-link" href={`/people/${l.slug}`}>{l.name}</SmartLink></span>)}</span>
        ) : null}
      </PageHero>

      {p.whenToCall.length ? (
        <Section labelledBy="when-title">
          <SectionHeader id="when-title" label={`${idx()} · WHEN TO CALL US`} title="When to call us." />
          <RailBody><SpecList items={p.whenToCall.map((w) => <span key={w} className="t-body-l">{w}</span>)} /></RailBody>
        </Section>
      ) : null}

      {p.howItWorks.length ? (
        <Section labelledBy="how-title">
          <SectionHeader id="how-title" label={`${idx()} · HOW IT WORKS`} title="How it works." />
          <RailBody full><SpecGrid cols={4} cells={p.howItWorks.map((h, i) => ({ label: ["ROLE", "HOURS", "TERM", "CONTRACT"][i] || "", index: String(i + 1).padStart(2, "0"), value: h }))} /></RailBody>
        </Section>
      ) : null}

      {p.whatWeDo.length ? (
        <Section tone="alt" labelledBy="what-title">
          <SectionHeader id="what-title" label={`${idx()} · WHAT WE DO`} title="What we do." />
          <RailBody full><SpecGrid cols={4} cells={p.whatWeDo.map((w, i) => ({ label: "TYPICAL WORK", index: String(i + 1).padStart(2, "0"), value: w }))} /></RailBody>
        </Section>
      ) : null}

      {p.connects ? (
        <Section labelledBy="connects-title">
          <SectionHeader id="connects-title" label={`${idx()} · HOW IT CONNECTS`} title={p.connects}>
            <p className="button-row" style={{ marginTop: 28 }}>{others.map((o) => <TextLink key={o.slug} href={`/what-we-do/${o.slug}`}>{o.label}</TextLink>)}<TextLink href="/conversion-design">Conversion Design</TextLink></p>
          </SectionHeader>
        </Section>
      ) : null}

      <Section labelledBy="proof-title">
        <SectionHeader id="proof-title" label={`${idx()} · PROOF`} title="Proof." lede={p.proofNote} />
        <RailBody full><div className="work-grid">{proof.map((w) => <WorkCard key={w.slug} item={w} />)}</div></RailBody>
      </Section>

      {p.whenItFits ? (
        <Section labelledBy="fits-title">
          <SectionHeader id="fits-title" label={`${idx()} · WHEN IT FITS`} title={p.whenItFits}>
            <p style={{ marginTop: 28 }}><TextLink href="/contact?engagement=embedded#note">Talk to us</TextLink></p>
          </SectionHeader>
        </Section>
      ) : null}

      {tools.length ? (
        <Section tone="sage" labelledBy="tools-title">
          <SectionHeader id="tools-title" label={`${idx()} · RELATED TOOLS`} title="Related tools." />
          <RailBody full><div className="tool-grid">{tools.map((t) => <ToolCard key={t.slug} tool={t} />)}</div></RailBody>
        </Section>
      ) : null}

      <CTABand />
    </>
  );
}

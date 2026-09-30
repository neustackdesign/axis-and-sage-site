import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/ds/CTABand";
import { SpecGrid, SpecList, ToolCard, WorkCard } from "@/components/ds/blocks";
import { PageHero } from "@/components/ds/PageHero";
import { RailBody, Section, SectionHeader, SmartLink, TextLink } from "@/components/ds/primitives";
import { toolBySlug } from "@/content/library";
import { personBySlug } from "@/content/people";
import { practiceBySlug, practices } from "@/content/practices";
import { workBySlug } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ practice: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return practices.map((p) => ({ practice: p.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = practiceBySlug((await params).practice);
  if (!p) return {};
  return pageMetadata({ title: p.label, path: `/what-we-do/${p.slug}`, description: `${p.h1} ${p.sub}` });
}

export default async function PracticePage({ params }: Props) {
  const p = practiceBySlug((await params).practice);
  if (!p) notFound();
  const leads = (p.ledByPeople || []).map(personBySlug).filter((x) => !!x);
  const proof = p.proof.map(workBySlug).filter((w) => !!w);
  const tools = p.tools.map(toolBySlug).filter((t) => !!t);
  const others = practices.filter((x) => x.slug !== p.slug && x.slug !== "embedded-leadership");
  let n = 0;
  const idx = () => String(++n).padStart(2, "0");

  return (
    <>
      <PageHero label={p.eyebrow} title={p.h1} display sub={p.sub}>
        {leads.length ? (
          <span className="t-small muted">Led by {p.ledBy === "both founders" ? "both founders: " : ""}{leads.map((l, i) => <span key={l!.slug}>{i ? " and " : ""}<SmartLink className="text-link" href={`/people/${l!.slug}`}>{l!.name}</SmartLink></span>)}</span>
        ) : null}
      </PageHero>

      {p.whenToCall ? (
        <Section labelledBy="when-title">
          <SectionHeader id="when-title" label={`${idx()} · WHEN TO CALL US`} title="When to call us." />
          <RailBody><SpecList items={p.whenToCall.map((w) => <span key={w} className="t-body-l">{w}</span>)} /></RailBody>
        </Section>
      ) : null}

      {p.howItWorks ? (
        <Section labelledBy="how-title">
          <SectionHeader id="how-title" label={`${idx()} · HOW IT WORKS`} title="How it works." />
          <RailBody full><SpecGrid cols={4} cells={p.howItWorks.map((h, i) => ({ label: ["ROLE", "HOURS", "TERM", "CONTRACT"][i] || "", index: String(i + 1).padStart(2, "0"), value: h }))} /></RailBody>
        </Section>
      ) : null}

      {p.whatWeDo ? (
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
        <RailBody full><div className="work-grid">{proof.map((w) => <WorkCard key={w!.slug} item={w!} />)}</div></RailBody>
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
          <RailBody full><div className="tool-grid">{tools.map((t) => <ToolCard key={t!.slug} tool={t!} />)}</div></RailBody>
        </Section>
      ) : null}

      <CTABand />
    </>
  );
}

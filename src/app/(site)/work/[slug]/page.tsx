import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CTABand } from "@/components/ds/CTABand";
import { StatGrid, StatTile, TestimonialFeature, ToolCard } from "@/components/ds/blocks";
import { ArtifactDoc, ArtifactScreen } from "@/components/ds/method";
import { ChipRow, Eyebrow, RailBody, Section, SectionHeader, SmartLink } from "@/components/ds/primitives";
import { toolBySlug } from "@/content/library";
import { people } from "@/content/people";
import { caseBySlug, casePages, provenanceOf, type CasePage } from "@/content/work";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { articleLd } from "@/lib/seo";
import { contentDate } from "@/content/dates";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return casePages.map((c) => ({ slug: c.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = caseBySlug((await params).slug);
  if (!c) return {};
  return pageMetadata({ title: `${c.name} · Work`, path: `/work/${c.slug}`, type: "article", description: c.intro || `${c.name}: ${c.moved}` });
}

function Visuals({ c }: { c: CasePage }) {
  if (c.artifact === "farmcrowdy") {
    return (
      <div className="artifact-stage is-paper" style={{ ["--n" as string]: 3 }}>
        <ArtifactScreen kicker="Sponsor · first visit" title="Sponsor a farm" media="Farm photo" rows={[["Updates", "Text · photo · video"], ["From", "Planting to harvest"]]} action="Sponsor this farm" />
        <ArtifactScreen kicker="Farm update" title="Your farm this week" media="Video · planting" rows={[["Stage", "Planting"], ["Next", "Harvest"]]} action="See your farm" />
        <ArtifactScreen kicker="Design system" title="Sponsorship, tracking and farmer tools" rows={[["Components", "300+"]]} action="Continue" />
      </div>
    );
  }
  if (c.artifact === "mular") {
    return (
      <div className="artifact-stage is-paper" style={{ ["--n" as string]: 2 }}>
        <ArtifactScreen kicker="Send · review" title="Rate and fee, before you commit" rows={[["Rate", "Shown first"], ["Fee", "Shown first"], ["You send", "Stablecoin"], ["They get", "Naira"]]} action="Confirm transfer" />
        <ArtifactScreen kicker="Settlement" title="Where your money is" rows={[["Received", "Done"], ["Converting", "Done"], ["Paid out", "In progress"]]} action="Track transfer" />
      </div>
    );
  }
  if (c.artifact === "governance") {
    return (
      <div className="artifact-stage" style={{ ["--n" as string]: 3 }}>
        <ArtifactDoc kicker="Group · governance" title="Delegation of authority" sign="Approved · board" />
        <ArtifactDoc kicker="Board · remuneration" title="Board pay and CEO reward" sign="Approved · board" />
        <ArtifactDoc kicker="Employees · shares" title="Employee share scheme" sign="I accept these terms" />
      </div>
    );
  }
  if (c.artifact === "merger") {
    return (
      <div className="artifact-stage" style={{ ["--n" as string]: 3 }}>
        <ArtifactDoc kicker="Merger · design" title="iGate Advisory and Garden Ventures" sign="Signed · both boards" />
        <ArtifactDoc kicker="GV Solutions" title="Operating model and group interfaces" sign="Approved · board" />
        <ArtifactDoc kicker="Appointment" title="Fractional chief operating officer" sign="Sign here · COO" />
      </div>
    );
  }
  if (c.slug === "nature-roots") return <figure><img className="case-photo" src="/images/axis-sage/nature-roots-live.jpg" alt="Nature Roots packaging" loading="lazy" /></figure>;
  if (c.slug === "uganda-investor-summit") return <figure><img className="case-photo" src="/images/axis-sage/summit-live.jpg" alt="Uganda Investor Summit stage and identity" loading="lazy" /></figure>;
  return null;
}

export default async function CasePageRoute({ params }: Props) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();
  const i = casePages.findIndex((x) => x.slug === c.slug);
  const next = casePages[(i + 1) % casePages.length];
  const lead = c.ledBy ? people.find((p) => p.name === c.ledBy) : undefined;
  const hasVisuals = !!c.artifact || c.slug === "nature-roots" || c.slug === "uganda-investor-summit";
  let n = 0;
  const idx = () => String(++n).padStart(2, "0");

  return (
    <>
      <Breadcrumbs trail={[{ name: "Work", path: "/work" }, { name: c.name, path: `/work/${c.slug}` }]} />
      <JsonLd data={articleLd({ headline: c.name, description: c.intro || `${c.name}: ${c.moved}`, path: `/work/${c.slug}`, date: contentDate(`/work/${c.slug}`), authors: people.filter((p) => p.name === c.ledBy).map((p) => ({ name: p.name, path: `/people/${p.slug}` })) })} />
      <section className="tone-paper" aria-labelledby="page-title">
        <div className="wrap page-hero">
          <div className="page-hero-grid">
            <div className="stack-8">
              <Eyebrow strong>CASE</Eyebrow>
              <p className="t-label muted">{c.sector.toUpperCase()}{c.years ? ` · ${c.years}` : ""}</p>
              {provenanceOf(c.slug) ? <p className="provenance t-label">{provenanceOf(c.slug)}</p> : null}
            </div>
            <div>
              <h1 id="page-title" className="t-display reveal">{c.name}</h1>
              {c.intro ? <p className="page-hero-sub t-body-l">{c.intro}</p> : null}
              <div className="page-hero-meta">
                <ChipRow chips={c.chips} label="Role and action" />
                {lead ? <span className="t-small muted">Led by <SmartLink className="text-link" href={`/people/${lead.slug}`}>{lead.name}</SmartLink></span> : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section tone="alt" labelledBy="needed-title">
        <div className="section-header rail-grid">
          <Eyebrow strong as="div"><span id="needed-title">{idx()} · NEEDED</span></Eyebrow>
          <p className="case-needed">{c.needed}</p>
        </div>
      </Section>

      {c.inTheWay ? (
        <Section labelledBy="way-title">
          <SectionHeader id="way-title" label={`${idx()} · IN THE WAY`} title="What stood in the way." />
          <RailBody><ol className="spec-list">{c.inTheWay.map((w, k) => <li key={w}><span className="t-label">{String(k + 1).padStart(2, "0")}</span><span className="t-body-l">{w}</span></li>)}</ol></RailBody>
        </Section>
      ) : null}

      <Section labelledBy="changed-title">
        <SectionHeader id="changed-title" label={`${idx()} · CHANGED`} title="What we changed." />
        <RailBody>
          {c.changes ? (
            <ul className="change-list">{c.changes.map((ch) => <li key={ch.text}><span className={`chip${ch.tag === "TERMS" ? "" : " chip-conversion"}`}>{ch.tag}</span><span>{ch.text}</span></li>)}</ul>
          ) : <p className="t-body-l" style={{ maxWidth: 720 }}>{c.changedSummary}</p>}
        </RailBody>
      </Section>

      <Section labelledBy="moved-title">
        <SectionHeader id="moved-title" label={`${idx()} · MOVED`} title="What moved." lede={c.stats ? undefined : c.moved} />
        {c.stats ? <RailBody full><StatGrid cols={Math.min(3, c.stats.length)}>{c.stats.map((s) => <StatTile key={s.numeral} stat={s} />)}</StatGrid>{c.stats.length === 1 ? <p className="t-body-l" style={{ marginTop: 24, maxWidth: 720 }}>{c.moved}</p> : null}</RailBody> : null}
      </Section>

      {hasVisuals ? (
        <Section labelledBy="visuals-title">
          <SectionHeader id="visuals-title" label={`${idx()} · VISUALS`} title="Visuals." />
          <RailBody full>
            <Visuals c={c} />
            <p className="artifact-caption t-label">{c.artifact ? "ARTIFACTS · REDRAWN FOR THIS PAGE, NOT SCREENSHOTS" : "PROJECT IMAGE"}</p>
          </RailBody>
        </Section>
      ) : null}

      {c.quote ? (
        <Section labelledBy="quote-title">
          <h2 id="quote-title" className="sr-only">What the client said</h2>
          <TestimonialFeature t={c.quote} />
        </Section>
      ) : null}

      <Section tone="sage" labelledBy="tools-title">
        <SectionHeader id="tools-title" label={`${idx()} · RELATED TOOLS`} title="Related tools." />
        <RailBody full><div className="tool-grid">{c.tools.map((slug) => toolBySlug(slug)).filter(Boolean).map((t) => <ToolCard key={t!.slug} tool={t!} />)}</div></RailBody>
      </Section>

      <Section tight labelledBy="next-title">
        <SmartLink href={`/work/${next.slug}`} className="next-case">
          <span className="t-label muted" id="next-title">NEXT CASE</span>
          <span className="t-h2">{next.name}</span>
          <span className="t-small muted">{next.moved}</span>
          <span className="text-link">Read the case<span className="text-link-arrow" aria-hidden="true">▸</span></span>
        </SmartLink>
      </Section>

      <CTABand />
    </>
  );
}


import type { Metadata } from "next";
import { Invitations, Opening, Testimony } from "@/components/v26/blocks";
import { SetPiece } from "@/components/v26/SetPiece";
import { WorkIndex } from "@/components/v26/WorkIndex";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getEngagements, getHome, getSetPieces, getSitePage, getTools, getWorkIndex } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("work");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/work", description: p.seo.description });
}

export default async function WorkPage() {
  const [p, work, pieces, home, engagements, tools] = await Promise.all([getSitePage("work"), getWorkIndex(), getSetPieces(), getHome(), getEngagements(), getTools()]);
  // The homepage's two set pieces lead, in its order; any others follow in work order.
  const lead = home.featuredCases.map((c) => c.slug);
  const ordered = [...pieces].sort((a, b) => (lead.indexOf(a.slug) + 1 || 99) - (lead.indexOf(b.slug) + 1 || 99));
  const t = p.strings;
  const sec = p.sectionMap;
  const diagnostic = engagements.paths.flatMap((x) => x.offers).find((o) => o.name === engagements.diagnostic.name);
  const scorecard = tools.find((x) => x.slug === "conversion-scorecard");
  const invitations = [
    sec.diagnose && diagnostic ? { label: sec.diagnose.label ?? "", title: sec.diagnose.title ?? diagnostic.name, line: sec.diagnose.intro ?? "", href: diagnostic.cta.href, link: t.diagnoseLink ?? diagnostic.cta.label } : null,
    sec.scorecard && scorecard ? { label: sec.scorecard.label ?? "", title: sec.scorecard.title ?? scorecard.title, line: sec.scorecard.intro ?? scorecard.line, href: `/tools/${scorecard.slug}`, link: t.scorecardLink ?? scorecard.cta } : null,
  ].filter((x): x is NonNullable<typeof x> => !!x);

  return (
    <div className="v26">
      <Breadcrumbs trail={[{ name: "Work", path: "/work" }]} />
      <Opening label={p.hero.label} title={p.hero.title} sub={p.hero.sub} />

      {ordered.map((piece, i) => (
        <section key={piece.slug} className={`sec${piece.tone === "dark" ? " t-mid" : ""}`} data-sec={`piece-${i}`} aria-label={piece.name}>
          <div className="wrap"><SetPiece p={piece} mediaFirst={i % 2 === 1} headingLevel={2} readLabel={t.readCase} /></div>
        </section>
      ))}

      {home.testimony?.quote ? (
        <section className="sec t-sage" data-sec="quote" aria-label="What clients say">
          <div className="wrap"><Testimony quote={home.testimony.quote} stats={home.testimony.stats} /></div>
        </section>
      ) : null}

      <section className="sec t-alt" data-sec="index" aria-labelledby="index-title">
        <div className="wrap">
          <div className="head" style={{ marginBottom: 0 }}><div className="stack"><h2 id="index-title" className="h2 rv">{sec.index?.title}</h2></div><p className="lbl ink rv">{sec.index?.label}</p></div>
          <WorkIndex items={work} labels={{ all: t.filterAll ?? "All", engagement: t.filterEngagement ?? "Engagements", role: t.filterRole ?? "Earlier roles", founded: t.filterFounded ?? "Founded" }}
            tags={{ engagement: t.tagEngagement ?? "Engagement", role: t.tagRole ?? "Earlier role", founded: t.tagFounded ?? "Founded" }} />
        </div>
      </section>

      {invitations.length ? (
        <section className="sec" data-sec="invite" aria-label="Where to start">
          <div className="wrap"><Invitations items={invitations} /></div>
        </section>
      ) : null}
    </div>
  );
}

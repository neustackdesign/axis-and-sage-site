import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolCard } from "@/components/ds/blocks";
import { ButtonLink, Eyebrow, Portrait } from "@/components/ds/primitives";
import { diagnosticCreditNote, diagnosticDays, diagnosticFeePays, engagements, faqs } from "@/content/engagements";
import { guideBySlug, guides, toolBySlug } from "@/content/library";
import { bookCallHref, ctaBand } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return guides.filter((g) => g.published).map((g) => ({ slug: g.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = guideBySlug((await params).slug);
  if (!g) return {};
  return pageMetadata({ title: g.title, path: `/guides/${g.slug}`, type: "article", description: diagnosticFeePays });
}

const diagnostic = engagements.find((e) => e.recommended)!;
const sections = [
  { id: "the-fee", title: "What the fee pays for" },
  { id: "the-ten-days", title: "The ten working days" },
  { id: "what-you-get", title: "What you get" },
  { id: "the-credit", title: "The credit" },
];

// Body copy for the example guide is assembled from the approved engagement copy; nothing new is claimed.
const bodyWords = [diagnosticFeePays, ...diagnosticDays.map((d) => d.what), diagnostic.weDo, diagnostic.youGet, diagnosticCreditNote, faqs[3].a].join(" ").split(/\s+/).length;
const readingMinutes = Math.max(1, Math.round(bodyWords / 220));

export default async function GuidePage({ params }: Props) {
  const g = guideBySlug((await params).slug);
  if (!g || !g.published) notFound();
  const tool = toolBySlug("conversion-scorecard")!;

  return (
    <article className="article">
      <header className="wrap article-head">
        <Eyebrow strong>GUIDE · {g.category}</Eyebrow>
        <h1 className="t-h1 article-title reveal">{g.title}.</h1>
        <p className="article-standfirst t-body-l">Every engagement begins with the action you need and a fixed fee. Nothing starts without both.</p>
        <div className="page-hero-meta">
          <div className="author-card">
            <Portrait alt="Author portrait placeholder" label=" " />
            <div><p className="author-name">[Author]</p><p className="author-role">Co-founder, Axis &amp; Sage Advisory</p></div>
          </div>
          <span className="t-label muted">{readingMinutes} MIN READ</span>
        </div>
      </header>
      <div className="wrap article-layout">
        <nav className="article-toc" aria-label="Contents">
          <span className="t-label muted">CONTENTS</span>
          {sections.map((s, i) => <a key={s.id} href={`#${s.id}`}>{String(i + 1).padStart(2, "0")} {s.title}</a>)}
        </nav>
        <div className="article-body">
          <h2 id="the-fee">What the fee pays for</h2>
          <p>{diagnosticFeePays}</p>
          <blockquote className="pull-quote">&ldquo;You know the price before we start.&rdquo;</blockquote>

          <h2 id="the-ten-days">The ten working days</h2>
          <table className="data-table">
            <thead><tr><th scope="col">When</th><th scope="col">What happens</th></tr></thead>
            <tbody>{diagnosticDays.map((d) => <tr key={d.when}><td style={{ whiteSpace: "nowrap" }}>{d.when}</td><td>{d.what}</td></tr>)}</tbody>
          </table>
          <div className="callout">
            <span className="t-label">CALLOUT · YOU BRING</span>
            <span>{diagnostic.bring}.</span>
          </div>

          <div className="article-embed">
            <ToolCard tool={tool} />
          </div>

          <h2 id="what-you-get">What you get</h2>
          <p>We {diagnostic.weDo.charAt(0).toLowerCase() + diagnostic.weDo.slice(1)}. You get {diagnostic.youGet.charAt(0).toLowerCase() + diagnostic.youGet.slice(1)}.</p>

          <h2 id="the-credit">The credit</h2>
          <p>{diagnosticCreditNote} {faqs[3].a}</p>

          <div className="article-end on-dark">
            <p>{ctaBand.headline}</p>
            <ButtonLink href={bookCallHref}>Book a 30-minute call</ButtonLink>
          </div>
        </div>
      </div>
    </article>
  );
}

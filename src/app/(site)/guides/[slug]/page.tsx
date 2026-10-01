import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextComponents } from "next-sanity";
import { ToolCard } from "@/components/ds/blocks";
import { ButtonLink, Eyebrow, Portrait } from "@/components/ds/primitives";
import { headingId, plainText, RichText } from "@/components/ds/RichText";
import type { ToolMeta } from "@/lib/content/types";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs, JsonLd } from "@/components/seo/JsonLd";
import { articleLd } from "@/lib/seo";
import { getGuide, getGuides, getSettings } from "@/sanity/load";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)
export async function generateStaticParams() { return (await getGuides()).filter((g) => g.published).map((g) => ({ slug: g.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const g = await getGuide((await params).slug);
  if (!g) return {};
  return pageMetadata({ title: g.seo.title ?? g.title, absoluteTitle: !!g.seo.title, path: `/guides/${g.slug}`, type: "article", description: g.seo.description ?? g.excerpt });
}

const textOf = (children: unknown): string => (Array.isArray(children) ? children.map(textOf).join("") : typeof children === "string" ? children : "");

/** The article body: Portable Text with the guide's own blocks (timeline, callout, tool embed, closing call to action). */
const articleComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ value, children }) => <h2 id={headingId(textOf((value as { children?: { text: string }[] }).children?.map((c) => c.text)))}>{children}</h2>,
    blockquote: ({ children }) => <blockquote className="pull-quote">{children}</blockquote>,
  },
  types: {
    asEngagementTimeline: ({ value }: { value: { days?: { when: string; what: string }[] } }) => (
      <table className="data-table">
        <thead><tr><th scope="col">When</th><th scope="col">What happens</th></tr></thead>
        <tbody>{(value.days ?? []).map((d) => <tr key={d.when}><td style={{ whiteSpace: "nowrap" }}>{d.when}</td><td>{d.what}</td></tr>)}</tbody>
      </table>
    ),
    asCallout: ({ value }: { value: { label?: string; text?: string } }) => (
      <div className="callout"><span className="t-label">{value.label}</span><span>{value.text}</span></div>
    ),
    asToolEmbed: ({ value }: { value: { tool?: ToolMeta } }) => (value.tool ? <div className="article-embed"><ToolCard tool={value.tool} /></div> : null),
    asArticleEnd: ({ value }: { value: { headline?: string; cta?: { label: string; href: string } } }) => (
      <div className="article-end on-dark">
        <p>{value.headline}</p>
        {value.cta ? <ButtonLink href={value.cta.href}>{value.cta.label}</ButtonLink> : null}
      </div>
    ),
  },
};

export default async function GuidePage({ params }: Props) {
  const [g, settings] = await Promise.all([getGuide((await params).slug), getSettings()]);
  if (!g) notFound();
  const headings = g.body.filter((b) => b._type === "block" && (b as { style?: string }).style === "h2").map((b) => plainText([b]));
  const readingMinutes = Math.max(1, Math.round(plainText(g.body).split(/\s+/).filter(Boolean).length / 220));
  const date = g.publishedAt ?? (g.updatedAt ?? "").slice(0, 10);

  return (
    <>
    <Breadcrumbs trail={[{ name: "Library", path: "/library" }, { name: g.title, path: `/guides/${g.slug}` }]} />
    <JsonLd data={articleLd({ headline: g.title, description: g.seo.description ?? g.excerpt, path: `/guides/${g.slug}`, date, modified: g.updatedAt?.slice(0, 10), authors: g.authors.map((p) => ({ name: p.name, path: `/people/${p.slug}` })) })} />
    <article className="article">
      <header className="wrap article-head">
        <Eyebrow strong>GUIDE · {g.category}</Eyebrow>
        <h1 className="t-h1 article-title reveal">{g.title}.</h1>
        {g.excerpt ? <p className="article-standfirst t-body-l">{g.excerpt}</p> : null}
        <div className="page-hero-meta">
          <div className="author-cards">
            {g.authors.map((p) => (
              <div key={p.slug} className="author-card">
                <Portrait alt={p.name} initials={p.initials} dark={p.half === "moments"} src={p.portrait} />
                <div><p className="author-name"><Link className="text-link" href={`/people/${p.slug}`}>{p.name}</Link></p><p className="author-role">{p.title}, {settings.companyName} · {p.practice}</p></div>
              </div>
            ))}
          </div>
          <span className="t-label muted">{readingMinutes} MIN READ</span>
        </div>
      </header>
      <div className="wrap article-layout">
        <nav className="article-toc" aria-label="Contents">
          <span className="t-label muted">CONTENTS</span>
          {headings.map((h, i) => <a key={h} href={`#${headingId(h)}`}>{String(i + 1).padStart(2, "0")} {h}</a>)}
        </nav>
        <div className="article-body">
          <RichText value={g.body} components={articleComponents} />
        </div>
      </div>
    </article>
    </>
  );
}

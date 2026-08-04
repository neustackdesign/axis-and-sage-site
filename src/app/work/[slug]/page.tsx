import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getProjectSlugs } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/image";

const fallbackAssets: Record<string, { src: string; alt: string }> = {
  "nature-roots": { src: "/images/axis-sage/nature-roots-live.jpg", alt: "Nature Roots product packaging" },
  earlybean: { src: "/images/axis-sage/earlybean.jpg", alt: "Earlybean product experience sketches" },
  "uganda-investor-summit": { src: "/images/axis-sage/summit-live.jpg", alt: "Uganda Investor Summit stage" },
};

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return { title: "Project not found" };
  const settings = await getSiteSettings();
  const origin = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || (process.env.VERCEL_ENV === "production" ? "https://axisandsage.com" : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const imagePath = sanityImageUrl(project.seo?.image) || sanityImageUrl(settings.seo.image) || project.seo?.image?.src || settings.seo.image?.src || "/og/axis-sage.png";
  const canonicalPath = `/work/${project.slug}`;
  const canonical = process.env.VERCEL_ENV === "production" && project.seo?.canonicalUrl?.startsWith("http") ? project.seo.canonicalUrl : new URL(canonicalPath, origin).toString();
  const title = project.seo?.title || project.title;
  const description = project.seo?.description || project.summary;
  const image = { url: new URL(imagePath, origin).toString(), width: 1200, height: 630, type: "image/png", alt: project.seo?.image?.alt || settings.seo.image?.alt || `${project.title} — Axis & Sage project` };
  return { title, description, alternates: { canonical }, openGraph: { type: "article", title, description, url: canonical, images: [image] }, twitter: { card: "summary_large_image", title, description, images: [{ url: image.url, alt: image.alt }] }, robots: process.env.VERCEL_ENV === "production" ? undefined : { index: false, follow: false } };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  const asset = project.cover?.src ? { src: project.cover.src, alt: project.cover.alt || "" } : fallbackAssets[project.slug];
  return <article className="project-page"><div className="project-page-shell breakout"><Link className="back-link" href="/#our-work">← Back to selected work</Link><div className="project-page-heading"><div><p className="eyebrow">{project.tags.join(" / ")}</p><h1>{project.title}</h1></div><p className="project-page-summary">{project.summary}</p></div><figure className="project-page-figure">{asset ? <img src={asset.src} alt={asset.alt} /> : null}</figure><div className="project-page-details"><div><span className="eyebrow">Contribution</span><p>{project.contribution || project.summary}</p></div><div><span className="eyebrow">Project context</span><p>{project.location || "Africa and the GCC"}</p></div><div className="project-page-cta"><Link className="text-link" href="/#contact"><span>Start a project</span><span aria-hidden="true">↗</span></Link></div></div>{project.testimonial?.approved ? <blockquote className="project-quote">“{project.testimonial.quote}”<cite>{project.testimonial.personName}</cite></blockquote> : null}</div></article>;
}

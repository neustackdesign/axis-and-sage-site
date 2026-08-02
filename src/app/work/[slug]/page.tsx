import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getProjectSlugs } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/sanity/lib/queries";
import { sanityImageUrl } from "@/sanity/lib/image";

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
  return <article className="project-page"><div className={`project-page-visual project-visual-${project.tone ?? "ink"}`}><span>{project.title.split(" ").map((word) => word[0]).join("")}</span><small>Approved imagery pending review</small></div><div className="container project-page-content"><Link className="back-link" href="/#our-work">← Back to our work</Link><p className="eyebrow">{project.tags.join(" · ")}</p><h1>{project.title}</h1><p className="project-page-summary">{project.summary}</p><div className="project-page-meta">{project.client ? <div><span className="eyebrow">Client</span><p>{project.client}</p></div> : null}{project.location ? <div><span className="eyebrow">Location</span><p>{project.location}</p></div> : null}{project.year ? <div><span className="eyebrow">Year</span><p>{project.year}</p></div> : null}</div>{project.testimonial?.approved ? <blockquote className="project-quote">“{project.testimonial.quote}”<cite>{project.testimonial.personName}</cite></blockquote> : null}<Link className="button button-dark" href="/#contact">Start a conversation <span aria-hidden="true">↗</span></Link></div></article>;
}

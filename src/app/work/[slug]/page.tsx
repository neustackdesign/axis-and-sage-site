import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getProjectSlugs } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  if (!project) return { title: "Project not found" };
  return { title: project.title, description: project.summary, alternates: { canonical: `/work/${project.slug}` } };
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();
  return <article className="project-page"><div className={`project-page-visual project-visual-${project.tone ?? "ink"}`}><span>{project.title.split(" ").map((word) => word[0]).join("")}</span><small>Approved imagery pending review</small></div><div className="container project-page-content"><Link className="back-link" href="/#our-work">← Back to our work</Link><p className="eyebrow">{project.tags.join(" · ")}</p><h1>{project.title}</h1><p className="project-page-summary">{project.summary}</p><div className="project-page-meta">{project.client ? <div><span className="eyebrow">Client</span><p>{project.client}</p></div> : null}{project.location ? <div><span className="eyebrow">Location</span><p>{project.location}</p></div> : null}{project.year ? <div><span className="eyebrow">Year</span><p>{project.year}</p></div> : null}</div>{project.testimonial?.approved ? <blockquote className="project-quote">“{project.testimonial.quote}”<cite>{project.testimonial.personName}</cite></blockquote> : null}<Link className="button button-dark" href="/#contact">Start a conversation <span aria-hidden="true">↗</span></Link></div></article>;
}

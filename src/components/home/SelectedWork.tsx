import Link from "next/link";
import type { HomePage, Project } from "@/types/content";
import { Apparatus, EditorialImage, projectAssets, SectionOpening } from "./EditorialPrimitives";

const projectContexts: Record<string, string> = {
  "nature-roots": "BRAND STRATEGY / IDENTITY",
  earlybean: "PRODUCT DESIGN / UX",
  "uganda-investor-summit": "EVENT STRATEGY / STORYTELLING",
};

const projectAlt: Record<string, string> = {
  "nature-roots": "Nature Roots product packaging",
  earlybean: "Earlybean product experience sketches",
  "uganda-investor-summit": "Uganda Investor Summit stage",
};

function ProjectLink({ project }: { project: Project }) {
  return <Link className="text-link" href={`/work/${project.slug}`}><span>View case study</span><span aria-hidden="true">↗</span></Link>;
}

function FeaturedProject({ project }: { project: Project }) {
  return <article className="work-featured" data-reveal="work-featured">
    <figure className="work-featured-figure"><EditorialImage image={project.cover} fallback={projectAssets[project.slug]} alt={project.cover?.alt || projectAlt[project.slug] || ""} /></figure>
    <div className="work-featured-copy prose"><Apparatus>01 / FEATURED</Apparatus><h3>{project.title}</h3><p>{project.summary}</p><div className="work-context"><Apparatus>{projectContexts[project.slug] || project.tags.join(" / ")}</Apparatus></div><ProjectLink project={project} /></div>
  </article>;
}

function SupportingProject({ project, index }: { project: Project; index: number }) {
  return <article className="work-supporting" data-reveal="work-supporting"><figure><EditorialImage image={project.cover} fallback={projectAssets[project.slug]} alt={project.cover?.alt || projectAlt[project.slug] || ""} /></figure><div className="work-supporting-copy prose"><Apparatus>0{index} / SUPPORTING</Apparatus><h3>{project.title}</h3><p>{project.summary}</p><Apparatus>{projectContexts[project.slug] || project.tags.join(" / ")}</Apparatus><ProjectLink project={project} /></div></article>;
}

export function SelectedWork({ data }: { data: NonNullable<HomePage["projects"]> }) {
  const items = Array.isArray(data?.items) ? data.items : [];
  const visible = items.filter((project) => project.homepagePlacement !== "hidden").sort((a, b) => (a.homepageOrder || 99) - (b.homepageOrder || 99));
  const featured = visible.find((project) => project.homepagePlacement === "featured") || visible[0];
  const supporting = visible.filter((project) => project.slug !== featured?.slug).slice(0, 2);
  if (!featured) return null;
  return <section className="landing-section selected-work" id="our-work">
    <SectionOpening index="03" label={data.label} />
    <div className="section-copy prose" data-reveal="work-intro"><h2>{data.heading}</h2><p>{data.introduction}</p></div>
    <div className="work-composition breakout"><FeaturedProject project={featured} /><div className="work-supporting-grid">{supporting.map((project, index) => <SupportingProject key={project.slug} project={project} index={index + 2} />)}</div></div>
  </section>;
}

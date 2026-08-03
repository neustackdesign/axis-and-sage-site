import Link from "next/link";
import type { HomePage, Project } from "@/types/content";
import { Apparatus, EditorialImage, projectAssets, SectionOpening } from "./EditorialPrimitives";

function WorkChapter({ project, index }: { project: Project; index: number }) {
  const evidence = project.contribution || project.outcome;
  return <article className="work-chapter" data-reveal="work-chapter">
    <div className="work-chapter-head prose"><Apparatus>0{index + 1} / {project.year || "Selected work"}</Apparatus><h3>{project.title}</h3><p>{project.summary}</p></div>
    <figure className="work-figure breakout"><EditorialImage image={project.cover} fallback={projectAssets[project.slug]} alt={`${project.title} project image`} /><figcaption><Apparatus>{project.tags.join(" · ")}</Apparatus></figcaption></figure>
    <div className="work-evidence prose">
      {evidence ? <p><strong>Contribution</strong> {evidence}</p> : null}
      <div className="work-link-row"><Apparatus>{project.location || "Axis & Sage"}</Apparatus><Link className="text-link" href={`/work/${project.slug}`}><span>View case study</span><span aria-hidden="true">↗</span></Link></div>
    </div>
  </article>;
}

export function SelectedWork({ data }: { data: HomePage["projects"] }) {
  return <section className="landing-section selected-work" id="our-work">
    <SectionOpening index="03" label={data.label} />
    <div className="section-copy prose" data-reveal="work-intro"><h2>{data.heading}</h2><p>{data.introduction}</p></div>
    <div className="work-chapters">{data.items.map((project, index) => <WorkChapter key={project.slug} project={project} index={index} />)}</div>
  </section>;
}

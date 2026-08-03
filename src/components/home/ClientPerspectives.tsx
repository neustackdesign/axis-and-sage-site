import type { HomePage, Testimonial } from "@/types/content";
import { Apparatus, SectionOpening } from "./EditorialPrimitives";

function Perspective({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  return <figure className={`perspective perspective-${index === 0 ? "featured" : "supporting"}`} data-reveal="perspective"><Apparatus>0{index + 1}</Apparatus><blockquote>“{testimonial.quote}”</blockquote><figcaption><Apparatus>{testimonial.personName}{testimonial.organisation ? ` / ${testimonial.organisation}` : ""}</Apparatus></figcaption></figure>;
}

export function ClientPerspectives({ data }: { data?: HomePage["testimonials"] }) {
  const items = data?.items.filter((testimonial) => testimonial.approved !== false) || [];
  if (!data || !items.length) return null;
  return <section className="landing-section client-perspectives" id="testimonials">
    <SectionOpening index="04" label={data.label} />
    <div className="section-copy prose" data-reveal="perspective-intro"><h2>{data.heading}</h2><p>{data.introduction}</p></div>
    <div className="perspective-list breakout">{items.map((testimonial, index) => <Perspective key={`${testimonial._id ?? testimonial.personName}-${index}`} testimonial={testimonial} index={index} />)}</div>
  </section>;
}


import type { HomePage, Testimonial } from "@/types/content";
import { Apparatus, SectionOpening } from "./EditorialPrimitives";

function Perspective({ testimonial, index, featured }: { testimonial: Testimonial; index: number; featured?: boolean }) {
  return <figure className={`perspective ${featured ? "perspective-featured" : "perspective-supporting"}`} data-reveal="perspective"><Apparatus>0{index + 1}</Apparatus><blockquote>“{testimonial.quote}”</blockquote><figcaption><Apparatus>{testimonial.personName}{testimonial.role ? ` / ${testimonial.role}` : ""}{testimonial.organisation ? ` / ${testimonial.organisation}` : ""}</Apparatus></figcaption></figure>;
}

export function ClientPerspectives({ data }: { data?: HomePage["testimonials"] }) {
  const sourceItems = Array.isArray(data?.items) ? data.items : [];
  const items = sourceItems.filter((testimonial) => testimonial.approved !== false && testimonial.showOnHomepage !== false).sort((a, b) => (a.homepageOrder || 99) - (b.homepageOrder || 99)).slice(0, 3);
  if (!data || !items.length) return null;
  return <section className="landing-section client-perspectives" id="testimonials">
    <SectionOpening index="04" label={data.label} />
    <div className="section-copy prose" data-reveal="perspective-intro"><h2>What clients say</h2></div>
    <div className="perspective-list breakout"><Perspective testimonial={items[0]} index={0} featured /><div className="perspective-supporting-grid">{items.slice(1).map((testimonial, index) => <Perspective key={`${testimonial._id ?? testimonial.personName}-${index}`} testimonial={testimonial} index={index + 1} />)}</div></div>
  </section>;
}

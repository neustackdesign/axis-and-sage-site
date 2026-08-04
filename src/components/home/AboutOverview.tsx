import type { HomePage } from "@/types/content";
import { Apparatus, EditorialImage, Reveal } from "./EditorialPrimitives";

const assetRoot = "/images/axis-sage";

export function AboutOverview({ data }: { data: NonNullable<HomePage["about"]> }) {
  const images = data.images?.length ? data.images : [
    { src: `${assetRoot}/nature-roots-live.jpg`, alt: "Nature Roots product packaging" },
    { src: `${assetRoot}/earlybean.jpg`, alt: "Earlybean product experience sketches" },
    { src: `${assetRoot}/summit-live.jpg`, alt: "Uganda Investor Summit stage" },
  ];
  const principles = data.principles?.length ? data.principles : [
    { number: "01", title: "Think strategically", body: "Start with the market, the model and the choices that give the work direction." },
    { number: "02", title: "Act creatively", body: "Turn the direction into brands, products and experiences people can understand, trust and use." },
    { number: "03", title: "Grow sustainably", body: "Build the systems, stories and partnerships that carry the work forward." },
  ];
  return <section className="landing-section about-overview" id="about">
    <div className="landing-label-row breakout" data-reveal="about-copy">
      <div><Apparatus>{data.label}</Apparatus></div>
      <div className="landing-copy prose">
        <h2>{data.heading}</h2>
        <p>{data.body}</p>
        <div className="principles" aria-label="Our principles">{principles.map((principle) => <div className="principle-row" key={principle.number}><Apparatus>{principle.number}</Apparatus><strong>{principle.title}</strong><p>{principle.body}</p></div>)}</div>
      </div>
    </div>
    <Reveal name="about-figure" className="about-figure-grid breakout">
      <figure className="about-figure about-figure-wide"><EditorialImage image={images[0]} alt={images[0]?.alt || ""} /></figure>
      <figure className="about-figure"><EditorialImage image={images[1] || images[0]} alt={images[1]?.alt || ""} /></figure>
      <figure className="about-figure"><EditorialImage image={images[2] || images[0]} alt={images[2]?.alt || ""} /></figure>
    </Reveal>
    <div className="about-support prose" data-reveal="about-support">
      {(Array.isArray(data?.support) ? data.support : []).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
  </section>;
}

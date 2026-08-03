import type { HomePage } from "@/types/content";
import { Apparatus, EditorialImage, Reveal } from "./EditorialPrimitives";

const assetRoot = "/images/axis-sage";

export function AboutOverview({ data }: { data: HomePage["about"] }) {
  const images = data.images?.length ? data.images : ["about-1.jpg", "about-2.jpg", "about-3.jpg"].map((name) => ({ src: `${assetRoot}/${name}`, alt: "Axis & Sage editorial image" }));
  return <section className="landing-section about-overview" id="about">
    <div className="landing-label-row breakout" data-reveal="about-copy">
      <div><Apparatus>{data.label}</Apparatus></div>
      <div className="landing-copy prose">
        <h2>{data.heading}</h2>
        <p>{data.body}</p>
        <p className="statement">{data.approach}</p>
      </div>
    </div>
    <Reveal name="about-figure" className="about-figure-grid breakout">
      <figure className="about-figure about-figure-wide"><EditorialImage image={images[0]} alt="Axis & Sage editorial image" /></figure>
      <figure className="about-figure"><EditorialImage image={images[1] || images[0]} alt="Axis & Sage editorial image" /></figure>
      <figure className="about-figure"><EditorialImage image={images[2] || images[0]} alt="Axis & Sage editorial image" /></figure>
    </Reveal>
    <div className="about-support prose" data-reveal="about-support">
      {data.support.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </div>
  </section>;
}


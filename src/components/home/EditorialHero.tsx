import type { HomePage } from "@/types/content";
import { Apparatus, EditorialImage, Reveal, TextLink } from "./EditorialPrimitives";

const assetRoot = "/images/axis-sage";

export function EditorialHero({ data }: { data: HomePage["hero"] }) {
  const kicker = data.eyebrow.length ? data.eyebrow.join(" · ") : "Strategy · Design · Growth";
  return <section className="landing-hero" id="top">
    <div className="breakout">
      <div className="hero-reading prose" data-reveal="hero-reading">
        <Apparatus className="hero-kicker">{kicker}</Apparatus>
        <h1>{data.heading}</h1>
        <p className="hero-lede">{data.body}</p>
        <div className="hero-actions">
          <TextLink href={data.primaryCta.href}>{data.primaryCta.label}</TextLink>
          {data.secondaryCta ? <TextLink href={data.secondaryCta.href}>{data.secondaryCta.label}</TextLink> : null}
        </div>
      </div>
      <Reveal name="hero-figure" className="hero-figure-wrap">
        <figure className="hero-figure">
          <EditorialImage image={data.media} fallback={`${assetRoot}/hero-chess.jpg`} alt="Chess pieces on a board" />
          <figcaption><Apparatus>STRATEGY / BRAND / PRODUCT / GROWTH / VENTURE BUILDING / STORYTELLING</Apparatus></figcaption>
        </figure>
      </Reveal>
    </div>
  </section>;
}

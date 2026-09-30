import Image from "next/image";
import { ButtonLink } from "@/components/ds/primitives";
import { bookCallHref, heroImage, scorecardHref } from "@/content/site";

/**
 * The homepage cover: one framed surface holding the navigation (SiteHeader "hero", laid over its top edge), the
 * artwork as the whole environment, the message at lower left, and mono metadata pinned to the bottom corners.
 * The artwork is treated, not shown plainly: a soft grade, grain, and a left-to-right shade behind the copy.
 */
export function HomepageHero() {
  return (
    <section className="cover" aria-labelledby="hero-title">
      <div className="cover-frame on-dark">
        <div className="cover-art">
          <Image src={heroImage.src} alt={heroImage.alt} fill priority sizes="100vw" className="cover-image" />
          <span className="cover-shade" aria-hidden="true" />
          <span className="cover-grain" aria-hidden="true" />
        </div>

        <div className="cover-body">
          <div className="cover-copy">
            <p className="t-label cover-eyebrow">ADVISORY · AFRICA AND THE GCC · ABU DHABI · DUBAI · LAGOS</p>
            <h1 id="hero-title" className="hero-title cover-title reveal">Get the people your business depends on to act.</h1>
            <p className="t-body-l cover-sub">Investors commit, partners sign, teams execute and customers buy when the terms are right and the moment is clear. We design both. We call it Conversion Design.</p>
            <div className="cover-actions">
              <ButtonLink href={bookCallHref}>Book a 30-minute call</ButtonLink>
              <ButtonLink href={scorecardHref} variant="secondary">Take the Conversion Scorecard ▸</ButtonLink>
            </div>
          </div>

          <div className="cover-meta t-label">
            <p>STRATEGY &amp; INVESTMENT · PRODUCT &amp; TECHNOLOGY · BRAND &amp; MARKET</p>
            <p className="cover-credit">{heroImage.credit}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { Fragment } from "react";
import { ButtonLink } from "@/components/ds/primitives";
import { bookCallHref, heroImage, scorecardHref } from "@/content/site";

const EYEBROW = ["ADVISORY", "AFRICA AND THE GCC", "ABU DHABI", "DUBAI", "LAGOS"];
const PRACTICES = ["STRATEGY & INVESTMENT", "PRODUCT & TECHNOLOGY", "BRAND & MARKET"];

/** The self-hosted crop when it's in /public, otherwise the same crop from Unsplash's CDN. Resolved at build time. */
const heroSrc = existsSync(join(process.cwd(), "public", heroImage.src)) ? heroImage.src : heroImage.remote;

/**
 * A "·"-separated run of labels where each label stays whole: lines break only between labels, and the separator
 * stays with the label before it, so no line starts with "·".
 */
function Run({ items, className }: { items: string[]; className?: string }) {
  return (
    <span className={className}>
      {items.map((item, i) => (
        <Fragment key={item}>
          <span className="nowrap">{i < items.length - 1 ? `${item} ·` : item}</span>
          {i < items.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * The homepage cover: one framed surface holding the navigation (SiteHeader "hero", laid over its top edge), the
 * artwork as the whole environment, the message at lower left, and mono metadata pinned to the bottom corners.
 * The artwork is treated, not shown plainly: a restrained grade, grain, and shade behind the copy only.
 */
export function HomepageHero() {
  const [place, ...source] = heroImage.credit.split(" · ");
  return (
    <section className="cover" aria-labelledby="hero-title">
      <div className="cover-frame on-dark">
        <div className="cover-art">
          <Image src={heroSrc} alt={heroImage.alt} fill priority sizes="100vw" className="cover-image" />
          <span className="cover-shade" aria-hidden="true" />
          <span className="cover-grain" aria-hidden="true" />
        </div>

        <div className="cover-body">
          <div className="cover-copy">
            <p className="t-label cover-eyebrow"><Run items={EYEBROW} /></p>
            <h1 id="hero-title" className="hero-title cover-title reveal">Get the people your business depends on to act.</h1>
            <p className="t-body-l cover-sub">Investors commit, partners sign, teams execute and customers buy when the terms are right and the moment is clear. We design both. We call it Conversion Design.</p>
            <div className="cover-actions">
              <ButtonLink href={bookCallHref}>Book a 30-minute call</ButtonLink>
              <ButtonLink href={scorecardHref} variant="secondary">Take the Conversion Scorecard ▸</ButtonLink>
            </div>
          </div>

          <div className="cover-meta t-label">
            <p><Run items={PRACTICES} /></p>
            <p className="cover-credit"><span className="nowrap">{`${place} ·`}</span> <span className="nowrap">{source.join(" · ")}</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

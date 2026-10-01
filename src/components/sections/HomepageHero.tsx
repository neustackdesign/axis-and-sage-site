import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import { Fragment } from "react";
import { ButtonLink } from "@/components/ds/primitives";
import type { SanityImageView } from "@/lib/content/types";
import type { HomeView } from "@/sanity/load";
import { sanityLoader } from "@/sanity/image";

/** Below this width the portrait crop is served; above it, the landscape crop. Matches the cover's mobile CSS. */
const MOBILE_QUERY = "(max-width: 767px)";

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

const loaderFor = (img: SanityImageView) => (img.url.startsWith("https://cdn.sanity.io/") ? sanityLoader : undefined);

/**
 * Art direction: two Sanity assets, never one crop stretched. The landscape crop (3200×1800) on desktop and tablet,
 * the portrait crop (1200×1800) on phones. Each crop's hotspot sets its focus point.
 */
function HeroPicture({ desktop, mobile, alt }: { desktop: SanityImageView; mobile: SanityImageView; alt: string }) {
  const common = { alt, sizes: "100vw", priority: true, quality: 82 } as const;
  const { props: { srcSet: desktopSet } } = getImageProps({ ...common, src: desktop.url, width: desktop.width ?? 3200, height: desktop.height ?? 1800, loader: loaderFor(desktop) });
  const { props: { srcSet: mobileSet, ...img } } = getImageProps({ ...common, src: mobile.url, width: mobile.width ?? 1200, height: mobile.height ?? 1800, loader: loaderFor(mobile) });
  return (
    <picture>
      <source media={MOBILE_QUERY} srcSet={mobileSet} />
      <source srcSet={desktopSet} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in the spread props */}
      <img {...img} className="cover-image" />
    </picture>
  );
}

/**
 * The homepage cover: one framed surface holding the navigation (SiteHeader "hero", laid over its top edge), the
 * artwork as the whole environment, the message at lower left, and mono metadata pinned to the bottom corners.
 * The artwork is treated, not shown plainly: a restrained grade, grain, and shade behind the copy only.
 * Everything here is edited in Sanity (Homepage).
 */
export function HomepageHero({ home }: { home: HomeView }) {
  const [place, ...source] = home.imageCredit.split(" · ");
  const focus = {
    ...(home.desktopImage?.focus ? { "--cover-focus-desktop": home.desktopImage.focus } : {}),
    ...(home.mobileImage?.focus ? { "--cover-focus-mobile": home.mobileImage.focus } : {}),
  } as CSSProperties;
  return (
    <section className="cover" aria-labelledby="hero-title">
      <div className="cover-frame on-dark">
        <div className="cover-art" style={focus}>
          {home.desktopImage && home.mobileImage ? <HeroPicture desktop={home.desktopImage} mobile={home.mobileImage} alt={home.imageAlt} /> : null}
          <span className="cover-shade" aria-hidden="true" />
          <span className="cover-grain" aria-hidden="true" />
        </div>

        <div className="cover-body">
          <div className="cover-copy">
            <p className="t-label cover-eyebrow"><Run items={home.eyebrow} /></p>
            <h1 id="hero-title" className="hero-title cover-title reveal">{home.headline}</h1>
            <p className="t-body-l cover-sub">{home.supportingCopy}</p>
            <div className="cover-actions">
              <ButtonLink href={home.primaryCta.href}>{home.primaryCta.label}</ButtonLink>
              <ButtonLink href={home.secondaryCta.href} variant="secondary">{home.secondaryCta.label} ▸</ButtonLink>
            </div>
          </div>

          <div className="cover-meta t-label">
            <p><Run items={home.practices} /></p>
            {home.imageCredit ? <p className="cover-credit"><span className="nowrap">{source.length ? `${place} ·` : place}</span>{source.length ? <> <span className="nowrap">{source.join(" · ")}</span></> : null}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}

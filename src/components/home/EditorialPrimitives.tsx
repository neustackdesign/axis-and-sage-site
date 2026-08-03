import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import type { ImageValue } from "@/types/content";

const assetRoot = "/images/axis-sage";

export const projectAssets: Record<string, string> = {
  "nature-roots": `${assetRoot}/nature-roots-live.jpg`,
  earlybean: `${assetRoot}/earlybean.jpg`,
  "uganda-investor-summit": `${assetRoot}/summit-live.jpg`,
};

export function imageSource(image?: ImageValue, fallback?: string) {
  return image?.src || fallback;
}

export function EditorialImage({ image, fallback, alt, className }: { image?: ImageValue; fallback?: string; alt: string; className?: string }) {
  const src = imageSource(image, fallback);
  return src
    ? <img className={className} src={src} alt={image?.alt || alt} />
    : <div className={`${className || "editorial-image"} image-empty`} role="img" aria-label={alt} />;
}

export function Apparatus({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`apparatus ${className}`.trim()}>{children}</span>;
}

export function SectionOpening({ index, label }: { index: string; label: string }) {
  return <div className="section-opening breakout" data-reveal="section-opening"><Apparatus>{index} / {label}</Apparatus><span className="ink-rule" aria-hidden="true" /></div>;
}

export function TextLink({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  return <Link className="text-link" href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}><span>{children}</span><span aria-hidden="true">↗</span></Link>;
}

export function Reveal({ children, name = "content", delay = 0, className = "" }: { children: ReactNode; name?: string; delay?: number; className?: string }) {
  return <div className={`reveal reveal-${name} ${className}`.trim()} data-reveal={name} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

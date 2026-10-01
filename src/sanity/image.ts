import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImageView } from "@/lib/content/types";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export type SanityImageSource = {
  asset?: { _ref?: string; _id?: string; url?: string; metadata?: { dimensions?: { width: number; height: number }; lqip?: string } } | null;
  hotspot?: { x: number; y: number } | null;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  alt?: string | null;
};

/** A Sanity image as the components need it, or undefined when there's no asset. Focus comes from the hotspot. */
export function imageView(img: SanityImageSource | null | undefined, opts: { width?: number } = {}): SanityImageView | undefined {
  if (!img?.asset) return undefined;
  const dims = img.asset.metadata?.dimensions;
  // Local seed images (development only) are already served from /public.
  const local = img.asset.url?.startsWith("/") ? img.asset.url : null;
  const url = local ?? builder.image(img as never).width(opts.width ?? dims?.width ?? 2400).auto("format").url();
  return {
    url,
    width: dims?.width,
    height: dims?.height,
    alt: img.alt ?? undefined,
    lqip: img.asset.metadata?.lqip,
    focus: img.hotspot ? `${Math.round(img.hotspot.x * 100)}% ${Math.round(img.hotspot.y * 100)}%` : undefined,
  };
}

/** next/image loader for Sanity's CDN: Sanity resizes, so Vercel's optimiser isn't used. */
export function sanityLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality || 80));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

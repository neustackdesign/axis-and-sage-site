import { getSitePage } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Terms & Moments.";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 86400; // Daily fallback; publish webhook handles immediate changes.

export default async function Image() {
  const p = await getSitePage("newsletter");
  return renderOg({ label: p.hero.label, title: p.seo.ogTitle ?? p.hero.title });
}

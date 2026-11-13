import { getSitePage } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Two founders. Both of them on your work.";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 604800; // Seven-day fallback; publish webhook handles immediate changes.

export default async function Image() {
  const p = await getSitePage("people");
  return renderOg({ label: p.hero.label, title: p.seo.ogTitle ?? p.hero.title });
}

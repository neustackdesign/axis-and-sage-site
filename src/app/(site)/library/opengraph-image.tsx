import { getSitePage } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Free tools for the decision in front of you.";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export default async function Image() {
  const p = await getSitePage("library");
  return renderOg({ label: p.hero.label, title: p.seo.ogTitle ?? p.hero.title });
}

import { getSitePage } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Start with one sentence. Know the price before we start.";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 86400; // Daily fallback; publish webhook handles immediate changes.

export default async function Image() {
  const p = await getSitePage("engagements");
  return renderOg({ label: p.hero.label, title: p.seo.ogTitle ?? p.hero.title });
}

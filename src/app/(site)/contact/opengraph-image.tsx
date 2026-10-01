import { getSitePage } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Tell us who needs to act.";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export default async function Image() {
  const p = await getSitePage("contact");
  return renderOg({ label: p.hero.label, title: p.seo.ogTitle ?? p.hero.title });
}

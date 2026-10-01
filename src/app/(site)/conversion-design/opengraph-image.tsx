import { getMethod } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Start from the action.";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export default async function Image() {
  const m = await getMethod();
  return renderOg({ label: m.hero.label, title: m.seo.ogTitle ?? m.hero.title });
}

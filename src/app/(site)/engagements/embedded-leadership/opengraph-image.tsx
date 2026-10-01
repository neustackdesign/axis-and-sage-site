import { getPractice } from "@/sanity/load";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export default async function Image() {
  const p = await getPractice("embedded-leadership");
  if (!p) throw new Error("Embedded leadership practice is missing in Sanity.");
  return renderOg({ label: p.eyebrow, title: p.seo.ogTitle ?? p.h1 });
}

import { guideBySlug, guides } from "@/content/library";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;
export function generateStaticParams() { return guides.filter((g) => g.published).map((g) => ({ slug: g.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = guideBySlug(slug)!;
  return renderOg({ label: `GUIDE · ${c.category}`, title: c.title });
}

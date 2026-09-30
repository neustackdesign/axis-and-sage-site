import { caseBySlug, casePages } from "@/content/work";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;
export function generateStaticParams() { return casePages.map((c) => ({ slug: c.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = caseBySlug(slug)!;
  return renderOg({ label: `CASE · ${c.sector}`, title: c.name });
}

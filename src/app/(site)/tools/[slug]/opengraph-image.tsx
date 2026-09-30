import { toolBySlug, tools } from "@/content/library";
import { toolSearchPhrase } from "@/content/titles";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;
export function generateStaticParams() { return tools.map((t) => ({ slug: t.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = toolBySlug(slug)!;
  return renderOg({ label: `FREE TOOL · ${c.kind}`, title: toolSearchPhrase[c.slug] || c.title });
}

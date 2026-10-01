import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";
import { getTool, getTools } from "@/sanity/load";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)
export async function generateStaticParams() { return (await getTools()).map((x) => ({ slug: x.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getTool((await params).slug);
  if (!c) notFound();
  return renderOg({ label: `FREE TOOL · ${c.kind}`, title: c.seo.ogTitle ?? c.title });
}

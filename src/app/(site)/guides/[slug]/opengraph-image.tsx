import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";
import { getGuide, getGuides } from "@/sanity/load";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)
export async function generateStaticParams() { return (await getGuides().then((g) => g.filter((x) => x.published))).map((x) => ({ slug: x.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getGuide((await params).slug);
  if (!c) notFound();
  return renderOg({ label: `GUIDE · ${c.category}`, title: c.title });
}

import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";
import { getCase, getCaseList } from "@/sanity/load";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 86400; // Daily fallback; publish webhook handles immediate changes.
export async function generateStaticParams() { return (await getCaseList()).map((x) => ({ slug: x.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getCase((await params).slug);
  if (!c) notFound();
  return renderOg({ label: `CASE · ${c.sector}`, title: c.name });
}

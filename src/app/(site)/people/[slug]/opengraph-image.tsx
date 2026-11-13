import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";
import { getPeople, getPerson } from "@/sanity/load";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 604800; // Seven-day fallback; publish webhook handles immediate changes.
export async function generateStaticParams() { return (await getPeople()).map((x) => ({ slug: x.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = await getPerson((await params).slug);
  if (!c) notFound();
  return renderOg({ label: "PEOPLE", title: `${c.name}. ${c.line}` });
}

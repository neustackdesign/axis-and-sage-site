import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";
import { getPractice, getPractices } from "@/sanity/load";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)
export async function generateStaticParams() { return (await getPractices().then((p) => p.filter((x) => x.section === "whatWeDo"))).map((x) => ({ practice: x.slug })); }

export default async function Image({ params }: { params: Promise<{ practice: string }> }) {
  const c = await getPractice((await params).practice);
  if (!c) notFound();
  return renderOg({ label: c.eyebrow, title: c.seo.ogTitle ?? c.h1 });
}

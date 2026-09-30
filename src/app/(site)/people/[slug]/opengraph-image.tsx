import { people, personBySlug } from "@/content/people";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;
export function generateStaticParams() { return people.map((p) => ({ slug: p.slug })); }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = personBySlug(slug)!;
  return renderOg({ label: "PEOPLE", title: `${c.name}. ${c.line}` });
}

import { practiceBySlug, practices } from "@/content/practices";
import { ogContentType, ogSize, renderOg } from "@/lib/og/render";

export const alt = "Axis & Sage Advisory";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamicParams = false;
export function generateStaticParams() { return practices.map((p) => ({ practice: p.slug })); }

export default async function Image({ params }: { params: Promise<{ practice: string }> }) {
  const { practice } = await params;
  const c = practiceBySlug(practice)!;
  return renderOg({ label: c.eyebrow, title: c.h1 });
}

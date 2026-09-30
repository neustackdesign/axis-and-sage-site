import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeView } from "@/components/sections/PracticeView";
import { practiceBySlug, practices } from "@/content/practices";
import { practiceMeta } from "@/content/titles";
import { pageMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ practice: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return practices.map((p) => ({ practice: p.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = practiceBySlug((await params).practice);
  if (!p) return {};
  const m = practiceMeta[p.slug];
  return pageMetadata({ title: m.title, absoluteTitle: true, path: `/what-we-do/${p.slug}`, description: m.description });
}

export default async function PracticePage({ params }: Props) {
  const p = practiceBySlug((await params).practice);
  if (!p) notFound();
  return <PracticeView p={p} trail={[{ name: p.label, path: `/what-we-do/${p.slug}` }]} />;
}

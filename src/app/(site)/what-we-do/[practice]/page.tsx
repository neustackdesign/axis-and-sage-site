import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeView } from "@/components/sections/PracticeView";
import { pageMetadata } from "@/lib/metadata";
import { getPractices } from "@/sanity/load";

type Props = { params: Promise<{ practice: string }> };

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)
export async function generateStaticParams() { return (await getPractices()).filter((p) => p.section === "whatWeDo").map((p) => ({ practice: p.slug })); }

async function load(slug: string) {
  const all = await getPractices();
  return { p: all.find((x) => x.slug === slug && x.section === "whatWeDo"), others: all.filter((x) => x.section === "whatWeDo") };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { p } = await load((await params).practice);
  if (!p) return {};
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: `/what-we-do/${p.slug}`, description: p.seo.description });
}

export default async function PracticePage({ params }: Props) {
  const { p, others } = await load((await params).practice);
  if (!p) notFound();
  return <PracticeView p={p} others={others} trail={[{ name: p.label, path: `/what-we-do/${p.slug}` }]} />;
}

import type { Metadata } from "next";
import { PracticeView } from "@/components/sections/PracticeView";
import { pageMetadata } from "@/lib/metadata";
import { embeddedLeadershipHref } from "@/lib/routes";
import { MissingContentError } from "@/sanity/fetch";
import { getPractice, getPractices } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

async function load() {
  const p = await getPractice("embedded-leadership");
  if (!p) throw new MissingContentError("Practice \"embedded-leadership\"");
  return p;
}

export async function generateMetadata(): Promise<Metadata> {
  const p = await load();
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: embeddedLeadershipHref, description: p.seo.description });
}

export default async function EmbeddedLeadershipPage() {
  const [p, all] = await Promise.all([load(), getPractices()]);
  return <PracticeView p={p} others={all.filter((x) => x.section === "whatWeDo")} trail={[{ name: "Engagements and pricing", path: "/engagements" }, { name: p.label, path: embeddedLeadershipHref }]} />;
}

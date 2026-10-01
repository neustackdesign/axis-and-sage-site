import type { Metadata } from "next";
import { LegalArticle } from "@/components/sections/LegalArticle";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/metadata";
import { getLegal } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegal("privacy");
  return pageMetadata({ title: doc.seo.title ?? doc.title, absoluteTitle: !!doc.seo.title, path: "/privacy", description: doc.seo.description });
}

export default async function PrivacyPage() {
  const doc = await getLegal("privacy");
  return (
    <>
      <Breadcrumbs trail={[{ name: doc.title, path: "/privacy" }]} />
      <LegalArticle doc={doc} />
    </>
  );
}

import type { Metadata } from "next";
import { LegalArticle } from "@/components/sections/LegalArticle";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { pageMetadata } from "@/lib/metadata";
import { getLegal } from "@/sanity/load";

export const revalidate = 86400; // Daily fallback; publish webhook handles immediate changes.

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegal("terms");
  return pageMetadata({ title: doc.seo.title ?? doc.title, absoluteTitle: !!doc.seo.title, path: "/terms", description: doc.seo.description });
}

export default async function TermsPage() {
  const doc = await getLegal("terms");
  return (
    <>
      <Breadcrumbs trail={[{ name: doc.title, path: "/terms" }]} />
      <LegalArticle doc={doc} />
    </>
  );
}

import { LegalArticle } from "@/components/sections/LegalArticle";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { privacyNotice } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: privacyNotice.title, path: "/privacy", description: "How Axis & Sage Advisory collects, uses and protects personal data from axisandsage.com." });

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: privacyNotice.title, path: "/privacy" }]} />
      <LegalArticle doc={privacyNotice} />
    </>
  );
}

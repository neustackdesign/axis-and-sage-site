import { LegalArticle } from "@/components/sections/LegalArticle";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { termsOfUse } from "@/content/legal";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({ title: termsOfUse.title, path: "/terms", description: "The terms that apply to your use of axisandsage.com." });

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: termsOfUse.title, path: "/terms" }]} />
      <LegalArticle doc={termsOfUse} />
    </>
  );
}

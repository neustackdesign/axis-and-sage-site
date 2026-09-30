import { PageHero } from "@/components/ds/PageHero";
import { Section } from "@/components/ds/primitives";
import { contact } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({ title: "Terms", path: "/terms" });

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Terms", path: "/terms" }]} />
      <PageHero label="TERMS" title="Terms." />
      <Section tight labelledBy="body-title">
        <div className="rail-grid">
          <p id="body-title" className="t-label muted">{contact.legalName.toUpperCase()}</p>
          <div className="prose stack-16">
            <p>[Terms text to be supplied and approved before launch.]</p>
            <p>{contact.legalName}, {contact.registeredAddress}. Questions: <a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
          </div>
        </div>
      </Section>
    </>
  );
}

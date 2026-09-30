import { PageHero } from "@/components/ds/PageHero";
import { Section } from "@/components/ds/primitives";
import { contact } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/seo/JsonLd";

export const metadata = pageMetadata({ title: "Privacy", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs trail={[{ name: "Privacy", path: "/privacy" }]} />
      <PageHero label="PRIVACY" title="Privacy." />
      <Section tight labelledBy="body-title">
        <div className="rail-grid">
          <p id="body-title" className="t-label muted">{contact.legalName.toUpperCase()}</p>
          <div className="prose stack-16">
            <p>[Privacy text to be supplied and approved before launch.]</p>
            <p>{contact.legalName}, {contact.registeredAddress}. Questions: <a className="text-link" href={`mailto:${contact.email}`}>{contact.email}</a>.</p>
          </div>
        </div>
      </Section>
    </>
  );
}

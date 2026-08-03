import type { HomePage } from "@/types/content";
import { ContactForm } from "@/components/ui/ContactForm";
import { Apparatus, SectionOpening, TextLink } from "./EditorialPrimitives";

export function ContactSection({ data }: { data: HomePage["contact"] }) {
  const email = data.email || "info@axisandsage.com";
  return <section className="landing-section contact-section" id="contact">
    <SectionOpening index="06" label={data.label} />
    <div className="contact-heading breakout" data-reveal="contact-heading"><h2>{data.heading}</h2><p className="contact-lede prose">{data.introduction}</p><TextLink href={`mailto:${email}`}>{email}</TextLink></div>
    <div className="contact-layout breakout" data-reveal="contact-layout"><div className="contact-details"><Apparatus>Office</Apparatus><span>{data.offices?.[0] || "Abu Dhabi, Dubai, UAE"}</span><Apparatus>Email</Apparatus><a className="underlined-link" href={`mailto:${email}`}>{email}</a></div><div className="contact-form-frame"><ContactForm /></div></div>
  </section>;
}


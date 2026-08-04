import type { HomePage } from "@/types/content";
import { ContactForm } from "@/components/ui/ContactForm";
import { isContactFormConfigured } from "@/lib/contact-availability";
import { Apparatus, SectionOpening, TextLink } from "./EditorialPrimitives";

export function ContactSection({ data }: { data: HomePage["contact"] }) {
  const email = data.email || "info@axisandsage.com";
  const formEnabled = isContactFormConfigured();
  return <section className="landing-section contact-section" id="contact">
    <SectionOpening index="06" label={data.label} />
    <div className="contact-heading breakout" data-reveal="contact-heading"><h2>{data.heading}</h2><p className="contact-lede prose">{data.introduction}</p><TextLink href={`mailto:${email}`}>{email}</TextLink></div>
    <div className="contact-layout breakout" data-reveal="contact-layout"><div className="contact-details"><Apparatus>Base</Apparatus><span>{data.base || data.offices?.[0] || "Dubai, UAE"}</span><Apparatus>Working across</Apparatus><span>{data.workingAcross || "Africa and the GCC"}</span><Apparatus>Email</Apparatus><a className="underlined-link" href={`mailto:${email}`}>{email}</a></div><div className="contact-form-frame">{formEnabled ? <ContactForm /> : <div className="contact-form-unavailable"><p>Online enquiries are not available yet. Please email us directly.</p><TextLink href={`mailto:${email}`}>Email us</TextLink></div>}</div></div>
  </section>;
}

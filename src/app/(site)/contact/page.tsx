import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Section, SmartLink } from "@/components/ds/primitives";
import { ContactForm } from "@/components/forms/ContactForm";
import { contact, whatsappHref, whatsappLabel } from "@/content/site";
import { engagements } from "@/content/engagements";
import { sentenceOf } from "@/lib/leads";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  path: "/contact",
  description: "Tell us who needs to act. One sentence is enough. We reply within one working day with a clear next step.",
});

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || "";

export default async function ContactPage({ searchParams }: Props) {
  const q = await searchParams;
  const sentence = sentenceOf({ who: one(q.who), what: one(q.what), when: one(q.when) });
  const engagementKey = one(q.engagement).toLowerCase();
  const engagement = engagementKey ? engagements.find((e) => e.name.toLowerCase().includes(engagementKey))?.name || one(q.engagement) : "";
  const initialMessage = [sentence, engagement ? `We'd like to talk about: ${engagement}.` : ""].filter(Boolean).join(" ");
  const bookSubject = encodeURIComponent("Book a 30-minute call");

  return (
    <>
      <PageHero label="CONTACT" title="Tell us who needs to act." sub="One sentence is enough. We reply within one working day with a clear next step." />
      <Section tight labelledBy="routes-title">
        <h2 id="routes-title" className="sr-only">Three ways to reach us</h2>
        <div className="contact-routes">
          <section id="book" className="contact-route" aria-labelledby="book-title">
            <Eyebrow>01 · CALL</Eyebrow>
            <h3 id="book-title" className="t-h3">Book a 30-minute call</h3>
            {contact.bookingUrl ? (
              <iframe className="calendar-embed" src={contact.bookingUrl} title="Book a 30-minute call" loading="lazy" />
            ) : (
              <div className="calendar-placeholder">
                <span className="t-label">CALENDAR EMBED · [BOOKING LINK]</span>
                <p className="t-small muted">Until the calendar is connected, email us and we&apos;ll send times.</p>
                <a className="text-link" href={`mailto:${contact.email}?subject=${bookSubject}`}>Ask for a time<span className="text-link-arrow" aria-hidden="true">▸</span></a>
              </div>
            )}
          </section>
          <section id="note" className="contact-route contact-route-form" aria-labelledby="note-title">
            <Eyebrow>02 · NOTE</Eyebrow>
            <h3 id="note-title" className="t-h3">Send a note</h3>
            <ContactForm initialMessage={initialMessage} initialWhen={one(q.when)} />
          </section>
          <section id="whatsapp" className="contact-route" aria-labelledby="wa-title">
            <Eyebrow>03 · WHATSAPP</Eyebrow>
            <h3 id="wa-title" className="t-h3">WhatsApp</h3>
            <p className="muted">{whatsappLabel()}</p>
            <SmartLink className="text-link" href={whatsappHref()}>Chat with us<span className="text-link-arrow" aria-hidden="true">▸</span></SmartLink>
          </section>
        </div>
      </Section>
      <Section tone="alt" tight labelledBy="details-title">
        <div className="section-header rail-grid">
          <Eyebrow strong as="div"><span id="details-title">DETAILS</span></Eyebrow>
          <div className="spec-grid" style={{ ["--cols" as string]: 3 }}>
            <div className="spec-cell"><div className="spec-cell-head t-label"><span>EMAIL</span><span>01</span></div><a className="spec-cell-value text-link" href={`mailto:${contact.email}`}>{contact.email}</a></div>
            <div className="spec-cell"><div className="spec-cell-head t-label"><span>REGISTERED</span><span>02</span></div><p className="spec-cell-value">{contact.legalName}, {contact.registeredAddressShort}</p></div>
            <div className="spec-cell"><div className="spec-cell-head t-label"><span>FOUNDERS</span><span>03</span></div><p className="spec-cell-value">{contact.foundersBased}</p></div>
          </div>
        </div>
      </Section>
    </>
  );
}

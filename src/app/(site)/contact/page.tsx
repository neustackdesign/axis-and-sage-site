import { Suspense } from "react";
import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Section, SmartLink } from "@/components/ds/primitives";
import { ContactForm, ContactFormFromQuery } from "@/components/forms/ContactForm";
import { CalEmbed } from "@/components/forms/CalEmbed";
import { contact, whatsappHref } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  path: "/contact",
  description: "Tell us who needs to act. One sentence is enough. We reply within one working day with a clear next step.",
});

export default function ContactPage() {
  const wa = whatsappHref();
  const booking = !!contact.bookingUrl;
  const routes = [booking, true, !!wa].filter(Boolean).length;
  return (
    <>
      <PageHero label="CONTACT" title="Tell us who needs to act." sub="One sentence is enough. We reply within one working day with a clear next step." />
      <Section tight labelledBy="routes-title">
        <h2 id="routes-title" className="sr-only">Ways to reach us</h2>
        <div className={`contact-routes routes-${routes}`}>
          {booking ? (
            <section id="book" className="contact-route" aria-labelledby="book-title">
              <Eyebrow>01 · CALL</Eyebrow>
              <h3 id="book-title" className="t-h3">Book a 30-minute call</h3>
              <CalEmbed url={contact.bookingUrl} />
            </section>
          ) : null}
          {/* While the booking link is unset, the note form takes the booking route's place (#book). */}
          <section id={booking ? "note" : "book"} className="contact-route contact-route-form" aria-labelledby="note-title">
            {!booking ? <span id="note" className="sr-only" /> : null}
            <Eyebrow>{booking ? "02 · NOTE" : "01 · NOTE"}</Eyebrow>
            <h3 id="note-title" className="t-h3">Send a note</h3>
            <Suspense fallback={<ContactForm />}><ContactFormFromQuery /></Suspense>
          </section>
          {wa ? (
            <section id="whatsapp" className="contact-route" aria-labelledby="wa-title">
              <Eyebrow>{booking ? "03" : "02"} · WHATSAPP</Eyebrow>
              <h3 id="wa-title" className="t-h3">WhatsApp</h3>
              <p className="muted">{contact.whatsappNumber}</p>
              <SmartLink className="text-link" href={wa}>Chat with us<span className="text-link-arrow" aria-hidden="true">▸</span></SmartLink>
            </section>
          ) : null}
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

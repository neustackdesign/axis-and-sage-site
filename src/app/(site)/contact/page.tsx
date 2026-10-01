import { Suspense } from "react";
import { PageHero } from "@/components/ds/PageHero";
import { Eyebrow, Section, SmartLink } from "@/components/ds/primitives";
import { ContactForm, ContactFormFromQuery } from "@/components/forms/ContactForm";
import { CalEmbed } from "@/components/forms/CalEmbed";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getEngagements, getSettings, getSitePage } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("contact");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/contact", description: p.seo.description });
}

export default async function ContactPage() {
  const [p, contact, e] = await Promise.all([getSitePage("contact"), getSettings(), getEngagements()]);
  const engagementNames = [...e.columns, ...e.specialists].map((x) => x.name);
  const wa = whatsappLink(contact.whatsappMessage);
  const booking = !!contact.bookingUrl;
  const routes = [booking, true, !!wa].filter(Boolean).length;
  return (
    <>
      <Breadcrumbs trail={[{ name: "Contact", path: "/contact" }]} />
      <PageHero label={p.hero.label} title={p.hero.title} sub={p.hero.sub} />
      <Section tight labelledBy="routes-title">
        <h2 id="routes-title" className="sr-only">Ways to reach us</h2>
        <div className={`contact-routes routes-${routes}`}>
          {booking ? (
            <section id="book" className="contact-route" aria-labelledby="book-title">
              <Eyebrow>01 · CALL</Eyebrow>
              <h3 id="book-title" className="t-h3">{p.strings.callTitle}</h3>
              <CalEmbed url={contact.bookingUrl} />
            </section>
          ) : null}
          {/* While the booking link is unset, the note form takes the booking route's place (#book). */}
          <section id={booking ? "note" : "book"} className="contact-route contact-route-form" aria-labelledby="note-title">
            {!booking ? <span id="note" className="sr-only" /> : null}
            <Eyebrow>{booking ? "02 · NOTE" : "01 · NOTE"}</Eyebrow>
            <h3 id="note-title" className="t-h3">{p.strings.noteTitle}</h3>
            <Suspense fallback={<ContactForm />}><ContactFormFromQuery engagements={engagementNames} /></Suspense>
          </section>
          {wa ? (
            <section id="whatsapp" className="contact-route" aria-labelledby="wa-title">
              <Eyebrow>{booking ? "03" : "02"} · WHATSAPP</Eyebrow>
              <h3 id="wa-title" className="t-h3">{p.strings.whatsappTitle}</h3>
              <p className="muted">{wa.number}</p>
              <SmartLink className="text-link" href={wa.href}>{p.strings.whatsappLink}<span className="text-link-arrow" aria-hidden="true">▸</span></SmartLink>
            </section>
          ) : null}
        </div>
      </Section>
      <Section tone="alt" tight labelledBy="details-title">
        <div className="section-header rail-grid">
          <Eyebrow strong as="div"><span id="details-title">DETAILS</span></Eyebrow>
          <div className="spec-grid" style={{ ["--cols" as string]: 3 }}>
            <div className="spec-cell"><div className="spec-cell-head t-label"><span>EMAIL</span><span>01</span></div><a className="spec-cell-value text-link" href={`mailto:${contact.contactEmail}`}>{contact.contactEmail}</a></div>
            <div className="spec-cell"><div className="spec-cell-head t-label"><span>REGISTERED</span><span>02</span></div><p className="spec-cell-value">{contact.legalName}, {contact.registeredAddressShort}</p></div>
            <div className="spec-cell"><div className="spec-cell-head t-label"><span>FOUNDERS</span><span>03</span></div><p className="spec-cell-value">{contact.foundersBased}</p></div>
          </div>
        </div>
      </Section>
    </>
  );
}

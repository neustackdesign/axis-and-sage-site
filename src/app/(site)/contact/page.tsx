import type { Metadata } from "next";
import { Suspense } from "react";
import { CalEmbed } from "@/components/forms/CalEmbed";
import { ContactPaths, ContactPathsFromQuery } from "@/components/v26/ContactPaths";
import { pageMetadata } from "@/lib/metadata";
import { whatsappLink } from "@/lib/whatsapp";
import { Breadcrumbs } from "@/components/seo/JsonLd";
import { getSettings, getSitePage } from "@/sanity/load";

export const revalidate = 60; // REVALIDATE_SECONDS (segment config must be a literal)

export async function generateMetadata(): Promise<Metadata> {
  const p = await getSitePage("contact");
  return pageMetadata({ title: p.seo.title, absoluteTitle: true, path: "/contact", description: p.seo.description });
}

export default async function ContactPage() {
  const [p, contact] = await Promise.all([getSitePage("contact"), getSettings()]);
  const wa = whatsappLink(contact.whatsappMessage);
  const t = p.strings;
  // Until starting points are published, the form still works as one general enquiry.
  const paths = p.paths.length ? p.paths : [{ key: "call", title: t.noteTitle ?? "Send a note", line: p.hero.sub ?? "", label: "General enquiry", who: "investors", what: "commit to the round" }];
  const copy = { title: p.hero.title, sub: p.hero.sub, label: p.hero.label, note: t.formNote, email: contact.contactEmail, based: contact.foundersBased };
  return (
    <div className="v26">
      <Breadcrumbs trail={[{ name: "Contact", path: "/contact" }]} />
      <section className="t-sun bleed" id="note" aria-labelledby="page-title">
        <Suspense fallback={<ContactPaths paths={paths} copy={copy} />}><ContactPathsFromQuery paths={paths} copy={copy} /></Suspense>
      </section>
      {contact.bookingUrl ? (
        <section className="sec" id="book" aria-labelledby="book-title">
          <div className="wrap g12" style={{ rowGap: 24 }}>
            <div className="s4 stack"><p className="lbl ink">{t.bookLabel ?? "Book"}</p><h2 id="book-title" className="h2 xs">{t.callTitle}</h2>
              {wa ? <p className="small"><a className="tl more" href={wa.href}>{t.whatsappLink ?? "WhatsApp"} · {wa.number}</a></p> : null}
              <p className="small muted">{contact.legalName}, {contact.registeredAddressShort}</p>
            </div>
            <div className="s8"><CalEmbed url={contact.bookingUrl} /></div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

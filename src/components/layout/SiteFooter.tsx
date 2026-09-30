import Link from "next/link";
import { OrbitRings } from "@/components/ds/blocks";
import { Lockup } from "@/components/ds/primitives";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { contact, footerColumns, legalLine, newsletter, whatsappHref } from "@/content/site";

/** Footer: charcoal, newsletter first, four columns, contact and legal lines, dotted orbit rings behind. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <OrbitRings className="footer-orbits" />
      <div className="wrap">
        <div className="footer-news">
          <div>
            <p className="t-label muted" style={{ color: "var(--text-muted-dark)", marginBottom: 12 }}>NEWSLETTER</p>
            <h2>{newsletter.name}</h2>
            <p>{newsletter.line}</p>
          </div>
          <NewsletterForm dark />
        </div>
        <div className="footer-cols">
          <div className="footer-brand"><Link href="/" aria-label="Axis & Sage Advisory, home"><Lockup dark /></Link></div>
          {footerColumns.map((col) => (
            <nav className="footer-col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>{col.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            </nav>
          ))}
        </div>
        <p className="footer-contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          {whatsappHref() ? <><span aria-hidden="true">·</span><a href={whatsappHref()!}>WhatsApp {contact.whatsappNumber}</a></> : null}
          {contact.companyLinkedIn ? <><span aria-hidden="true">·</span><a href={contact.companyLinkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a></> : null}
        </p>
        <p className="footer-legal t-label"><span>{legalLine}</span><span>AFRICA · GCC</span></p>
      </div>
    </footer>
  );
}

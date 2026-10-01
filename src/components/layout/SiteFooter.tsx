import Link from "next/link";
import { OrbitRings } from "@/components/ds/blocks";
import { Lockup } from "@/components/ds/primitives";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import type { SiteSettings } from "@/lib/content/types";
import { whatsappLink } from "@/lib/whatsapp";

/** Footer: charcoal, newsletter first, four columns, contact and legal lines, dotted orbit rings behind. */
export function SiteFooter({ settings: s }: { settings: SiteSettings }) {
  const wa = whatsappLink(s.whatsappMessage);
  return (
    <footer className="site-footer">
      <OrbitRings className="footer-orbits" />
      <div className="wrap">
        <div className="footer-news">
          <div>
            <p className="t-label muted" style={{ color: "var(--text-muted-dark)", marginBottom: 12 }}>NEWSLETTER</p>
            <h2>{s.newsletter.name}</h2>
            <p>{s.newsletter.line}</p>
          </div>
          <NewsletterForm dark />
        </div>
        <div className="footer-cols">
          <div className="footer-brand"><Link href="/" aria-label={`${s.companyName}, home`}><Lockup dark /></Link></div>
          {s.footerColumns.map((col) => (
            <nav className="footer-col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>{col.links.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul>
            </nav>
          ))}
        </div>
        <p className="footer-contact">
          <a href={`mailto:${s.contactEmail}`}>{s.contactEmail}</a>
          {wa ? <><span aria-hidden="true">·</span><a href={wa.href}>WhatsApp {wa.number}</a></> : null}
          {s.socialLinks.map((l) => <span key={l.href} style={{ display: "contents" }}><span aria-hidden="true">·</span><a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a></span>)}
        </p>
        <p className="footer-legal t-label"><span>{s.legalLine}</span><span>{s.regionTag}</span></p>
      </div>
    </footer>
  );
}

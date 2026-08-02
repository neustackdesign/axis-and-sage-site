import Link from "next/link";
import type { LinkValue, SiteSettings } from "@/types/content";

function FooterLinks({ items }: { items: LinkValue[] }) {
  return <ul>{items.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>;
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <p className="eyebrow">Axis &amp; Sage</p>
          <p className="footer-statement">The strategic partner for businesses, brands and products that matter.</p>
        </div>
        <div className="footer-links">
          <p className="eyebrow">Quick links</p>
          <FooterLinks items={settings.footerNavigation} />
        </div>
        <div className="footer-contact">
          <p className="eyebrow">Start a conversation</p>
          <Link className="footer-cta" href="#contact">Tell us what you&apos;re building <span aria-hidden="true">↗</span></Link>
          {settings.contactEmail ? <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a> : <span className="pending-copy">Contact email pending confirmation</span>}
        </div>
      </div>
      <div className="footer-bottom container">
        <span>{settings.copyright}</span>
        <span>Built with clarity.</span>
      </div>
    </footer>
  );
}

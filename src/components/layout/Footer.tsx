import Link from "next/link";
import type { LinkValue, SiteSettings } from "@/types/content";

function FooterLinks({ items }: { items: LinkValue[] }) {
  return <ul>{items.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>;
}

export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="site-footer">
      <div className="footer-top container">
        <div className="footer-brand"><img className="footer-logo" src="/images/axis-sage/logo.png" alt="Axis & Sage Consulting" /></div>
        <div className="footer-links">
          <p className="eyebrow">Quick links</p>
          <FooterLinks items={settings.footerNavigation} />
        </div>
      </div>
      <div className="footer-bottom container">
        {settings.copyright ? <span>{settings.copyright}</span> : null}
      </div>
    </footer>
  );
}

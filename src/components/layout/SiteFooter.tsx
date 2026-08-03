import Link from "next/link";
import type { LinkValue, SiteSettings } from "@/types/content";
import { Apparatus } from "@/components/home/EditorialPrimitives";

function FooterLinks({ items }: { items: LinkValue[] }) {
  return <ul>{items.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>;
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return <footer className="site-footer"><div className="footer-shell shell"><div className="footer-rule" aria-hidden="true" /><div className="footer-utilities"><Link className="footer-wordmark" href="/" aria-label="Axis & Sage home"><img src="/images/axis-sage/logo-dark.png" alt="Axis & Sage Consulting" /></Link><div className="footer-navigation"><FooterLinks items={settings.footerNavigation} /></div><div className="footer-contact"><a href={`mailto:${settings.contactEmail || "info@axisandsage.com"}`}>{settings.contactEmail || "info@axisandsage.com"}</a>{settings.socialLinks?.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}</div><div className="footer-copyright"><Apparatus>{settings.copyright || "© 2026 Axis & Sage"}</Apparatus><Apparatus>{settings.workingAcross || settings.officeLocations?.[0] || "Dubai, UAE"}</Apparatus></div></div></div></footer>;
}

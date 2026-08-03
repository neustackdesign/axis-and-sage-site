import Link from "next/link";
import type { LinkValue, SiteSettings } from "@/types/content";
import { Apparatus, TextLink } from "@/components/home/EditorialPrimitives";

function FooterLinks({ items }: { items: LinkValue[] }) {
  return <ul>{items.map((item) => <li key={item.href}><Link href={item.href}>{item.label}</Link></li>)}</ul>;
}

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return <footer className="site-footer"><div className="footer-shell shell"><div className="footer-closing breakout"><h2>Let&apos;s build something that matters.</h2><TextLink href="#contact">Start a conversation</TextLink></div><div className="footer-rule" aria-hidden="true" /><div className="footer-utilities"><Link className="footer-wordmark" href="/" aria-label="Axis & Sage home"><img src="/images/axis-sage/logo.png" alt="Axis & Sage Consulting" /></Link><div className="footer-navigation"><Apparatus>Navigate</Apparatus><FooterLinks items={settings.footerNavigation} /></div><div className="footer-copyright"><Apparatus>{settings.copyright || "Axis & Sage"}</Apparatus></div></div></div></footer>;
}


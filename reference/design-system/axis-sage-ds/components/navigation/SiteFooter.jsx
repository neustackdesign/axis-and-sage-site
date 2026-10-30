import React from "react";
import { Lockup } from "../brand/Lockup.jsx";
import { Ribbons } from "../brand/Ribbons.jsx";
const COLS = [
  { title: "What we do", links: ["Strategy & Investment", "Product & Technology", "Brand & Market", "Engagements and pricing", "Embedded leadership"] },
  { title: "Work", links: ["All work", "Investors commit", "Partners sign", "Teams execute", "Customers buy"] },
  { title: "Library", links: ["Tools", "Guides", "Newsletter"] },
  { title: "Company", links: ["Conversion Design", "People", "Contact", "Privacy", "Terms"] },
];
/** Footer: Midnight, newsletter first, four columns, contact and legal lines, dotted ribbons behind. */
export function SiteFooter({ assetBase = "assets/brand", onNavigate = () => {} }) {
  const go = (l) => (e) => { e.preventDefault(); onNavigate(l); };
  return (
    <footer className="site-footer">
      <div className="footer-ribbons" aria-hidden="true"><Ribbons crop="full" tone="outline" /></div>
      <div className="wrap">
        <div className="footer-news">
          <div>
            <p className="t-label" style={{ color: "var(--text-muted-dark)", marginBottom: 12 }}>NEWSLETTER</p>
            <h2>Terms & Moments</h2>
            <p>Each month, one decision that didn't turn into action: why, and what fixed it.</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input className="field-control" type="email" placeholder="you@company.com" aria-label="Email" />
            <button className="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
        <div className="footer-cols">
          <div className="footer-brand"><Lockup dark assetBase={assetBase} /></div>
          {COLS.map((col) => (
            <nav className="footer-col" key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>{col.links.map((l) => <li key={l}><a href="#" onClick={go(l)}>{l}</a></li>)}</ul>
            </nav>
          ))}
        </div>
        <p className="footer-contact"><a href="mailto:info@axisandsage.com">info@axisandsage.com</a><span aria-hidden="true">·</span><a href="#">LinkedIn</a></p>
        <p className="footer-legal t-label"><span>© 2026 Axis & Sage Advisory Limited · Masdar City Free Zone, Abu Dhabi, United Arab Emirates</span><span>AFRICA AND THE GCC</span></p>
      </div>
    </footer>
  );
}

import React from "react";
import { Lockup } from "../brand/Lockup.jsx";
const GROUPS = {
  whatWeDo: { label: "What we do", eyebrow: "WHAT WE DO", blurb: "Strategy & Investment fixes terms. Product & Technology fixes moments. Brand & Market fixes the promise and the message.", items: [
    { label: "Strategy & Investment", desc: "Get the terms right." }, { label: "Product & Technology", desc: "Make the moment clear." },
    { label: "Brand & Market", desc: "Say it so they act." }, { label: "Engagements and pricing", desc: "Start with one sentence. Know the price before we start." } ] },
  library: { label: "Library", eyebrow: "LIBRARY", blurb: "Built from the frameworks we use with clients. No sign-up to use them.", items: [
    { label: "Tools", desc: "Free tools for the decision in front of you." }, { label: "Guides", desc: "Delegation of authority, ESOPs, investor readiness, pitch decks and the payment screen." },
    { label: "Newsletter", desc: "Terms & Moments, each month." } ] },
};
const LINKS = ["Work", "Conversion Design", "People"];
/** Nav · Nav.Dropdown. Default: sticky Cloud bar, 1px rule. Hero: transparent on-dark over the homepage cover. */
export function SiteHeader({ variant = "default", current, assetBase = "assets/brand", onNavigate = () => {} }) {
  const [menu, setMenu] = React.useState(null);
  const overArt = variant === "hero";
  const go = (l) => (e) => { e.preventDefault(); setMenu(null); onNavigate(l); };
  return (
    <header className={["site-header", overArt ? "is-hero on-dark" : ""].filter(Boolean).join(" ")}>
      <div className="wrap site-header-inner">
        <a href="#" onClick={go("Home")} aria-label="Axis & Sage Advisory, home"><Lockup dark={overArt} assetBase={assetBase} /></a>
        <nav className="nav-desktop" aria-label="Primary">
          <div className="nav-item"><button className="nav-link" type="button" aria-expanded={menu === "whatWeDo"} onClick={() => setMenu(menu === "whatWeDo" ? null : "whatWeDo")}>What we do<span className="nav-chev" aria-hidden="true">▾</span></button></div>
          {LINKS.map((l) => <div className="nav-item" key={l}><a className="nav-link" href="#" onClick={go(l)} aria-current={current === l ? "page" : undefined}>{l}</a></div>)}
          <div className="nav-item"><button className="nav-link" type="button" aria-expanded={menu === "library"} onClick={() => setMenu(menu === "library" ? null : "library")}>Library<span className="nav-chev" aria-hidden="true">▾</span></button></div>
          <div className="nav-actions">
            <a className="text-link" href="#" onClick={go("Scorecard")}>Take the Scorecard</a>
            <a className="btn btn-primary btn-sm" href="#" onClick={go("Contact")}>Book a call</a>
          </div>
        </nav>
      </div>
      {menu ? (
        <div className="nav-panel">
          <div className="wrap nav-panel-inner">
            <div className="nav-panel-intro"><p className="t-label">{GROUPS[menu].eyebrow}</p><p>{GROUPS[menu].blurb}</p></div>
            <div className="nav-panel-list">
              {GROUPS[menu].items.map((i) => <a key={i.label} href="#" onClick={go(i.label)}><span className="nav-panel-title">{i.label}</span><span className="nav-panel-desc">{i.desc}</span></a>)}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

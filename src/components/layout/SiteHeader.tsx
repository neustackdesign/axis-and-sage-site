"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Lockup } from "@/components/ds/primitives";
import type { HeaderNav, NavGroup } from "@/lib/content/types";

type MenuKey = "whatWeDo" | "library";
export type HeaderVariant = "default" | "hero";

function isActive(pathname: string, href: string) {
  const path = href.split(/[?#]/)[0];
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

function Dropdown({ group, id, onNavigate }: { group: NavGroup; id: string; onNavigate: () => void }) {
  return (
    <div className="nav-panel" id={id}>
      <div className="wrap nav-panel-inner">
        <div className="nav-panel-intro">
          <p className="t-label">{group.eyebrow}</p>
          <p>{group.blurb}</p>
        </div>
        <div className="nav-panel-list">
          {group.items.map((item) => (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <span className="nav-panel-title">{item.label}</span>
              {item.description ? <span className="nav-panel-desc">{item.description}</span> : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Nav · Nav.Dropdown · Nav.Drawer. Default: sticky paper bar, 1px rule below, one orange button.
 * Hero (homepage only): transparent, on-dark, laid over the top of the homepage cover. Dropdowns and the drawer
 * still open on paper, and the bar turns paper while the drawer is open.
 */
export function SiteHeader({ variant = "default", nav }: { variant?: HeaderVariant; nav: HeaderNav }) {
  const { navigation: navGroups, primaryCta, scorecardCta } = nav;
  const primaryLinks = navGroups.primaryLinks;
  const pathname = usePathname() || "/";
  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState<MenuKey | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const drawerButton = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close menus when the route changes (state adjusted during render, not in an effect).
  const [routeSeen, setRouteSeen] = useState(pathname);
  if (routeSeen !== pathname) { setRouteSeen(pathname); setMenu(null); setDrawer(false); }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (drawer) { setDrawer(false); drawerButton.current?.focus(); }
      setMenu(null);
    };
    const onClick = (e: MouseEvent) => { if (headerRef.current && !headerRef.current.contains(e.target as Node)) setMenu(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onClick); };
  }, [drawer]);

  useEffect(() => {
    document.body.classList.toggle("nav-is-open", drawer);
    if (drawer) drawerRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.body.classList.remove("nav-is-open");
  }, [drawer]);

  const close = () => { setMenu(null); setDrawer(false); };
  const groups: MenuKey[] = ["whatWeDo", "library"];

  const overArt = variant === "hero" && !drawer;
  const className = ["site-header", variant === "hero" ? "is-hero" : "", drawer ? "is-open" : "", overArt ? "on-dark" : ""].filter(Boolean).join(" ");

  return (
    <header className={className} ref={headerRef}>
      <div className="wrap site-header-inner">
        <Link href="/" aria-label="Axis & Sage Advisory, home" onClick={close}><Lockup dark={overArt} /></Link>

        <nav className="nav-desktop" aria-label="Primary">
          <div className="nav-item">
            <button className="nav-link" type="button" aria-expanded={menu === "whatWeDo"} aria-controls="nav-panel-what-we-do" onClick={() => setMenu(menu === "whatWeDo" ? null : "whatWeDo")}>
              {navGroups.whatWeDo.label}<span className="nav-chev" aria-hidden="true">▾</span>
            </button>
          </div>
          {primaryLinks.map((l) => (
            <div className="nav-item" key={l.href}>
              <Link className="nav-link" href={l.href} aria-current={isActive(pathname, l.href) ? "page" : undefined}>{l.label}</Link>
            </div>
          ))}
          <div className="nav-item">
            <button className="nav-link" type="button" aria-expanded={menu === "library"} aria-controls="nav-panel-library" onClick={() => setMenu(menu === "library" ? null : "library")}>
              {navGroups.library.label}<span className="nav-chev" aria-hidden="true">▾</span>
            </button>
          </div>
          <div className="nav-actions">
            <Link className="text-link" href={scorecardCta.href}>{scorecardCta.label}</Link>
            <Link className="btn btn-primary btn-sm" href={primaryCta.href}>{primaryCta.label}</Link>
          </div>
        </nav>

        <div className="nav-compact">
          <Link className="btn btn-primary btn-sm" href={primaryCta.href} onClick={close}>{primaryCta.label}</Link>
          <button ref={drawerButton} className="menu-button" type="button" aria-expanded={drawer} aria-controls="nav-drawer" onClick={() => setDrawer((v) => !v)}>
            {drawer ? "CLOSE" : "MENU"}
          </button>
        </div>
      </div>

      {groups.map((key) => menu === key ? <Dropdown key={key} id={`nav-panel-${navGroups[key].key}`} group={navGroups[key]} onNavigate={close} /> : null)}

      <div className="drawer" id="nav-drawer" hidden={!drawer} ref={drawerRef} role="dialog" aria-modal="true" aria-label="Site menu">
        <div className="wrap drawer-inner">
          <ul className="drawer-list">
            {(["whatWeDo"] as MenuKey[]).map((key) => (
              <li key={key}>
                <button className="drawer-row" type="button" aria-expanded={drawerGroup === key} onClick={() => setDrawerGroup(drawerGroup === key ? null : key)}>
                  {navGroups[key].label}<span className="nav-chev" aria-hidden="true">{drawerGroup === key ? "▴" : "▾"}</span>
                </button>
                {drawerGroup === key ? <div className="drawer-sub">{navGroups[key].items.map((i) => <Link key={i.href} href={i.href} onClick={close}>{i.label}</Link>)}</div> : null}
              </li>
            ))}
            {primaryLinks.map((l) => <li key={l.href}><Link className="drawer-row" href={l.href} onClick={close}>{l.label}<span className="nav-chev" aria-hidden="true">▸</span></Link></li>)}
            <li>
              <button className="drawer-row" type="button" aria-expanded={drawerGroup === "library"} onClick={() => setDrawerGroup(drawerGroup === "library" ? null : "library")}>
                {navGroups.library.label}<span className="nav-chev" aria-hidden="true">{drawerGroup === "library" ? "▴" : "▾"}</span>
              </button>
              {drawerGroup === "library" ? <div className="drawer-sub">{navGroups.library.items.map((i) => <Link key={i.href} href={i.href} onClick={close}>{i.label}</Link>)}</div> : null}
            </li>
            <li><Link className="drawer-row" href={scorecardCta.href} onClick={close}>{scorecardCta.label}<span className="nav-chev" aria-hidden="true">▸</span></Link></li>
          </ul>
          <div className="drawer-foot">
            <Link className="btn btn-primary" href={primaryCta.href} onClick={close}>{primaryCta.label}</Link>
            {nav.whatsapp ? <a className="text-link" href={nav.whatsapp.href}>WhatsApp us · {nav.whatsapp.number}<span className="text-link-arrow" aria-hidden="true">▸</span></a> : null}
            <div className="drawer-foot-meta t-label"><span>{nav.locations.join(" · ").toUpperCase()}</span><a href={`mailto:${nav.contactEmail}`}>{nav.contactEmail.toUpperCase()}</a></div>
            {/* The visible CLOSE button sits in the bar, outside the dialog; this one keeps closing reachable inside it. */}
            <button type="button" className="sr-only drawer-close-hidden" onClick={() => { setDrawer(false); drawerButton.current?.focus(); }}>Close menu</button>
          </div>
        </div>
      </div>
    </header>
  );
}

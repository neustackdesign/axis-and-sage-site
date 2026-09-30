"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Lockup } from "@/components/ds/primitives";
import { bookCallHref, contact, navGroups, primaryLinks, scorecardHref, whatsappHref, type NavGroup } from "@/content/site";

type MenuKey = "whatWeDo" | "library";

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

/** Nav · Nav.Dropdown · Nav.Drawer. Paper bar, 1px rule below, one orange button. */
export function SiteHeader() {
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

  return (
    <header className="site-header" ref={headerRef}>
      <div className="wrap site-header-inner">
        <Link href="/" aria-label="Axis & Sage Advisory, home" onClick={close}><Lockup /></Link>

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
            <Link className="text-link" href={scorecardHref}>Take the Scorecard</Link>
            <Link className="btn btn-primary btn-sm" href={bookCallHref}>Book a call</Link>
          </div>
        </nav>

        <div className="nav-compact">
          <Link className="btn btn-primary btn-sm" href={bookCallHref} onClick={close}>Book a call</Link>
          <button ref={drawerButton} className="menu-button" type="button" aria-expanded={drawer} aria-controls="nav-drawer" onClick={() => setDrawer((v) => !v)}>
            {drawer ? "CLOSE" : "MENU"}
          </button>
        </div>
      </div>

      {groups.map((key) => menu === key ? <Dropdown key={key} id={`nav-panel-${navGroups[key].key}`} group={navGroups[key]} onNavigate={close} /> : null)}

      <div className="drawer" id="nav-drawer" hidden={!drawer} ref={drawerRef} aria-label="Menu">
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
            <li><Link className="drawer-row" href={scorecardHref} onClick={close}>Take the Scorecard<span className="nav-chev" aria-hidden="true">▸</span></Link></li>
          </ul>
          <div className="drawer-foot">
            <Link className="btn btn-primary" href={bookCallHref} onClick={close}>Book a call</Link>
            {whatsappHref() ? <a className="text-link" href={whatsappHref()!}>WhatsApp us · {contact.whatsappNumber}<span className="text-link-arrow" aria-hidden="true">▸</span></a> : null}
            <div className="drawer-foot-meta t-label"><span>ABU DHABI · DUBAI · LAGOS</span><a href={`mailto:${contact.email}`}>{contact.email.toUpperCase()}</a></div>
          </div>
        </div>
      </div>
    </header>
  );
}

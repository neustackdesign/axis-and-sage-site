"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LinkValue } from "@/types/content";

export function SiteHeader({ navigation }: { navigation: LinkValue[] }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab" && open && menuRef.current) {
        const links = menuRef.current.querySelectorAll("a");
        if (!links.length) return;
        if (event.shiftKey && document.activeElement === links[0]) {
          event.preventDefault();
          links[links.length - 1].focus();
        } else if (!event.shiftKey && document.activeElement === links[links.length - 1]) {
          event.preventDefault();
          links[0].focus();
        }
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.toggle("nav-is-open", open);
    if (open) menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("nav-is-open");
    };
  }, [open]);

  return <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
    <div className="shell header-inner">
      <Link className="site-wordmark" href="/" aria-label="Axis & Sage home"><img src="/images/axis-sage/logo.png" alt="Axis & Sage Consulting" /></Link>
      <nav className="desktop-navigation" aria-label="Primary navigation">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav>
      <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((value) => !value)}><span className="menu-lines" aria-hidden="true"><i /><i /><i /></span></button>
      <div className={`mobile-navigation${open ? " is-open" : ""}`} id="mobile-navigation" ref={menuRef} aria-hidden={!open}><nav aria-label="Mobile navigation">{navigation.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav></div>
    </div>
  </header>;
}


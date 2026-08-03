"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LinkValue } from "@/types/content";

type HeaderProps = { navigation: LinkValue[] };

export function Header({ navigation }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileNavigationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !open) return;
      const links = Array.from(mobileNavigationRef.current?.querySelectorAll<HTMLAnchorElement>("a") || []);
      if (!links.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.toggle("nav-is-open", open);
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (open) window.setTimeout(() => mobileNavigationRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      document.body.classList.remove("nav-is-open");
    };
  }, [open]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <Link className="site-logo" href="/" aria-label="Axis & Sage home"><img src="/images/axis-sage/logo.png" alt="Axis & Sage Consulting" /></Link>
      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="menu-lines" aria-hidden="true"><i /><i /><i /></span>
      </button>
      <div ref={mobileNavigationRef} className={`mobile-navigation${open ? " is-open" : ""}`} id="mobile-navigation" aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

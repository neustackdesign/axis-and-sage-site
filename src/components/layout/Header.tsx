"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LinkValue } from "@/types/content";

type HeaderProps = { navigation: LinkValue[] };

export function Header({ navigation }: HeaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.toggle("nav-is-open", open);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("nav-is-open");
    };
  }, [open]);

  return (
    <header className="site-header">
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
      <div className={`mobile-navigation${open ? " is-open" : ""}`} id="mobile-navigation" aria-hidden={!open}>
        <nav aria-label="Mobile navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

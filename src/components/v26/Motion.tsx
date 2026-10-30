"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One controller for scroll reveals on 2026 pages. Marks <html class="mo"> once script runs, so content is visible
 * without it, then adds `in` to each [data-sec] as it enters the viewport. A fallback reveals everything after 4.5s
 * (anchor jumps, print, a stalled observer). Reduced motion is handled in CSS: everything rests on its final frame.
 */
export function Motion() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const secs = Array.from(document.querySelectorAll<HTMLElement>(".v26 [data-sec]"));
    if (!secs.length) return;
    const reveal = (el: Element) => el.classList.add("in");
    if (typeof IntersectionObserver === "undefined") { secs.forEach(reveal); return; }
    root.classList.add("mo"); // already set by the inline script in the root layout; kept for client navigations
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { threshold: 0.12 });
    secs.forEach((s) => io.observe(s));
    const fallback = window.setTimeout(() => secs.forEach(reveal), 4500);
    return () => { io.disconnect(); window.clearTimeout(fallback); };
  }, [pathname]);
  return null;
}

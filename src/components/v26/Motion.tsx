"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * One controller for scroll reveals on 2026 pages. Marks <html class="mo"> once script runs, so content is visible
 * without it, then adds `in` to each [data-sec] as it enters the viewport. It also marks <html data-motion>, which stands
 * down the inline fallback in the root layout (that one only covers script that never hydrates). Its own fallback
 * reveals what is on or above the screen after 1.5s (anchor jumps, restored scroll); sections below still reveal on
 * scroll. Reduced motion is handled in CSS: everything rests on its final frame.
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
    root.dataset.motion = "on";
    // 0.12 of a section, or 30% of the screen for sections taller than it
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting && (e.intersectionRatio >= 0.12 || e.intersectionRect.height >= window.innerHeight * 0.3)) { reveal(e.target); io.unobserve(e.target); }
    }), { threshold: [0, 0.12, 0.3, 0.6] });
    secs.forEach((s) => io.observe(s));
    const fallback = window.setTimeout(() => secs.forEach((s) => { if (s.getBoundingClientRect().top < window.innerHeight) reveal(s); }), 1500);
    return () => { io.disconnect(); window.clearTimeout(fallback); };
  }, [pathname]);
  return null;
}

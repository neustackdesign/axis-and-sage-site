"use client";

import { useEffect, useState, type RefObject } from "react";

/** The track's progress through the screen, 0 to 1. Pinned (taller than the screen): its scroll range.
 *  Unpinned (mobile, short sections): its passage across the middle of the screen. */
function progress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const range = r.height - vh;
  return range > 40 ? -r.top / range : (vh * 0.5 - r.top) / r.height;
}

/** Which of `n` stages a scroll narrative is on. Scrolling alone advances it; scrolling back reverses it. */
export function useScrollStage(ref: RefObject<HTMLElement | null>, n: number) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const read = () => { frame = 0; setStage(Math.min(n - 1, Math.max(0, Math.floor(progress(el) * n)))); };
    const queue = () => { if (!frame) frame = requestAnimationFrame(read); };
    read();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => { window.removeEventListener("scroll", queue); window.removeEventListener("resize", queue); cancelAnimationFrame(frame); };
  }, [ref, n]);
  return stage;
}

/** A click on stage `i` scrolls to where scrolling would have shown it, so the page and the control never disagree. */
export function scrollToStage(el: HTMLElement, i: number, n: number) {
  const r = el.getBoundingClientRect();
  const range = r.height - window.innerHeight;
  if (range <= 40) return false; // unpinned: the caller shows the stage directly
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: window.scrollY + r.top + ((i + 0.5) / n) * range, behavior: reduce ? "auto" : "smooth" });
  return true;
}

/**
 * A before/after figure plays itself: server HTML shows the result; once script runs it drops to the start and plays
 * to the result when a third of it is on screen. Reduced motion, or a control the visitor touched, rests on the result.
 */
export function usePlayOnEnter(ref: RefObject<HTMLElement | null>, paused = false) {
  const [done, setDone] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node || paused || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const frame = requestAnimationFrame(() => setDone(false));
    let timer = 0;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { timer = window.setTimeout(() => setDone(true), 600); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(node);
    return () => { cancelAnimationFrame(frame); io.disconnect(); window.clearTimeout(timer); };
  }, [ref, paused]);
  return done;
}

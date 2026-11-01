"use client";

import { useEffect, useState, type RefObject } from "react";

/** A track pins when its first child is sticky (desktop); on phones the same track scrolls as a normal block. */
const pinned = (el: HTMLElement) => !!el.firstElementChild && getComputedStyle(el.firstElementChild).position === "sticky";

/**
 * Which of `n` stages the screen shows. Pinned: an equal share of the track's scroll range each.
 * Unpinned, with `n` [data-stage] marks: the last mark past 60% down the screen. A mark that becomes current only grows
 * below its own top and the ones above it only shrink, so a change never undoes itself (height-based progress did,
 * flickering at boundaries). Otherwise: the element's passage across 40% down the screen.
 */
function stageOf(el: HTMLElement, n: number) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const marks = el.querySelectorAll<HTMLElement>("[data-stage]");
  const p = pinned(el) ? -r.top / (r.height - vh)
    : marks.length === n ? [...marks].filter((m, i) => i && m.getBoundingClientRect().top < vh * 0.6).length / n
    : (vh * 0.4 - r.top) / r.height;
  return Math.min(n - 1, Math.max(0, Math.floor(p * n + 1e-6)));
}

/** Which of `n` stages a scroll narrative is on. Scrolling alone advances it; scrolling back reverses it. */
export function useScrollStage(ref: RefObject<HTMLElement | null>, n: number) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const read = () => { frame = 0; setStage(stageOf(el, n)); };
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
  if (!pinned(el)) return false; // unpinned: the caller shows the stage directly
  const r = el.getBoundingClientRect();
  const range = r.height - window.innerHeight;
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

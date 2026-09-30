"use client";

import { ATTRIBUTION_KEY, nextAttribution, type Attribution } from "@/lib/attribution";

function read(): Attribution | null {
  try { return JSON.parse(localStorage.getItem(ATTRIBUTION_KEY) || "null"); } catch { return null; }
}

/** Called on every page view: records first and last touch for 90 days. */
export function recordVisit() {
  try {
    const next = nextAttribution(read(), { url: window.location.href, referrer: document.referrer, now: Date.now(), siteHost: window.location.host });
    localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
  } catch { /* storage blocked: submissions still carry the current page */ }
}

/** What every submission sends. */
export function currentAttribution(): Attribution {
  const stored = read() || {};
  return { ...stored, page: window.location.pathname + window.location.search };
}

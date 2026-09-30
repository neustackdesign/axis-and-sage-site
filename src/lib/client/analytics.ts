"use client";

import { track } from "@vercel/analytics";
import { currentAttribution } from "./attribution";

type Props = Record<string, string | number | boolean | null>;
declare global { interface Window { gtag?: (...args: unknown[]) => void } }

/** Client events: Vercel Analytics custom events, mirrored to GA4 when it is switched on and consented. */
export function trackEvent(name: "cta_click" | "whatsapp_click" | "tool_start" | "tool_step" | "tool_complete", props: Props = {}) {
  try { track(name, props); } catch { /* analytics must never break the page */ }
  try { window.gtag?.("event", name, props); } catch { /* ignore */ }
}

/** tool_complete is also recorded on the server, where the conversions table is the source of truth. */
export function recordToolComplete(tool: string, meta: Props = {}) {
  trackEvent("tool_complete", { tool, ...meta });
  try {
    const body = JSON.stringify({ event: "tool_complete", tool, meta, attribution: currentAttribution() });
    if (!navigator.sendBeacon?.("/api/conversion", new Blob([body], { type: "application/json" }))) fetch("/api/conversion", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch { /* ignore */ }
}

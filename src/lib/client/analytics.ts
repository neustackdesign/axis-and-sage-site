"use client";

import { currentAttribution } from "./attribution";

/** A completed tool: one anonymous row in the Pipeline Sheet's Tools tab. No start, step or click events. */
export function recordToolComplete(tool: string, answers: unknown, result: unknown) {
  try {
    const body = JSON.stringify({ tool, answers, result, utmSource: currentAttribution().first?.utm_source });
    if (!navigator.sendBeacon?.("/api/tool-complete", new Blob([body], { type: "application/json" }))) fetch("/api/tool-complete", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  } catch { /* never break the tool */ }
}

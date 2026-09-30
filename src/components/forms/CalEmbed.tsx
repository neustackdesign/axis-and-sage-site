"use client";

import { useEffect, useRef } from "react";
import { currentAttribution } from "@/lib/client/attribution";

type CalFn = ((...args: unknown[]) => void) & { ns?: Record<string, (...args: unknown[]) => void>; q?: unknown[]; loaded?: boolean };
declare global { interface Window { Cal?: CalFn } }

/** Cal.com inline embed built from NEXT_PUBLIC_BOOKING_URL (e.g. https://cal.com/axisandsage/30min). */
export function CalEmbed({ url }: { url: string }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let parsed: URL;
    try { parsed = new URL(url); } catch { return; }
    const w = window as Window & { Cal?: CalFn };
    if (!w.Cal) {
      // Cal.com's official loader, condensed.
      const Cal = function (...args: unknown[]) {
        const cal = w.Cal!;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; const s = document.createElement("script"); s.src = "https://app.cal.com/embed/embed.js"; document.head.appendChild(s); cal.loaded = true; }
        if (args[0] === "init" && typeof args[1] === "string") {
          const ns = args[1];
          const api = function (...a: unknown[]) { (api as CalFn).q!.push(a); } as CalFn;
          api.q = [];
          cal.ns![ns] = cal.ns![ns] || api;
          (cal.ns![ns] as CalFn).q!.push(args);
          cal.q!.push(["initNamespace", ns]);
          return;
        }
        cal.q!.push(args);
      } as CalFn;
      w.Cal = Cal;
    }
    const a = currentAttribution();
    const meta: Record<string, string> = {};
    for (const [k, v] of Object.entries({ utm_source: a.first?.utm_source, utm_medium: a.first?.utm_medium, utm_campaign: a.first?.utm_campaign, last_utm_source: a.last?.utm_source, landing_page: a.landing_page, referrer: a.referrer })) if (v) meta[`metadata[${k}]`] = v;
    w.Cal!("init", "book", { origin: parsed.origin });
    w.Cal!.ns?.book?.("inline", { elementOrSelector: el.current, calLink: parsed.pathname.replace(/^\//, ""), config: { layout: "month_view", ...meta } });
  }, [url]);
  return <div ref={el} className="calendar-embed" aria-label="Booking calendar" />;
}

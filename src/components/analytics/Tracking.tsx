"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { recordVisit } from "@/lib/client/attribution";
import { trackEvent } from "@/lib/client/analytics";

/** Records attribution on every page view and sends cta_click and whatsapp_click events. */
export function Tracking() {
  const pathname = usePathname();
  useEffect(() => { recordVisit(); }, [pathname]);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a, button") as HTMLAnchorElement | HTMLButtonElement | null;
      if (!a) return;
      const href = a instanceof HTMLAnchorElement ? a.getAttribute("href") || "" : "";
      const label = (a.textContent || "").trim().slice(0, 80);
      if (href.includes("wa.me/")) trackEvent("whatsapp_click", { page: window.location.pathname, label });
      else if (a.classList.contains("btn-primary") || a.hasAttribute("data-cta")) trackEvent("cta_click", { page: window.location.pathname, label, href });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}

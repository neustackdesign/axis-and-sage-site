"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { recordVisit } from "@/lib/client/attribution";

/** Records first- and last-touch attribution on every page view (kept in localStorage for 90 days). */
export function Tracking() {
  const pathname = usePathname();
  useEffect(() => { recordVisit(); }, [pathname]);
  return null;
}

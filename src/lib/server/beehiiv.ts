import "server-only";
import type { Attribution } from "@/lib/attribution";
import { config, logFailure } from "./config";

/** Adds a confirmed subscriber to Beehiiv once BEEHIIV_API_KEY and BEEHIIV_PUBLICATION_ID are set. */
export async function syncToBeehiiv(email: string, attribution?: Attribution): Promise<boolean> {
  if (!config.beehiivKey || !config.beehiivPublication) return false;
  try {
    const res = await fetch(`https://api.beehiiv.com/v2/publications/${config.beehiivPublication}/subscriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.beehiivKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email, reactivate_existing: false, send_welcome_email: true, double_opt_override: "off", utm_source: attribution?.first?.utm_source || "axisandsage.com", utm_medium: attribution?.first?.utm_medium, utm_campaign: attribution?.first?.utm_campaign, referring_site: attribution?.referrer }),
    });
    if (!res.ok) { logFailure("beehiiv", `Beehiiv ${res.status}`, { body: (await res.text()).slice(0, 200) }); return false; }
    return true;
  } catch (error) { logFailure("beehiiv", error); return false; }
}

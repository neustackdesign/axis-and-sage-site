// Attribution shared by client and server. First touch and last touch UTMs, referrer and landing page,
// kept in localStorage for 90 days and sent with every submission.

export type Touch = { utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_term?: string; utm_content?: string; referrer?: string; landing_page?: string; at: string };
export type Attribution = { first?: Touch; last?: Touch; referrer?: string; landing_page?: string; page?: string };

export const ATTRIBUTION_KEY = "as_attribution";
export const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** Pure update step: given what is stored and the current visit, return what to store. */
export function nextAttribution(stored: Attribution | null, visit: { url: string; referrer: string; now: number; siteHost: string }): Attribution {
  const url = new URL(visit.url);
  const utms: Partial<Touch> = {};
  for (const k of UTM_KEYS) { const v = url.searchParams.get(k); if (v) utms[k] = v.slice(0, 200); }
  let externalReferrer = "";
  try { if (visit.referrer && new URL(visit.referrer).host !== visit.siteHost) externalReferrer = visit.referrer.slice(0, 500); } catch { /* ignore malformed referrer */ }
  const expired = (t?: Touch) => !t || visit.now - Date.parse(t.at) > ATTRIBUTION_TTL_MS;
  const touch: Touch = { ...utms, referrer: externalReferrer || undefined, landing_page: url.pathname + url.search, at: new Date(visit.now).toISOString() };
  const isNewTouch = Object.keys(utms).length > 0 || !!externalReferrer;
  const base: Attribution = stored && !expired(stored.first) ? stored : {};
  return {
    first: base.first || touch,
    last: isNewTouch || !base.last || expired(base.last) ? touch : base.last,
    referrer: base.referrer || externalReferrer || undefined,
    landing_page: base.landing_page || touch.landing_page,
  };
}

/** Keeps only known string fields, so nothing unexpected is stored. */
export function sanitiseAttribution(raw: unknown): Attribution {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Record<string, unknown>;
  const touch = (t: unknown): Touch | undefined => {
    if (!t || typeof t !== "object") return undefined;
    const o = t as Record<string, unknown>;
    const out: Touch = { at: typeof o.at === "string" ? o.at.slice(0, 40) : "" };
    for (const k of [...UTM_KEYS, "referrer", "landing_page"] as const) if (typeof o[k] === "string") out[k] = (o[k] as string).slice(0, 500);
    return out;
  };
  const str = (v: unknown) => (typeof v === "string" ? v.slice(0, 500) : undefined);
  return { first: touch(r.first), last: touch(r.last), referrer: str(r.referrer), landing_page: str(r.landing_page), page: str(r.page) };
}

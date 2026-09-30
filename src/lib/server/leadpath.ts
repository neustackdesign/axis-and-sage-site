import "server-only";
import { sanitiseAttribution } from "@/lib/attribution";
import { leadSources, sentenceOf, type LeadPayload } from "@/lib/leads";
import { deliver, forwardToSheet, randomId, retryPending, sendOrPark, type SheetPayload } from "@/lib/pipeline/core";
import { alertMail, autoreplyMail, toolResultMail } from "@/lib/pipeline/emails";
import { mailerLiteSubscribe } from "@/lib/pipeline/mailerlite";
import { resendSend } from "@/lib/pipeline/resend";
import { hashIp } from "@/lib/pipeline/sign";
import { blobStore } from "./blob-store";
import { config, logEvent } from "./config";

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try { return (await request.json()) as Record<string, unknown>; } catch { return {}; }
}

export function clientIp(request: Request) {
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

/** Salted hash of the caller's IP, for the Sheet's rate limit. The IP itself is never stored. */
export const ipHashOf = (request: Request) => hashIp(clientIp(request), config.ipHashSalt);

export function parseLead(raw: Record<string, unknown>): LeadPayload | null {
  const source = str(raw.source, 20) as LeadPayload["source"];
  if (!leadSources.includes(source)) return null;
  return {
    source,
    email: str(raw.email, 200) || "",
    name: str(raw.name, 200), company: str(raw.company, 200), role: str(raw.role, 200),
    message: str(raw.message, 4000), who: str(raw.who, 200), what: str(raw.what, 200), when: str(raw.when, 60),
    heard: str(raw.heard, 60), heardDetail: str(raw.heardDetail, 200),
    consent: raw.consent === true || raw.consent === "on" || raw.consent === "true",
    tool: str(raw.tool, 80), summary: str(raw.summary, 8000), engagement: str(raw.engagement, 120),
    website: str(raw.website, 200),
    origin: str(raw.origin, 40)?.toLowerCase().replace(/[^a-z0-9-]/g, "") || undefined,
    attribution: sanitiseAttribution(raw.attribution),
  };
}

/** Builds the record the Pipeline Sheet receives. It holds no IP data: the IP hash travels separately (see deliver). */
export function sheetPayload(type: SheetPayload["type"], lead: LeadPayload, rest: Partial<SheetPayload> = {}): SheetPayload {
  const a = lead.attribution || {};
  return {
    type,
    id: randomId(),
    createdAt: new Date().toISOString(),
    source: lead.origin ? `${lead.source} · ${lead.origin}` : lead.source,
    name: lead.name, email: lead.email, company: lead.company, role: lead.role, message: lead.message,
    who: lead.who, what: lead.what, when: lead.when, sentence: sentenceOf(lead) || undefined,
    heard: lead.heard, heardDetail: lead.heardDetail, engagement: lead.engagement,
    tool: lead.tool, summary: lead.summary,
    utm: { first: a.first, last: a.last },
    referrer: a.referrer, landingPage: a.landing_page, submissionPage: a.page,
    ...rest,
  };
}

export const forward = (payload: SheetPayload) => forwardToSheet(payload, { url: config.sheetWebhookUrl, secret: config.sheetWebhookSecret });
export const subscribe = mailerLiteSubscribe({ apiKey: config.mailerLiteKey, groupId: config.mailerLiteGroup });

export const sendMail = resendSend({ apiKey: config.resendKey, from: config.mailFrom });

export type VisitorMail = "sent" | "parked" | "none" | "failed";

/**
 * The whole lead path after validation: Blob first, forward to the Sheet, then email through Resend. The alert goes to
 * info@ with the founders copied; the visitor gets the tool result, or the auto-reply when `autoreply` is set.
 * Nothing is emailed when the Sheet marked the lead "limited". If the Sheet can't be reached, the emails still go.
 */
export async function deliverLead(payload: SheetPayload, opts: { ipHash?: string; autoreply?: boolean } = {}) {
  const result = await deliver(payload, { store: blobStore, forward, log: logEvent }, { ipHash: opts.ipHash });
  if (!result.stored) return { ...result, visitorMail: "none" as VisitorMail };
  if (result.limited) { logEvent("lead_limited", { id: payload.id }); return { ...result, visitorMail: "none" as VisitorMail }; }
  const deps = { store: blobStore, send: sendMail, log: logEvent };
  const visitor = payload.type === "tool_email" ? toolResultMail(payload, config.siteUrl) : opts.autoreply ? autoreplyMail(payload, config.siteUrl) : null;
  const [, v] = await Promise.all([
    sendOrPark(alertMail(payload, { to: config.notifyTo, cc: config.founders }), deps),
    visitor ? sendOrPark(visitor, deps) : Promise.resolve(null),
  ]);
  const visitorMail: VisitorMail = !v ? "none" : v.sent ? "sent" : v.parked ? "parked" : "failed";
  return { ...result, visitorMail };
}

export const runRetry = () => retryPending({ store: blobStore, forward, subscribe, send: sendMail, log: logEvent });

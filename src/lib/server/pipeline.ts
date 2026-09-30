import "server-only";
import { after } from "next/server";
import { sanitiseAttribution, type Attribution } from "@/lib/attribution";
import { leadSources, leadSubject, leadText, sentenceOf, validateLead, type LeadPayload } from "@/lib/leads";
import { stripUrls } from "@/lib/text";
import { config, logFailure, logInfo } from "./config";
import { insertConversion, insertLead, markLead, type ConversionEvent } from "./db";
import { sendMail } from "./email";
import { syncToHubSpot } from "./hubspot";
import { checkRateLimit, clientIp } from "./ratelimit";
import { verifyTurnstile } from "./turnstile";

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try { return (await request.json()) as Record<string, unknown>; } catch { return {}; }
}

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
    website: str(raw.website, 200), turnstileToken: str(raw.turnstileToken, 4000),
    attribution: sanitiseAttribution(raw.attribution),
  };
}

export type Gate = { ok: true } | { ok: false; status: number; body: Record<string, unknown> };

/** Steps 1 to 3: validate, Turnstile, rate limit. The honeypot is answered like a success and dropped. */
export async function gate(request: Request, lead: LeadPayload, { validate = true } = {}): Promise<Gate | "honeypot"> {
  if (lead.website) return "honeypot";
  if (validate) {
    const errors = validateLead(lead);
    if (Object.keys(errors).length) return { ok: false, status: 400, body: { message: "Please check the highlighted fields.", errors } };
  }
  const ip = clientIp(request);
  if (!(await verifyTurnstile(lead.turnstileToken, ip))) return { ok: false, status: 403, body: { message: "We couldn't confirm you're not a robot. Please try again.", retry: true } };
  const limit = await checkRateLimit(ip, lead.email);
  if (!limit.ok) return { ok: false, status: 429, body: { message: limit.reason === "email" ? "We've had a few messages from this address in the last hour. Please try again later, or email info@axisandsage.com." : "That's a lot of messages in a few minutes. Please wait a little and try again." } };
  return { ok: true };
}

export async function recordConversion(event: ConversionEvent, source: string, attribution: Attribution, meta?: unknown) {
  try { await insertConversion(event, source, attribution, meta); } catch (error) { logFailure("conversion", error, { event }); }
}

function attributionLines(a: Attribution) {
  const t = (x?: Attribution["first"]) => x ? [x.utm_source, x.utm_medium, x.utm_campaign].filter(Boolean).join(" / ") || x.referrer || "direct" : "unknown";
  return [`First touch: ${t(a.first)}`, `Last touch: ${t(a.last)}`, `Referrer: ${a.referrer || "none"}`, `Landing page: ${a.landing_page || "unknown"}`, `Submitted on: ${a.page || "unknown"}`].join("\n");
}

function autoresponder(lead: LeadPayload) {
  const first = (lead.name || "").trim().split(/\s+/)[0];
  const said = stripUrls(sentenceOf(lead) || lead.message || "");
  return [
    first ? `Thanks, ${first}.` : "Thanks.",
    "",
    "We have your note. One of us will reply within one working day.",
    ...(said ? ["", "You wrote:", `"${said}"`] : []),
    "",
    `While you wait, the Conversion Scorecard takes six minutes: ${config.siteUrl}/tools/conversion-scorecard`,
    "",
    "Axis & Sage Advisory",
  ].join("\n");
}

/** Steps 4 to 8 for contact and CTA leads. Succeeds if either the database write or the notification email succeeds. */
export async function processLead(request: Request, lead: LeadPayload) {
  const attribution = lead.attribution || {};
  const sentence = sentenceOf(lead);
  let id: string | null = null;
  try {
    id = await insertLead({ source: lead.source === "cta" ? "cta" : "contact", email: lead.email, name: lead.name, company: lead.company, role: lead.role, message: lead.message, who: lead.who, what: lead.what, when: lead.when, sentence, heard: lead.heard, heardDetail: lead.heardDetail, consent: lead.consent, engagement: lead.engagement, userAgent: request.headers.get("user-agent")?.slice(0, 300), attribution });
  } catch (error) { logFailure("db_lead", error, { source: lead.source }); }

  const notified = await sendMail({ to: [config.notifyTo], cc: config.notifyCc, replyTo: lead.email, subject: leadSubject(lead), text: `${leadText(lead)}\n\n${attributionLines(attribution)}${id ? `\n\nLead ID: ${id}` : "\n\nNot saved to the database: see logs."}` }, "notify_lead");
  if (id && notified) { try { await markLead(id, "notified"); } catch (error) { logFailure("db_mark_notified", error); } }

  if (!id && !notified) {
    logFailure("lead_lost_risk", "database and notification both failed; visitor offered mailto", { source: lead.source });
    return { ok: false as const };
  }

  await sendMail({ to: [lead.email], subject: "We have your note · Axis & Sage", text: autoresponder(lead) }, "autoresponder");
  await recordConversion("form_submit", lead.source, attribution, { leadId: id });
  after(async () => {
    const synced = await syncToHubSpot({ email: lead.email, name: lead.name, company: lead.company, role: lead.role, sentence, source: lead.source }, "new_lead");
    if (synced && id) { try { await markLead(id, "hubspot_synced"); } catch (error) { logFailure("db_mark_hubspot", error); } }
  });
  logInfo("lead_received", { source: lead.source, saved: !!id, notified });
  return { ok: true as const, id };
}

export const autoresponderText = autoresponder;

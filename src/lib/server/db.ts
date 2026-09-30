import "server-only";
import { neon } from "@neondatabase/serverless";
import type { Attribution } from "@/lib/attribution";
import { config } from "./config";

let client: ReturnType<typeof neon> | null = null;
function sql() {
  if (!config.databaseUrl) throw new Error("DATABASE_URL not configured");
  client ||= neon(config.databaseUrl);
  return client;
}

const j = (v: unknown) => (v === undefined ? null : JSON.stringify(v));
const attributionCols = (a: Attribution) => [j(a.first), j(a.last), a.referrer || null, a.landing_page || null, a.page || null] as const;

export type LeadRow = {
  source: "contact" | "cta" | "booking";
  email: string; name?: string; company?: string; role?: string; message?: string;
  who?: string; what?: string; when?: string; sentence?: string; heard?: string; heardDetail?: string;
  consent?: boolean; engagement?: string; booking?: unknown; userAgent?: string; attribution: Attribution;
};

export async function insertLead(l: LeadRow): Promise<string> {
  const [ft, lt, ref, land, page] = attributionCols(l.attribution);
  const rows = await sql().query(
    `insert into leads (source, name, email, company, role, message, who, what, when_text, sentence, heard, heard_detail, consent, engagement, booking, first_touch, last_touch, referrer, landing_page, submission_page, user_agent)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) returning id`,
    [l.source, l.name || null, l.email, l.company || null, l.role || null, l.message || null, l.who || null, l.what || null, l.when || null, l.sentence || null, l.heard || null, l.heardDetail || null, l.consent ?? null, l.engagement || null, j(l.booking), ft, lt, ref, land, page, l.userAgent || null],
  ) as { id: string }[];
  return rows[0].id;
}

export async function markLead(id: string, field: "notified" | "hubspot_synced") {
  await sql().query(`update leads set ${field === "notified" ? "notified" : "hubspot_synced"} = true where id = $1`, [id]);
}

export async function insertToolResult(r: { tool: string; email: string; result: unknown; summary: string; shareUrl?: string; attribution: Attribution }) {
  const [ft, lt, ref, land, page] = attributionCols(r.attribution);
  const rows = await sql().query(
    `insert into tool_results (tool, email, result, summary, share_url, first_touch, last_touch, referrer, landing_page, submission_page) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning id`,
    [r.tool, r.email, j(r.result), r.summary, r.shareUrl || null, ft, lt, ref, land, page],
  ) as { id: string }[];
  return rows[0].id;
}

export async function markToolEmailed(id: string) {
  await sql().query(`update tool_results set emailed = true where id = $1`, [id]);
}

export async function upsertSubscriber(email: string, attribution: Attribution) {
  const [ft, lt, ref, land, page] = attributionCols(attribution);
  await sql().query(
    `insert into subscribers (email, first_touch, last_touch, referrer, landing_page, submission_page) values ($1,$2,$3,$4,$5,$6)
     on conflict ((lower(email))) do nothing`,
    [email, ft, lt, ref, land, page],
  );
}

export async function confirmSubscriber(email: string) {
  await sql().query(`insert into subscribers (email, status, confirmed_at) values ($1, 'confirmed', now())
     on conflict ((lower(email))) do update set status = 'confirmed', confirmed_at = coalesce(subscribers.confirmed_at, now())`, [email]);
}

export async function markSubscriberSynced(email: string) {
  await sql().query(`update subscribers set beehiiv_synced = true where lower(email) = lower($1)`, [email]);
}

export type ConversionEvent = "form_submit" | "booking_complete" | "tool_complete" | "tool_email_requested" | "newsletter_signup";

export async function insertConversion(event: ConversionEvent, source: string, attribution: Attribution, meta?: unknown) {
  await sql().query(
    `insert into conversions (event, source, page, first_touch, last_touch, referrer, landing_page, meta) values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [event, source, attribution.page || null, j(attribution.first), j(attribution.last), attribution.referrer || null, attribution.landing_page || null, j(meta)],
  );
}

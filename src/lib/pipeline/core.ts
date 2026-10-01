// The lead path, independent of Vercel, Google and Resend so it can be tested with mocks.
// 1 validate · 2 minimum fill time · 3 store in Blob first · 4 forward to Apps Script, delete on confirm
// 5 email through Resend unless the Sheet marked it limited · 6 respond with success once stored
// 7 mailto hand-over only if the Blob write fails.
import { signBody } from "./sign";

export const MIN_FILL_MS = 3000;
export const FORWARD_TIMEOUT_MS = 8000;

export type PendingKind = "leads" | "subscribers" | "emails";

export interface PendingStore {
  put(pathname: string, body: string): Promise<void>;
  list(prefix: string): Promise<string[]>; // pathnames
  read(pathname: string): Promise<string | null>;
  remove(pathname: string): Promise<void>;
}

/** What the Apps Script says: `ok` once the row is written; `limited` when the soft rate limit applied (send no email). */
export type ForwardResult = { ok: boolean; limited: boolean };
export type Forward = (payload: SheetPayload) => Promise<ForwardResult>;
const NOT_FORWARDED: ForwardResult = { ok: false, limited: false };

export type Touch = { utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_term?: string; utm_content?: string; referrer?: string; landing_page?: string; at?: string };

export type SheetPayload = {
  type: "lead" | "tool_email" | "tool_complete";
  id: string;
  createdAt: string;
  source?: string;
  name?: string; email?: string; company?: string; role?: string; message?: string;
  who?: string; what?: string; when?: string; sentence?: string; heard?: string; heardDetail?: string; engagement?: string;
  tool?: string; summary?: string; result?: unknown; shareUrl?: string; diagnosticUrl?: string;
  /** Cal.com bookings: startTime is UTC ISO; startTimeLocal is the same moment in Asia/Dubai, zone spelled out. */
  booking?: { title?: string; startTime?: string; startTimeLocal?: string; timeZone?: string };
  /** Sent to the Sheet for its rate limit only. Never stored in Blob. */
  ipHash?: string;
  utm?: { first?: Touch; last?: Touch };
  referrer?: string; landingPage?: string; submissionPage?: string;
};

/** True when the form was sent less than 3 seconds after it rendered: answer as if it worked, store nothing. */
export function tooFast(renderedAt: unknown, submittedAt: unknown, minMs = MIN_FILL_MS) {
  if (typeof renderedAt !== "number" || typeof submittedAt !== "number") return true;
  return submittedAt - renderedAt < minMs;
}

export const randomId = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
export const pendingPath = (kind: PendingKind, now: Date, id: string) => `pending/${kind}/${now.toISOString().replace(/[:.]/g, "-")}-${id}.json`;

export type DeliverResult = { stored: boolean; delivered: boolean; limited: boolean; pathname?: string };
type Log = (e: string, c?: Record<string, unknown>) => void;

/**
 * Store first, then forward; delete the stored copy once Apps Script confirms. The IP hash goes to the Sheet's rate
 * limit with the live forward only: the stored copy never holds it, so a lead waiting for the cron keeps no IP data.
 */
export async function deliver(payload: SheetPayload, deps: { store: PendingStore; forward: Forward; now?: () => Date; log?: Log }, transient: { ipHash?: string } = {}): Promise<DeliverResult> {
  const now = deps.now?.() ?? new Date();
  const pathname = pendingPath("leads", now, payload.id);
  const { ipHash: payloadHash, ...stored } = payload;
  const ipHash = transient.ipHash ?? payloadHash;
  try {
    await deps.store.put(pathname, JSON.stringify(stored));
  } catch (error) {
    deps.log?.("blob_write_failed", { id: payload.id, error: String(error) });
    return { stored: false, delivered: false, limited: false };
  }
  let result = NOT_FORWARDED;
  try { result = await deps.forward(ipHash ? { ...stored, ipHash } : stored); } catch (error) { deps.log?.("forward_failed", { id: payload.id, error: String(error) }); }
  if (result.ok) {
    try { await deps.store.remove(pathname); } catch (error) { deps.log?.("blob_delete_failed", { pathname, error: String(error) }); }
  } else deps.log?.("forward_pending", { id: payload.id, pathname });
  return { stored: true, delivered: result.ok, limited: result.ok && result.limited, pathname };
}

/* ---------- Email ---------- */

export type Mail = { to: string[]; cc?: string[]; replyTo?: string; subject: string; text: string; html?: string };
export type SendMail = (mail: Mail) => Promise<boolean>;

/** Sends now; if the send fails, parks the email in pending/emails/ for the cron. */
export async function sendOrPark(mail: Mail, deps: { store: PendingStore; send: SendMail; now?: () => Date; id?: string; log?: Log }) {
  if (await deps.send(mail).catch(() => false)) return { sent: true, parked: false };
  const now = deps.now?.() ?? new Date();
  try {
    await deps.store.put(pendingPath("emails", now, deps.id ?? randomId()), JSON.stringify(mail));
    deps.log?.("email_pending", { subject: mail.subject });
    return { sent: false, parked: true };
  } catch {
    deps.log?.("email_failed", { subject: mail.subject });
    return { sent: false, parked: false };
  }
}

/** Posts a signed payload to the Apps Script web app and reads its JSON reply after the 302 redirect. */
export async function forwardToSheet(payload: SheetPayload, opts: { url: string; secret: string; fetchImpl?: typeof fetch; timeoutMs?: number; now?: () => number }): Promise<ForwardResult> {
  if (!opts.url || !opts.secret) return NOT_FORWARDED;
  const body = signBody(payload, opts.secret, opts.now?.() ?? Date.now());
  const res = await (opts.fetchImpl ?? fetch)(opts.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // plain text avoids a CORS preflight and Apps Script reads postData.contents
    body: JSON.stringify(body),
    redirect: "follow",
    signal: AbortSignal.timeout(opts.timeoutMs ?? FORWARD_TIMEOUT_MS),
  });
  if (!res.ok) return NOT_FORWARDED;
  const reply = (await res.json().catch(() => null)) as { ok?: boolean; limited?: boolean } | null;
  return { ok: reply?.ok === true, limited: reply?.limited === true };
}

export type Subscribe = (email: string, attribution?: SheetPayload["utm"]) => Promise<boolean>;

/** Daily retry: re-forward pending leads, re-send pending subscribers and emails, report what's left. */
export async function retryPending(deps: { store: PendingStore; forward: Forward; subscribe: Subscribe; send: SendMail; log?: Log }) {
  const counts = { leadsDelivered: 0, leadsPending: 0, subscribersSent: 0, subscribersPending: 0, emailsSent: 0, emailsPending: 0, unreadable: 0 };
  for (const pathname of await deps.store.list("pending/leads/")) {
    const raw = await deps.store.read(pathname).catch(() => null);
    let payload: SheetPayload | null = null;
    try { payload = raw ? (JSON.parse(raw) as SheetPayload) : null; } catch { payload = null; }
    if (!payload) { counts.unreadable++; continue; }
    const ok = (await deps.forward(payload).catch(() => NOT_FORWARDED)).ok;
    if (ok) { await deps.store.remove(pathname).catch(() => undefined); counts.leadsDelivered++; } else counts.leadsPending++;
  }
  for (const pathname of await deps.store.list("pending/subscribers/")) {
    const raw = await deps.store.read(pathname).catch(() => null);
    let item: { email?: string; utm?: SheetPayload["utm"] } | null = null;
    try { item = raw ? JSON.parse(raw) : null; } catch { item = null; }
    if (!item?.email) { counts.unreadable++; continue; }
    const ok = await deps.subscribe(item.email, item.utm).catch(() => false);
    if (ok) { await deps.store.remove(pathname).catch(() => undefined); counts.subscribersSent++; } else counts.subscribersPending++;
  }
  for (const pathname of await deps.store.list("pending/emails/")) {
    const raw = await deps.store.read(pathname).catch(() => null);
    let mail: Mail | null = null;
    try { mail = raw ? (JSON.parse(raw) as Mail) : null; } catch { mail = null; }
    if (!mail?.to?.length) { counts.unreadable++; continue; }
    const ok = await deps.send(mail).catch(() => false);
    if (ok) { await deps.store.remove(pathname).catch(() => undefined); counts.emailsSent++; } else counts.emailsPending++;
  }
  deps.log?.("cron_retry", counts);
  return counts;
}

/** Newsletter: MailerLite first; if that fails, park the sign-up for the cron; if that fails too, hand over. */
export async function subscribeOrPark(email: string, utm: SheetPayload["utm"], deps: { store: PendingStore; subscribe: Subscribe; now?: () => Date; id?: string }) {
  if (await deps.subscribe(email, utm).catch(() => false)) return { ok: true, parked: false };
  const now = deps.now?.() ?? new Date();
  try {
    await deps.store.put(pendingPath("subscribers", now, deps.id ?? randomId()), JSON.stringify({ email, utm, createdAt: now.toISOString() }));
    return { ok: true, parked: true };
  } catch {
    return { ok: false, parked: false };
  }
}

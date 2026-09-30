// The lead path, independent of Vercel and Google so it can be tested with mocks.
// 1 validate · 2 minimum fill time · 3 store in Blob first · 4 forward to Apps Script, delete on confirm
// 5 respond with success once stored · 6 mailto hand-over only if the Blob write fails.
import { signBody } from "./sign";

export const MIN_FILL_MS = 3000;
export const FORWARD_TIMEOUT_MS = 8000;

export type PendingKind = "leads" | "subscribers";

export interface PendingStore {
  put(pathname: string, body: string): Promise<void>;
  list(prefix: string): Promise<string[]>; // pathnames
  read(pathname: string): Promise<string | null>;
  remove(pathname: string): Promise<void>;
}

export type Forward = (payload: SheetPayload) => Promise<boolean>;

export type Touch = { utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_term?: string; utm_content?: string; referrer?: string; landing_page?: string; at?: string };

export type SheetPayload = {
  type: "lead" | "tool_email" | "tool_complete";
  id: string;
  createdAt: string;
  source?: string;
  name?: string; email?: string; company?: string; role?: string; message?: string;
  who?: string; what?: string; when?: string; sentence?: string; heard?: string; heardDetail?: string; engagement?: string;
  tool?: string; summary?: string; result?: unknown; shareUrl?: string; diagnosticUrl?: string;
  booking?: unknown;
  sendAutoreply?: boolean;
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

export type DeliverResult = { stored: boolean; delivered: boolean; pathname?: string };

/** Store first, then forward; delete the stored copy once Apps Script confirms. */
export async function deliver(payload: SheetPayload, deps: { store: PendingStore; forward: Forward; now?: () => Date; log?: (e: string, c?: Record<string, unknown>) => void }): Promise<DeliverResult> {
  const now = deps.now?.() ?? new Date();
  const pathname = pendingPath("leads", now, payload.id);
  try {
    await deps.store.put(pathname, JSON.stringify(payload));
  } catch (error) {
    deps.log?.("blob_write_failed", { id: payload.id, error: String(error) });
    return { stored: false, delivered: false };
  }
  let delivered = false;
  try { delivered = await deps.forward(payload); } catch (error) { deps.log?.("forward_failed", { id: payload.id, error: String(error) }); }
  if (delivered) {
    try { await deps.store.remove(pathname); } catch (error) { deps.log?.("blob_delete_failed", { pathname, error: String(error) }); }
  } else deps.log?.("forward_pending", { id: payload.id, pathname });
  return { stored: true, delivered, pathname };
}

/** Posts a signed payload to the Apps Script web app and reads its JSON reply after the 302 redirect. */
export async function forwardToSheet(payload: SheetPayload, opts: { url: string; secret: string; fetchImpl?: typeof fetch; timeoutMs?: number; now?: () => number }): Promise<boolean> {
  if (!opts.url || !opts.secret) return false;
  const body = signBody(payload, opts.secret, opts.now?.() ?? Date.now());
  const res = await (opts.fetchImpl ?? fetch)(opts.url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" }, // plain text avoids a CORS preflight and Apps Script reads postData.contents
    body: JSON.stringify(body),
    redirect: "follow",
    signal: AbortSignal.timeout(opts.timeoutMs ?? FORWARD_TIMEOUT_MS),
  });
  if (!res.ok) return false;
  const reply = (await res.json().catch(() => null)) as { ok?: boolean } | null;
  return reply?.ok === true;
}

export type Subscribe = (email: string, attribution?: SheetPayload["utm"]) => Promise<boolean>;

/** Daily retry: re-forward pending leads, re-send pending subscribers, report what's left. */
export async function retryPending(deps: { store: PendingStore; forward: Forward; subscribe: Subscribe; log?: (e: string, c?: Record<string, unknown>) => void }) {
  const counts = { leadsDelivered: 0, leadsPending: 0, subscribersSent: 0, subscribersPending: 0, unreadable: 0 };
  for (const pathname of await deps.store.list("pending/leads/")) {
    const raw = await deps.store.read(pathname).catch(() => null);
    let payload: SheetPayload | null = null;
    try { payload = raw ? (JSON.parse(raw) as SheetPayload) : null; } catch { payload = null; }
    if (!payload) { counts.unreadable++; continue; }
    const ok = await deps.forward(payload).catch(() => false);
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

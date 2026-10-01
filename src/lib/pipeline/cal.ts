// Cal.com BOOKING_CREATED payloads → the fields the lead path needs. Pure, so it can be tested.

/** The one required question on the Cal.com event. Its answer becomes the lead's sentence. */
export const CAL_SENTENCE_QUESTION = "Who needs to act, and what do you need them to do?";

/** Bookings are shown in Gulf Standard Time, which has no daylight saving. */
export const CAL_TIME_ZONE = "Asia/Dubai";

type CalAnswer = unknown;
export type CalPayload = {
  triggerEvent?: string;
  payload?: { title?: string; startTime?: string; attendees?: { name?: string; email?: string; timeZone?: string }[]; responses?: Record<string, CalAnswer> };
};
export type CalBooking = { title?: string; startTime?: string; startTimeLocal?: string; timeZone: string };

const isPrimitive = (v: unknown): v is string | number | boolean => typeof v === "string" || typeof v === "number" || typeof v === "boolean";
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * A readable answer, or null. Primitives are used as they are; an object counts only when it exposes a primitive
 * `value` (Cal.com's `{ label, value }`). Other objects, arrays and empty values are skipped, never stringified.
 */
export function answerText(v: CalAnswer): string | null {
  const raw = isPrimitive(v) ? v : v && typeof v === "object" && !Array.isArray(v) && isPrimitive((v as { value?: unknown }).value) ? (v as { value: string | number | boolean }).value : null;
  if (raw === null || raw === false) return null;
  const text = String(raw).trim();
  return text ? text : null;
}

function answerLabel(key: string, v: CalAnswer): string {
  const label = v && typeof v === "object" ? (v as { label?: unknown }).label : undefined;
  return typeof label === "string" && label.trim() ? label.trim() : key;
}

const isSentenceQuestion = (key: string, v: CalAnswer) => {
  const q = norm(CAL_SENTENCE_QUESTION);
  return norm(answerLabel(key, v)) === q || norm(key) === q || /who.?needs.?to.?act/i.test(key);
};

/** The call time in Asia/Dubai with the zone spelled out: "Fri, 2 Oct 2026, 13:00 GST (Asia/Dubai, UTC+4)". */
export function formatCallTime(iso: string | undefined) {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  const text = new Intl.DateTimeFormat("en-GB", { timeZone: CAL_TIME_ZONE, weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d);
  return `${text} GST (${CAL_TIME_ZONE}, UTC+4)`;
}

/** Name, email, the sentence, the other answers as Notes, and the call time in Asia/Dubai. Null without an attendee email. */
export function parseCalBooking(body: CalPayload) {
  const p = body.payload || {};
  const attendee = p.attendees?.[0] || {};
  if (!attendee.email) return null;
  let sentence: string | undefined;
  const notes: string[] = [];
  for (const [key, v] of Object.entries(p.responses || {})) {
    if (["name", "email"].includes(key)) continue;
    const text = answerText(v);
    if (!text) continue;
    if (!sentence && isSentenceQuestion(key, v)) { sentence = text; continue; }
    notes.push(`${answerLabel(key, v)}: ${text}`);
  }
  const booking: CalBooking = { title: p.title, startTime: p.startTime, startTimeLocal: formatCallTime(p.startTime), timeZone: CAL_TIME_ZONE };
  return { email: attendee.email, name: attendee.name, sentence, message: notes.join("\n").slice(0, 4000) || undefined, booking };
}

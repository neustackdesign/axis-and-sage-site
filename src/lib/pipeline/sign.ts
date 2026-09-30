import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Apps Script's doPost can't read HTTP headers, so the signature travels in the body:
 * { payload, ts, sig } with sig = hex HMAC-SHA256 of `${ts}.${JSON.stringify(payload)}` using SHEET_WEBHOOK_SECRET.
 */
export function signBody<T>(payload: T, secret: string, ts = Date.now()) {
  const sig = createHmac("sha256", secret).update(`${ts}.${JSON.stringify(payload)}`).digest("hex");
  return { payload, ts, sig };
}

export function verifyBody(body: { payload: unknown; ts: number; sig: string }, secret: string, now = Date.now(), maxAgeMs = 5 * 60_000) {
  if (!body || typeof body.ts !== "number" || typeof body.sig !== "string") return false;
  if (Math.abs(now - body.ts) > maxAgeMs) return false;
  const expected = createHmac("sha256", secret).update(`${body.ts}.${JSON.stringify(body.payload)}`).digest("hex");
  const a = Buffer.from(body.sig), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Verifies a hex HMAC-SHA256 signature over a raw body (Cal.com webhooks, x-cal-signature-256). */
export function verifyHexSignature(raw: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(signature || ""), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** SHA-256 of the IP with a salt. The IP itself is never stored. */
export function hashIp(ip: string, salt: string) {
  return createHmac("sha256", salt || "unsalted").update(ip || "unknown").digest("hex");
}

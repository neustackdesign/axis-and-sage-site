import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { config } from "./config";

const b64 = (s: string) => Buffer.from(s).toString("base64url");

/** Signed, expiring token (payload.expiry.signature) for newsletter confirmation links. */
export function signToken(value: string, ttlMs = 7 * 24 * 60 * 60 * 1000) {
  const body = `${b64(value)}.${Date.now() + ttlMs}`;
  return `${body}.${createHmac("sha256", config.signingSecret || "dev-only-secret").update(body).digest("base64url")}`;
}

export function verifyToken(token: string): string | null {
  const [v, exp, sig] = token.split(".");
  if (!v || !exp || !sig) return null;
  const expected = createHmac("sha256", config.signingSecret || "dev-only-secret").update(`${v}.${exp}`).digest("base64url");
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b) || Date.now() > Number(exp)) return null;
  return Buffer.from(v, "base64url").toString();
}

/** Verifies a hex HMAC-SHA256 signature over a raw body (Cal.com webhooks). */
export function verifyHexSignature(raw: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(signature || ""), b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

import "server-only";
import { config, logFailure } from "./config";

/** Verifies a Cloudflare Turnstile token on the server. Without a secret (local previews) verification is skipped and logged. */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  if (!config.turnstileSecret) {
    if (config.isProduction) logFailure("turnstile", "TURNSTILE_SECRET_KEY missing in production");
    return true;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: config.turnstileSecret, response: token, remoteip: ip });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) logFailure("turnstile", "rejected", { codes: data["error-codes"] });
    return !!data.success;
  } catch (error) {
    logFailure("turnstile", error);
    return false;
  }
}

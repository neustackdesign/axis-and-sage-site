import "server-only";
import { resolveMx } from "node:dns/promises";

/** True when the email's domain has MX records, so the auto-reply has somewhere to land. */
export async function hasMx(email: string, timeoutMs = 3000): Promise<boolean> {
  const domain = email.split("@")[1]?.trim().toLowerCase();
  if (!domain) return false;
  try {
    const records = await Promise.race([resolveMx(domain), new Promise<never>((_, reject) => setTimeout(() => reject(new Error("mx timeout")), timeoutMs))]);
    return records.some((r) => r.exchange && r.exchange !== ".");
  } catch {
    return false;
  }
}

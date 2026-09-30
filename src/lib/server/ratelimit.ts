import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { config, logFailure } from "./config";

// 5 submissions per 10 minutes per IP, 3 per hour per email.
const LIMITS = { ip: { max: 5, windowMs: 10 * 60_000, window: "10 m" }, email: { max: 3, windowMs: 60 * 60_000, window: "1 h" } } as const;

let limiters: { ip: Ratelimit; email: Ratelimit } | null = null;
function upstash() {
  if (!config.upstashUrl || !config.upstashToken) return null;
  if (!limiters) {
    const redis = new Redis({ url: config.upstashUrl, token: config.upstashToken });
    limiters = {
      ip: new Ratelimit({ redis, prefix: "as:rl:ip", limiter: Ratelimit.slidingWindow(LIMITS.ip.max, LIMITS.ip.window) }),
      email: new Ratelimit({ redis, prefix: "as:rl:email", limiter: Ratelimit.slidingWindow(LIMITS.email.max, LIMITS.email.window) }),
    };
  }
  return limiters;
}

// In-memory fallback for previews without Upstash. Per instance only; production requires Upstash (scripts/check-launch.mjs).
const memory = new Map<string, number[]>();
function memoryHit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const hits = (memory.get(key) || []).filter((t) => now - t < windowMs);
  hits.push(now);
  memory.set(key, hits);
  return hits.length <= max;
}

export async function checkRateLimit(ip: string, email: string): Promise<{ ok: boolean; reason?: "ip" | "email" }> {
  const emailKey = email.trim().toLowerCase();
  const l = upstash();
  if (l) {
    try {
      const byIp = await l.ip.limit(ip);
      if (!byIp.success) return { ok: false, reason: "ip" };
      if (emailKey) { const byEmail = await l.email.limit(emailKey); if (!byEmail.success) return { ok: false, reason: "email" }; }
      return { ok: true };
    } catch (error) {
      logFailure("ratelimit", error);
      // Fall through to the in-memory limiter rather than blocking a real enquiry.
    }
  }
  if (!memoryHit(`ip:${ip}`, LIMITS.ip.max, LIMITS.ip.windowMs)) return { ok: false, reason: "ip" };
  if (emailKey && !memoryHit(`email:${emailKey}`, LIMITS.email.max, LIMITS.email.windowMs)) return { ok: false, reason: "email" };
  return { ok: true };
}

export function clientIp(request: Request) {
  return request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
}

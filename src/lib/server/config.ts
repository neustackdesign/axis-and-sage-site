import "server-only";

// Server configuration. Every integration is optional at runtime so a missing key degrades, never drops an enquiry.
// scripts/check-launch.mjs refuses a production build while launch-critical keys are missing.
const env = (k: string) => process.env[k]?.trim() || "";

export const config = {
  isProduction: process.env.VERCEL_ENV === "production",
  siteUrl: (env("NEXT_PUBLIC_SITE_URL") || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")).replace(/\/$/, ""),
  databaseUrl: env("DATABASE_URL"),
  resendKey: env("RESEND_API_KEY"),
  resendBase: env("RESEND_API_BASE") || "https://api.resend.com", // override only for local testing
  mailFrom: env("MAIL_FROM") || "Axis & Sage <hello@notify.axisandsage.com>",
  mailReplyTo: env("MAIL_REPLY_TO") || "info@axisandsage.com",
  notifyTo: env("CONTACT_TO_EMAIL") || "info@axisandsage.com",
  notifyCc: env("FOUNDER_EMAILS").split(",").map((s) => s.trim()).filter(Boolean),
  turnstileSecret: env("TURNSTILE_SECRET_KEY"),
  upstashUrl: env("KV_REST_API_URL") || env("UPSTASH_REDIS_REST_URL"),
  upstashToken: env("KV_REST_API_TOKEN") || env("UPSTASH_REDIS_REST_TOKEN"),
  hubspotToken: env("HUBSPOT_PRIVATE_APP_TOKEN"),
  hubspotPipeline: env("HUBSPOT_PIPELINE_ID") || "default",
  hubspotStageNewLead: env("HUBSPOT_STAGE_NEW_LEAD"),
  hubspotStageCallBooked: env("HUBSPOT_STAGE_CALL_BOOKED"),
  signingSecret: env("SIGNING_SECRET"),
  beehiivKey: env("BEEHIIV_API_KEY"),
  beehiivPublication: env("BEEHIIV_PUBLICATION_ID"),
  calWebhookSecret: env("CAL_WEBHOOK_SECRET"),
};

export function logFailure(step: string, error: unknown, context: Record<string, unknown> = {}) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(JSON.stringify({ level: "error", event: "lead_pipeline_failure", step, message, ...context }));
}

export function logInfo(event: string, context: Record<string, unknown> = {}) {
  console.log(JSON.stringify({ level: "info", event, ...context }));
}

import "server-only";

// Server configuration. Every integration is optional at runtime so a missing key degrades, never drops an enquiry.
// scripts/check-launch-env.mjs refuses a production build while launch-critical keys are missing.
const env = (k: string) => process.env[k]?.trim() || "";

export const config = {
  isProduction: process.env.VERCEL_ENV === "production",
  siteUrl: (env("NEXT_PUBLIC_SITE_URL") || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")).replace(/\/$/, ""),
  sheetWebhookUrl: env("SHEET_WEBHOOK_URL"),
  sheetWebhookSecret: env("SHEET_WEBHOOK_SECRET"),
  blobToken: env("BLOB_READ_WRITE_TOKEN"),
  cronSecret: env("CRON_SECRET"),
  ipHashSalt: env("IP_HASH_SALT"),
  calWebhookSecret: env("CAL_WEBHOOK_SECRET"),
  resendKey: env("RESEND_API_KEY"),
  mailFrom: env("MAIL_FROM") || "Axis & Sage <info@axisandsage.com>",
  notifyTo: env("CONTACT_TO_EMAIL") || "info@axisandsage.com",
  founders: env("FOUNDER_EMAILS").split(",").map((s) => s.trim()).filter(Boolean),
  mailerLiteKey: env("MAILERLITE_API_KEY"),
  mailerLiteGroup: env("MAILERLITE_GROUP_ID"),
};

export function logEvent(event: string, context: Record<string, unknown> = {}) {
  const failure = /fail|pending|error/.test(event);
  (failure ? console.error : console.log)(JSON.stringify({ level: failure ? "error" : "info", event, ...context }));
}

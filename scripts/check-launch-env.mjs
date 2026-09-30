// Production gate: fails a production build early if launch-critical configuration is missing.
if (process.env.VERCEL_ENV !== "production") { console.log("Launch env check skipped (not a production build)."); process.exit(0); }

const has = (k) => !!process.env[k]?.trim();
const required = [
  ["NEXT_PUBLIC_SITE_URL", "canonical URLs and email links"],
  ["DATABASE_URL", "Neon Postgres: leads, tool_results, subscribers, conversions"],
  ["RESEND_API_KEY", "email via notify.axisandsage.com"],
  ["FOUNDER_EMAILS", "founders copied on every lead"],
  ["TURNSTILE_SECRET_KEY", "Cloudflare Turnstile server verification"],
  ["NEXT_PUBLIC_TURNSTILE_SITE_KEY", "Cloudflare Turnstile widget"],
  ["SIGNING_SECRET", "newsletter confirmation links"],
];
const missing = required.filter(([k]) => !has(k));
if (!(has("KV_REST_API_URL") && has("KV_REST_API_TOKEN")) && !(has("UPSTASH_REDIS_REST_URL") && has("UPSTASH_REDIS_REST_TOKEN"))) missing.push(["KV_REST_API_URL / KV_REST_API_TOKEN", "Upstash Redis rate limits"]);
if (has("NEXT_PUBLIC_BOOKING_URL") && !has("CAL_WEBHOOK_SECRET")) missing.push(["CAL_WEBHOOK_SECRET", "verifies the Cal.com booking webhook"]);
for (const [k, why] of [["HUBSPOT_PRIVATE_APP_TOKEN", "HubSpot sync"], ["BEEHIIV_API_KEY", "Beehiiv sync"], ["NEXT_PUBLIC_BOOKING_URL", "booking calendar"], ["NEXT_PUBLIC_WHATSAPP_NUMBER", "WhatsApp links"]]) {
  if (!has(k)) console.warn(`Optional and not set: ${k} (${why}).`);
}
if (missing.length) {
  console.error("\nLaunch env check failed. Missing:");
  for (const [k, why] of missing) console.error(`  ${k}: ${why}`);
  process.exit(1);
}
console.log("Launch env check passed.");

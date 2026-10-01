// Production gate: fails a production build early if launch-critical configuration is missing.
if (process.env.VERCEL_ENV !== "production") { console.log("Launch env check skipped (not a production build)."); process.exit(0); }

const has = (k) => !!process.env[k]?.trim();
const required = [
  ["NEXT_PUBLIC_SITE_URL", "canonical URLs and links in emails"],
  ["SHEET_WEBHOOK_URL", "the Apps Script web app on the Pipeline Sheet"],
  ["SHEET_WEBHOOK_SECRET", "signs every post to the Apps Script (same value as its Script Property)"],
  ["BLOB_READ_WRITE_TOKEN", "private Vercel Blob store: leads are stored here before they are forwarded"],
  ["RESEND_API_KEY", "sends every website email: the lead alert, the auto-reply and tool results"],
  ["CRON_SECRET", "protects the daily retry cron"],
  ["IP_HASH_SALT", "salts the IP hash; the IP itself is never stored"],
  ["NEXT_PUBLIC_BOOKING_URL", "the Cal.com booking embed"],
  ["CAL_WEBHOOK_SECRET", "verifies the Cal.com booking webhook"],
];
const optional = [
  [["MAILERLITE_API_KEY", "MAILERLITE_GROUP_ID"], "newsletter sign-ups park in Blob until these are set"],
  [["FOUNDER_EMAILS"], "lead alerts go to CONTACT_TO_EMAIL only"],
  [["NEXT_PUBLIC_WHATSAPP_NUMBER"], "WhatsApp links stay hidden"],
  [["NEXT_PUBLIC_LINKEDIN_URL", "NEXT_PUBLIC_LINKEDIN_IFEANYI", "NEXT_PUBLIC_LINKEDIN_TOMIWA"], "LinkedIn links stay hidden"],
  [["NEXT_PUBLIC_GA_ID"], "GA4 stays off"],
];
for (const [keys, why] of optional) {
  const unset = keys.filter((k) => !has(k));
  if (unset.length) console.warn(`Optional and not set: ${unset.join(", ")} (${why}).`);
}
// The hero should be self-hosted before launch; until then it falls back to Unsplash's CDN.
const { existsSync } = await import("node:fs");
if (!existsSync(new URL("../public/images/axis-sage/lagos-sunset-chibuzo-nwaneri.jpg", import.meta.url))) {
  console.warn("Hero image not self-hosted yet (it falls back to images.unsplash.com). Run `pnpm fetch:hero` and commit the file.");
}
const missing = required.filter(([k]) => !has(k));
if (missing.length) {
  console.error("\nLaunch env check failed. Missing:");
  for (const [k, why] of missing) console.error(`  ${k}: ${why}`);
  process.exit(1);
}
console.log("Launch env check passed.");

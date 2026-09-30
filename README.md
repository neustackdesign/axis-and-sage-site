# Axis & Sage site

This is the Axis & Sage Advisory website. It's a strict TypeScript Next.js App Router application built on the Axis & Sage design system. It deploys on Vercel Hobby and has no database.

## Status

**Pages built:** the full sitemap from the Conversion Design brief.
- Home.
- `/conversion-design`.
- The three practice pages.
- `/engagements` and `/engagements/embedded-leadership`.
- `/work` with filters, and six case pages.
- `/people` and both profiles.
- `/library`, the six tools and the guides.
- `/newsletter`, `/contact`, `/thank-you`, `/privacy`, `/terms` and the 404.

**Where things live:**
- **Content:** typed modules in `src/content/`. There is no CMS.
- **Tool logic:** pure functions in `src/lib/tools/`, from Spec A (`reference/briefs/06-tools-spec.md`).
- **Leads:** `src/lib/pipeline/` (pure, tested) and `src/lib/server/` (Vercel wiring).
- **Emails:** `src/lib/pipeline/emails.ts`, sent through Resend.
- **Pipeline Sheet script:** `integrations/google-apps-script/`.

The finished site has no AWS runtime dependency. DNS, AWS and the production domain stay untouched until the cutover below is approved.

The component usage map is in `reference/design-system/website-component-map.md`.

## Requirements

- Node.js 20.9 or newer.
- pnpm 11.2.2 (`corepack enable` is recommended). Use `pnpm install --frozen-lockfile`.

## Local development

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

The site runs with no keys at all:
- **No Blob token:** forms can't store anything, so they offer the visitor a prefilled email instead.
- **No Sheet URL:** leads are stored in Blob and wait for the cron.
- **No Resend key:** emails are parked in Blob and wait for the cron.
- **No MailerLite key:** sign-ups are parked in Blob and wait for the cron.

## The stack

| Service | What it does |
| --- | --- |
| Vercel | Hosts the site, runs the forms and the daily cron. |
| Vercel Blob (private store) | Holds every lead until the Sheet confirms it, plus any email or newsletter sign-up that couldn't be sent yet. |
| Google Workspace | The info@axisandsage.com inbox, where the founders reply. The Sheet "Axis & Sage · Pipeline" and its Apps Script web app keep the record of every lead. |
| Resend | Sends every website email from `Axis & Sage <info@axisandsage.com>`: the lead alert, the auto-reply and tool results. |
| MailerLite | The newsletter list. MailerLite sends its own confirmation email. |
| Cal.com | Booking, as an inline embed on `/contact#book`. |
| Vercel Web Analytics and Speed Insights | Page views and performance. They need no keys. |
| GA4 | Off. It switches on only if `NEXT_PUBLIC_GA_ID` is set, and then uses Consent Mode. |

The site qualifies. The Sheet tracks. Cal.com schedules. Resend sends. The founders reply from Gmail.

## The lead path

The contact form, the CTA band, tool emails and Cal.com bookings all take the same path:

| Step | What happens |
| --- | --- |
| 1 | Validate with `validateLead` (`src/lib/leads.ts`). The honeypot field is kept: if it's filled, the visitor sees the normal success and nothing is stored. |
| 2 | Minimum fill time. A submission sent less than 3 seconds after the form rendered also gets the normal success, and nothing is stored. |
| 3 | Store first: JSON in the private Blob store at `pending/leads/<ISO time>-<random id>.json`. The record holds the fields, the sentence, first-touch and last-touch UTMs, the referrer, the landing page and the submission page. It holds no IP data. |
| 4 | Forward: a signed POST to `SHEET_WEBHOOK_URL`, with an 8-second timeout. The live forward also carries a SHA-256 hash of the IP, salted with `IP_HASH_SALT`, for the Sheet's rate limit; the Sheet doesn't store it. When the Apps Script replies `{ ok: true }`, the Blob file is deleted. |
| 5 | Email through Resend: the alert to info@ with the founders copied and Reply-To set to the visitor, plus the visitor's auto-reply (contact and CTA only, when the email's domain has MX records) or tool result. Nothing is sent if the Sheet replied `limited: true`. If the Sheet can't be reached, the emails still go. An email Resend doesn't accept is parked in `pending/emails/` for the cron. |
| 6 | Respond with success once the Blob write succeeds, even if the forward failed. The contact form redirects to `/thank-you`. |
| 7 | The mailto hand-over appears only when the Blob write itself fails. |

**Signing.** Apps Script can't read request headers, so the signature travels in the body: `{ payload, ts, sig }`, where `sig` is the hex HMAC-SHA256 of `ts + "." + JSON.stringify(payload)` using `SHEET_WEBHOOK_SECRET`. The script checks it with `Utilities.computeHmacSha256Signature` and rejects any `ts` older than 5 minutes. Apps Script answers a POST with a 302 to `script.googleusercontent.com`; the site follows the redirect and reads `{ ok: true }`.

**Daily cron.** `vercel.json` runs `/api/cron/retry` once a day, with `Authorization: Bearer CRON_SECRET`. Each run:
- re-forwards everything in `pending/leads/`, deleting each file once delivered
- re-sends everything in `pending/subscribers/` to MailerLite
- re-sends everything in `pending/emails/` through Resend
- logs a count of anything still pending (`event: "cron_retry"`)

**What the Apps Script does** (details in `integrations/google-apps-script/README.md`). It only records; it sends no email:
- verifies the signature
- applies a soft rate limit: 5 per 10 minutes per IP hash, and 3 per hour per email. Over the limit, the row is still added and marked "limited", and it replies `limited: true` so the site sends no email.
- appends one row per lead, tool email or booking to the "Leads" tab. It never edits existing rows.
- adds one anonymous row per completed tool to the "Tools" tab: date, tool, answers, result and UTM source
- deletes Tools rows older than 12 months, daily, as the privacy notice says

**Email (Resend).**
- Add the domain `axisandsage.com` in Resend and add the DNS records it gives you. Don't touch Google's MX records: inbound mail stays with Google Workspace.
- If Resend asks for an SPF record and one already exists for Google, don't add a second SPF TXT record. Merge Resend's mechanism into the existing one, or use the subdomain setup Resend recommends (its default puts the SPF and bounce records on a `send.` subdomain, which avoids the collision).
- Mail goes out as `Axis & Sage <info@axisandsage.com>`, set by `MAIL_FROM`. Alerts reply to the visitor; everything else replies to info@.
- MailerLite can use its own sending subdomain later if it needs one.

**Newsletter.** Sign-ups go to the MailerLite API, into group `MAILERLITE_GROUP_ID`. In MailerLite, switch on double opt-in for API sign-ups (Subscribers → Settings → Double opt-in, and tick it for API and integrations). MailerLite then sends the confirmation itself. If the API call fails, the sign-up is written to `pending/subscribers/` for the cron. The visitor sees "Check your inbox to confirm your subscription."

**Bookings.** The Cal.com inline embed on `/contact#book` uses `NEXT_PUBLIC_BOOKING_URL` (`https://cal.com/axisandsage/30min`). Point a Cal.com webhook (BOOKING_CREATED) at `/api/cal`, with its secret in `CAL_WEBHOOK_SECRET`. The route verifies the `x-cal-signature-256` signature, then sends the booking down the lead path with source `booking`.

**Tools.** Tool pages need no sign-up. An email is asked for only to send a result, a model or a checklist. The lift model, the DoA matrix, the ESOP model and the readiness checklist download as `.xlsx` files with live formulas, built in the browser with ExcelJS. There are no start, step or click events: a completed tool writes one anonymous row to the Tools tab.

## Setup, in order

Each value below, in the order you'll get it. `NEXT_PUBLIC_*` values are public; everything else is secret. Set the Vercel values in the project's Settings → Environment Variables, for Production and Preview.

Create the Sheet and the Apps Script in the Axis & Sage Google Workspace, signed in as info@axisandsage.com if it's a real user, or as the Workspace user that owns the info@ alias. Not a personal Gmail account. Share the Sheet with both founders as editors. Claude and Vercel never need that Google login: the site needs only the web app URL and the secret.

| # | Name | Where | Where the value comes from |
| --- | --- | --- | --- |
| 1 | `SHEET_WEBHOOK_SECRET` | Vercel and Script Property | Make it once, for example with `openssl rand -hex 32`, and use the same value in both places. It's the script's only property. |
| 2 | `SHEET_WEBHOOK_URL` | Vercel | The web app URL from Apps Script → Deploy → Manage deployments. It ends in `/exec`. |
| 3 | `BLOB_READ_WRITE_TOKEN` | Vercel | Vercel → Storage → Create → Blob, with **Private** access, then connect it to the project. Vercel adds the token itself. |
| 4 | `RESEND_API_KEY` | Vercel | Resend → API Keys → Create, with sending access, once `axisandsage.com` shows as verified in Resend → Domains. |
| 5 | `FOUNDER_EMAILS` | Vercel | Both founders' addresses, comma-separated. They're copied on every lead alert. |
| 6 | `CRON_SECRET` | Vercel | Any long random string. Vercel sends it to the cron route. |
| 7 | `IP_HASH_SALT` | Vercel | Any long random string. Changing it later only breaks rate-limit continuity. |
| 8 | `NEXT_PUBLIC_SITE_URL` | Vercel | `https://axisandsage.com` in Production. Previews fall back to the Vercel URL. |
| 9 | `NEXT_PUBLIC_BOOKING_URL` | Vercel | `https://cal.com/axisandsage/30min`. In Cal.com, connect both founders' calendars and make one question required: "Who needs to act, and what do you need them to do?" |
| 10 | `CAL_WEBHOOK_SECRET` | Vercel | Cal.com → Settings → Developer → Webhooks: add `https://axisandsage.com/api/cal` for BOOKING_CREATED, and copy its secret. |
| 11 | `MAIL_FROM`, `CONTACT_TO_EMAIL` | Vercel, optional | Default to `Axis & Sage <info@axisandsage.com>` and `info@axisandsage.com`. |
| 12 | `MAILERLITE_API_KEY` | Vercel, optional | MailerLite → Integrations → API → Generate new token. Switch on double opt-in for API sign-ups. |
| 13 | `MAILERLITE_GROUP_ID` | Vercel, optional | MailerLite → Subscribers → Groups → open the group; the ID is in the URL. |
| 14 | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Vercel, optional | International format, for example `+971…`. WhatsApp links stay hidden until it's set. |
| 15 | `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_LINKEDIN_IFEANYI`, `NEXT_PUBLIC_LINKEDIN_TOMIWA`, `NEXT_PUBLIC_PORTFOLIO_TOMIWA` | Vercel, optional | Profile URLs. Each link stays hidden until it's set. |
| 16 | `NEXT_PUBLIC_GA_ID` | Vercel, off at launch | A GA4 measurement ID. Leave it unset. |

Numbers 1 to 10 are required in Production: `scripts/check-launch-env.mjs` stops the build without them. The optional ones print a warning.

Vercel Web Analytics and Speed Insights need no keys. Turn them on in the project's Analytics and Speed Insights tabs.

## Launch inputs and the production gate

A production build (`VERCEL_ENV=production`) runs four gates in order:

1. `scripts/check-launch-env.mjs` fails if a required variable is missing.
2. The full test suite runs. A failing test fails the build.
3. `next build`.
4. `scripts/check-placeholders.mjs` fails if any rendered page still contains a placeholder, such as `[price]`, `[Title]` or `DRAFT`.

Previews keep any placeholder visible. Run `pnpm check:placeholders` after a local build for the same report.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Deployment

1. Link the repository to the Axis & Sage project on Vercel (Hobby).
2. Turn on Deployment Protection for previews.
3. Create the Sheet and deploy the Apps Script (see its README), create the private Blob store, verify the domain in Resend, and set the variables above.
4. Review the preview.

Do not attach `axisandsage.com` until the preview is explicitly approved and every line of the launch gate passes.

## Moving off AWS

Today the old site runs on S3 and CloudFront, and DNS for `axisandsage.com` is in Route 53. Moving the site to Vercel alone doesn't remove AWS: the nameservers have to move too. The end state has no AWS at all. Nothing below happens without explicit approval, and the AWS deletions need a second approval after the rollback period.

**Before the cutover**
1. Export every Route 53 record, with a screenshot as well: MX, SPF and other TXT, DKIM, DMARC, verification records, the apex, `www` and anything else.
2. Choose the new DNS host. Vercel DNS is the simplest, since Vercel already hosts the site. Cloudflare's free DNS is the alternative if you want DNS independent of the host.
3. Recreate every record there. Keep Google's MX, SPF, DKIM and DMARC exactly as they are, and add Resend's records.

**Cutover**
1. Point the domain's nameservers from Route 53 to the new DNS host.
2. Attach the apex and `www` to the Vercel project; check redirects and certificates.
3. Check Google mail both ways.
4. Check Resend shows the domain as verified, then send a test lead.
5. Check MailerLite later, once it sends.
6. Run the full test buyer from the launch gate.

**After the rollback period, with a second approval**
1. Archive the old static site as a ZIP.
2. Delete the CloudFront distribution, the S3 website bucket and the Route 53 hosted zone.
3. If the domain is registered with AWS Registrar, transfer the registration too. It isn't a runtime dependency, so it can wait until after launch.

## Repository safety

The canonical checkout is `/Users/tomiwao/Code/axis-and-sage-site`.
- Do not clone it or create a nested repository.
- Do not modify DNS or AWS records until the cutover above is approved.
- Do not treat the legacy Framer export as maintainable code.

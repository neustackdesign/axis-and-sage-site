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
- **Pipeline Sheet script:** `integrations/google-apps-script/`.

DNS, AWS infrastructure and the production domain are intentionally untouched.

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
- **No MailerLite key:** sign-ups are parked in Blob and wait for the cron.

## The stack

| Service | What it does |
| --- | --- |
| Google Workspace Apps Script | A web app on the Sheet "Axis & Sage · Pipeline". It writes each lead to the Sheet and sends every email from info@axisandsage.com. |
| Vercel Blob (private store) | Holds every lead until the Sheet confirms it, plus newsletter sign-ups that MailerLite didn't accept. |
| MailerLite | The newsletter list. MailerLite sends its own confirmation email. |
| Cal.com | Booking, as an inline embed on `/contact#book`. |
| Vercel Web Analytics and Speed Insights | Page views and performance. They need no keys. |
| GA4 | Off. It switches on only if `NEXT_PUBLIC_GA_ID` is set, and then uses Consent Mode. |

## The lead path

The contact form, the CTA band, tool emails and Cal.com bookings all take the same path:

| Step | What happens |
| --- | --- |
| 1 | Validate with `validateLead` (`src/lib/leads.ts`). The honeypot field is kept: if it's filled, the visitor sees the normal success and nothing is stored. |
| 2 | Minimum fill time. A submission sent less than 3 seconds after the form rendered also gets the normal success, and nothing is stored. |
| 3 | Store first: JSON in the private Blob store at `pending/leads/<ISO time>-<random id>.json`. The record holds the fields, the sentence, first-touch and last-touch UTMs, the referrer, the landing page, the submission page, and a SHA-256 hash of the IP salted with `IP_HASH_SALT`. The IP itself is never stored. |
| 4 | Forward: a signed POST to `SHEET_WEBHOOK_URL`, with an 8-second timeout. When the Apps Script replies `{ ok: true }`, the Blob file is deleted. |
| 5 | Respond with success once the Blob write succeeds, even if the forward failed. The contact form redirects to `/thank-you`. |
| 6 | The mailto hand-over appears only when the Blob write itself fails. |

**Signing.** Apps Script can't read request headers, so the signature travels in the body: `{ payload, ts, sig }`, where `sig` is the hex HMAC-SHA256 of `ts + "." + JSON.stringify(payload)` using `SHEET_WEBHOOK_SECRET`. The script checks it with `Utilities.computeHmacSha256Signature` and rejects any `ts` older than 5 minutes. Apps Script answers a POST with a 302 to `script.googleusercontent.com`; the site follows the redirect and reads `{ ok: true }`.

**Daily cron.** `vercel.json` runs `/api/cron/retry` once a day, with `Authorization: Bearer CRON_SECRET`. Each run:
- re-forwards everything in `pending/leads/`, deleting each file once delivered
- re-sends everything in `pending/subscribers/` to MailerLite
- logs a count of anything still pending (`event: "cron_retry"`)

**What the Apps Script does** (details in `integrations/google-apps-script/README.md`):
- verifies the signature
- applies a soft rate limit: 5 per 10 minutes per IP hash, and 3 per hour per email. Over the limit, the row is still added and marked "limited", and no email is sent.
- appends one row per lead or booking to the "Leads" tab. It never edits existing rows.
- sends the lead alert to info@, copying the founders
- sends the auto-reply for contact and CTA leads, only when the site passes `sendAutoreply` (the site checks the domain has MX records first)
- sends tool results to the visitor as HTML and text, with a share link and a "Book a Diagnostic" link
- adds one anonymous row per completed tool to the "Tools" tab: date, tool, answers, result and UTM source

**Newsletter.** Sign-ups go to the MailerLite API, into group `MAILERLITE_GROUP_ID`. In MailerLite, switch on double opt-in for API sign-ups (Subscribers → Settings → Double opt-in, and tick it for API and integrations). MailerLite then sends the confirmation itself. If the API call fails, the sign-up is written to `pending/subscribers/` for the cron. The visitor sees "Check your inbox to confirm your subscription."

**Bookings.** The Cal.com inline embed on `/contact#book` uses `NEXT_PUBLIC_BOOKING_URL` (`https://cal.com/axisandsage/30min`). Point a Cal.com webhook (BOOKING_CREATED) at `/api/cal`, with its secret in `CAL_WEBHOOK_SECRET`. The route verifies the `x-cal-signature-256` signature, then sends the booking down the lead path with source `booking`.

**Tools.** Tool pages need no sign-up. An email is asked for only to send a result, a model or a checklist. The lift model, the DoA matrix, the ESOP model and the readiness checklist download as `.xlsx` files with live formulas, built in the browser with ExcelJS. There are no start, step or click events: a completed tool writes one anonymous row to the Tools tab.

## Setup, in order

Each value below, in the order you'll get it. `NEXT_PUBLIC_*` values are public; everything else is secret. Set the Vercel values in the project's Settings → Environment Variables, for Production and Preview.

| # | Name | Where | Where the value comes from |
| --- | --- | --- | --- |
| 1 | `SHEET_WEBHOOK_SECRET` | Vercel and Script Property | Make it once, for example with `openssl rand -hex 32`, and use the same value in both places. |
| 2 | `FOUNDER_EMAILS` | Script Property | Both founders' addresses, comma-separated. They're copied on every lead alert. |
| 3 | `FROM_ADDRESS` | Script Property | `info@axisandsage.com`. |
| 4 | `SHEET_WEBHOOK_URL` | Vercel | The web app URL from Apps Script → Deploy → Manage deployments. It ends in `/exec`. |
| 5 | `BLOB_READ_WRITE_TOKEN` | Vercel | Vercel → Storage → Create → Blob, with **Private** access, then connect it to the project. Vercel adds the token itself. |
| 6 | `CRON_SECRET` | Vercel | Any long random string. Vercel sends it to the cron route. |
| 7 | `IP_HASH_SALT` | Vercel | Any long random string. Changing it later only breaks rate-limit continuity. |
| 8 | `NEXT_PUBLIC_SITE_URL` | Vercel | `https://axisandsage.com` in Production. Previews fall back to the Vercel URL. |
| 9 | `NEXT_PUBLIC_BOOKING_URL` | Vercel | `https://cal.com/axisandsage/30min`. |
| 10 | `CAL_WEBHOOK_SECRET` | Vercel | Cal.com → Settings → Developer → Webhooks: add `https://axisandsage.com/api/cal` for BOOKING_CREATED, and copy its secret. |
| 11 | `MAILERLITE_API_KEY` | Vercel, optional | MailerLite → Integrations → API → Generate new token. |
| 12 | `MAILERLITE_GROUP_ID` | Vercel, optional | MailerLite → Subscribers → Groups → open the group; the ID is in the URL. |
| 13 | `NEXT_PUBLIC_WHATSAPP_NUMBER` | Vercel, optional | International format, for example `+971…`. WhatsApp links stay hidden until it's set. |
| 14 | `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_LINKEDIN_IFEANYI`, `NEXT_PUBLIC_LINKEDIN_TOMIWA`, `NEXT_PUBLIC_PORTFOLIO_TOMIWA` | Vercel, optional | Profile URLs. Each link stays hidden until it's set. |
| 15 | `NEXT_PUBLIC_GA_ID` | Vercel, off at launch | A GA4 measurement ID. Leave it unset. |

Numbers 1 to 10, except the Script Properties, are required in Production: `scripts/check-launch-env.mjs` stops the build without them. The optional ones print a warning.

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

1. Link the repository to the Axis & Sage project on Vercel.
2. Turn on Deployment Protection for previews.
3. Create the Sheet and deploy the Apps Script (see its README), create the private Blob store, and set the variables above.
4. Review the preview.

Do not attach `axisandsage.com` until the preview is explicitly approved and every line of the launch gate passes.

**Cutover plan:**
1. Review the preview.
2. Verify forms, SEO and accessibility.
3. Lower the DNS TTL if needed.
4. Attach the domain in the approved Vercel project.
5. Verify redirects and certificates.
6. Keep the AWS deployment for rollback.

Deleting AWS is a separate, later action. It comes after the cutover and the rollback period, and needs a second explicit approval.

## Repository safety

The canonical checkout is `/Users/tomiwao/Code/axis-and-sage-site`.
- Do not clone it or create a nested repository.
- Do not modify DNS or AWS records.
- Do not treat the legacy Framer export as maintainable code.

# Axis & Sage site

This is the Axis & Sage Advisory website. It's a strict TypeScript Next.js App Router application built on the Axis & Sage design system, and it deploys on Vercel.

## Status

**Pages built:** the full sitemap from the Conversion Design brief.
- Home.
- `/conversion-design`.
- The four practice pages.
- `/engagements`.
- `/work` with filters, and six case pages.
- `/people` and both profiles.
- `/library`, the six tools and the guides.
- `/newsletter`, `/contact`, `/thank-you`, `/privacy`, `/terms` and the 404.

**Where things live:**
- **Content:** typed modules in `src/content/`. There is no CMS.
- **Tool logic:** pure functions in `src/lib/tools/`.
- **Leads:** one server pipeline in `src/lib/server/`.

DNS, AWS infrastructure and the production domain are intentionally untouched.

The component usage map, the placeholders and the assets still needed are listed in `reference/design-system/website-component-map.md`.

## Requirements

- Node.js 20.9 or newer.
- pnpm 11.2.2 (`corepack enable` is recommended). Use `pnpm install --frozen-lockfile`.

## Local development

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

The site runs with no keys at all, and every integration degrades safely:
- **No database or email:** forms offer the visitor a prefilled email instead.
- **No Turnstile secret:** verification is skipped and logged.
- **No Upstash:** an in-memory rate limiter stands in.

## The lead pipeline

Every entry point goes through the same steps. The entry points are:
- the contact form
- the CTA band
- newsletter sign-ups
- tool emails
- Cal.com bookings

| Step | What happens |
| --- | --- |
| 1 | Validate with `validateLead` (`src/lib/leads.ts`). |
| 2 | Verify Cloudflare Turnstile on the server. The honeypot field is kept. |
| 3 | Rate limit with Upstash Redis: 5 submissions per 10 minutes per IP, and 3 per hour per email. |
| 4 | Save to Neon Postgres: `leads`, `tool_results`, `subscribers`, and `conversions` for events. |
| 5 | Notify `info@axisandsage.com` through Resend, with `FOUNDER_EMAILS` copied. |
| 6 | Send the autoresponder, for contact and CTA leads only. It's plain text and strips any URLs from what the visitor typed. |
| 7 | Sync to HubSpot, best effort: create or update the contact and add a deal. Retried, and never blocks the response. |
| 8 | Respond. The contact form redirects to `/thank-you`. |

**Failure handling:**
- If the database write fails, the notification email is still sent.
- The visitor sees the mailto hand-over only when both the database and the email fail.
- Every failure is logged as JSON with `event: "lead_pipeline_failure"`.

**Attribution:** first-touch and last-touch UTMs, the referrer and the landing page are kept in localStorage for 90 days. They're sent with every submission and stored on every row.

**Email:**
- Mail is sent from "Axis & Sage <hello@notify.axisandsage.com>", with Reply-To set to info@axisandsage.com.
- Verify `notify.axisandsage.com` in Resend: add its SPF, DKIM and DMARC records. That keeps website mail off the founders' own domain reputation.
- DNS for the subdomain is a separate, approved change. This repo does not touch DNS.

**Newsletter:**
- Double opt-in with a signed, expiring link (`/api/newsletter/confirm`).
- Confirmed subscribers sync to Beehiiv once `BEEHIIV_API_KEY` and `BEEHIIV_PUBLICATION_ID` are set.

**Bookings:**
- The Cal.com inline embed on `/contact#book` is built from `NEXT_PUBLIC_BOOKING_URL`. While that's unset, the note form takes its place.
- Point a Cal.com webhook (BOOKING_CREATED) at `/api/cal` with the secret in `CAL_WEBHOOK_SECRET`.

**Tools:**
- Results are emailed to the visitor as HTML and plain text, with a share link and a "Book a Diagnostic with this sentence" link. info@ gets a copy.
- The lift model, the DoA matrix and the ESOP model also download an `.xlsx` with live formulas, built in the browser with ExcelJS.

### Database

Apply the schema once, and again after any change to `db/schema.sql`. It's idempotent:

```bash
DATABASE_URL=... pnpm db:migrate
```

## Environment variables

Set these in the Vercel project (Settings → Environment Variables) for Production and Preview. `NEXT_PUBLIC_*` values are public. Everything else is secret.

| Variable | Required for launch | Where it comes from |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | `https://axisandsage.com` in Production. Previews fall back to the Vercel URL. |
| `DATABASE_URL` | yes | Vercel Marketplace → Neon. Added automatically when you connect the store. |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | yes | Vercel Marketplace → Upstash Redis. Added automatically. `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` also work. |
| `RESEND_API_KEY` | yes | Resend → API Keys, after verifying `notify.axisandsage.com`. |
| `FOUNDER_EMAILS` | yes | Both founders' addresses, comma-separated. They're copied on every lead. |
| `CONTACT_TO_EMAIL` | no | Defaults to `info@axisandsage.com`. |
| `MAIL_FROM`, `MAIL_REPLY_TO` | no | Default to `Axis & Sage <hello@notify.axisandsage.com>` and `info@axisandsage.com`. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | yes | Cloudflare dashboard → Turnstile → add a widget for the site's domains. |
| `SIGNING_SECRET` | yes | Any long random string, for example `openssl rand -base64 32`. Signs the newsletter links. |
| `HUBSPOT_PRIVATE_APP_TOKEN` | recommended | HubSpot → Settings → Integrations → Private apps. Needs these scopes: `crm.objects.contacts.write`, `crm.objects.deals.write` and the matching read scopes. |
| `HUBSPOT_PIPELINE_ID`, `HUBSPOT_STAGE_NEW_LEAD`, `HUBSPOT_STAGE_CALL_BOOKED` | recommended | HubSpot → Settings → Objects → Deals → Pipelines. Create "New lead" and "Call booked", then copy their internal IDs. Without them, deals go to `default` / `appointmentscheduled`. |
| `NEXT_PUBLIC_BOOKING_URL` | recommended | The Cal.com event link, for example `https://cal.com/axisandsage/30min`. |
| `CAL_WEBHOOK_SECRET` | if booking is set | Cal.com → Settings → Developer → Webhooks → the secret. |
| `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID` | optional | Beehiiv → Settings → Integrations → API. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | optional | In international format, for example `+971…`. All WhatsApp links stay hidden until it's set. |
| `NEXT_PUBLIC_LINKEDIN_URL`, `NEXT_PUBLIC_LINKEDIN_IFEANYI`, `NEXT_PUBLIC_LINKEDIN_TOMIWA`, `NEXT_PUBLIC_PORTFOLIO_TOMIWA` | optional | Profile URLs. Each link stays hidden until it's set. |
| `NEXT_PUBLIC_GA_ID` | off at launch | A GA4 measurement ID. Switches on GA4 with Consent Mode and a consent bar. |

Vercel Web Analytics and Speed Insights need no keys. Turn them on in the Vercel project's Analytics and Speed Insights tabs.

## Measurement

- **Server conversions** go to the `conversions` table, which is the source of truth: `form_submit`, `booking_complete`, `tool_complete`, `tool_email_requested` and `newsletter_signup`.
- **Client events** go to Vercel Analytics as custom events: `cta_click`, `whatsapp_click`, `tool_start` and `tool_step`.
- **GA4** stays off unless `NEXT_PUBLIC_GA_ID` is set. When it's on, it uses Consent Mode v2 and stores nothing until the visitor accepts.

## Launch inputs and the production gate

A production build (`VERCEL_ENV=production`) runs four gates in order:

1. `scripts/check-launch-env.mjs` fails if any launch-critical key above is missing.
2. The full test suite runs, including every tool test.
3. `next build`.
4. `scripts/check-placeholders.mjs` fails if any rendered page still contains a placeholder, such as `[price]`, `[Title]`, `[CEO]`, `DRAFT`, `PORTRAIT ·` or `PAINTING:`.

Previews keep the placeholders visible so you can see what's missing. Run `pnpm check:placeholders` after a local build for the same report.

Most inputs live in `src/content/`:

| Input | File |
| --- | --- |
| Prices | `engagements.ts` → `prices`. Numbers with a currency. |
| Titles | `people.ts` for Ifeanyi's title, `work.ts` for testimonial titles. |
| Portraits | `people.ts` → `portrait`. |
| Hero painting | `components/ds/method.tsx` (`PaintingFrame`). |
| Template files | `library.ts` → `templates[].file`, with the files in `public/templates/`. |
| Tool copy and test cases | File 06, going into `tools.ts`, `src/lib/tools/` and `test/tools.test.mjs`. |

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Deployment

1. Link the repository to the Axis & Sage project on a Vercel **Pro** team. Hobby is for non-commercial use only.
2. Turn on Deployment Protection for previews.
3. Connect Neon and Upstash from the Marketplace, set the variables above, and run `pnpm db:migrate`.
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

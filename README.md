# Axis & Sage site

Rebuild of the Axis & Sage consultancy website as a strict TypeScript Next.js App Router application with a controlled Sanity content model, embedded Studio and Vercel-ready deployment configuration.

## Status

The local application, Sanity schema, fallback content, contact endpoint, audit records and responsive QA captures are implemented. Sanity publishing and Vercel deployment require project/account credentials. DNS, AWS infrastructure and the production domain are intentionally untouched.

## Requirements

- Node.js 20.9 or newer
- pnpm 11.2.2 (`corepack enable` is recommended)
- A Sanity project for editorial content and Studio
- Optional Resend account for contact delivery

The exact package-manager pin is recorded in `package.json` and `pnpm-lock.yaml`. Use `pnpm install --frozen-lockfile` in the canonical checkout, CI, Codex worktrees and Vercel.

## Local development

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

The site is available at `http://localhost:3000`; the embedded Studio is at `/studio`.

With no Sanity project ID, the site renders deterministic, source-verified fallback content. This keeps visual review possible while editorial infrastructure is being provisioned.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes in deployment | Canonical URL, metadata and sitemap |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | yes for Sanity | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | yes for Sanity | Usually `production` |
| `SANITY_API_READ_TOKEN` | preview/live editing | Server-side draft reads |
| `SANITY_API_WRITE_TOKEN` | seed only | Token used by the idempotent seed script |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | preview | Studio/Presentation URL |
| `SANITY_STUDIO_PREVIEW_ORIGIN` | preview | Presentation origin |
| `RESEND_API_KEY` | contact delivery | Resend API key |
| `CONTACT_TO_EMAIL` | contact delivery | Verified inbox receiving enquiries |
| `CONTACT_FROM_EMAIL` | contact delivery | Verified sender address |

Never expose Sanity write tokens or the Resend key with a `NEXT_PUBLIC_` prefix.

## Sanity setup and seed

1. Create or select the Axis & Sage project and `production` dataset.
2. Add the project ID and dataset to `.env.local`.
3. Add `http://localhost:3000` and the eventual Vercel preview origin to Sanity CORS settings.
4. Run `pnpm seed:sanity` with `SANITY_API_WRITE_TOKEN`.
5. Open `/studio` and review the singleton Homepage and Site settings documents.

The seed uses deterministic IDs and `createOrReplace`, so rerunning it is safe. It deliberately skips uncertain testimonials, statistics, office details, contact email and unapproved imagery. The schema uses controlled homepage section types so editors cannot invent arbitrary page structure.

## Editorial model

The model includes `siteSettings`, `homePage`, `service`, `project`, `testimonial` and `faq` documents, plus reusable CTA, SEO, image-with-alt, navigation, office, social-link, statistic and portable-text objects. Homepage sections are hero, about, services, projects, testimonials, FAQ and contact. Testimonials only render when explicitly marked approved.

## Visual editing

`next-sanity/live` provides server/browser live content wiring. Draft Mode enables Presentation and `next-sanity/visual-editing` overlays when a valid Sanity preview secret and read token are configured. The resolver maps the singleton homepage, settings, services, projects, testimonials and FAQs to their visual locations. Until those credentials exist, `/studio` is a route-ready shell rather than a connected editorial workspace.

## Contact form

`POST /api/contact` validates name, email and message length, rejects spam through a honeypot field, and sends through Resend when all delivery variables are present. Without delivery configuration it returns an explicit `503` configuration message; it never claims delivery that did not occur.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm audit:assets` reports the legacy export's URL graph without modifying files. Screenshots and audit records live under `reference/`.

## Deployment

Link the canonical repository to the correct existing Vercel scope, set the same environment variables for Preview and Production as appropriate, and deploy with the committed pnpm lockfile. Review the Vercel preview before any production-domain action. Do not attach `axisandsage.com` until the preview is explicitly approved.

The production cutover plan is: review preview, verify forms/SEO/accessibility, lower DNS TTL if needed, attach the domain in the approved Vercel project, verify redirects and certificates, and retain the AWS deployment for rollback. AWS deletion is a separate later action after the cutover and rollback period, requiring a second explicit approval.

## Repository safety

The canonical checkout is `/Users/tomiwao/Code/axis-and-sage-site`. Do not clone it, create a nested repository, modify DNS/AWS records, or treat the legacy Framer export as maintainable code.

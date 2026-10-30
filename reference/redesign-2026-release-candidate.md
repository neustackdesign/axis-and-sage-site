# 2026 redesign · release candidate (phase 1)

Branch `redesign-phase-1` from production commit `bcfcd67` (`main`, aliased to axisandsage.com and uesta.axisandsage.com).
Design source: the Claude Design canvas, latest versions (canonical lockup correction, contact and form revisions).
Production is unchanged. Nothing in Sanity is published.

## Route coverage

| Route | Canvas board | Status |
| --- | --- | --- |
| `/` | R1 homepage, R2 mobile | **Updated** |
| `/work` | R3 selected work | **Updated** |
| `/work/farmcrowdy` | R4 Farmcrowdy case | **Updated** (2026 case template) |
| `/work/[slug]` other cases (GV Solutions, Venture Garden Group, Mular, Nature Roots, Uganda Investor Summit) | none | Preserved (existing case template; switches to 2026 layout once `caseHeadline` is filled in) |
| `/conversion-design` | R8 process and why us | **Updated** (FAQ and FAQ structured data kept) |
| `/contact` | 07c contact | **Updated** (Cal booking kept at `#book`) |
| `/what-we-do/[practice]` ×3 | R5 to R7 | Preserved layout; family names in drafts. **Decision:** Governance and AI Assessment page structures |
| `/engagements`, `/engagements/embedded-leadership` | none | Preserved |
| `/people`, `/people/[slug]` | none | Preserved (Approach "About" link points here) |
| `/library`, `/guides/[slug]`, `/tools/[slug]` ×6, `/newsletter` | none | Preserved |
| `/privacy`, `/terms`, `/thank-you`, 404 | none | Preserved |
| `/what-we-do/embedded-leadership` | n/a | 301 preserved |
| `uesta.axisandsage.com` | n/a | Host rewrite preserved |
| `/api/*` (contact, newsletter, cal, cron, sanity revalidate, tools) | n/a | Unchanged |
| `/api/draft-mode/enable`, `/api/draft-mode/disable` | n/a | **New**: editor draft preview |

Shared changes reach every route: the 1440 grid (1328 content, 56px margins; 32 tablet, 20 mobile), the header (Services mega menu, scroll rule, Library as a link, canonical inline lockup at every width), and the motion controller.

## Design system changes

- `src/styles/tokens.css`: `--grid-max` 1328px, `--grid-margin` 56px, `--grid-margin-t` 32px; relational motion tokens (label 360, step 640, mask 720, success 480, stagger 50), all zeroed under reduced motion.
- `src/styles/compose.css` (new, scoped to `.v26`): type scale, hard tone alternation (Midnight, Lilac, Sage, Creme, Sunset), the `.lite` reset for light objects inside dark and Sunset sections, opening rows, set pieces, dot fields, merger diagram, testimony mosaic, readout, ten-day bar, founders, sentence form, work index, case and approach layouts, contact, and tablet/mobile rules.
- Motion: `html.mo` is set before first paint by an inline script, so content only hides when script runs; a 4.5s fallback reveals everything; `Motion` observes `[data-sec]`; reduced motion rests on the final frame.
- Header (`SiteHeader`, `chrome.css`): Services mega menu with staggered cards; rule appears on scroll; Scorecard link moves into the menu foot; the lockup stays inline on small screens (ADVISORY beside the wordmark).
- Removed, replaced by the above: `HomepageHero`, `ContactForm`, `MethodSentencePanel`, `FounderCards`, `WorkFilter`.

## Sanity

Schema (`studio/schemaTypes/v2`), optional fields only, so published documents validate unchanged:

- Objects: `asDecisionActor`, `asSituation`, `asLogoItem`, `asLogoGroup`, `asProofStat`, `asContactPath`, `asSetPiece`; `asMethodStep` gains `owner`, `artefact`, `measure`.
- `homePageV2` (group Design 2026): `decisionPath`, `situations`, `proofBand`, `featuredCases`, `testimony`, `methodCase`, `aiNote`, `startLabels`.
- `workItem`: `setPiece`, `sentence`, `caseHeadline`, `place`, `roleLine`, `wayHeadline`, `flow`, `result`, `evidence`, `nextCase`, `closing`.
- `conversionMethod`: `halves`, `stagesLabel`, `why`, `closingLine`. `sitePage`: `paths` (contact). `person`: `homeLine`, `credentialLine`.

Queries and loaders (`src/sanity/queries.ts`, `load.ts`) read the new fields; every new section renders nothing when its field is empty, so the code is safe to deploy before the drafts are published (the production build passes against today's published content).

Drafts (13 documents, written to `drafts.*`, none published): Site settings, Homepage, Conversion Design, Work page, Contact page, three practices, two people, Farmcrowdy, GV Solutions, Nature Roots. One asset uploaded: the existing Nature Roots client photograph. Drafts were patched field by field from the published documents, so two Studio edits not in the seed were preserved (the "Users adopt" footer link and the Guides menu description).

Preview: Vercel preview deployments read drafts (perspective `drafts`, `SANITY_API_READ_TOKEN`, never cached). Production reads published content only; editors can preview drafts on production through `/api/draft-mode/enable?secret=…` once `SANITY_PREVIEW_SECRET` is set.

Revalidation is unchanged: the signed webhook on `/api/sanity/revalidate` expires the `sanity` tag on publish, with 60-second ISR as the fallback.

## Content decisions applied (from the approved canvas)

- Families renamed: Strategy & Investment → **Strategy & Operations**, Product & Technology → **Technology & AI**, Brand & Market → **Brand & Growth** (titles, eyebrows, nav, footer, founder practice titles, bios' closing line). URLs unchanged.
- Navigation: Services, Work, Approach, About, Library; primary call to action "Book a 30-minute call".
- Provenance follows the repo's locked decisions: Nature Roots, Uganda Investor Summit and OUI Life are Axis & Sage engagements and stay visible; LASRIC, the university platform and AgriGHG stay held back.
- Quotations are used verbatim from published testimonials (the canvas trimmed Bunmi Akinyemiju's).
- Ifeanyi Monyei's credentials use the published wording ("Chief of Staff to Group Strategy & Growth"), not the canvas's "Group Head, Strategy & Growth".
- The Farmcrowdy "Observed" evidence and the measurement window stay out until confirmed.

## Missing assets and pending decisions

| Item | Treatment now | Needed before production |
| --- | --- | --- |
| Client and venture logos (VGG, NSIP, Farmcrowdy, Kolibri, Mular, Earlybean) | Tiles show the organisation name; each tile takes a logo in Sanity (`proofBand` → Logo) | Logo files and permission to use them |
| Founder portraits | Initials in the 4:5 Creme field (existing approved fallback) | Commissioned portraits |
| Governance and AI Assessment pages (R6, R7) | Not built; practice pages keep their layout | Content architecture decision |
| Services index (R5) | Not built; mega menu and practice pages cover it | Decision |
| Brand & Growth proof | No set piece; listed in the index only | Confirmed proof |
| Unconfirmed case pages | n/a: provenance is confirmed in the repo | None |
| Studio deploy | Drafts carry fields the hosted Studio does not know yet | Run `pnpm --dir studio deploy` at release |
| `SANITY_PREVIEW_SECRET` | Unset; production draft mode is off (fails closed) | Add in Vercel Production if editors want draft preview there |
| Seed drift | Seed now matches published for the fields above; Settings still differs in two Studio-only edits | Fold them into the seed when convenient |

## Release steps (after approval)

1. Merge `redesign-phase-1` into `main` (Vercel promotes to production).
2. Deploy the Studio (`pnpm --dir studio deploy`).
3. Publish the 13 drafts (Studio, or `pnpm sanity:seed --publish`), then confirm the webhook delivery in Sanity and a fresh read on the live pages.
4. Check axisandsage.com, uesta.axisandsage.com, the contact and sentence forms end to end, the Cal booking, analytics and the sitemap.

## Verification (30 October 2026)

- Tests: 120 of 120 pass (`pnpm test`), including the content rules, provenance, founder titles, webhook and export checks. Type-check passes; lint has warnings only (`<img>` usage, as elsewhere in the codebase).
- Build: `next build` passes against today's published content (code-first safe) and on Vercel Preview against the drafts.
- Preview: every route returns 200 (404 page returns 404). The preview renders the Sanity drafts (set pieces, the Nature Roots image from Sanity's CDN, the 2026 Farmcrowdy case, contact starting points). A draft edit appeared on the preview without a deployment and was reverted.
- Production: unchanged (axisandsage.com still serves "What we do"; uesta.axisandsage.com returns 200).
- Browser: desktop 1440, tablet 800 and mobile 375/390, checked in the in-app browser and Playwright. No horizontal overflow at 375. Services menu opens, staggers, closes on Escape and outside click. The decision path, proof tiles, readout tabs, before/after controls, work filters, scroll stages and contact starting points respond. Contact validation reports every field at once; `?engagement=diagnostic` preselects the Diagnostic. One `h1` per page, every control named, every image has alt text, no console errors (the only warning seen is Playwright's own caret style on inputs).
- Reduced motion: reveals, draws and dot fields rest on their final frame.
- Screenshots: `reference/screenshots/redesign-2026/` (1440 and 390, five pages), captured from the local server on the seed, which carries the same redesign content as the drafts.

Not verified: real lead submission end to end on the preview (it would send a live lead to the pipeline), the Cal embed's booking flow, the Sanity publish webhook (needs a publish), and Safari and Firefox (the sentence fields fall back to a fixed size where `field-sizing` is unsupported).

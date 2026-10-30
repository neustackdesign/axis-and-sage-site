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

## Outstanding items, classified (31 October)

**Release blockers: none open.** Fixed during release preparation: unsourced copy (the AI note now follows the brief; stage 3's measure comes from the method; Farmcrowdy's place reads Nigeria, as published), footer `/work?action=` links (filter restored), and contact links for offers without a starting point (the offer's name is kept in the form and the lead).

| Item | Decision | Treatment |
| --- | --- | --- |
| Client and venture logos | Accepted, post-launch | Tiles show the organisation name; add logos in Sanity (Homepage → Proof band) |
| Founder portraits | Accepted, post-launch | Initials in the 4:5 field |
| Governance, AI Assessment and Services index pages | Accepted, post-launch decision | Practice pages keep their layout, under the new names |
| Brand & Growth proof | Accepted, post-launch | No proof shown; the family is listed without a claim |
| Sanity publish webhook | Accepted, post-launch (pre-existing gap) | `sanity hook list` shows none registered: the signed route exists but nothing calls it. Published edits appear through the 60-second refresh. Create it with the existing `SANITY_REVALIDATE_SECRET` |
| Studio schema manifest | Accepted, post-launch | The hosted Studio bundle carries the new fields, but the CLI's manifest extract and `documents validate` load an empty workspace, so server-side schema tools see no types. The schema itself validates (42 types, 0 problems) |
| `SANITY_PREVIEW_SECRET` | Accepted, post-launch | Draft mode on production stays off (fails closed); Vercel previews already show drafts |
| Real lead and Cal booking end to end | Release check | Server path verified without storing; one deliberate, labelled test lead after launch if wanted |

## Release runbook (needs approval)

Build: branch `redesign-phase-1`, commit `55a60d7` (preview `axis-and-sage-site-2t22cqyyp`, READY). Current production: deployment `dpl_G2yW1ADF3w8mJ6XgJD8DFtpRPUgy` (`axis-and-sage-site-on4z7h0tc`, commit `bcfcd67`). Studio: already deployed with the new fields (additive).

Order matters. The new code on today's published content renders sparse pages (homepage: hero, start, founders and call to action only), while the live code on the new content renders every route without errors (checked locally: `main` against the new seed). So content goes first, then the build is made from it:

1. **Pre-flight.** Confirm the backup exists: `reference/release-2026/published-before-release.ndjson` (the 13 documents as published, with their revisions) plus a full dataset export taken 31 October.
2. **Publish the 13 drafts** (Studio, or `publish_documents` with the IDs below). The live site keeps its layout and shows the new copy within about a minute; expect "Library" twice in the old header until step 5.
3. **Stage the production build** from `55a60d7`: `vercel deploy --prod --skip-domain`. It builds with production settings and the newly published content, and takes no domain.
4. **Validate the staged URL:** every route and sitemap URL returns 200, the homepage shows all nine sections, `/work` shows three set pieces, the Farmcrowdy case uses the 2026 layout, forms reject invalid input, and `uesta` serves its page.
5. **Promote:** `vercel promote <staged deployment>`. axisandsage.com and uesta.axisandsage.com move together.
6. **Merge** `redesign-phase-1` into `main`, so the next git deploy builds the same code.
7. **Verify live:** the step 4 checks on axisandsage.com, plus the Cal booking link, the analytics script, the header across 1440, 1024 and 390, and Safari for the sentence form.

Drafts to publish: `axisSageSettings`, `axisSageHome`, `axisSageConversionMethod`, `axisSagePage-work`, `axisSagePage-contact`, `axisSage-practice-strategy-and-investment`, `axisSage-practice-product-and-technology`, `axisSage-practice-brand-and-market`, `axisSage-person-ifeanyi-monyei`, `axisSage-person-tomiwa-ogunmodede`, `axisSage-work-farmcrowdy`, `axisSage-work-gv-solutions`, `axisSage-work-nature-roots`.

## Rollback

- **Code (instant):** `vercel rollback dpl_G2yW1ADF3w8mJ6XgJD8DFtpRPUgy` (or promote it in the dashboard). The previous code renders the new content correctly, so this alone is safe. If `main` was merged, revert the merge commit before the next deploy.
- **Content:** roll back code first (the new code on old content is sparse), then restore the 13 documents: `sanity dataset import reference/release-2026/published-before-release.ndjson production --replace` from `studio/`, or "Restore" to the recorded revision of each document in the Studio history. The ISR refresh picks it up within about a minute.
- **Studio:** no rollback needed; the new fields are optional. To remove them, deploy the Studio from `main`.

## Verification (30 October 2026)

- Tests: 120 of 120 pass (`pnpm test`), including the content rules, provenance, founder titles, webhook and export checks. Type-check passes; lint has warnings only (`<img>` usage, as elsewhere in the codebase).
- Build: `next build` passes against today's published content and on Vercel Preview against the drafts. With today's published content the new pages are sparse, hence the content-first order above.
- Preview: every route returns 200 (404 page returns 404). The preview renders the Sanity drafts (set pieces, the Nature Roots image from Sanity's CDN, the 2026 Farmcrowdy case, contact starting points). A draft edit appeared on the preview without a deployment and was reverted.
- Production: unchanged (axisandsage.com still serves "What we do"; uesta.axisandsage.com returns 200).
- Browser: desktop 1440, tablet 800 and mobile 375/390, checked in the in-app browser and Playwright. No horizontal overflow at 375. Services menu opens, staggers, closes on Escape and outside click. The decision path, proof tiles, readout tabs, before/after controls, work filters, scroll stages and contact starting points respond. Contact validation reports every field at once; `?engagement=diagnostic` preselects the Diagnostic. One `h1` per page, every control named, every image has alt text, no console errors (the only warning seen is Playwright's own caret style on inputs).
- Reduced motion: reveals, draws and dot fields rest on their final frame.
- Screenshots: `reference/screenshots/redesign-2026/` (1440 and 390, five pages), captured from the local server on the seed, which carries the same redesign content as the drafts.

Not verified: real lead submission end to end on the preview (it would send a live lead to the pipeline), the Cal embed's booking flow, the Sanity publish webhook (needs a publish), and Safari and Firefox (the sentence fields fall back to a fixed size where `field-sizing` is unsupported).

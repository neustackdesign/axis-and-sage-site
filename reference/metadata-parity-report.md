# Axis & Sage metadata parity report

Status: `CODEX SELF-ASSESSMENT — USER REVIEW PENDING`

## Source asset findings

- The current production page exposes light and dark Axis & Sage favicon assets at `nOTDqoxkx2Tb6ox06bdKaTvHqXY.png` and `BTGvtq2pXzYPVivMmovur220c.png`.
- The legacy HTML favicon reference `gmXoT6wqO781SOBsSgp0WMijTII.png` is not used because the current production page is the newer source of truth.
- The legacy Open Graph title, description and image are confirmed Refit construction-template residue and are excluded.

## Generated browser assets

| Asset | Local path | Dimensions | Source/status |
| --- | --- | --- | --- |
| Light browser icon | `/icons/axis-sage-light.png` | 690 × 690 | Recovered from current production |
| Dark browser icon | `/icons/axis-sage-dark.png` | 690 × 690 | Recovered from current production |
| ICO fallback | `/favicon.ico` | 16, 32, 48 px | Generated from recovered light icon |
| Apple touch icon | `/icons/axis-sage-dark.png` | 690 × 690 | Recovered from current production |
| Social image | `/og/axis-sage.png` | 1200 × 630 | Restrained composition from approved source hero image and local Axis & Sage logo |

## Rendered metadata contract

- Title: `Axis and Sage Advisory`
- Description: `Axis & Sage Advisory is a boutique strategy, product, and growth partner fusing deep African market insight with GCC execution muscle to help innovators, investors, and public-sector leaders design, build, and scale high-impact ventures.`
- Production canonical: `https://axisandsage.com/` unless a verified Site Settings canonical URL is configured.
- Preview/local canonical: the current preview or local origin, never a hardcoded temporary Vercel URL.
- Open Graph type: `website` on `/`, `article` on project pages.
- Open Graph image: `/og/axis-sage.png`, 1200 × 630, PNG, meaningful Axis & Sage alt text.
- Twitter card: `summary_large_image`, using the same title, description and image with alt text.
- Non-production preview and Studio: `noindex, nofollow`.

## CMS fallbacks

Site Settings retains editable default SEO title, title template, description, canonical URL and Open Graph image/alt fields. Homepage and project SEO overrides are read when present, with the local approved social image as the safe fallback. Draft/stega content is not used by metadata queries.

## Verification status

The production bundle built successfully with `next/font/google`. Browser verification on the production bundle recorded:

- Hero computed font: `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif`, weight 400; `document.fonts.check("400 28px Instrument Serif")` returned `true`.
- Section heading computed font: `"Instrument Serif", "Instrument Serif Fallback", Georgia, serif`, weight 400.
- Body computed font: `"Helvetica Neue", Helvetica, Arial, sans-serif`.
- Bundled font resources observed in the production build: `/_next/static/media/797e433ab948586e-s.p.0r6juujl39pe6.woff2` (Geist Mono), `/_next/static/media/7ebf22b5a21034f8-s.p.3j3877k49yy0l.woff2` (Instrument Serif italic), and `/_next/static/media/e41d5df559864f9e-s.p.1g73gv09-xcb6.woff2` (Instrument Serif normal). Browser `document.fonts.check()` returned true for Instrument Serif and Geist Mono.
- Local rendered metadata includes the canonical URL, OG/Twitter title and description, 1200 × 630 PNG image, image alt text, and light/dark favicon plus Apple touch icon links.
- Direct local HTTP checks returned 200 with the expected content types for both PNG browser icons, `/favicon.ico`, `/og/axis-sage.png`, `/work/nature-roots`, and `/studio`.
- Preview metadata must remain `noindex, nofollow` and use its deployment origin; unauthenticated content verification is currently blocked by Vercel deployment protection.

Corrected preview deployment: `https://axis-and-sage-site-j61l8svw2-neustackdesign-gmailcoms-projects.vercel.app`. The deployment responds with Vercel deployment protection and `x-robots-tag: noindex`; browser review requires the authorized Vercel session. Production remains untouched.

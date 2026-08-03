# Axis & Sage visual parity report

Status: `CODEX SELF-ASSESSMENT — USER REVIEW PENDING`

This report is a Codex self-assessment only. User visual approval remains the authority. The rebuild has not passed visual parity and production remains untouched.

## Evidence set

Static comparison images are under `reference/screenshots/comparison/` at exactly 1440 × 1000, 1024 × 900 and 390 × 844. Motion evidence is under `reference/motion-comparison/`. Each finding below is independently assessed across static visual, typography, motion and interaction behavior.

The corrected mobile header/hero evidence is `reference/screenshots/comparison/header-hero-390x844-corrected-side-by-side.png`; the remaining exact-viewport section comparisons are retained from the prior source capture set pending the next full visual review.

## Section results

| Section | Static visual parity | Typography parity | Motion parity | Interaction parity | Review note |
| --- | --- | --- | --- | --- | --- |
| Header | NOT MATCHED | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | This remains NOT MATCHED until the source mobile control, blur treatment and source-only navigation content are reviewed in the rebuilt preview. |
| Hero | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Refit hero quote removed; source chess media and measured hero entrance timings are retained. |
| About | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Public statistics are hidden without verified values; the image rail is now manually controlled with CSS scroll snap. |
| Services | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Only Strategy detail is public in fallback data; four draft detail sets are withheld while the accordion layout remains. |
| Our work | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Source project imagery and card structure retained; desktop sticky progression is restored as progressive enhancement. |
| Testimonials | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Source-present testimonial content remains subject to editorial approval; perpetual rail movement is withheld in favour of a controlled editorial grid. |
| FAQs | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Source questions, one-open behavior and smooth plus/close transition are retained. |
| Contact | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Source composition and form wiring retained; contact claims still need business approval. |
| Footer | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Refit credit and unsupported copyright are withheld; logo and source links remain. |

## Typography gate

The required gate is actual browser rendering, not a CSS declaration. The production build uses `next/font/google` for Instrument Serif normal/italic 400 and Geist Mono; sans roles use the verified Helvetica Neue system stack. Browser evidence confirms computed Instrument Serif and Helvetica Neue values; user visual review is still required before this field can be upgraded to MATCHED.

## Motion and interaction gate

Static screenshots do not validate entrance timing, rails, sticky progression, accordions, mobile navigation, hover behavior or reduced motion. See `reference/motion-family-revision.md` and the paired/equivalent evidence under `reference/motion-comparison/`. These fields remain self-assessments pending user review.

## Asset and metadata gate

Current-production Axis & Sage favicon assets are migrated locally. The Refit legacy social metadata is excluded. The rebuilt social image is a restrained 1200 × 630 composition made from the approved local hero image and logo. See `reference/metadata-parity-report.md` for paths, dimensions and environment behavior.

## Review authority

No lint, typecheck, test, build, screenshot or browser check can substitute for user visual approval. Do not merge the draft PR, attach the production domain, change DNS, or touch AWS resources until approval is explicit.

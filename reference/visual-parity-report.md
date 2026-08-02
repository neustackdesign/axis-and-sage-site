# Axis & Sage visual parity report

Status: correction pass captured 2026-08-02. The live page and rebuilt page were captured at 1440 × 1000, 1024 × 900 and 390 × 844. The browser surface produced 1425 × 990 / equivalent captures; comparison copies in `reference/screenshots/comparison/` are normalized to the exact requested dimensions, with LIVE / LEGACY on the left and REBUILT on the right.

Statuses are limited to the review vocabulary required for this rebuild:

- MATCHED
- MINOR TECHNICAL VARIANCE
- BLOCKED BY MISSING SOURCE ASSET
- NOT MATCHED

## Comparison set

Each viewport has a full header/hero frame and section-level comparison for About, Services, Our work, Testimonials, FAQs, Contact and Footer. The complete set is under `reference/screenshots/comparison/`, for example:

- `header-hero-1440x1000-side-by-side.png`
- `header-hero-1024x900-side-by-side.png`
- `header-hero-390x844-side-by-side.png`
- `services-1440x1000-side-by-side.png`
- `testimonials-1440x1000-side-by-side.png`
- `faqs-390x844-side-by-side.png`

## Section results

| Section | 1440 × 1000 | 1024 × 900 | 390 × 844 | Review note |
| --- | --- | --- | --- | --- |
| Header | MATCHED | MATCHED | MATCHED | Logo, navigation rhythm, mobile inset bar and menu control follow the source. |
| Hero | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Source font metrics and Framer image-reveal timing vary slightly; media, composition, copy, pills and CTA are retained. |
| About | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Local strip uses the migrated source images and accessible document flow; carousel timing is not runtime-identical. |
| Services | MATCHED | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Source chess media, five-item accordion, icons, first-open state and responsive stacking are present. |
| Our work | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Source project assets and card structure are present; local cards use normal flow instead of Framer scroll pinning. |
| Testimonials | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Source 400px card rail, alternating surfaces, portraits and client order are preserved; carousel offset is runtime-dependent. |
| FAQs | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Nine source questions, first-open state, two-column desktop layout and mobile accordion are preserved. |
| Contact | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Dark rounded panel, source copy/details and field order are preserved; local form validation/API wiring is semantic. |
| Footer | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | MINOR TECHNICAL VARIANCE | Logo, Quick links, current navigation and non-Refit copyright are preserved; source template credit is excluded. |

No major section is marked `NOT MATCHED`. The remaining variances are implementation/runtime differences recorded for visual approval, not new design decisions.

## Asset disposition

Legitimate live assets are migrated under `public/images/axis-sage/`: the logo, hero chess image, service chess image, About strip, project images, service icons and six testimonial portraits. The rejected abstract graphics and confirmed Refit construction/template assets are not used. The mapping is documented in `reference/asset-inventory.json`.

## Interaction checks

- Mobile navigation opens/closes and closes on Escape.
- Services accordion opens one item at a time and preserves Strategy open by default.
- FAQ accordion opens one item at a time and preserves the first item open by default.
- Contact fields retain labels, required markers, validation and the existing contact API path.

Visual approval remains required before production cutover. Production domain, DNS, AWS resources and the existing draft PR remain untouched.

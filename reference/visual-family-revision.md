# Axis & Sage visual-family revision

Status: `CODEX SELF-ASSESSMENT — USER REVIEW PENDING`

This revision is an authorised visual-system update for Axis & Sage. It is not a redesign of the consultancy's identity and it is not a pixel-copy of either reference site. The live Axis & Sage site, committed legacy HTML and approved Axis assets remain the source of truth for Axis-specific content, imagery and composition.

## Reference systems reviewed

- `/Users/tomiwao/Code/tomiwao-portfolio-rebuild` — read-only reference for analytical navigation, mono apparatus, image reveal and evidence-led work presentation.
- `/Users/tomiwao/Code/ifeanyi-monyei-profile` — read-only reference for fixed blurred navigation, numbered sections, dark/light rhythm, staged hero typography and a dark contact close.
- `/Users/tomiwao/Code/axis-and-sage-site` — implementation target; current production and `reference/legacy/axisandsage-page.html` remain authoritative.

## Adopted family rules

| Rule | Axis & Sage application | Decision |
| --- | --- | --- |
| Compact fixed navigation | Source-only About, Services, Our work, FAQs and Contact links; blurred backdrop; understated scroll rule; three-line mobile control that transforms into a close control. | Adopt |
| Numbered section apparatus | `01` About through `06` Contact, with a mono index, mono label and flexible hairline. | Adopt |
| Type roles | Instrument Serif for display; Helvetica Neue system stack for body, navigation, controls and forms; Geist Mono for indexes, metadata and tags. | Adopt |
| Editorial surfaces | Paper and wash surfaces, ink text, restrained sage accents and hairline rules. | Adapt to Axis palette |
| Deliberate media | Chess hero and approved Axis project imagery remain the visual anchors. Image reveal is limited to hero and selected work media. | Retain/adapt |
| Controlled motion | Staged hero entrance, section rises, accordion transitions, sticky desktop work progression and manually controlled image rail. No perpetual autoplay movement. | Adopt/adapt |

## Explicitly retained Axis identity

- Axis & Sage logo and dark chess hero.
- Strategy, design and growth positioning and approved production wording.
- Current Sanity schemas, routes, Presentation/Visual Editing, Draft Mode, contact API and SEO architecture.
- Real project imagery, project slugs and project routes.
- Approved testimonials and source navigation labels.
- Public statistics remain hidden until verified values are supplied.

## Explicitly retired or withheld

- Rounded pill-heavy section apparatus and speculative editorial cards.
- Perpetual About and testimonial tickers; both are replaced by controlled, user-directed presentation.
- Unsupported service detail copy and capabilities; withheld behind the existing approval gate.
- Fabricated hero testimonial, unsupported statistics and any Refit residue.
- Framer runtime dependency and generic repeated fade-up treatment.
- Mona Sans from the public implementation; no public element should use it after this revision.

## Section scaffold

| Index | Section | Family treatment | Axis-specific constraint |
| --- | --- | --- | --- |
| 01 | About | Editorial split and manually scrollable image rail with CSS scroll snap. | No unsupported statistics. |
| 02 | Services | Numbered hairline rows, serif service names, sans descriptions, mono capabilities and responsive active image. | Detail/capability copy is public only when approved. |
| 03 | Our work | Editorial case-study cards with real images, metadata and desktop sticky progression. | Project evidence and routes remain source-backed. |
| 04 | Testimonials | Controlled editorial grid with no endless movement. | Unapproved fallback quotes remain withheld. |
| 05 | FAQs | Hairline accordion, one item open at a time, smooth height and control transition. | Existing source questions and answers retained. |
| 06 | Contact | Dark closing chapter with compact form and source contact details. | No invented business claims. |

## Evidence captured

Exact viewport captures:

- `reference/screenshots/family-revision-axis-sage-1440x1000.png`
- `reference/screenshots/family-revision-axis-sage-1024x900.png`
- `reference/screenshots/family-revision-axis-sage-768x1024.png`
- `reference/screenshots/family-revision-axis-sage-390x844.png`

Section-position captures are provided for desktop and mobile under `reference/screenshots/` with `family-revision-{about,services,our-work,testimonials,faqs,contact}-{1440x1000,390x844}.png` names.

These are Codex captures of the rebuild, not a claim of user-approved parity. The prior full-page stitcher output is not used as evidence because sticky layouts make that capture method unreliable.

## Review gate

This revision is ready for visual review on the Vercel preview only after the branch is deployed. Static checks cannot establish approval. The user remains the authority on whether the new cross-site family relationship is appropriate and whether Axis & Sage still feels unmistakably itself.


# Axis & Sage structural delta

Status: `WHOLESALE REDESIGN — CODEX SELF-ASSESSMENT`

This records the presentation architecture change from the parity baseline to the Tomiwa v3 application system. It is intentionally explicit about composition, not just styling.

| Section | Previous DOM/composition | New DOM/composition | Old pattern removed | New design-system pattern | Axis reason |
| --- | --- | --- | --- | --- | --- |
| Header | `Header` rendered an absolute hero overlay, desktop links and a dark translucent full-screen mobile sheet. | `SiteHeader` renders a centered shell wordmark, mono navigation, scroll-aware hairline and a paper square mobile sheet. | Dark overlay menu, giant serif mobile links, hero-dependent header. | Shell-width nav, mono apparatus, paper surface and ruled mobile list. | Keeps Axis logo/navigation while joining the family shell. |
| Hero | `HomeSections` used a dark split grid with copy beside a rounded chess image, pills and a gradient overlay. | `EditorialHero` uses a prose reading block followed by a wide breakout chess figure and caption. | Split hero, pills, serif display, dark band, rounded media, gradient. | Landing hero with 680px reading measure and 960px image punctuation. | Chess remains the Axis anchor, but the page now starts from the source system's editorial landing rhythm. |
| About | `About` used a two-column intro, duplicated ticker markup and optional legacy stats. | `AboutOverview` uses a label/content row, strong Helvetica statement, three-image breakout composition and support prose. | Perpetual ticker, coloured section treatment, stat grid when unverified. | Home-only label/content row and editorial image composition. | Retains approved About copy and imagery without unsupported metrics. |
| Services | `Services` used a permanent image panel beside an icon-led card accordion. | `ServiceIndex` uses a ruled 680px numbered list, approval-gated expansion and a breakout image below the list. | Side-by-side service template, icons, card treatment, pill-like capability presentation. | Structured list row with mono number, Helvetica title, details and controlled figure. | Preserves service interaction and approval gates while making the list the content. |
| Selected work | `Projects` rendered three rounded two-column cards with tags and embedded quotes. | `SelectedWork` renders independent project chapters with metadata, title/context, 960px figure, evidence row and restrained route link. | Rounded project cards, tinted panels, pill tags, card-contained quotes. | Editorial case-study chapters and ruled evidence rows. | Real Axis project imagery becomes the visual sequence rather than a card background. |
| Testimonials | `Testimonials` duplicated data into an infinite horizontal ticker of bordered cards and stars. | `ClientPerspectives` renders approved quotes in a ruled featured/supporting grid. | Autoplay ticker, stars, quote cards and tinted backgrounds. | Editorial quotations with mono source metadata. | Keeps approved client voice readable and non-perpetual. |
| FAQ | `Faqs` placed rounded accordion cards beside an intro panel. | `Questions` uses a 680px ruled accordion with mono number, Helvetica question and one-open behavior. | Rounded FAQ cards, serif questions and coloured controls. | Hairline question rows and controlled answer expansion. | Functional behavior remains while the composition becomes part of the page grid. |
| Contact | `Contact` placed copy and form inside a dark rounded panel with a tinted form card. | `ContactSection` uses paper, a large closing statement, direct email CTA, ruled contact details and underline-only form fields. | Dark panel, rounded form card, gradient/band treatment. | Paper closing chapter and square form controls. | Keeps the real form and contact details while removing an unrelated visual band. |
| Footer | `Footer` used a large dark rounded block with logo, CTA and links. | `SiteFooter` uses a quiet shell, paper background, ink opening rule, compact utilities and a separate closing statement. | Dark footer panel, rounded container and serif footer hierarchy. | 1px rule and mono utility footer. | Axis logo and links remain; the page now exits in the same system as it enters. |

## Architecture changes

- Deleted `HomeSections.tsx`, `Header.tsx` and `Footer.tsx` rather than maintaining parallel implementations.
- Added independently understandable home components under `src/components/home/`.
- Added `MotionScope` as a shared progressive-enhancement boundary for reveal behavior.
- Added `EditorialPrimitives` for image sourcing, apparatus, section rules, restrained links and reveal hooks.
- Replaced the public CSS token layer and selectors in `globals.css`; no old component system remains in public source.
- Kept content data, Sanity queries, routes, contact API, metadata and approval gates outside the presentation components.


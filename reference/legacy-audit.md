# Axis & Sage legacy audit

Audit date: 2026-08-02

Sources reviewed:

- `reference/legacy/axisandsage-page.html` (897,435 bytes; exported Framer HTML)
- `https://axisandsage.com/` (live production render)
- Responsive reference capture attempt at 390 px; the export's full-page capture timed out because of the oversized Framer runtime and duplicated responsive DOM. The bounded mobile viewport capture is stored under `reference/screenshots/legacy/`.

## Executive summary

The site has a strong editorial consultancy direction hidden inside a Framer construction-template export. The parts worth preserving are the typographic contrast, generous spacing, monochrome palette, image-led project presentation, service-card rhythm, anchor navigation, and the warm, pragmatic Axis & Sage copy. The rebuild should keep those characteristics while replacing the duplicated Framer DOM with semantic React sections and replacing all editorial data with typed Sanity documents.

The source is not maintainable application code. It includes generated Framer class names, three repeated responsive variants, Framer's runtime and analytics modules, a generated search index, several inherited font declarations, and more than 150 repeated remote asset references.

## Page structure

| Order | Section | Stable anchor | Observed behaviour | Rebuild decision |
| --- | --- | --- | --- | --- |
| 1 | Header/navigation | — | Desktop anchor links; compact mobile navigation | Semantic sticky header with keyboard-safe mobile menu |
| 2 | Hero | `banner` | Full-height opening composition, rotating Strategy / Design / Growth framing, large spaced heading and CTA | Preserve the composition and motion feel with CSS/React; remove Refit quote |
| 3 | About | `about` | Editorial split with serif/sans contrast, image carousel, approach copy and four statistics | Preserve split and stats; publish only verified values |
| 4 | Services | `services` | Five service cards with image, copy, capability list and CTA; repeated responsive markup | Controlled Sanity service references and one accessible interactive card system |
| 5 | Our work | `our-work` | Image-led project carousel/card sequence with project-specific quotes | Three verified project records; keyboard/touch carousel controls |
| 6 | Testimonials | `testimonials` | General testimonial carousel with duplicated slides | Render only approved Sanity testimonials; hide if empty |
| 7 | FAQs | `faqs` | Accordion-like question list and CTA | Controlled FAQ references; omit inherited construction questions |
| 8 | Contact | `contact` | Office details and form for Name, Email, Phone Number and Message | CMS-managed verified details plus honest server-side form state |
| 9 | Footer | — | Dark footer, quick links, copyright and template credit | CMS-managed footer; remove Refit and JJ Gerrish references |

## Responsive model

The export defines three generated variants:

- Desktop: `min-width: 1440px`
- Tablet: `810px` through `1439px`
- Phone: `max-width: 809px`

The implementation uses those as visual reference points rather than copying the variants. A single semantic DOM tree should flow from a two-column editorial composition to a stacked mobile layout, with CSS grid/flex and `clamp()` tokens handling intermediate widths.

## Visual system

- Page background is white with deep near-black text and a dark footer.
- The source token values include white, `rgb(16, 16, 20)` near-black, light neutral borders, muted grey text and a red accent token that is not a dominant Axis & Sage treatment.
- Instrument Serif is used for expressive editorial headings; Mona Sans is used for interface copy and body text.
- The visual language favours generous whitespace, rounded image/card containers, thin borders, small uppercase labels, and strong typographic scale.
- The hero uses an unusually large, widely tracked heading where each character is animated/positioned by Framer. The rebuild should recreate the scale and rhythm without preserving the generated character wrappers.

## Interaction inventory

- Anchor navigation to About, Services, Our work, FAQs and Contact.
- Header changes layout at the phone breakpoint and should expose an accessible menu.
- Hero rotating framing words: Strategy, Design and Growth.
- About image carousel/sequence with back/next arrows and page indicators.
- Services show a card hierarchy and CTA; the duplicated export variants are not a reason to duplicate content in React.
- Project carousel/sequence with back/next controls and associated project quote.
- General testimonial carousel with back/next controls; not publishable until approval is established.
- FAQ question expansion.
- Contact form focus, validation, loading, success and failure states.

## Source/runtime findings

- `<meta name="generator" content="Framer 84a2f33">` is present.
- Framer analytics is loaded from `events.framer.com`.
- Framer React, motion, layout and search-index modules are loaded from `framerusercontent.com`.
- The export contains the Framer-generated `data-framer-*` attributes and minified CSS; none should ship in the application.
- Images, SVGs and font files are mostly served from `framerusercontent.com`.
- There are 162 Framer URL references and 32 unique Framer image/SVG URLs after deduplication.
- The export repeats content across desktop, tablet and phone variants, inflating both markup and extracted text.
- Meaningful images have empty `alt` attributes in the export and need editorial alt text in Sanity.

## Template residue and editorial risks

The following must not be published in the rebuild:

- Refit title, descriptions, Open Graph and Twitter metadata.
- The Refit construction/home-improvement hero quote.
- Home craftsmanship, completed construction projects, tradespeople and client-satisfaction copy inherited by the About statistics.
- Repeated Strategy copy and capability lists on every service card unless the client confirms the correct descriptions.
- The general testimonial introduction mentioning Refit and craftsmanship.
- Any construction, kitchen, bathroom, loft, renovation or planning-permission FAQ.
- The misspelling “Abu Dhaboi”; retain the source fact only after correcting to “Abu Dhabi” or leave it for editorial confirmation.
- The London address `167-169 Great Portland Street, W1W 5PF`, which may be inherited template content.
- The obscured/placeholder-like email value in the export/live render.
- `© 2025 Refit. All rights reserved.`
- The `Website design by JJ Gerrish` credit.

## Capture limitations

The legacy document is large and carries multiple full responsive variants plus Framer runtime dependencies. The in-app browser captured a bounded 390 px mobile viewport at `reference/screenshots/legacy/legacy-live-390-top.png`; full-page and wider capture requests timed out at the browser protocol screenshot step. The live production DOM and source audit remain available as the primary visual/content references, and the rebuild will receive bounded captures at the required widths during QA.

# Axis & Sage wholesale redesign report

Status: `CODEX SELF-ASSESSMENT — USER REVIEW PENDING`

The previous `codex/axis-sage-family-revision` branch was a surface-level revision and is superseded. This branch is a new presentation architecture based on the copied Tomiwa v3 reference at `reference/design-system/tomiwao-v3.html`. PR #2 remains open and unmerged; this work is intended for a separate draft PR.

## Section assessment

| Section | Result | Design-system rule used | Axis & Sage element retained | Motion | Accessibility result |
| --- | --- | --- | --- | --- | --- |
| Header | STRUCTURALLY REBUILT | 1200px shell, mono uppercase navigation, paper/hairline scroll state, square paper mobile sheet. | Axis logo and source navigation. | Rule, sheet and hamburger transitions. | Keyboard navigation, Escape, focus containment and scroll lock. |
| Hero | STRUCTURALLY REBUILT | 680px prose above a 960px breakout figure; Helvetica 700; underline CTA; paper surface. | Approved positioning, lede and chess image. | Staged reading block and one image reveal. | Heading hierarchy, image alt, visible no-JS content. |
| About | STRUCTURALLY REBUILT | 960px label/content row and editorial image composition; no bands or stats. | Approved About copy, approach and imagery. | Copy/image first-entry reveal. | Text remains in prose measure; figures have alt text. |
| Services | STRUCTURALLY REBUILT | Ruled numbered list, Helvetica titles, mono metadata and breakout image below rows. | Five source service names, approved Strategy detail and approval gates. | Height/opacity expansion and active figure change. | Disabled unapproved rows, one interactive detail, keyboard buttons. |
| Selected work | STRUCTURALLY REBUILT | Editorial project chapters with 680px context, 960px figure, evidence row and restrained link. | Real project content, imagery, slugs and routes. | Chapter and image reveals; no autoplay. | Semantic articles, figures, alt text and real route links. |
| Client perspectives | STRUCTURALLY REBUILT | Ruled quotations with Helvetica reading type and mono source metadata. | Approved testimonials and portraits remain optional. | Entry reveal only; no ticker. | Semantic figures/quotes, readable contrast and no forced movement. |
| Questions | STRUCTURALLY REBUILT | 680px ruled accordion, mono numbers, Helvetica questions, one-open behavior. | Existing FAQ content and CTA. | Height/opacity and plus/minus transition. | `aria-expanded`, `aria-controls`, keyboard buttons. |
| Contact | STRUCTURALLY REBUILT | Paper closing statement, breakout two-column layout, underline-only form and square submit. | Contact API, validation states, email and UAE office data. | Closing layout/form reveal and restrained control transitions. | Labels, required fields, status announcements and focus styles. |
| Footer | STRUCTURALLY REBUILT | Quiet shell utility footer with 1px ink rule and mono links. | Axis logo, footer navigation and copyright fallback. | Underline/arrow transition only. | Semantic footer, keyboard links and no decorative motion. |

No major public section is marked `UNCHANGED`. The old split hero, pill apparatus, serif hierarchy, tinted bands, rounded cards, dark contact panel and dark footer were removed from public source.

## Static evidence

Full-page captures:

- `reference/screenshots/wholesale-redesign/full-1440x1000.png`
- `reference/screenshots/wholesale-redesign/full-1024x900.png`
- `reference/screenshots/wholesale-redesign/full-768x1024.png`
- `reference/screenshots/wholesale-redesign/full-390x844.png`

Top viewport captures:

- `reference/screenshots/wholesale-redesign/home-1440x1000.png`
- `reference/screenshots/wholesale-redesign/home-1024x900.png`
- `reference/screenshots/wholesale-redesign/home-768x1024.png`
- `reference/screenshots/wholesale-redesign/home-390x844.png`

Focused section captures for About, Services, Work, Testimonials, FAQ and Contact are stored in the same directory with `{section}-{1440x1000,390x844}.png` names. The open mobile sheet is `mobile-menu-open-390x844.png`.

## Review gate

This is not a claim of approval. Screenshots demonstrate a materially different composition, but the user remains the authority on visual hierarchy, source-system fidelity, content presentation and motion quality.


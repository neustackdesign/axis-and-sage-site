# Axis & Sage application spec — Tomiwa v3 design system

Status: `WHOLESALE REDESIGN — IMPLEMENTATION SOURCE`

The byte-for-byte source reference is [`tomiwao-v3.html`](/Users/tomiwao/Code/axis-and-sage-site/reference/design-system/tomiwao-v3.html). Its external Claude/support scripts are reference-document residue and must not be executed or reproduced. The following spec translates its static HTML/CSS into Axis & Sage components while preserving Axis content, imagery, Sanity wiring and functional requirements.

## Foundation

### Typography

- Use Helvetica Neue, Helvetica, Arial for every reading role: headings, ledes, body copy, descriptions, questions, form values and closing statements.
- Use Geist Mono 400/500 for apparatus: navigation, kickers, section labels, indices, dates, tags, captions, metadata, form labels, project categories and footer utilities.
- Remove Instrument Serif and Mona Sans from public frontend code. No third public-facing face, decorative italics or serif fallback is permitted.
- Use sentence case for content. Use uppercase mono only for apparatus with approximately `0.08em` tracking.
- Use only the documented scale: 11, 12, 13, 15, 17, 19, 24 and 34–60px.

### Palette and surface

The page uses warm paper as its only page surface. Ink is the only accent.

| Token | Value | Use |
| --- | --- | --- |
| paper | `#faf9f5` | page background |
| wash | `#f0ede3` | rare inline code/selection support, not section bands |
| ink | `#1a1915` | primary text, strong rules and link hover |
| body | `#3a382f` | long-form reading copy |
| sub | `#5d5a50` | secondary copy and apparatus |
| faint | `#8a8678` | metadata, dates and captions |
| divider | `#e3dfd3` | internal 1px dividers |
| supporting-border | `#d8d4c6` | restrained tags and figure borders |
| resting-underline | `#b8b4a8` | default link underline |
| selection | `#e8e4d8` | text selection |

No sage token, coloured accent, gradient, tinted section background, decorative shadow or invented shape is allowed. Colour may come from approved Axis project imagery.

### Layout utilities

- `.shell`: max-width 1200px, centered, 24px desktop gutter and 20–24px mobile gutter.
- `.breakout`: max-width 960px, centered; used for hero figures, image compositions, service figures, project media, grids and contact layout.
- `.prose`: max-width 680px, centered; used for all flowing text, headings, ledes, answers and copy blocks.
- Home landing sections may use the breakout width as their primary composition; nothing is page-edge anchored by default.
- Major landing sections use 100–120px vertical rhythm; internal headings use 64–72px top space; list rows use 26–30px padding; paragraphs use 16–18px rhythm; footer separation is approximately 140px.
- Square corners everywhere except inherently circular portrait crops or small status indicators.

## Application shell

### `SiteHeader`

Use the Axis & Sage logo/wordmark at left inside the 1200px shell. Desktop navigation is right-aligned Geist Mono uppercase, 12px, approximately 24px gap, with no CTA pill or active decoration. The header is transparent at the top and gains only a paper surface and hairline rule when scroll legibility requires it.

On mobile, keep the compact Axis logo and three-line hamburger. Open a paper, square, full-width navigation sheet with ink border and mono navigation. Keep Escape dismissal, focus containment, body scroll lock and reduced-motion behavior. Do not use the rejected dark translucent full-screen menu or giant serif menu type.

### `EditorialHero`

Use a 960px breakout landing composition, not the old split hero. Render:

1. Mono kicker: `STRATEGY · DESIGN · GROWTH`.
2. Approved Axis & Sage positioning as a Helvetica 700 display heading, approximately 38–60px.
3. Approved body as a 19px lede in the 680px reading measure.
4. Underline-only text CTA with arrow movement.
5. A wide chess image/figure beneath the text in the breakout column.
6. A quiet mono caption or image metadata line when source-backed.

The image is the primary visual punctuation. No dark band, rounded frame, gradient, pill, serif, testimonial or statistic is permitted.

### `AboutOverview`

Use the landing label-and-content row at 960px: mono uppercase label on the left and approved About copy on the right. A strong Helvetica statement may be used where the approved copy supports it. Follow with a deliberate breakout image composition: editorial grid, asymmetric two-image composition or controlled CSS scroll-snap rail. Never use an autoplay ticker. Statistics remain hidden unless verified, then use ruled breakout stat blocks with Helvetica 700 numbers and mono labels.

### `ServiceIndex`

Use a centered 960px/680px editorial list opened by a 1px ink rule. Each row has a mono number, Helvetica 700 service name, concise 15–17px description, expansion indicator and mono capability metadata. Parchment dividers separate rows. Expanded content remains in the same grid and can reveal an approved breakout image below the group. Do not use service icons, a permanent side image panel, rounded media, coloured active states or pill capabilities. Existing `detailApproved` gates remain authoritative; unapproved fallback detail stays withheld.

### `SelectedWork`

Render each project as an editorial chapter, not a card:

- mono project number/category/year;
- Helvetica 700 title;
- concise 680px project context;
- large 960px approved project figure;
- contribution/evidence row;
- mono-separated project categories/tags;
- restrained underlined project link;
- parchment divider before the next chapter.

Desktop sticky behavior is allowed only when it creates a chapter transition; mobile uses normal flow. Project imagery supplies the page colour. No tinted card, pill tag, serif title, card-contained testimonial or coloured metadata.

### `ClientPerspectives`

Show approved testimonials as ruled editorial quotations: one featured quote with supporting quotes, a ruled two-column layout or a vertical quote index. Use Helvetica reading text and mono source metadata. Portraits are optional circular crops. No quote cards, stars, coloured chips or autoplay.

### `Questions`

Use a 680px ruled accordion: 1px ink opening rule, parchment dividers, Helvetica 700 questions, Helvetica 400 answers and a mono number/plus control. One item opens at a time with smooth height/opacity transition. No cards, serif or coloured controls.

### `ContactSection`

Keep the paper background. Use a large Helvetica closing statement in the 960px breakout, direct email CTA, two-column contact/form layout at wide widths, mono labels, underline-only inputs and a square submit button or text CTA. Preserve `ContactForm` validation, loading, success and error states. No dark panel, gradient, rounded form card or tinted form surface.

### `SiteFooter`

Use a 1px ink opening rule and a quiet shell-width utility layout. Footer links are Geist Mono, spacing is compact, copyright is restrained and the paper background continues. A larger closing statement may sit above it, but the footer is not a dark panel.

## Motion and accessibility

- Hero: staged rise for kicker, headline line/word groups, lede, CTA and one controlled chess image reveal.
- Page: section reveal on first viewport entry and selected work-image reveal; content is visible without JavaScript.
- Interactions: 140–220ms underline/arrow/nav-rule transitions; 600–800ms content reveals; 18–28px rise; 60–90ms stagger; restrained ease-out.
- Services and FAQ: grid/height and opacity transitions with one-open behavior.
- Work: controlled image/crop transition or chapter release, without perpetual movement.
- Reduced motion removes transforms, animation and transition duration while leaving every element visible.
- Keyboard focus remains visible; mobile navigation supports Escape, focus containment and scroll lock; no horizontal overflow is allowed.

## Axis & Sage identity retained

- Axis & Sage logo and wordmark.
- Consultancy positioning and approved copy.
- Chess/strategy imagery, real service imagery and real project imagery.
- Wider 960px image-led pacing than a personal portfolio.
- Service interactions, project storytelling and the contact form.
- Sanity, routes, approval gates, metadata, favicons, contact API and deployment safeguards.


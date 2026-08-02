# Axis & Sage design parity specification

Status: source-of-truth audit completed 2026-08-02

This document records the rendered Axis & Sage production design from `https://axisandsage.com/`, cross-checked against `reference/legacy/axisandsage-page.html` and the captured reference images in `reference/screenshots/legacy/`. It is a reconstruction specification, not a visual redesign brief. Where the legacy export contains Refit residue, the current Axis & Sage production page wins for content and visual treatment.

## Source captures

- `legacy-live-1440x1000.png`: desktop hero and start of About at 1440 × 1000.
- `legacy-live-1024x900.png`: tablet hero and start of About at 1024 × 900.
- `legacy-live-390x844.png`: mobile hero at 390 × 844.
- `live-1440-about.png`, `live-1440-services.png`, `live-1440-work.png`, `live-1440-testimonials.png`, `live-1440-faqs.png`, `live-1440-contact.png`: section captures from the live page.

## Section order

1. Header inside the dark hero (`#banner`)
2. Hero/banner
3. About
4. Services
5. Our work
6. Testimonials
7. FAQs
8. Contact
9. Footer

## Header

- The header is positioned inside the hero, not a separate opaque bar. The desktop header is approximately 83 px tall and begins around 45 px from the top of the 1440 px viewport.
- Desktop content is inset about 72 px from the left and right edges. The actual logo is the white Axis & Sage Consulting image asset, approximately 155 × 24 px at desktop.
- Navigation is a five-item horizontal row: About, Services, Our work, FAQs, Contact. It uses Mona Sans at approximately 14 px, white, with generous spacing and no visible underline or pill treatment.
- The desktop hero/navigation surface is dark `rgb(16, 16, 20)` with a rounded image panel on the right.
- At 390 px, the header sits in a dark rounded container inset about 20 px from the viewport edges, with the logo on the left and a three-line hamburger control on the right. Desktop navigation is replaced by the menu control.
- The mobile menu is a blurred dark navigation overlay using only About, Services, Our work, FAQs and Contact. It has no authored “Axis & Sage / Navigation” label or descriptive note and closes on Escape or link selection.

## Hero

- Background: dark `rgb(16, 16, 20)`.
- Desktop hero height: 720 px, with a 50 px top inset. At 1440 px, the content is a two-column composition: left text column and right image panel.
- The hero media is a real chess-board photograph with black and wooden pieces: `0k0Ki7uoBJFcfwr7amSblvNnKU.jpg`. It is shown in a rounded rectangle, approximately 614 × 660 px at 1440 px and 335 × 680 px at 390 px. The mobile crop keeps the wooden king visible behind the text.
- Desktop hero media has the navigation overlaid across its top edge. A translucent dark gradient is present over the image for text contrast.
- Three compact dark translucent pills sit above the heading: Strategy, Design, Growth. Each has a small white circular marker.
- Heading: “We build businesses, brands, and products that matter”. It uses Instrument Serif, white, approximately 58 px / 1.2 at desktop, and wraps across two lines in the left column. At 390 px it is approximately 36–40 px with three lines.
- Supporting copy uses Mona Sans, light gray/lavender `rgb(208, 209, 219)`, approximately 14 px / 1 at desktop, widening to a readable multi-line block on mobile.
- CTA: “Work with us”, a dark translucent rounded pill about 205 × 60 px on desktop and about 198 × 60 px on mobile. It includes a circular white arrow control at the right. There is no second hero CTA in the production composition.
- Hero motion is restrained: the source uses Framer entrance/scroll behavior and a subtle image/gradient treatment. Do not add invented decorative graphics or animated typography.

## About

- Background: warm near-white `#ffffff` in the live capture.
- Desktop section begins after an approximately 150 px gap below the hero and is about 1,349 px tall at 1440 px. The first row has the section label and Instrument Serif heading on the left, with the Mona Sans body on the right. The heading is approximately 48 px and the body approximately 18 px with a max width around 560 px.
- Label treatment: dark charcoal rounded pill with white Instrument Serif text, “About us”.
- Heading: “Where strategy meets storytelling”.
- Body: production Axis & Sage copy beginning “At Axis and Sage, we believe every great business starts with a compelling story.”
- Below the intro is a horizontal image carousel/strip of real editorial images with narrow white gutters. The visible source images show work at a desk, wireframe sketches, financial charts, and a hand using a device. Preserve the image-led strip and its overflow behavior.
- The lower About content contains the production approach statement and supporting copy. The source includes four statistic labels, but the captured values resolve to contradictory `0` / `0%` states alongside claims about 25 projects, 3 experts and complete satisfaction. The public rebuild hides these blocks until verified values are approved; the Sanity schema retains the fields.
- Mobile transforms the intro and image strip to a single column; the source image strip remains horizontally overflowed/carousel-like rather than becoming abstract panels.

## Services

- Background: `#fafafa`.
- Desktop section has approximately 100 px vertical padding and a centered intro. Label is a charcoal rounded pill “Services”; heading is Instrument Serif “What we do”; introduction is centered Mona Sans: “Think of us as your strategic Swiss Army knife - versatile, reliable, and always sharp.”
- Main layout is a two-column service area: a large grayscale chess photograph on the left and a right-hand accordion list on the right. The first item, Strategy, is open in the source capture. The image is a real chess photograph and must not be replaced by a generic card or geometric placeholder.
- Service rows use thin light borders, a small service-specific line icon, Instrument Serif titles, and plus/close controls. The open Strategy row contains the production description and four bullet capabilities: Market Analysis, Business Model Design, Competitive Intelligence, Growth Planning, plus a rounded “Work with us” CTA.
- Items and order: Strategy, Design, Growth, Venture Building, Storytelling. Preserve accordion open/closed interaction and one-at-a-time behavior.
- Mobile stacks the image and accordion while preserving the same row treatment, proportions, typography, and first-item open state.

## Our work / projects

- Background: warm near-white.
- Centered intro: charcoal rounded pill “Our work”, Instrument Serif heading “Get inspired by our work”, and centered production introduction copy.
- Projects are three vertically stacked, large rounded cards with a pale lavender-gray background. Each card contains a real project image on the left and title, description, dark pill tags, quote/testimonial text, and client name on the right. On mobile the image is above the text; on desktop the image/text ratio is approximately 1:1.
- Project order and legitimate content: Nature Roots, Earlybean, Uganda Investor Summit. Preserve the current source summaries, tags, quotes and names in their current placement.
- Source project images include the Nature Roots product photograph and the other live Framer-hosted project/editorial images. Migrate the actual files locally; do not use abstract initials or “Approved imagery pending review” placeholders.
- Cards are lightly rounded, with generous internal padding and no invented shadows. The source uses a sticky/scrolling card progression on the longer desktop layout; implement equivalent sequential behavior where practical and keep normal document flow accessible.

## Testimonials

- Background: warm near-white.
- Centered label “Testimonials”, heading “Hear from our clients”, and centered introduction. The live text currently includes inherited Refit wording in the introduction; remove only that confirmed template residue while preserving the Axis & Sage testimonials.
- Testimonials are a horizontally overflowing multi-column grid/carousel of bordered cards. Cards alternate between white and pale lavender-gray backgrounds, have small star ratings across the top, Mona Sans quote text, and a 40–50 px circular portrait beside the client name at the bottom.
- Preserve the live Axis & Sage testimonial set and names: Onyeka Akumah, Bunmi Akinyemiju, Dinma Obidiebube, LASRIC, Chuks Okeibunor, and Temi Olateru. Use portraits from the source only when they can be migrated; otherwise keep the card structure with a neutral accessible portrait treatment.

## FAQs

- Background: warm near-white.
- Desktop layout is two columns. Left: charcoal rounded pill “FAQs”, Instrument Serif heading “Answering your questions”, Mona Sans introduction, and light-gray rounded CTA “Get in touch” with dark circular arrow. Right: stacked rounded bordered accordion rows.
- The first FAQ is open in the source capture. Open row shows the question in Instrument Serif, answer in Mona Sans gray text, and an × control. Closed rows show a + control. Rows have very light borders, rounded corners, and consistent vertical spacing.
- Preserve the production questions and answers and the current accordion behavior. Mobile stacks the intro over the accordion.

## Contact

- The contact content is contained in a large dark rounded panel inset from the page edges, approximately 20 px on mobile and 20–72 px on desktop.
- Background: dark `rgb(16, 16, 20)`, with white/gray type. Left column: charcoal/light pill “Contact”, Instrument Serif “Get in touch”, production introduction, then Office and Email rows. Current production contact details are “Abu Dhabi, Dubai, UAE” and `info@axisandsage.com`.
- Right column: light gray rounded form panel. Fields are Name*, Email*, Phone Number, Message*, with gray bordered inputs and a full-width dark “Send message” button. Preserve labels, field order, required states, validation and contact API wiring.
- The panel is two columns desktop and stacked on mobile. Keep the rounded corners, internal padding and neutral gray form surface.

## Footer

- Footer is dark and rounded/inset like the contact panel. The actual white Axis & Sage Consulting logo is used on the left, with a “Quick links” Instrument Serif heading and two-column link list on the right.
- Preserve the current five navigation destinations. Confirmed Refit/JJ Gerrish/template credits and unsupported footer copyright are withheld pending approved legal text.
- Mobile stacks logo and links; preserve the large dark surface and generous spacing.

## Global visual system

- Primary surfaces: dark `rgb(16, 16, 20)`, white/warm near-white `#ffffff`/`#fafafa`, pale lavender-gray card surfaces approximately `#eeeef4`, and gray text approximately `rgb(61, 61, 71)` / `rgb(208, 209, 219)`.
- Fonts: Instrument Serif normal and italic at weight 400 for display headings, labels and card titles; Mona Sans for body, navigation, controls and form labels. The implementation uses `next/font/google`, which bundles the Google font files into the production build; browser computed-style verification is required before typography is marked matched.
- Type is high-contrast editorial but restrained: serif display headings, sans-serif body, no speculative all-caps system, no dark-grid overlay, no gradient artwork, no abstract initials.
- Layout uses a centered max-width content region around 1290–1300 px on desktop with approximately 72 px side gutters; 20 px side gutters on mobile. Section gaps are large and deliberate, with light 1 px borders where the source uses them.
- Rounded corners are used for hero media, CTA pills, project/testimonial cards, accordion rows, contact/form surfaces and footer surfaces. Avoid adding heavy shadows.
- Responsive breakpoints visibly transform the two-column hero, services, projects, FAQs and contact into stacked mobile compositions; navigation becomes a menu at mobile width. Preserve the source mobile overflow/carousel behavior for About, projects and testimonials.
- Accessibility is allowed to improve semantics, focus states, labels and keyboard behavior, but must not change the visual hierarchy or composition.

## Asset classification

| Source asset family | Classification | Required treatment |
| --- | --- | --- |
| `CXNyqFWxn3IGo9h0klgtTByhQo.png` | Axis & Sage brand asset | Migrate locally and use for header/footer logo. |
| `0k0Ki7uoBJFcfwr7amSblvNnKU.jpg` | Axis & Sage hero/editorial asset | Migrate locally and use in hero. |
| `NANSGVXUK18NCYQ3fePYCh7bOU.jpg`, `yOCzk3blaLhsCC5ESW6nrkAoVI.jpg`, `OM7ThVf4wcUZMalLEDyZmgJIg.jpg`, `eQJyz5g9WTCLHZWjLpRGyJCsog.jpg`, `ajubAf8qeloloONA1gKozCMPus.jpg`, `Nl2DG7sgaAcI0xtDXBTzVTojXo.jpg` | Axis & Sage About/service editorial assets | Migrate locally and preserve in the image strip/service media. |
| `huT1COM16weiAaIPhLwFIVRdrA.jpg`, `0libgSeRizuARAM9iS2oePuohc.jpg`, `GpGVjCMyOmYKOWL4Pbzyt1I2pw0.jpg`, `h21hioTJjqLp15r9E97ER2KsmA.jpg` | Axis & Sage service/editorial assets | Migrate locally and map to the services composition where visible. |
| `T7BGAIpV6lUY7WfZWSCiAdzQM.jpg`, `ggJ5BE7K23uDqa4xZPRSYiEZo.jpeg`, `tkFpRmY5QQvYvF1hwAyhz3XA.jpg` | Axis & Sage project assets | Migrate locally and map to Nature Roots, Earlybean and Uganda Investor Summit. |
| Live testimonial portraits | Axis & Sage testimonial assets, rights/identity source-confirmed by current production usage | Migrate only where available; otherwise retain neutral card structure without invented portraits. |
| `Oz4gnNO46liNnbABMXpHDdjDFEY.png`, legacy `hero.png`, `about-*.png`, `work-*.jpg` construction imagery | Obvious Refit/template residue | Exclude from the rebuild. |
| Framer runtime, analytics, editor and font loader assets | Interface/runtime assets | Replace with local application behavior and locally served font files where practical. |

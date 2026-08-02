# Axis & Sage content inventory

Status values:

- **Verified Axis & Sage content** — clearly branded and supported by the source/live site.
- **Likely valid — needs confirmation** — plausible source content that should not be treated as final business evidence without editorial confirmation.
- **Obvious template residue** — inherited Refit/construction content or metadata; excluded from the rebuild.
- **Missing replacement content** — the source does not provide enough verified material to publish safely.

## Verified Axis & Sage content

| Area | Content |
| --- | --- |
| Hero | “We build businesses, brands, and products that matter” |
| Hero positioning | “A boutique consultancy fusing deep African insight with GCC know-how to help innovators, investors, & public-sector leaders design, build, & scale high-impact ventures.” |
| About heading | “Where strategy meets storytelling” |
| About body | “At Axis and Sage, we believe every great business starts with a compelling story. We're the strategic architects and creative storytellers who help ambitious leaders build ventures that don't just succeed—they inspire.” |
| Approach | “Our approach is simple: think strategically, act creatively, grow sustainably.” |
| About support | “We've helped launch groundbreaking ventures, transform established brands, and connect investors with game-changing opportunities across Africa and beyond.” |
| About support | “From product design to market strategy, from storytelling to growth hacking—we're the partners who see your vision and make it reality.” |
| Services | Strategy; Design; Growth; Venture Building; Storytelling |
| Services introduction | “Think of us as your strategic Swiss Army knife - versatile, reliable, and always sharp.” |
| Work | Nature Roots; Earlybean; Uganda Investor Summit |
| Nature Roots | Brand strategy and digital identity work positioning the brand as a trusted link between African farmers and sustainable global markets. Tags: Strategy, Branding. |
| Earlybean | Product research and UX work translating a savings model into an intuitive digital product for young Africans. Tags: Product Design, UX/UI. |
| Uganda Investor Summit | Event strategy, branding and investor-relations work for Uganda’s investment conference. Tags: Event Strategy, Storytelling. |
| Project quotes | Named quotes and names associated with Nature Roots / Kunmi Demuren, Earlybean / Biobele Oyibo, and Uganda Investor Summit / Bunmi Akinyemiju are present in the source. Keep them linked to their projects and mark proof/approval for editorial review. |
| FAQ framing | “Answering your questions” and “Got more questions? Send us your enquiry below” |
| Contact invitation | “Got a big idea? A complex challenge? Or just want to explore how we can help? We'd love to hear from you!” |
| Contact fields | Name, Email, Phone Number, Message |
| Geography | UAE positioning, with Dubai and Abu Dhabi named in the source. |

## Source-present — public but approval still required

| Area | Content/risk |
| --- | --- |
| About statistics | The source contains contradictory animated `0` / `0%` values alongside claims about 25 projects, 3 experts and complete satisfaction. All public statistic blocks are withheld until approved values and definitions are supplied; the Sanity statistic schema remains available. |
| Testimonials | Axis & Sage-branded quotes from Onyeka Akumah, Bunmi Akinyemiju, Dinma Obidiebube, LASRIC, Chuks Okeibunor and Temi Olateru appear in the source, but approval/proof URLs are absent. Hold as drafts until approved. |
| Office locations | “Abu Dhabi, Dubai, UAE” is plausible and branded, but the source also contains a questionable London address. Publish only verified UAE locations. |
| Email | `info@axisandsage.com` is used by the parity implementation as the Axis & Sage contact address; confirm ownership before production launch. |
| CTA destinations | “Work with us” / “Get in touch” clearly map to `#contact`; exact external destinations are not present. |

## Proposed replacements — withheld from public detail

The following fallback summaries and capability lists were authored during the rebuild and are not source-faithful migration. They remain only as clearly flagged draft data for later editorial review:

- Design — proposed summary and capabilities; public detail hidden.
- Growth — proposed summary and capabilities; public detail hidden.
- Venture Building — proposed summary and capabilities; public detail hidden.
- Storytelling — proposed summary and capabilities; public detail hidden.

Strategy is the only fallback service detail marked approved for the public parity preview because its summary and four capabilities are present in the source audit. Sanity service documents include an explicit `detailApproved` publishing gate.

## Obvious template residue

- Refit construction and renovation page title and metadata.
- Refit home-improvement description and social card.
- Refit/home-design quote in the hero.
- Home craftsmanship, tradespeople, renovation and construction-stat copy.
- Construction testimonial introduction and inherited general testimonials.
- Construction, kitchen, bathroom, loft and planning-permission FAQs.
- London address `167-169 Great Portland Street, W1W 5PF`.
- `Abu Dhaboi` spelling error.
- `© 2025 Refit. All rights reserved.`
- `Website design by JJ Gerrish` credit.
- Framer analytics, runtime, search index and generated layout scripts.

## Migrated visual content

- The live Axis & Sage logo, chess hero, about image strip, project imagery, service icon set and six testimonial portraits are downloaded into `public/images/axis-sage/` for the rebuild; they are no longer runtime dependencies on Framer.
- The current-production light and dark favicon assets are recovered under `public/icons/`; the legacy Refit favicon reference is not used.
- The social preview image under `public/og/axis-sage.png` is derived from the approved local hero image and logo and awaits explicit brand approval.
- Testimonial portraits are mapped in live DOM order to Onyeka Akumah, Bunmi Akinyemiju, Dinma Obidiebube, LASRIC, Chuks Okeibunor and Temi Olateru. Editorial approval remains a publishing gate.

## Missing replacement content

- Approved service summaries and capability lists for Design, Growth, Venture Building and Storytelling; authored fallback drafts are explicitly withheld from public detail.
- Approved general testimonials, roles, organisations, portrait usage rights and proof URLs.
- Approved statistics and definitions; public statistic blocks are currently hidden.
- Verified contact email, phone number (if one should be public), office addresses and social links.
- Final approval of the recovered current-production favicon assets and the derived social image for production use.
- Legal links and final footer copyright text.
- Full case-study detail for any project beyond a homepage card.
- Resend sender and recipient values for contact delivery.
- Sanity project ID, dataset access and a server-side read token.

## Publishing policy

The application keeps source content and migrated visual assets in the parity layer, while Sanity editorial approval remains required for uncertain claims, portraits, contact details and statistics before production publication. Refit residue remains excluded.

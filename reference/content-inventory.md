# Axis & Sage content inventory

## Functional refinement editorial state

This inventory now distinguishes source material from the working copy introduced for the protected refinement preview. The new homepage copy for the hero, About, services, Selected Work, FAQs and Contact is preview/draft content requiring user approval before production publication. The fallback layer is used only when Sanity is unavailable; no production Sanity dataset is silently changed by these fallback edits.

Status values:

- **Verified Axis & Sage content** — clearly branded and supported by the source/live site.
- **Likely valid — needs confirmation** — plausible source content that should not be treated as final business evidence without editorial confirmation.
- **Obvious template residue** — inherited Refit/construction content or metadata; excluded from the rebuild.
- **Missing replacement content** — the source does not provide enough verified material to publish safely.

## Verified Axis & Sage content

| Area | Content |
| --- | --- |
| Hero | “We build businesses, brands, and products that matter” |
| Hero positioning | Refinement copy is preview/draft: “Axis & Sage is a strategy, design and growth consultancy helping ambitious founders, organisations and public-sector leaders shape ventures, build trusted brands and bring high-impact ideas to market across Africa and the GCC.” |
| About heading | “Where strategy meets storytelling” |
| About body | “At Axis and Sage, we believe every great business starts with a compelling story. We're the strategic architects and creative storytellers who help ambitious leaders build ventures that don't just succeed—they inspire.” |
| Approach | “Our approach is simple: think strategically, act creatively, grow sustainably.” |
| About support | “We've helped launch groundbreaking ventures, transform established brands, and connect investors with game-changing opportunities across Africa and beyond.” |
| About support | “From product design to market strategy, from storytelling to growth hacking—we're the partners who see your vision and make it reality.” |
| Services | Strategy; Design; Growth; Venture Building; Storytelling |
| Services introduction | Refinement copy is preview/draft: “Five connected capabilities, used independently or combined around the problem.” |
| Work | Nature Roots; Earlybean; Uganda Investor Summit |
| Nature Roots | Brand strategy and digital identity work positioning the brand as a trusted link between African farmers and sustainable global markets. Tags: Strategy, Branding. |
| Earlybean | Product research and UX work translating a savings model into an intuitive digital product for young Africans. Refinement fallback now uses `public/images/axis-sage/earlybean.jpg`; the Web Summit image `earlybean-live.jpeg` is withheld from Earlybean project rendering because its subject is not the project. |
| Uganda Investor Summit | Event strategy, branding and investor-relations work for Uganda’s investment conference. Tags: Event Strategy, Storytelling. |
| Project quotes | Named quotes and names associated with Nature Roots / Kunmi Demuren, Earlybean / Biobele Oyibo, and Uganda Investor Summit / Bunmi Akinyemiju are present in the source. Keep them linked to their projects and mark proof/approval for editorial review. |
| FAQ framing | Refinement preview uses six buyer-relevant questions and a single centred accordion. |
| Contact invitation | Refinement copy is preview/draft: “Tell us what you’re building.” and the working enquiry introduction. |
| Contact fields | Refinement preview: Name, Work email, Organisation, multi-select capability needs, Timeline, Message. Phone is withheld. |
| Geography | Refinement preview says Base: Dubai, UAE; Working across: Africa and the GCC. Physical-office approval remains outstanding. |

## Source-present — public but approval still required

| Area | Content/risk |
| --- | --- |
| About statistics | The source contains contradictory animated `0` / `0%` values alongside claims about 25 projects, 3 experts and complete satisfaction. All public statistic blocks are withheld until approved values and definitions are supplied; the Sanity statistic schema remains available. |
| Testimonials | Axis & Sage-branded quotes from Onyeka Akumah, Bunmi Akinyemiju, Dinma Obidiebube, LASRIC, Chuks Okeibunor and Temi Olateru appear in the source, but approval/proof URLs are absent. Hold as drafts until approved. |
| Office locations | “Abu Dhabi, Dubai, UAE” is plausible and branded, but the source also contains a questionable London address. Publish only verified UAE locations. |
| Email | `info@axisandsage.com` is used by the parity implementation as the Axis & Sage contact address; confirm ownership before production launch. |
| CTA destinations | “Work with us” / “Get in touch” clearly map to `#contact`; exact external destinations are not present. |

## Proposed replacements — withheld from public detail

The following fallback summaries and capability lists are working copy authored for the protected functional refinement preview and are not source-faithful migration. They require approval before production publication:

- Design — proposed summary and capabilities; public detail hidden.
- Growth — proposed summary and capabilities; public detail hidden.
- Venture Building — proposed summary and capabilities; public detail hidden.
- Storytelling — proposed summary and capabilities; public detail hidden.

Sanity service documents include `detailApproved` and `previewOnly` publishing gates. The protected preview keeps all five summaries visible so closed rows remain useful; only approved expandable detail should be opened in production.

## Homepage testimonial decision

The refinement preview retains Bunmi Akinyemiju as the featured quote and Dinma Obidiebube plus LASRIC / Lagos State Science Research & Innovation Council as supporting quotes. The quote beginning “Tomiwa helped sharpen our identity…” is withheld from the homepage. Chuks Okeibunor and Temi Olateru remain in the CMS/fallback inventory but are withheld from the homepage. Roles and organisations are shown only where supplied by approved data.

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

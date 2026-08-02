# Axis & Sage visual parity report

## Capture set

The rebuild was captured at 1440px, 1024px and 390px widths, with additional captures for the mobile navigation, service accordion, project carousel, FAQ accordion and contact validation state. The legacy capture set contains the bounded mobile top capture that was possible from the heavy exported page; wider full-page captures timed out in the browser because of the legacy export's large runtime and asset graph.

## Matched or intentionally retained

- Dark, grid-led opening frame with large editorial typography and a restrained sage/ink/cream palette.
- Axis & Sage copy and section order verified against the live site: hero, about, services, work, FAQs and contact.
- Responsive navigation, stacked mobile sections, accordion services/FAQs and keyboard-friendly carousel controls.
- Editorial contrast between Instrument Serif display type and a compact sans-serif UI voice.
- Clear scroll rhythm, hairline rules, numbered service/work markers and lightweight motion.

## Intentional corrections

- Refit template branding, construction copy, inherited address, template credit and Framer runtime were removed.
- Template imagery is not shipped. Project cards use branded abstract placeholders until approved Axis & Sage imagery is supplied.
- Testimonials are withheld until client approval and attribution are confirmed.
- Unverified statistics, office locations, phone numbers and email addresses remain empty rather than being presented as facts.
- The legacy export's oversized duplicated desktop/tablet/mobile markup was replaced with semantic responsive components.

## Pending editorial inputs

1. Approved project imagery and alt text.
2. Confirmed service descriptions and capability lists for Design, Growth, Venture Building and Storytelling.
3. Approved testimonial text, names, roles and organisations.
4. Confirmed office, phone and contact email details.
5. Final SEO/social image and any approved case-study outcomes.

## QA note

The implementation is designed to render safely with fallback content before Sanity credentials are configured. Once seeded, the same controlled section components consume Sanity content. The visual system is therefore ready for editorial review without publishing uncertain legacy residue.

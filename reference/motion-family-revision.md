# Axis & Sage motion-family revision

Status: `CODEX SELF-ASSESSMENT — USER REVIEW PENDING`

The motion system is reconstructed with React, CSS and browser-native observation. The Framer runtime is not restored. All motion has a visible no-JavaScript-safe state and a reduced-motion path.

## Motion inventory and implementation

| Source behaviour | Rebuild treatment | Evidence |
| --- | --- | --- |
| Hero media reveal from low opacity/translated state | Hero media uses a restrained opacity and translate reveal on load. | `reference/motion-comparison/family-revision-hero-entrance.gif` |
| Hero descriptor, heading words, supporting copy and CTA enter in sequence | Descriptor, word spans, supporting copy and CTA use distinct delays and the shared ease-out. | `reference/motion-comparison/family-revision-hero-entrance.gif` |
| Header blur, scroll rule and mobile menu | Fixed header backdrop blur persists; a rule appears after scroll; the three-line control transforms to close and the overlay fades/slides in. Escape, focus containment and scroll lock are implemented. | `reference/motion-comparison/family-revision-mobile-navigation.gif` |
| About image movement | Replaced the perpetual ticker with a manually controlled horizontal CSS scroll-snap rail. This preserves a visible image sequence without endless motion or forced autoplay. | `reference/screenshots/family-revision-about-1440x1000.png` |
| Services active-item transition | Approved service row opens with a measured grid-template-rows transition; the active image crossfades and unapproved details remain disabled/withheld. | `reference/motion-comparison/family-revision-service-accordion.gif` |
| Project sticky progression | Desktop project cards use sticky positioning and staged overlap/progression; mobile returns to normal document flow. | `reference/motion-comparison/family-revision-project-progression.gif` |
| Testimonial rail movement | Perpetual movement is intentionally not carried forward. The family revision uses a controlled editorial grid so the evidence remains readable and accessible. | `reference/screenshots/family-revision-testimonials-1440x1000.png` |
| FAQ expansion and control state | One item open at a time; answer height, opacity and plus-to-close rotation transition together. | `reference/motion-comparison/family-revision-faq-accordion.gif` |
| Button/link response | Arrow marks translate on hover/focus while text and background transitions remain restrained. | Browser interaction audit |
| Viewport section reveals | Section intro and selected content use IntersectionObserver-backed `data-reveal` states with modest vertical movement. Content is visible by default when the observer is unavailable. | Browser scroll audit |
| Reduced motion | `prefers-reduced-motion: reduce` removes animation/transition duration and clears reveal transforms. The layout and content remain visible without JavaScript motion. | `reference/motion-comparison/family-revision-reduced-motion-static.png` plus CSS/browser verification |

## Shared motion tokens

- Standard rise: 18px with a short ease-out.
- Hero word staging: 60ms increments, followed by supporting copy and CTA delays.
- Media reveal: opacity and transform only; no layout-affecting dimensions.
- Accordion: height/opacity/control transition only; no content displacement outside the active row.
- No perpetual movement, scroll-jacking or invented parallax.

## Evidence paths

Short reviewable recordings/equivalents are stored under `reference/motion-comparison/`:

- `family-revision-hero-entrance.gif`
- `family-revision-mobile-navigation.gif`
- `family-revision-service-accordion.gif`
- `family-revision-project-progression.gif`
- `family-revision-faq-accordion.gif`
- `family-revision-reduced-motion-static.png` — stable reduced-motion review equivalent; the browser surface used for capture does not expose native media emulation, so this is paired with source-level CSS verification.

The static captures in `reference/screenshots/` are the reduced-motion-safe visual reference. Reduced-motion parity remains a code and browser-behaviour check rather than a claim that a static frame proves animation timing.

## Review gate

Motion parity is not marked passed. The evidence records the implemented behaviour and the remaining review surface; explicit user visual and motion approval is required before merge or production cutover.

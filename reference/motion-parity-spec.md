# Axis & Sage motion parity specification

Status: `CODEX SELF-ASSESSMENT — USER REVIEW PENDING`

This is a source-derived motion inventory for the visual-parity rebuild. It was checked against the current production page and the committed Framer HTML. The Framer runtime is not part of the rebuild.

## Source evidence

- The legacy HTML contains `__framer__appearAnimationsContent` with near-zero opacity (`0.001`), translated entrance states, spring settings, and source delays.
- Hero pill IDs `qen2mi`, `1awn5go`, and `3zqgnp` use `y: 10` and a `2.2s` delay.
- The hero supporting-copy ID `8ek52c` uses `y: 40` and a `2.2s` delay.
- The hero CTA ID `dmiiao` uses `y: 40` and a `2.4s` delay.
- The hero media container ID `1cgmpzu` fades from `0.001` with no delay.
- The source mobile `Logo + Hamburger` uses `backdrop-filter: blur(10px)` and `rgba(0, 0, 0, 0.6)`; the navigation uses the same blur treatment.
- The source project layout contains a sticky column with `position: sticky; top: 100px` in the desktop styles.
- The source contains a horizontally overflowing image treatment and testimonial rail; their exact runtime position is stateful, so the rebuild uses duplicated source items and a linear rail with pause/accessibility behavior.

## Behaviour inventory and implementation

| Area | Source behaviour | Rebuild implementation | Self-assessment |
| --- | --- | --- | --- |
| Hero media | Opacity reveal from `0.001`; dark image overlay/gradient | `data-reveal="hero-media"`, source image, CSS gradient | MINOR TECHNICAL VARIANCE |
| Hero pills | Three pills enter from `y: 10` after `2.2s` | `data-reveal="hero-pill"`, source delay, reduced-motion bypass | MINOR TECHNICAL VARIANCE |
| Hero heading | Static display heading in source DOM | Static Instrument Serif heading | MATCHED |
| Hero supporting copy | `y: 40`, `0.001` opacity, `2.2s` delay | `data-reveal="hero-copy"` with matching delay/offset | MINOR TECHNICAL VARIANCE |
| Hero CTA | `y: 40`, `0.001` opacity, `2.4s` delay | `data-reveal="hero-cta"` with matching delay/offset | MINOR TECHNICAL VARIANCE |
| Header/mobile nav | Blurred dark mobile surface; nav reveal/dismissal; hamburger transforms to close | CSS backdrop blur, opacity/translate transition, three-line control, Escape and link dismissal | MINOR TECHNICAL VARIANCE |
| About intro | Viewport-triggered opacity/vertical entrance in source appearance data | IntersectionObserver section reveal with JS-failure-visible content | MINOR TECHNICAL VARIANCE |
| About image rail | Continuous horizontal source image treatment | Duplicated local source assets, linear ticker, hover/focus pause, reduced-motion stop | MINOR TECHNICAL VARIANCE |
| Services | Section entrance, one-item accordion, plus/close control | Observer reveal, grid-row height transition, one open item, control state | MINOR TECHNICAL VARIANCE |
| Projects | Desktop sticky progression with normal-flow fallback | Desktop sticky card wrappers at `top: 100px`; normal flow below desktop breakpoint | MINOR TECHNICAL VARIANCE |
| Testimonials | Horizontal rail/carousel with alternating card surfaces | Duplicated local source testimonials, linear rail, hover/focus pause | MINOR TECHNICAL VARIANCE |
| FAQs | Smooth expansion/collapse, plus/close state, one open item | Grid-row transition, `aria-expanded`, one open item | MINOR TECHNICAL VARIANCE |
| Buttons/links | Circular arrow movement and source color transitions | Arrow rotation on hover/focus with source surfaces preserved | MINOR TECHNICAL VARIANCE |
| Reduced motion | Source suppresses appearance motion for reduced-motion users | `prefers-reduced-motion` disables animation and forces reveals visible | MATCHED |

## Implementation constraints

- No Framer runtime, animation bundle or remote motion dependency is restored.
- IntersectionObserver is progressive enhancement: without JavaScript, content remains visible.
- Tickers pause on hover/focus and stop under reduced motion; the rails remain accessible as ordinary document content.
- Motion is intentionally restrained to the measured source offsets and delays. No new decorative motion is introduced.

## Review evidence required

Static screenshots do not establish motion parity. Review the frame sequences and animated evidence under `reference/motion-comparison/` alongside the source captures. User visual approval remains the authority.

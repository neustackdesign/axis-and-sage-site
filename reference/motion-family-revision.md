# Wholesale redesign motion inventory

Status: `CODEX SELF-ASSESSMENT — USER REVIEW PENDING`

The wholesale presentation uses CSS and `IntersectionObserver` progressive enhancement. It does not restore the Framer runtime or use perpetual movement.

| Behaviour | Implementation | Review state |
| --- | --- | --- |
| Hero entrance | Kicker, heading block, lede/CTA and wide chess figure rise in measured sequence; image is revealed once through opacity/transform. | Implemented; exact source timing pending review. |
| Section entry | Section openings, intros, image compositions, work chapters, perspectives and contact layout reveal once on first viewport entry. | Implemented; content remains visible without JavaScript. |
| Services | Approved service detail expands with height/opacity; active image changes below the list. Unapproved details remain withheld. | Implemented. |
| Work | Project figure/crop reveals as each editorial chapter enters; chapter rhythm and ruled evidence rows replace card stacking. | Implemented. |
| Questions | One answer open at a time with height/opacity transition and plus/minus control. | Implemented. |
| Links and navigation | Underline transition, arrow translation, header scroll rule and paper mobile-sheet transition. | Implemented. |
| Reduced motion | `prefers-reduced-motion: reduce` and the observer branch clear transforms and durations while leaving content visible. | Implemented; native media-emulation recording remains a QA follow-up. |

Timing tokens are deliberately limited to 180ms interactions, 700–800ms content/image reveals, 24–28px rise and 60–90ms staged delays. There are no autoplay tickers, cursor effects, gradients, decorative parallax or long entrance delays.

Evidence is stored under `reference/motion-comparison/wholesale-redesign/`:

- `hero-entrance.gif`
- `service-accordion.gif`
- `faq-accordion.gif`
- `mobile-navigation.gif`
- `work-chapters.gif`
- `reduced-motion-static.png`

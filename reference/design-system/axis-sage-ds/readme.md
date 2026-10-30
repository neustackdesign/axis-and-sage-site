# Axis & Sage Design System

Design system for **Axis & Sage Advisory** — a two-founder advisory firm working across Africa and the GCC (Abu Dhabi, Dubai, Lagos). Its method is **Conversion Design**: name the action a business needs from someone (investors commit, partners sign, teams execute, customers buy, users adopt), find whether the *terms* or the *moment* is in the way, fix it, and measure what moved. Three practices: Strategy & Investment (terms), Product & Technology (moments), Brand & Market (the promise and message across both).

The one product surface is the marketing website **axisandsage.com** (Next.js App Router + Sanity): home, Conversion Design, three practice pages, engagements and pricing, work index and case pages, people, library (six free tools + guides), newsletter, contact.

## Sources
- Figma: *04 — Client — Axis and Sage — Active.fig* (2025 brand guidelines, logo lockups). Midnight, Cloud, Bloom, Lilac, Creme, the ribbons, the voice and the photography come from here.
- GitHub: https://github.com/neustackdesign/axis-and-sage-site (branch `main`) — explore it further for page layouts, tool logic and copy.
- Local mount: `axis-and-sage-site/` — key files: `src/styles/{tokens,base,chrome,components,tools}.css`, `src/components/ds/*.tsx`, `src/components/layout/*`, `migration/content-snapshot/*.ts` (all copy), `reference/design-system/website-component-map.md`.

## Index
- `styles.css` — entry point (imports only). `tokens/` (fonts, colors, typography, spacing, motion) + `css/` (base, chrome, components, tools — the site's own class CSS, copied verbatim).
- `fonts/` — Geist, Geist Mono, Platypi woff2 (+ OFL licence).
- `assets/brand/` — mark (colour, midnight, cloud), wordmarks (midnight, cloud), app icons, favicon. `assets/images/` — brand-book photography (`brand-*`), portraits and case photography.
- (Specimen cards, the UI kit and non-brand components are in the source zip, not this repo.) `guidelines/` — specimen cards (Colors, Type, Spacing, Brand, Voice, Applications), sharing `card.css`.
- `components/` — React primitives (below). Each has `.jsx`, `.d.ts`, `.prompt.md`; one `*.card.html` per folder.
- `ui_kits/site/` — click-through recreation of the website (Home, Work, Engagements, Contact). `data.js` holds verbatim site copy.
- `SKILL.md` — Agent Skill entry point.

## Components
- brand: **Lockup**, **Ribbons**, **MarkAvatar**, **Glyph** (+ `GLYPHS` data), **GlyphBadge**
- actions: **Button**, **TextLink**
- content: **Eyebrow**, **Chip**, **ChipRow**, **Portrait**
- layout: **Balance**, **Section**, **SectionHeader**, **RailBody**, **PageHero**
- navigation: **SiteHeader**, **SiteFooter**
- data: **SpecGrid**, **SpecList**, **StatTile**, **StatGrid**, **LogoStrip**, **Timeline**, **DayTimeline**, **EngagementTable**
- cards: **CaseCard**, **WorkCard**, **ToolCard**, **SpecialistCard**, **GapGrid**, **FounderCard**, **Testimonial**, **TestimonialFeature**
- method: **PlaneStack**, **MethodSentence**, **PaintingFrame**, **Artifact**, **ArtifactScreen**, **ArtifactDoc**
- forms: **Field**, **Check**, **Segmented**, **SliderField**, **CurrencyField**, **NewsletterForm**, **FormStatus**, **Stepper**, **ProgressBar**
- feedback: **Faq**, **ResultPanel**, **Quadrant**, **Blockers**
- article: **PullQuote**, **Callout**, **AuthorCard**, **DataTable**, **ArticleEnd**
- sections: **HomepageCover**, **CTABand**

All names follow the site's own component map. Components render the site's CSS classes (`btn`, `chip`, `case-card`…), so `styles.css` must be linked. Image-bearing components take an `assetBase` / `src` prop because asset paths are relative to the consuming page.


## Content fundamentals
- **Voice:** plain, declarative, short sentences. Confident without adjectives. "The decision was sound. The action never happened." "The site qualifies. The Sheet tracks. Cal.com schedules."
- **Person:** *we* (the firm) and *you* (the client). Founders speak as "one of us": "Every engagement is led by one of us, and usually both."
- **The sentence:** the brand's core device is a fill-in sentence — "We need [who] to [do what] by [when]." It appears in the method, CTA band, contact form, WhatsApp message ("Hi Axis & Sage, we need ___ to ___.").
- **Our voice is** (brand book): *Clear, not clever* — no fluff, filler or jargon. *Smart, not snobbish* — confident, never talking down. *Driven, not pushy* — calm, deliberate, focused on progress that lasts. *Human, not sterile* — serious work, still warm. In conversation we listen first and ask sharp questions; in writing, short sentences, active voice, strong verbs; in content, every piece has a point.
- **Pairs and parallelism:** terms / moments, decides / builds / says, "Investors commit, partners sign, teams execute and customers buy."
- **Casing:** sentence case for every heading and button ("Book a 30-minute call", "Take the Conversion Scorecard"). Headlines end with a full stop ("Two halves of every decision."). UPPERCASE only in mono apparatus: labels, tags, chips, sources ("01 · THE GAP", "FARMCROWDY · BUILT").
- **Separators:** middle dot `·` between label parts; `→` for before/after numbers ("18% → 60%"); `▸` trails links.
- **Numbers:** exact and sourced. Every stat carries a tag and a source line; never add a number without one. British spelling ("programme", "colour").
- **Price honesty:** "Know the price before we start." "Fixed fee", "Quoted on a 30-minute call". No hype, no exclamation marks, **no emoji**.
- **Microcopy:** errors are plain and per-field ("Add an email so we can reply."); loading flips the label ("Sending…"); success states say what happens next ("We reply within one working day").

## Visual foundations
- **Colour:** four brand colours. **Midnight Axis** `#0B0626` is the ink, the wordmark and every dark surface. **Cloud White** `#F3F0FF` is the page (`cloud-50` raised, `cloud-200` alt, `haze-300` rules). **Masdar Sunset** `#FE5F03` is the mark's first ribbon, the ribbons and large display. Its deep tone `#B5440D` (the 70% ribbon over Midnight) fills the one primary button per view and the closing CTA band, always with Cloud text. **Bloom** `#FE94F9` is the mark's second ribbon and the only accent on Midnight. Sage stays for tools and the library. Lilac for notes and voice, Creme with Brown text for people and stories. Status green and red only in forms and tools.
- **Contrast:** checked against WCAG 2 and APCA. Body and button text need 4.5 : 1 and Lc 60 or more. Cloud on Sunset deep: 5.4 : 1, Lc 80. Midnight on bright Sunset passes WCAG (6.4 : 1) but reads at Lc 47, so bright Sunset never sits under text smaller than 36px.
- **Section tones:** cloud by default, alt to separate, sage for tools, lilac for notes, creme for people, midnight at most twice a page. Sunset fills one band per page: the closing call to action.
- **Type:** Platypi 400 for headlines, quotes, card titles. Geist 400/500 for body and UI. Geist Mono 450 uppercase +0.08em for labels, stats, chips and the method sentence. Scale: poster 160/144 (covers, social, decks only), display 88/92, H1 64/68, H2 44/50, H3 28/34, body-l 20/30, body 17/27, small 14/20, label 12/16, stat 48/52. **Balance:** every text block keeps an even shape. Lines in a block run close to the same length, the last line is at least two-thirds of the longest, breaks fall between phrases, and each box is sized to the measure of its copy (`--measure-display` 12em, `--measure-heading` 18em, `--measure-lead` 34em, `--measure-body` 66ch, `--measure-caption` 48ch). A headline that fits on one line stays on one line. Button labels never wrap. CSS `text-wrap: balance` handles blocks up to six lines; the `Balance` helper in the bundle narrows longer boxes until their last line carries its weight. Break poster lines by hand.
- **Layout:** 12 columns, 1280 max, 24 gutter, 40 margin (20 on mobile). The 3/9 rail: a 1px rule, a numbered mono label in the rail, the headline in the content track. Section padding 96 (64 tight or on mobile). Give elements room: 40–56px between groups, 20–24px between siblings.
- **Rules and corners:** structure comes from 1px rules, not boxes. Square by default; pills for chips and glyphs; circles for avatars, badges and step marks. No drop shadows.
- **Ribbons:** the mark's two waves cropped large (`Ribbons`). Colour on Midnight; `outline` (dotted) behind the footer and on quiet dark grounds; `quiet` on light grounds. One field per view, kept clear of type and never on a photo.
- **Photography:** real people and real work moments across Africa and the GCC. One subject in focus, quiet background, shallow depth of field, natural and slightly muted colour (`saturate .88 contrast .95`). Captions are mono labels inside the frame, bottom right. Over photos, a Midnight shade only where type sits. Library: `assets/images/brand-*.jpg` from the 2025 brand book, plus case photography.
- **Motion:** runs once, then rests. Ease-out `cubic-bezier(.2,.7,.1,1)`; 160ms hover, 240ms state, 600ms first view. Reduced motion sets every duration to zero.
- **Hover and focus:** underlines appear or turn Sunset; cells tint to `cloud-200`; the primary button deepens to `sunset-600`. Focus is a 2px Midnight outline (Cloud on dark), 2px offset.

## Iconography
- The icon system is the **9×9 dot-matrix Glyph** (investors, partners, team, customers, users, terms, moment, action, time, money, document, screen), with one Sunset dot marking the action point. `Glyph` sets it in a pill; `GlyphBadge` in a circle for highlight covers and avatars.
- Unicode for small marks: `▸` links, `▾ ▴` dropdowns, `+ –` FAQ, `✓` done, `·` separator, `→` before/after.
- Illustration is code-drawn: PlaneStack, Timeline, redrawn Artifacts, Ribbons. No emoji. Client names are set in type.
- **Logo:** `Lockup` inline (header, footer, email) or stacked (covers, title slides, print). Midnight wordmark on light, Cloud on dark. Clear space equals the mark's height. Minimum: mark 24px, inline wordmark 10px tall. Don't stretch, recolour, add effects or place on busy grounds. The mark is two forces that intersect: Axis, Sage, collaboration, and Africa meeting the Gulf.
- **Quiet icon:** `MarkAvatar`, the point where the ribbons cross, in a Midnight circle. Social avatars, story bubbles, seals.

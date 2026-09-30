# Axis & Sage website: component usage map and build notes

This file covers the Conversion Design rebuild (brief 03). It maps each section to its design system component, lists the placeholders still visible, flags copy that was drafted rather than supplied, and names the assets still needed.

The design system source is `reference/design-system/axis-sage-ds/` (tokens and glyphs). Components are implemented in `src/components/ds/` under the names used on the design system's components page.

## Components

| Design system component | Code | Notes |
|---|---|---|
| Nav, Nav.Dropdown, Nav.Drawer | `components/layout/SiteHeader.tsx` | The desktop nav shows from 1120px up. Below that, the header has the logo, **Book a call** and MENU. The drawer puts the WhatsApp link at the foot. |
| Button.Primary, Button.Secondary, TextLink | `ds/primitives.tsx` (`ButtonLink`, `TextLink`) | Square, 48px tall. One orange primary per view. |
| Eyebrow | `ds/primitives.tsx` (`Eyebrow`) | Mono label, 12/16, uppercase. |
| SectionHeader | `ds/primitives.tsx` (`SectionHeader`, `RailBody`) | 3/9 left rail. The rail stacks above the content below 1024px. |
| PaintingFrame.Hero | `ds/method.tsx` (`PaintingFrame hero`) | Labelled CSS placeholder that needs no image request. |
| SpecGrid, SpecCell, spec list | `ds/blocks.tsx` (`SpecGrid`, `SpecList`) | 4 columns, then 2, then 1. |
| StatTile | `ds/blocks.tsx` (`StatTile`, `StatGrid`) | Shows a role tag and a source line. |
| Chip.Role, Chip.Conversion | `ds/primitives.tsx` (`Chip`, `ChipRow`) | The filter chips on /work use the selected state (orange-100). |
| CaseCard.Paper | `ds/blocks.tsx` (`CaseCard`) | Needed, Changed, Moved. |
| Work card | `ds/blocks.tsx` (`WorkCard`) | Name, sector, role chip, action chip and one line. |
| Testimonial | `ds/blocks.tsx` (`Testimonial`, `TestimonialFeature`) | |
| EngagementTable | `ds/blocks.tsx` (`EngagementTable`) | The Diagnostic column is inverted. Below 1024px it becomes stacked cards, with the recommended card first. |
| PlaneStack | `ds/method.tsx` (`PlaneStack`) | Motion runs once when the stack first comes into view. Respects reduced motion. |
| Timeline | `ds/blocks.tsx` (`Timeline`, `DayTimeline`) | |
| Glyph | `ds/primitives.tsx` (`Glyph`), `lib/glyphs.ts` | All 12 glyphs are ported. |
| MethodSentence | `sections/MethodSentencePanel.tsx`, `forms/CtaBandForm.tsx`, Scorecard step 1 | Wraps to three lines on mobile. |
| Fields | `.field*`, `.check`, `.segmented` in `styles/components.css` | Default, error and success states carry an icon and a message, not colour alone. |
| Stepper, ProgressBar | `tools/ToolBits.tsx` (`Stepper`) | |
| ResultPanel | `tools/Scorecard.tsx`, `tools/ToolBits.tsx` (`Quadrant`) | |
| ToolCard | `ds/blocks.tsx` (`ToolCard`) | |
| Article, PullQuote, Callout, AuthorCard | `app/(site)/guides/[slug]/page.tsx` | |
| Newsletter.Inline, Newsletter.Footer | `forms/NewsletterForm.tsx` | |
| CTABand.Orange | `ds/CTABand.tsx` | |
| LogoStrip | `ds/blocks.tsx` (`LogoStrip`) | Names are set in type because no logos were supplied. |
| Footer | `components/layout/SiteFooter.tsx` | Dotted orbit rings sit behind. |
| Artifact.Screen, Artifact.Paper | `ds/method.tsx` (`ArtifactScreen`, `ArtifactDoc`) | Used only inside case pages, captioned "redrawn, not screenshots". |

## Page map

| Page | Sections and components, in order |
|---|---|
| `/` | PaintingFrame.Hero · LogoStrip · The gap (SectionHeader, Glyph cards) · Conversion Design (MethodSentence and panel, PlaneStack) · Founders (Terms paper card, Moments charcoal card) · What moved (charcoal, StatTile ×7) · Selected work (CaseCard ×6) · Testimonial ×3 · How to start (EngagementTable, specialist cards) · Library (sage, ToolCard ×6) · CTABand · Footer |
| `/conversion-design` | Page hero · actor list with glyphs · two halves (paper Terms, charcoal Moments) · PlaneStack with expanded steps · Timeline (charcoal, Farmcrowdy) · CRO question · by type of action (links to /work filters) · FAQ 1, 2, 3, 7 · CTABand |
| `/what-we-do/*` | Hero with the practice lead · When to call us (spec list) · What we do (SpecGrid) · How it connects · Proof (3 work cards) · Related tools · CTABand. Embedded leadership shows How it works, Proof and When it fits instead. |
| `/engagements` | Hero · EngagementTable · 3 specialist cards · Diagnostic DayTimeline · fee · FAQ (all 8) · CTABand |
| `/work` | Hero · action and role filter chips (state in the URL) · work card grid · empty state · CTABand |
| `/work/[slug]` | Header · intro · Needed (large mono) · In the way · What we changed (TERMS and MOMENT tags) · What moved (StatTile) · Visuals · Quote · Related tools · Next case · CTABand |
| `/people`, `/people/[slug]` | Hero · one section per founder (Moments on charcoal) · specialists block (hidden while empty) · profile: bio, selected work, craft, education and base, related work |
| `/library` | Hero · Tools · Guides (only published guides link) · Templates (email request) · Newsletter · CTABand |
| `/tools/*` | Hero · sage tool section · CTABand |
| `/guides/[slug]` | Label, title, standfirst, author card, reading time, contents rail, pull quote, callout, table, embedded ToolCard, end CTA |
| `/contact` | Hero · three routes (calendar, form, WhatsApp) · details |
| `/newsletter`, `/thank-you`, `/privacy`, `/terms`, 404 | As specified |

Charcoal sections: Home uses two (What moved, and the Moments card). Every other page uses at most two.

## Forms and states

- Every form goes through one lead pipeline: `/api/contact` for contact and the CTA band, `/api/newsletter` (double opt-in), `/api/tool-result` for tool emails, and `/api/cal` for bookings. See the README, "The lead pipeline".
- **Error:** errors are inline and in plain language, and each field carries its own message.
- **Success:** the contact form shows "Thanks. One of us will reply within one working day." with the Scorecard link.
- **Last resort (503):** when both the database write and the notification email fail, or the server can't verify the browser (403), the form shows a notice and an "Open it in your email app" link that carries the full message. Nothing is lost and nothing is claimed as sent.
- **Rate limited (429):** a plain-language message to wait and try again.
- **Tool emails:** "Sent to {email}. Your file has downloaded." If the send fails, the tool says so and offers the download and a retry.
- **Loading:** buttons change their label to "Sending…" and are disabled.
- **Empty states:** a /work filter with no results, a DoA matrix with no levels or areas, the newsletter archive, and a guide still in draft.

## Placeholders still visible

- **Prices:** the price for the Diagnostic, Investor Readiness Sprint, Portfolio Review and Leadership working session.
- **Titles and names:**
  - Ifeanyi Monyei's title: "Co-founder & [CEO]".
  - Kunmi Demuren's [Title].
  - Temi Olateru's [Title] and [Firm].
  - The [Agency name] on the university innovation platform card.
  - The guide author, shown as [Author].
- **Contact details:**
  - The WhatsApp [number] (`NEXT_PUBLIC_WHATSAPP_NUMBER`).
  - The calendar embed, shown as [BOOKING LINK] (`NEXT_PUBLIC_BOOKING_URL`).
  - LinkedIn and portfolio URLs, shown as [URL].
- **Other:**
  - Privacy and terms text.
  - The newsletter's [first issue date].

## Copy drafted, not supplied (replace from file 06)

These were written so the tool screens can be reviewed. They live in `src/content/tools.ts` and are marked on every tool page as "DRAFT COPY AND SCORING · FINAL VERSION FROM FILE 06".

- **Conversion Scorecard:**
  - The ten statements and their "What we'd check first" lines.
  - The interim scoring and the verdict lines.
  - The mapping from action to related case.
- **What's a lift worth?:** the input labels and default values.
- **Delegation of Authority Builder:**
  - The default approval levels and decision areas.
  - The rule for the default A/R/C/I pattern.
- **Investor Readiness Score:** the 25 checks, the verdict bands and their lines.
- **Pitch Deck Outline:** the 12 questions and the slide notes.
- **Tool screens (all):** the ESOP sentence template and the tool microcopy, such as "Unanswered checks count as no."

Other lines written to fill a layout need:

- **Nav dropdown descriptions:** the Library items (Guides, Templates, Newsletter). The practice items reuse their H1s.
- **Section headings that the brief named but didn't write:**
  - "The four steps."
  - "By type of action."
  - "Frequently asked questions."
  - "Specialist engagements."
  - "Related work."
  - "Visuals."
- **Guide cards:** "Coming soon. Subscribe to get it first." on guides still in draft.
- **Contact:** the calendar placeholder line.
- **Case page artifacts:** the rows on the redrawn screens and documents (for example, "Stage · Planting").

The example guide, "What the Conversion Diagnostic fee pays for", is assembled only from the supplied engagement copy.

## Content decisions to confirm

- **Farmcrowdy "45,000+ Customers":** the brief gives no source line. The tile renders without one, which conflicts with the design system rule "if there is no source, there is no number". Supply a source or drop the tile.
- **Case pages for GV Solutions, Venture Garden Group, Mular, Nature Roots and Uganda Investor Summit:** these use only the Needed, Changed and Moved copy from the home cards. The other ten work entries have no case page, so their cards are not links.
- **Related tools on those case pages:** these follow each practice's tool list.
- **Stat source lines on the GV Solutions and Mular case pages:** these read "COMPANY RECORDS", taken from the homepage sources line. Confirm them.
- **Testimonial portraits:** Bunmi Akinyemiju, Temi Olateru and Onyeka Akumah use the portraits already migrated from the live site. Their usage approval was still marked pending in `reference/asset-inventory.json`. Kunmi Demuren has no portrait.

## Assets needed

- **Hero painting:** "Lagos lagoon at dusk", licensed or commissioned. Supply around 2400px wide in WebP, and keep the paper placeholder colour as the background.
- **Founder portraits:** Ifeanyi Monyei (paper backdrop) and Tomiwa Ogunmodede (charcoal backdrop). Set `portrait` in `src/content/people.ts`.
- **Client logos,** if wanted instead of type in the LogoStrip.
- **Template files:** the five templates, for sending by email.
- **Open Graph image:** `public/og/axis-sage.png` is the previous design. Replace it with the new lockup.

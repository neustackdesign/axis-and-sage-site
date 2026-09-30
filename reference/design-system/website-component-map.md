# Axis & Sage website: component usage map and build notes

This file covers the Conversion Design rebuild (brief 03, finished for launch in brief 11). It maps each section to its design system component, flags copy that was drafted rather than supplied, and names the assets still worth replacing.

The design system source is `reference/design-system/axis-sage-ds/` (tokens and glyphs). Components are implemented in `src/components/ds/` under the names used on the design system's components page.

## Components

| Design system component | Code | Notes |
|---|---|---|
| Nav, Nav.Dropdown, Nav.Drawer | `components/layout/SiteHeader.tsx` | The desktop nav shows from 1120px up. Below that, the header has the logo, **Book a call** and MENU. The drawer puts the WhatsApp link at the foot. |
| Button.Primary, Button.Secondary, TextLink | `ds/primitives.tsx` (`ButtonLink`, `TextLink`) | Square, 48px tall. One orange primary per view. |
| Eyebrow | `ds/primitives.tsx` (`Eyebrow`) | Mono label, 12/16, uppercase. |
| SectionHeader | `ds/primitives.tsx` (`SectionHeader`, `RailBody`) | 3/9 left rail. The rail stacks above the content below 1024px. |
| Homepage cover | `sections/HomepageHero.tsx`, with `SiteHeader variant="hero"` from `app/(home)/layout.tsx` | One framed surface: navigation inside it, the artwork as the whole field (graded, grained, shaded from the left), the message at lower left, the practices and the image credit at the bottom corners. |
| PaintingFrame.Hero | `ds/method.tsx` (`PaintingFrame hero`) | Image above, paper panel below. No longer used on Home; kept for other pages. |
| Portrait, initials tile | `ds/primitives.tsx` (`Portrait`) | Serif initials: "IM" on paper, "TO" on charcoal, until portraits are supplied. |
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
| `/` | Homepage cover · LogoStrip · The gap (SectionHeader, Glyph cards) · Conversion Design (MethodSentence and panel, PlaneStack) · Founders (Terms paper card, Moments charcoal card) · What moved (charcoal, StatTile ×7) · Selected work (CaseCard ×6) · Testimonial ×3 · How to start (EngagementTable, specialist cards) · Library (sage, ToolCard ×6) · CTABand · Footer |
| `/conversion-design` | Page hero · actor list with glyphs · two halves (paper Terms, charcoal Moments) · PlaneStack with expanded steps · Timeline (charcoal, Farmcrowdy) · CRO question · by type of action (links to /work filters) · FAQ 1, 2, 3, 7 · CTABand |
| `/what-we-do/*` | The three practices: hero with the practice lead · When to call us (spec list) · What we do (SpecGrid) · How it connects · Proof (3 work cards) · Related tools · CTABand. |
| `/engagements/embedded-leadership` | Same layout (`sections/PracticeView.tsx`): How it works, Proof and When it fits. `/what-we-do/embedded-leadership` redirects here with a 301. |
| `/engagements` | Hero · EngagementTable · 3 specialist cards · Diagnostic DayTimeline · fee · FAQ (all 8) · CTABand |
| `/work` | Hero · action and role filter chips (state in the URL) · work card grid · empty state · CTABand |
| `/work/[slug]` | Header · intro · Needed (large mono) · In the way · What we changed (TERMS and MOMENT tags) · What moved (StatTile) · Visuals · Quote · Related tools · Next case · CTABand |
| `/people`, `/people/[slug]` | Hero · one section per founder (Moments on charcoal) · specialists block (hidden while empty) · profile: bio, selected work, craft, education and base, related work |
| `/library` | Hero · Tools · Guides (only published guides link) · Templates (email request) · Newsletter · CTABand |
| `/tools/*` | Hero · sage tool section · CTABand |
| `/guides/[slug]` | Label, title, standfirst, author card, reading time, contents rail, pull quote, callout, table, embedded ToolCard, end CTA |
| `/contact` | Hero · three routes (calendar, form, WhatsApp) · details |
| `/privacy`, `/terms` | Article layout (`sections/LegalArticle.tsx`), with the text from brief 11 §5 in `content/legal.ts`. |
| `/newsletter`, `/thank-you`, 404 | As specified |

Charcoal sections: Home uses two (What moved, and the Moments card). Every other page uses at most two.

## Forms and states

- Every form takes one lead path: `/api/contact` for contact and the CTA band, `/api/newsletter` (MailerLite), `/api/tool-result` for tool emails, and `/api/cal` for bookings. See the README, "The lead path".
- **Error:** errors are inline and in plain language, and each field carries its own message.
- **Success:** shown once the lead is stored in Blob, even if the Pipeline Sheet hasn't confirmed yet. The contact form goes to `/thank-you`.
- **Last resort (503):** only when the Blob write itself fails. The form shows a notice and an "Open it in your email app" link that carries the full message.
- **Tool emails:** "Sent to {email}." or "Saved. We'll email it to {email} shortly.", plus "Your file has downloaded." when there's a file. If it can't be saved, the tool says so and offers the download and a retry.
- **Loading:** buttons change their label to "Sending…" and are disabled.
- **Empty states:** a /work filter with no results, a DoA matrix with no levels or areas, the newsletter archive, and a guide still in draft.

## Copy drafted, not supplied

The tool copy and logic are Spec A, word for word (`reference/briefs/06-tools-spec.md`). Lines written to fill a layout need:

- **Nav dropdown descriptions:** the Library items (Guides, Templates, Newsletter). The practice items reuse their H1s.
- **Section headings that the brief named but didn't write:** "The four steps.", "By type of action.", "Frequently asked questions.", "Specialist engagements.", "Related work.", "Visuals."
- **Guide cards:** "Coming soon. Subscribe to get it first." on guides still in draft.
- **Case page artifacts:** the rows on the redrawn screens and documents (for example, "Stage · Planting").
- **Tool microcopy beyond Spec A:**
  - field help text
  - "Unanswered checks count as no."
  - the search phrases in the tool page titles (only the DoA phrase is in Spec B)
  - the Group CEO's non-monetary codes: informed where the subsidiary MD approves; recommends where the MD recommends to the Board

## Content decisions to confirm

- **DoA defaults:** Spec A says Ifeanyi confirms or replaces the default bands and codes before launch.
- **Privacy and terms:** drafts for Ifeanyi's approval, not legal advice.
- **Farmcrowdy "45,000+ Customers":** the brief gives no source line.
- **Testimonial portraits:** Bunmi Akinyemiju, Temi Olateru and Onyeka Akumah use the portraits migrated from the live site. Their usage approval is marked pending in `reference/asset-inventory.json`.

## Assets worth replacing

- **Hero image:** served from Unsplash's CDN because the build sandbox couldn't download it. To self-host, save it at about 2400px wide in `public/images/` and change `heroImage.src` in `src/content/site.ts`.
- **Founder portraits,** if wanted instead of the initials tiles: set `portrait` in `src/content/people.ts`.
- **Client logos,** if wanted instead of type in the LogoStrip.
- **Template files:** the five templates, for sending by email.

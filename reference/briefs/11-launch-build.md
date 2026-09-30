# 11 · Claude Code prompt · the launch build (replaces 09 and 10)

**How to use.** Open Claude Code on `neustackdesign/axis-and-sage-site`, branch `claude/great-goldberg-5vcjxd` (PR #7), and paste this whole file. There's nothing to attach: the tool spec and the titles table are included as Spec A and Spec B. Files 09 and 10 were never run, and this file replaces both, so don't run them.

---

This is the last build pass before launch. It does four things:

1. Moves the site to a smaller stack with no database.
2. Applies the final tool spec.
3. Makes the content fixes below.
4. Fills in every remaining launch input.

Don't change the design or the approved copy except where this prompt says so.

## 0. Save the brief first

Save three files, then commit them before any other change:
- this prompt, as `reference/briefs/11-launch-build.md`
- Spec A, as `reference/briefs/06-tools-spec.md`
- Spec B, as `reference/briefs/05-seo-titles.md`

Future passes read the specs from these files. Where your code and the specs disagree, the specs win, except for the items listed under "Keep" in section 2.

## 1. The stack: no database

Hosting stays on **Vercel Hobby**. The site runs on four things you already use or that cost nothing:

| Job | Service |
|---|---|
| Pipeline, lead alerts, auto-replies and tool-result emails | **Google Workspace**: an Apps Script web app attached to the Sheet "Axis & Sage · Pipeline", sending from info@axisandsage.com |
| Backup copy of anything the Sheet hasn't received yet | **Vercel Blob**, a private store in this Vercel project. Hobby includes 1 GB and 2,000 writes a month |
| Newsletter | **MailerLite** (free), which also sends the confirmation email |
| Booking | **Cal.com** (keep what's built) |
| Page views | **Vercel Web Analytics** |

**Remove everything else** from code, dependencies, `.env.example`, the environment check, the README and the tests:
- Neon and `DATABASE_URL`
- Upstash and `KV_*`
- Turnstile
- Resend
- HubSpot
- Beehiiv
- the site's own newsletter confirmation tokens and `SIGNING_SECRET`
- the `conversions` and `events` tables and all the client event calls (`cta_click`, `whatsapp_click`, `tool_start`, `tool_step`)
- every mention of Vercel Pro and Neon in the README

Keep Speed Insights. Keep GA4 behind its flag, switched off.

### 1.1 The lead path

This path is used by the contact form, the CTA band, tool emails and bookings.

1. **Validate.** Use the existing `validateLead`. Keep the honeypot.
2. **Minimum fill time.** Each form carries the time it was rendered. If it's submitted less than 3 seconds later, return the normal success message and store nothing.
3. **Store first.** Write the lead as JSON to the private Blob store at `pending/leads/<ISO time>-<random id>.json`. Include the fields, the sentence, the first-touch and last-touch UTMs, the referrer, the landing page, the submission page, and a SHA-256 hash of the IP with `IP_HASH_SALT`. Never store the IP itself.
4. **Forward.** POST the lead to `SHEET_WEBHOOK_URL`, with an 8-second timeout. When the Apps Script confirms it, delete the Blob file.
5. **Respond with success** once the Blob write has succeeded, even if the forward failed: the lead is safe, and the cron will deliver it. The contact form then redirects to `/thank-you`.
6. **Fallback.** Show the mailto hand-over only when the Blob write itself fails.

### 1.2 Calling Apps Script: two gotchas

- **`doPost` can't read HTTP headers.** Put the signature in the body: `{ payload, ts, sig }`, where `sig` is the HMAC-SHA256 of `ts + "." + JSON.stringify(payload)` using `SHEET_WEBHOOK_SECRET`. Apps Script checks it with `Utilities.computeHmacSha256Signature` and rejects anything with `ts` more than 5 minutes old.
- **Apps Script answers a POST with a 302 redirect** to `script.googleusercontent.com`. Follow it; `fetch` does by default. Read the JSON reply from that URL, for example `{ ok: true }`.

### 1.3 The Apps Script

Put it in `integrations/google-apps-script/pipeline.gs`, with a README.

**Script Properties**
- `SHEET_WEBHOOK_SECRET`
- `FOUNDER_EMAILS`
- `FROM_ADDRESS`, which is `info@axisandsage.com`

**What `doPost` does**
1. Checks the signature.
2. **Soft rate limit** with `CacheService`: at most 5 per 10 minutes per IP hash and 3 per hour per email. Over the limit, the row is still added, marked "limited", but no emails are sent.
3. **Leads and bookings** are appended to the "Leads" tab, one row each. Existing rows are never edited.
4. **Lead alert.** Sends the notification to `FROM_ADDRESS`, copying `FOUNDER_EMAILS`.
5. **Auto-reply.** Sent for contact and CTA leads only, and only to email domains that have MX records. The site checks MX before forwarding and passes `sendAutoreply: true` or `false`.
6. **Tool emails.** Sends the visitor their result: HTML and plain text, a share link and a "Book a Diagnostic" link. The copy is the same as the current tool emails.
7. **Completed tools.** Appends one anonymous row to the "Tools" tab: date, tool, answers, result, UTM source. No step or start events.
8. **Replies** with `{ ok: true }`.

**Sending.** Use `GmailApp.sendEmail` with `{ from: FROM_ADDRESS, name: "Axis & Sage", replyTo }`. The script must be deployed by the info@ account, or by an account that has info@ as a "Send mail as" alias. Workspace allows about 1,500 recipients a day.

**Leads tab columns:** Date · Source · Name · Email · Company · Role · Sentence · When · Heard via · UTM source · UTM medium · UTM campaign · Landing page · Limited · Stage · Owner · Next action · Notes.

**Stage** is a dropdown with these values:
- New lead
- Qualified
- Call booked
- Diagnostic proposed
- Diagnostic signed
- Programme proposed
- Programme signed
- Embedded
- Lost

New leads start at New lead. Bookings start at Call booked.

**README setup steps**
1. Create the Sheet.
2. Open Extensions → Apps Script.
3. Paste the script.
4. Set the Script Properties.
5. Deploy as a web app: execute as me, access "Anyone".
6. Copy the web app URL into Vercel.

Add one warning to the README: **when you change the script, edit the existing deployment and choose "New version"**. A new deployment gets a new URL, and the site would keep posting to the old one.

### 1.4 The daily cron

Add one entry in `vercel.json`. Hobby runs crons once a day. The endpoint is `/api/cron/retry`, protected by `CRON_SECRET`. Each run:
- re-forwards every file in `pending/leads/`, deleting each one once it's delivered
- re-sends every file in `pending/subscribers/` to MailerLite
- logs a count of anything still pending

### 1.5 Newsletter

- Sign-ups go straight to the MailerLite API, into group `MAILERLITE_GROUP_ID`. MailerLite sends its own confirmation email; the README says to switch on double opt-in for API sign-ups in MailerLite's settings.
- If the call fails, write the sign-up to `pending/subscribers/` for the cron.
- Success copy: "Check your inbox to confirm your subscription."

### 1.6 Booking

- Keep the Cal.com inline embed at `https://cal.com/axisandsage/30min`, set through `NEXT_PUBLIC_BOOKING_URL`.
- Keep the webhook at `/api/cal`. It verifies Cal.com's signature header, then goes through the lead path in 1.1 with source `booking`.

### 1.7 Environment check

**Required in production**
- `NEXT_PUBLIC_SITE_URL`
- `SHEET_WEBHOOK_URL`
- `SHEET_WEBHOOK_SECRET`
- `BLOB_READ_WRITE_TOKEN` (created when you connect a Blob store to the project)
- `CRON_SECRET`
- `IP_HASH_SALT`
- `NEXT_PUBLIC_BOOKING_URL`
- `CAL_WEBHOOK_SECRET`

**Optional, with a warning when missing**
- `MAILERLITE_API_KEY` and `MAILERLITE_GROUP_ID`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- the LinkedIn URLs
- `NEXT_PUBLIC_GA_ID`

## 2. Tools: apply Spec A in full

**Copy and interim rules**
- Replace the drafted copy in `src/content/tools.ts` with Spec A, word for word. Delete `TOOL_DRAFT_NOTE`, its label, and every comment marking a rule as interim.

**Specific replacements**
- **Scorecard tie-break.** Statements from the weaker side come first. If the two sides score equal, Terms come first. Then statement order.
- **Scorecard related cases.** Use Spec A's map. Users or beneficiaries goes to Mular.
- **Scorecard display forms of {who}.** Follow Spec A. After a number, "Our team" becomes "people on our team".
- **Delegation of Authority limits.** Assign them to named levels, not positions:

  | Level | Limit |
  |---|---|
  | Manager | 0.05% of revenue |
  | Function head | 0.25% |
  | CFO | 1% |
  | CEO / MD | 5% |
  | Board | above 5% |

  - Board committees never hold a monetary limit.
  - The Group CEO follows Spec A's group rules.
  - Rename the levels to Spec A's names.
  - Use Spec A's non-monetary defaults and footnotes. Keep your extra footnote about personal interest.
- **ESOP.** Use Spec A's defaults. Vesting is monthly through `vested(m)`, so month 11 before the cliff returns 0. The chart can still plot yearly points.
- **Lift calculator.** Use Spec A's defaults. The break-even line uses the Diagnostic price, 5,000.
- **Investor Readiness.** Use Spec A's 25 checks, 2 / 1 / 0 scoring, bands and gap order.
- **Pitch Deck Outline.** Use Spec A's 12 questions and notes.

**Section 1 overrides Spec A's shared rules on storage and events.** Completed tools go to the "Tools" tab through Apps Script. There are no start, step or click events. Where Spec A says "CRM", read "the Pipeline Sheet".

**Keep** these, even where they go beyond the spec:
- hash-based share links
- the optional strike-price input, where blank means the current valuation divided by the fully diluted shares
- the target-rate field in Our team mode
- the `.xlsx` downloads and the success copy

**Tests**
- Add every Spec A test case to `test/tools.test.mjs`.
- Keep your existing tool tests only where they agree with Spec A.
- Add pipeline tests for:
  - Blob-first storage
  - the forward-then-delete step
  - cron retry
  - the signature format
  - the 3-second rule

  Mock Blob and Apps Script.
- A failing test fails the build.

## 3. Titles

Apply Spec B's table to the page metadata and the Open Graph images.

## 4. Content fixes and launch inputs

### Structure and pricing

- **Three practices.** Strategy & Investment, Product & Technology and Brand & Market.
  - Embedded leadership is a way of engaging, not a practice. Move its page to `/engagements/embedded-leadership`, with a 301 redirect from `/what-we-do/embedded-leadership`.
  - The "What we do" menu lists the three practices plus "Engagements and pricing".
  - Embedded leadership appears under Engagements and in the engagement table.
  - Update the sitemap, footer and breadcrumbs.
- **One published price.**
  - Conversion Diagnostic: "From US$5,000".
  - Conversion Programme: "Fixed fee, quoted after the Diagnostic".
  - Embedded leadership: "Monthly, quoted".
  - Investor Readiness Sprint, Portfolio Review and Leadership working session: "Quoted on a 30-minute call". The page headline stays: you still know the price before you start.

### Wording and evidence

- **OUI Life.** Use the approved wording: "the client reports a substantial increase in qualified leads".
- **Keep these figures.** Both are in the founders' approved fact list:
  - Farmcrowdy's first design system, 300+ components, built from scratch.
  - The Kolibri Design System, 500+ components, which Tomiwa contributed to and extended but did not build. Keep "contributor to".

### People and testimonials

- **Ifeanyi Monyei:** "Co-founder & CEO" everywhere.
- **Kunmi Demuren:** "Founder, Nature Roots".
- **Temi Olateru:** "Investor", with no firm field on the card.
- **Portraits:** initials tiles from the design system, "IM" on paper and "TO" on charcoal, with serif initials and no "PORTRAIT" label. This applies on Home, People and both profiles. No stock photos of people.

### Case pages

- **University innovation platform:** remove the agency line.

### Hero

- **Image:** "Sunset on Lagos skyline" by Chibuzo Nwaneri, https://unsplash.com/photos/gE3ign9Lx1Q, free under the Unsplash License. Save it at web size in `public/images/`. If the download is blocked, reference `https://images.unsplash.com/photo-1638437155671-167865b8bd49` and add `images.unsplash.com` to `images.remotePatterns`.
- **Credit:** replace the "PAINTING:" label with `LAGOS AT SUNSET · PHOTO: CHIBUZO NWANERI / UNSPLASH`.
- **Alt text:** "The Lagos skyline across the water at sunset."

### Guides and newsletter

- **Guide author:** Ifeanyi Monyei and Tomiwa Ogunmodede, with both author cards.
- **Newsletter:** the first issue is Tuesday 3 November 2026.

### Privacy and terms

Use the text in section 5, as written.

## 5. Privacy notice and terms

These are drafts for Ifeanyi's approval before launch. They are not legal advice. Use this text exactly, in the design system's article layout.

### /privacy

**Privacy notice**
Last updated: October 2026

**Who we are**
Axis & Sage Advisory Limited ("Axis & Sage", "we") is registered in Masdar City Free Zone, Abu Dhabi, United Arab Emirates. We decide how personal data collected through axisandsage.com is used, and we handle it in line with applicable data protection law. That includes the UAE's Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data and Nigeria's Data Protection Act 2023. Questions about this notice go to info@axisandsage.com.

**What we collect**
- **Notes, forms and calls.** When you send a note, use the "Who needs to act?" form or book a call, we collect your name, work email, company, role, the sentence you write, when it needs to happen, how you heard about us, and anything else you choose to tell us.
- **Tools.** When you finish a tool, we keep your answers and your result without your name or email, so we can see which tools help people. If you ask us to email you the result, we keep it with your email.
- **Newsletter.** When you subscribe to Terms & Moments, we keep your email address and your confirmation.
- **Bookings.** When you book a call, Cal.com passes us the details you give it.
- **How you found us.** We note the campaign link, the referring site and the first page you landed on. Your browser keeps this for 90 days and sends it to us only if you submit a form.
- **Technical data.** We count page views with Vercel Web Analytics, which doesn't use cookies. To stop our forms being abused, we use a scrambled (hashed) version of your IP address and keep it for a few hours at most.

We don't ask for sensitive personal data. Please don't send it to us.

**Why we use it**
- To reply to you and prepare for a conversation you asked for.
- To send you what you asked for, such as a tool result or a spreadsheet.
- To send the newsletter, only after you confirm your subscription.
- To see which pages and links help people reach us.
- To keep the site and our inboxes free of spam and abuse.

We rely on:
- your consent, for the newsletter
- the steps you ask us to take before a possible engagement, for enquiries, bookings and tool emails
- our legitimate interest in running and protecting our business, for analytics and security

You can withdraw consent at any time.

**Who else handles it**
A small number of providers process data for us:
- Vercel hosts the website. It briefly holds a copy of your message if our tracker can't be reached, and deletes it once the message arrives.
- Google Workspace runs our email and the tracker we use to follow up enquiries.
- MailerLite sends the newsletter.
- Cal.com runs our booking calendar.

If you message us on WhatsApp, WhatsApp's own terms and privacy policy also apply. We don't sell personal data or share it for anyone else's marketing.

**International transfers**
Our providers may process data outside the UAE and Nigeria, including in the European Union and the United States. We choose providers that protect personal data with contractual and technical safeguards.

**How long we keep it**
- Enquiries and bookings: up to 24 months after our last contact. If we work together, we keep them for as long as our contract and the law require.
- Tool results without an email: up to 12 months.
- Newsletter subscriptions: until you unsubscribe. Every issue has an unsubscribe link.
- Hashed IP addresses: a few hours at most.

**Your rights**
Depending on where you live, you can ask us to:
- tell you what we hold about you
- correct it or delete it
- restrict how we use it, or object to it
- give you a copy in a portable form

Write to info@axisandsage.com and we'll reply within 30 days. You can also complain to your data protection authority, such as the UAE Data Office or the Nigeria Data Protection Commission.

**Children**
This site is for businesses. It isn't directed at anyone under 18.

**Changes**
When we change this notice, we'll update the date at the top.

### /terms

**Terms of use**
Last updated: October 2026

**1. About these terms**
These terms apply to your use of axisandsage.com, which is run by Axis & Sage Advisory Limited, Masdar City Free Zone, Abu Dhabi, United Arab Emirates. By using the site, you accept them.

**2. Information, not advice**
The site, guides and tools give general information. Tool results are illustrative estimates based on what you enter. They are not financial, legal, tax or investment advice, so don't rely on them without advice for your own situation. Nothing on the site is an offer to raise capital or to arrange investments.

**3. No engagement until we sign one**
Using the site, sending a note or booking a call doesn't make you our client. We work under a signed engagement letter that sets out the scope, fees and terms.

**4. Our content**
We own, or are licensed to use, the content on this site: the text, design, graphics, tools and templates. You may view it, and you may download templates and tool results for your own organisation's internal use. You may not copy, resell or republish our content, tools or templates without our written permission. Client names, logos and quotes belong to those clients.

**5. Using the site properly**
Don't try to break or overload the site, scrape it, or send spam or harmful material through our forms. We may block access that does.

**6. Other websites**
Links to other sites are there for convenience. We aren't responsible for their content or practices.

**7. Liability**
We provide the site as it is. We work to keep it accurate and available, but we can't guarantee either. As far as the law allows, we aren't liable for any loss arising from your use of the site or from relying on its content. Nothing in these terms limits any liability that the law doesn't allow to be limited.

**8. Privacy**
Our privacy notice explains how we handle personal data.

**9. Governing law**
These terms are governed by the laws of the Emirate of Abu Dhabi and the federal laws of the United Arab Emirates. The courts of Abu Dhabi have jurisdiction.

**10. Changes and contact**
We may update these terms. When we do, we'll change the date at the top. Questions go to info@axisandsage.com.

## 6. Checks, then report back

Run typecheck, lint, tests, a production build and `pnpm check:placeholders`. The placeholder check should find none.

Update the launch gate in the PR description to this table:

| # | Check |
|---|---|
| 1 | **One full test buyer, end to end:** land on Home → take the Scorecard → press "Book a Diagnostic with this sentence" → send the prefilled form → a row appears in the Sheet → the alert reaches info@ and both founders → the auto-reply lands in the inbox, not spam → book through Cal.com → a Call booked row appears. Do it once from Gmail and once from Outlook. |
| 2 | With the Apps Script URL deliberately wrong, a form still says "Thanks", a file waits in `pending/leads/`, and after the URL is fixed, a manual run of the cron delivers it. |
| 3 | mail-tester.com scores 9/10 or higher for mail from info@. |
| 4 | A submission made in under 3 seconds is dropped. The honeypot works. The sixth rapid submission from one email is marked "limited" and sends no email. |
| 5 | Every Spec A test case passes. "DRAFT" appears nowhere. Tool emails arrive. The `.xlsx` files open in Excel and Google Sheets. |
| 6 | A newsletter test sign-up gets MailerLite's confirmation email. |
| 7 | The placeholder check is clean, `/studio` returns 404, and `/what-we-do/embedded-leadership` redirects with a 301. |
| 8 | Lighthouse mobile scores on Home, Engagements, the Scorecard and one guide: 90+ Performance, 95+ Accessibility, 100 Best Practices, 100 SEO. |
| 9 | The Rich Results Test passes. The LinkedIn and WhatsApp link previews show the page card. |

Finally, list every environment variable and Script Property, with where each value comes from, in the order the founders should set them up.

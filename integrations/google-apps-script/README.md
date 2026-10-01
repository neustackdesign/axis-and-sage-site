# Pipeline Sheet: Apps Script

`pipeline.gs` is a Google Apps Script web app on the Sheet "Axis & Sage · Pipeline". The website posts every lead, booking, tool email and completed tool to it. The script only records: it writes the rows and decides the soft rate limit. It sends no email; the website sends every email through Resend.

## Setup

1. **Create the Sheet.** In a separate browser profile or incognito window, sign in to the Axis & Sage Google Workspace: as info@axisandsage.com if it's a real user, or as the Workspace user that owns the info@ alias. Not a personal Gmail account. Create a Google Sheet named "Axis & Sage · Pipeline" and share it with both founders as editors. The script is deployed from this same account.
2. **Open Apps Script.** Extensions → Apps Script.
3. **Paste the script.** Replace the contents of `Code.gs` with `pipeline.gs` from this folder, then save.
4. **Set the Script Property.** Project Settings (the gear icon) → Script Properties → add one:

   | Property | Value |
   | --- | --- |
   | `SHEET_WEBHOOK_SECRET` | The same value as `SHEET_WEBHOOK_SECRET` in Vercel. Make it with `openssl rand -hex 32`. |

5. **Create the tabs.** In the editor, choose the function `setup` and click Run. Approve the permissions it asks for. This creates the "Leads" and "Tools" tabs with their headers, adds the Stage dropdown, and schedules the daily clean-up (`prune`).
6. **Deploy as a web app.** Deploy → New deployment → type "Web app".
   - Execute as: **Me**.
   - Who has access: **Anyone**.

   Click Deploy and approve the permissions.
7. **Copy the URL into Vercel.** Copy the web app URL (it ends in `/exec`) into `SHEET_WEBHOOK_URL` in the Vercel project, then redeploy the site.

To check it's live, open the URL in a browser. It should show `{"ok":true,"service":"Axis & Sage pipeline"}`.

> **When you change the script:** go to Deploy → Manage deployments, edit the existing deployment (the pencil icon), and choose **New version**. Don't create a new deployment: that gives a new URL, and the website keeps posting to the old one.

## What it does with each post

1. **Verifies the signature.** The body is `{ payload, ts, sig }`, where `sig` is the hex HMAC-SHA256 of `ts + "." + JSON.stringify(payload)`. It's checked with `Utilities.computeHmacSha256Signature`. A `ts` older than 5 minutes is rejected.
2. **Ignores a repeat.** Each post carries an id. Ids already written are kept in a hidden "Delivered" tab for 90 days, so a lead the site retries is never written twice.
3. **Applies a soft rate limit** with CacheService: 5 per 10 minutes per IP hash, and 3 per hour per email. Over the limit, the row is still added with "limited" in the Limited column and a blank Stage, so it stays out of the pipeline. Bookings are never limited. The IP hash is used for the count and never written to the Sheet.
4. **Adds a Leads row** for each lead, tool email and booking, and never edits an existing row. Text that starts like a formula (`=`, `+`, `-`, `@`) is stored as text.
5. **Adds a Tools row** for each completed tool: date, tool, answers, result and UTM source. These rows are anonymous.
6. **Replies** `{ ok: true, limited }`. With `limited: true`, the website sends no email for that lead. Anything else, and the website keeps the lead in Blob and retries it the next day.

**Retention.** `prune` runs daily at about 4am. It deletes Tools rows older than 12 months, as the privacy notice says, and delivery ids older than 90 days. Leads are never deleted automatically: review them by hand against the notice's 24-month rule.

## The Leads tab

| Column | Filled by |
| --- | --- |
| Date | The script: the time of the submission. |
| Source | The script: `contact`, `cta`, `booking` or `tool · <tool name>`. A contact form reached from a tool reads, for example, `contact · scorecard`. |
| Name, Email, Company, Role | The visitor. |
| Sentence | The visitor's "We need … to … by …" sentence. For a contact message, it's the message's first line. For a booking, it's the answer to the required Cal.com question "Who needs to act, and what do you need them to do?" |
| When, Heard via | The visitor. |
| UTM source, UTM medium, UTM campaign | The visitor's first touch, or the last touch if there's no first. Both touches are in the alert email. |
| Landing page | The first page of the visit. |
| Limited | "limited" when the soft rate limit applied. |
| Stage | Starts at **New lead**, or **Call booked** for a booking. Blank for a limited row, which stays out of the pipeline. The dropdown holds: New lead, Qualified, Call booked, Diagnostic proposed, Diagnostic signed, Programme proposed, Programme signed, Embedded, Lost. |
| Owner, Next action | You. |
| Notes | The script fills the full message, the engagement asked about, a tool's result, and for a booking the call time in Asia/Dubai (for example "Call: Fri, 2 Oct 2026, 13:00 GST (Asia/Dubai, UTC+4)"); you add to it. |

## Testing

`test/apps-script.test.mjs` runs this script against mocked Google services, posting bodies signed the way the website signs them.

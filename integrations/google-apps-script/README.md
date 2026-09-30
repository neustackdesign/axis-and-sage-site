# Pipeline Sheet: Apps Script

`pipeline.gs` is a Google Apps Script web app on the Sheet "Axis & Sage · Pipeline". The website posts every lead, booking, tool email and completed tool to it. It writes the rows and sends every email from info@axisandsage.com.

## Setup

1. **Create the Sheet.** Sign in as info@axisandsage.com, or as an account that has info@ as a "Send mail as" alias, and create a Google Sheet named "Axis & Sage · Pipeline". The account that deploys the script is the account that sends the email.
2. **Open Apps Script.** Extensions → Apps Script.
3. **Paste the script.** Replace the contents of `Code.gs` with `pipeline.gs` from this folder, then save.
4. **Set the Script Properties.** Project Settings (the gear icon) → Script Properties → add these three:

   | Property | Value |
   | --- | --- |
   | `SHEET_WEBHOOK_SECRET` | The same value as `SHEET_WEBHOOK_SECRET` in Vercel. Make it with `openssl rand -hex 32`. |
   | `FOUNDER_EMAILS` | Both founders' addresses, comma-separated. They're copied on every lead alert. |
   | `FROM_ADDRESS` | `info@axisandsage.com` |

5. **Create the tabs.** In the editor, choose the function `setup` and click Run. Approve the permissions it asks for. This creates the "Leads" and "Tools" tabs with their headers and adds the Stage dropdown.
6. **Deploy as a web app.** Deploy → New deployment → type "Web app".
   - Execute as: **Me**.
   - Who has access: **Anyone**.

   Click Deploy and approve the permissions.
7. **Copy the URL into Vercel.** Copy the web app URL (it ends in `/exec`) into `SHEET_WEBHOOK_URL` in the Vercel project, then redeploy the site.

To check it's live, open the URL in a browser. It should show `{"ok":true,"service":"Axis & Sage pipeline"}`.

> **When you change the script:** go to Deploy → Manage deployments, edit the existing deployment (the pencil icon), and choose **New version**. Don't create a new deployment: that gives a new URL, and the website keeps posting to the old one.

## What it does with each post

1. **Verifies the signature.** The body is `{ payload, ts, sig }`, where `sig` is the hex HMAC-SHA256 of `ts + "." + JSON.stringify(payload)`. It's checked with `Utilities.computeHmacSha256Signature`. A `ts` older than 5 minutes is rejected.
2. **Ignores a repeat.** Each post carries an id. Ids already written are kept in a hidden "Delivered" tab, so a lead the site retries is never written twice.
3. **Applies a soft rate limit** with CacheService: 5 per 10 minutes per IP hash, and 3 per hour per email. Over the limit, the row is still added with "limited" in the Limited column, and no emails are sent.
4. **Adds a Leads row** for each lead and booking, and never edits an existing row. Text that starts like a formula (`=`, `+`, `-`, `@`) is stored as text.
5. **Sends the lead alert** to `FROM_ADDRESS`, copying `FOUNDER_EMAILS`, with Reply-To set to the visitor.
6. **Sends the auto-reply** for contact and CTA leads only, and only when the site passes `sendAutoreply`. The site sets it after checking that the email's domain has MX records. The auto-reply never repeats a link the visitor typed.
7. **Sends tool emails.** The visitor gets their result as HTML and plain text, with a link to see it again and a "Book a Diagnostic" link.
8. **Adds a Tools row** for each completed tool: date, tool, answers, result and UTM source. These rows are anonymous.
9. **Replies** `{ ok: true }`. Anything else, and the website keeps the lead in Blob and retries it the next day.

Email goes out through `GmailApp.sendEmail` with `{ from: FROM_ADDRESS, name: "Axis & Sage", replyTo }`. Google Workspace allows about 1,500 recipients a day.

## The Leads tab

| Column | Filled by |
| --- | --- |
| Date | The script: the time of the submission. |
| Source | The script: `contact`, `cta`, `booking` or `tool · <tool name>`. A contact form reached from a tool reads, for example, `contact · scorecard`. |
| Name, Email, Company, Role | The visitor. |
| Sentence | The visitor's "We need … to … by …" sentence. For a contact message, it's the message's first line. |
| When, Heard via | The visitor. |
| UTM source, UTM medium, UTM campaign | The visitor's first touch, or the last touch if there's no first. Both touches are in the alert email. |
| Landing page | The first page of the visit. |
| Limited | "limited" when the soft rate limit applied. |
| Stage | Starts at **New lead**, or **Call booked** for a booking. The dropdown holds: New lead, Qualified, Call booked, Diagnostic proposed, Diagnostic signed, Programme proposed, Programme signed, Embedded, Lost. |
| Owner, Next action | You. |
| Notes | The script fills the full message, the engagement asked about, and a tool's result; you add to it. |

## Testing

`test/apps-script.test.mjs` runs this script against mocked Google services, posting bodies signed the way the website signs them.

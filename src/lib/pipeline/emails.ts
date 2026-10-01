// The website's emails, sent through Resend: the lead alert, the auto-reply and tool results. Pure, so they can be tested.
import { escapeHtml, stripUrls } from "@/lib/text";
import type { Mail, SheetPayload, Touch } from "./core";

export const DISCLAIMER = "An illustrative planning estimate, not financial, legal or tax advice.";

/** Paper background, serif heading, mono label, one orange button. */
export function htmlEmail({ heading, paragraphs, action }: { heading: string; paragraphs: string[]; action?: { label: string; href: string } }) {
  const p = paragraphs.map((t) => `<p style="margin:0 0 16px;font:16px/25px Helvetica,Arial,sans-serif;color:#1F1F1F">${t}</p>`).join("");
  const a = action ? `<p style="margin:24px 0"><a href="${action.href}" style="display:inline-block;background:#E8590C;color:#1F1F1F;padding:14px 22px;font:500 15px Helvetica,Arial,sans-serif;text-decoration:none">${action.label}</a></p>` : "";
  return `<!doctype html><html><body style="margin:0;background:#ECEBE9"><div style="max-width:560px;margin:0 auto;padding:40px 24px"><p style="margin:0 0 24px;font:12px/16px Menlo,monospace;letter-spacing:.08em;color:#5B5A57">AXIS &amp; SAGE ADVISORY</p><h1 style="margin:0 0 20px;font:400 28px/34px Platypi,Georgia,serif;color:#1F1F1F">${heading}</h1>${p}${a}<p style="margin:32px 0 0;border-top:1px solid #D4D4D2;padding-top:16px;font:12px/18px Helvetica,Arial,sans-serif;color:#5B5A57">Axis &amp; Sage Advisory Limited · Masdar City Free Zone, Abu Dhabi, United Arab Emirates</p></div></body></html>`;
}

/** Drops blank lines that would double up once empty fields are removed. */
const lines = (xs: string[]) => xs.filter((l, i, a) => l !== "" || (i > 0 && a[i - 1] !== "")).join("\n").trim();
const touch = (t?: Touch) => (t ? [t.utm_source, t.utm_medium, t.utm_campaign].filter(Boolean).join(" / ") || t.referrer || "direct" : "unknown");
const firstLine = (s?: string) => (s || "").split("\n")[0].slice(0, 300);

export function leadSentence(p: SheetPayload) {
  return p.sentence || (p.type === "tool_email" ? `${p.tool} result` : firstLine(p.message));
}

const emailPattern = /^[^\s@,]+@[^\s@,]+\.[^\s@,]{2,}$/;

/**
 * Optional copies of the lead alert, from FOUNDER_EMAILS (comma-separated). Trimmed and lower-cased; invalid
 * addresses, duplicates and the alert's own destination are dropped. Empty when nothing distinct is left.
 */
export function alertCc(founders: string | undefined, to: string): string[] {
  const own = to.trim().toLowerCase();
  const seen = new Set<string>();
  for (const raw of (founders || "").split(",")) {
    const email = raw.trim().toLowerCase();
    if (email && email !== own && emailPattern.test(email)) seen.add(email);
  }
  return [...seen];
}

/** To CONTACT_TO_EMAIL, copying any distinct FOUNDER_EMAILS, with Reply-To set to the visitor so a reply goes straight back to them. */
export function alertMail(p: SheetPayload, opts: { to: string; cc?: string[] }): Mail {
  const label = p.source === "booking" ? "Call booked" : p.type === "tool_email" ? `Tool result (${p.tool})` : "New lead";
  const sentence = leadSentence(p);
  const text = lines([
    `${label}: ${sentence || p.email}`,
    "",
    `Name: ${p.name || ""}`,
    `Email: ${p.email || ""}`,
    p.company ? `Company: ${p.company}` : "",
    p.role ? `Role: ${p.role}` : "",
    p.booking?.startTimeLocal ? `Call: ${p.booking.startTimeLocal}` : "",
    p.when ? `When: ${p.when}` : "",
    p.engagement ? `Interested in: ${p.engagement}` : "",
    p.heard ? `Heard via: ${p.heard}${p.heardDetail ? ` (${p.heardDetail})` : ""}` : "",
    p.message ? `\n${p.message}` : "",
    p.summary ? `\n${p.summary}` : "",
    "",
    `Source: ${p.source || p.type}`,
    `First touch: ${touch(p.utm?.first)}`,
    `Last touch: ${touch(p.utm?.last)}`,
    `Referrer: ${p.referrer || "none"}`,
    `Landing page: ${p.landingPage || "unknown"}`,
    `Submitted on: ${p.submissionPage || "unknown"}`,
  ]);
  const cc = alertCc((opts.cc || []).join(","), opts.to);
  return { to: [opts.to], ...(cc.length ? { cc } : {}), replyTo: p.email || undefined, subject: `${label}: ${sentence || p.name || p.email}`, text };
}

/** Contact and CTA only. Never repeats a link the visitor typed. */
export function autoreplyMail(p: SheetPayload, siteUrl: string): Mail {
  const first = (p.name || "").trim().split(/\s+/)[0];
  const said = stripUrls(leadSentence(p) || p.message || "");
  const scorecard = `${siteUrl}/tools/conversion-scorecard`;
  const text = [
    first ? `Thanks, ${first}.` : "Thanks.",
    "",
    "We have your note. One of us will reply within one working day.",
    ...(said ? ["", "You wrote:", `"${said}"`] : []),
    "",
    `While you wait, the Conversion Scorecard takes six minutes: ${scorecard}`,
    "",
    "Axis & Sage Advisory",
  ].join("\n");
  const html = htmlEmail({
    heading: first ? `Thanks, ${escapeHtml(first)}.` : "Thanks.",
    paragraphs: ["We have your note. One of us will reply within one working day.", ...(said ? [`You wrote:<br><em>“${escapeHtml(said)}”</em>`] : [])],
    action: { label: "Take the Conversion Scorecard", href: escapeHtml(scorecard) },
  });
  return { to: [p.email!], subject: "We have your note · Axis & Sage", text, html };
}

/** The visitor's tool result, as HTML and plain text, with a link back to it and a "Book a Diagnostic" link. */
export function toolResultMail(p: SheetPayload, siteUrl: string): Mail {
  const summary = p.summary || "";
  const diagnostic = p.diagnosticUrl || `${siteUrl}/contact?engagement=diagnostic#note`;
  const text = lines([
    `Your ${p.tool} result`,
    "",
    summary,
    "",
    p.shareUrl ? `See it again: ${p.shareUrl}` : "",
    `Book a Diagnostic: ${diagnostic}`,
    "",
    DISCLAIMER,
    "",
    "Axis & Sage Advisory",
  ]);
  const html = htmlEmail({
    heading: `Your ${escapeHtml(p.tool || "")} result`,
    paragraphs: [
      `<span style="white-space:pre-wrap;font-family:Menlo,monospace;font-size:13px;line-height:20px">${escapeHtml(summary)}</span>`,
      ...(p.shareUrl ? [`<a href="${escapeHtml(p.shareUrl)}" style="color:#1F1F1F">See your result again</a>`] : []),
      `<span style="font-size:13px;color:#5B5A57">${DISCLAIMER}</span>`,
    ],
    action: { label: "Book a Diagnostic", href: escapeHtml(diagnostic) },
  });
  return { to: [p.email!], subject: `Your ${p.tool} result · Axis & Sage`, text, html };
}

import "server-only";
import { config, logFailure } from "./config";

export type Mail = { to: string[]; cc?: string[]; subject: string; text: string; html?: string; replyTo?: string };

/** Sends through Resend from the notify subdomain. Returns false on any failure (and logs it). */
export async function sendMail(mail: Mail, step: string): Promise<boolean> {
  if (!config.resendKey) { logFailure(step, "RESEND_API_KEY not configured"); return false; }
  try {
    const res = await fetch(`${config.resendBase}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: config.mailFrom, to: mail.to, cc: mail.cc?.length ? mail.cc : undefined, reply_to: mail.replyTo || config.mailReplyTo, subject: mail.subject, text: mail.text, html: mail.html }),
    });
    if (!res.ok) { logFailure(step, `Resend ${res.status}`, { body: (await res.text()).slice(0, 300) }); return false; }
    return true;
  } catch (error) {
    logFailure(step, error);
    return false;
  }
}

/** Minimal, on-brand HTML wrapper: paper background, serif heading, mono labels, one orange link. */
export function htmlEmail({ heading, paragraphs, action, footer }: { heading: string; paragraphs: string[]; action?: { label: string; href: string }; footer?: string }) {
  const p = paragraphs.map((t) => `<p style="margin:0 0 16px;font:16px/25px Helvetica,Arial,sans-serif;color:#1F1F1F">${t}</p>`).join("");
  const a = action ? `<p style="margin:24px 0"><a href="${action.href}" style="display:inline-block;background:#E8590C;color:#1F1F1F;padding:14px 22px;font:500 15px Helvetica,Arial,sans-serif;text-decoration:none">${action.label}</a></p>` : "";
  return `<!doctype html><html><body style="margin:0;background:#ECEBE9"><div style="max-width:560px;margin:0 auto;padding:40px 24px"><p style="margin:0 0 24px;font:12px/16px Menlo,monospace;letter-spacing:.08em;color:#5B5A57">AXIS &amp; SAGE ADVISORY</p><h1 style="margin:0 0 20px;font:400 28px/34px Georgia,serif;color:#1F1F1F">${heading}</h1>${p}${a}<p style="margin:32px 0 0;border-top:1px solid #D4D4D2;padding-top:16px;font:12px/18px Helvetica,Arial,sans-serif;color:#5B5A57">${footer || "Axis &amp; Sage Advisory Limited · Masdar City Free Zone, Abu Dhabi, United Arab Emirates"}</p></div></body></html>`;
}

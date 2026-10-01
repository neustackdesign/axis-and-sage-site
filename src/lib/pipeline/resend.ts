import type { SendMail } from "./core";

/** Sends through the Resend API. False on any failure, so the caller can park the email for the cron. */
export function resendSend(opts: { apiKey: string; from: string; fetchImpl?: typeof fetch; base?: string }): SendMail {
  return async (mail) => {
    if (!opts.apiKey) return false;
    const res = await (opts.fetchImpl ?? fetch)(`${opts.base || "https://api.resend.com"}/emails`, {
      method: "POST",
      headers: { Authorization: `Bearer ${opts.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: opts.from, to: mail.to, cc: mail.cc?.length ? mail.cc : undefined, reply_to: mail.replyTo, subject: mail.subject, text: mail.text, html: mail.html }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  };
}

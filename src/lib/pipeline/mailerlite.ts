import type { Subscribe } from "./core";

/**
 * Adds a subscriber to a MailerLite group. With double opt-in for API sign-ups switched on in MailerLite,
 * MailerLite sends the confirmation email itself.
 */
export function mailerLiteSubscribe(opts: { apiKey: string; groupId: string; fetchImpl?: typeof fetch }): Subscribe {
  return async (email) => {
    if (!opts.apiKey || !opts.groupId) return false;
    const res = await (opts.fetchImpl ?? fetch)("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: { Authorization: `Bearer ${opts.apiKey}`, "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, groups: [opts.groupId] }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  };
}

// Shared lead validation for the contact route and the client forms. Plain language, no jargon.

export const leadSources = ["contact", "cta", "newsletter", "tool"] as const;
export type LeadSource = (typeof leadSources)[number];

export type LeadPayload = {
  source: LeadSource;
  email: string;
  name?: string;
  company?: string;
  role?: string;
  message?: string;
  who?: string;
  what?: string;
  when?: string;
  heard?: string;
  heardDetail?: string;
  consent?: boolean;
  tool?: string;
  summary?: string;
  website?: string; // honeypot
};

export type LeadErrors = Partial<Record<"email" | "name" | "message" | "who" | "what" | "consent", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLead(p: LeadPayload): LeadErrors {
  const errors: LeadErrors = {};
  const email = (p.email || "").trim();
  if (!email) errors.email = "Enter your work email.";
  else if (!emailPattern.test(email)) errors.email = "Enter an email like name@company.com.";
  if (p.source === "contact") {
    if (!p.name || p.name.trim().length < 2) errors.name = "Enter your name.";
    if (!p.message || p.message.trim().length < 10) errors.message = "Tell us who needs to act, in a sentence or two.";
    if (!p.consent) errors.consent = "Tick to let us reply to you.";
  }
  if (p.source === "cta") {
    if (!p.who || !p.who.trim()) errors.who = "Say who needs to act.";
    if (!p.what || !p.what.trim()) errors.what = "Say what you need them to do.";
  }
  return errors;
}

export function sentenceOf(p: Pick<LeadPayload, "who" | "what" | "when">) {
  const who = (p.who || "").trim();
  const what = (p.what || "").trim();
  const when = (p.when || "").trim();
  if (!who && !what) return "";
  return `We need ${who || "[who]"} to ${what || "[do what]"}${when && when !== "no date yet" ? ` by ${when}` : when === "no date yet" ? " (no date yet)" : ""}.`;
}

export function leadText(p: LeadPayload) {
  const lines = [
    `Source: ${p.source}${p.tool ? ` (${p.tool})` : ""}`,
    p.name ? `Name: ${p.name}` : "",
    `Email: ${p.email}`,
    p.company ? `Company: ${p.company}` : "",
    p.role ? `Role: ${p.role}` : "",
    p.who || p.what ? `Sentence: ${sentenceOf(p)}` : "",
    p.when && !(p.who || p.what) ? `When: ${p.when}` : "",
    p.heard ? `Heard via: ${p.heard}${p.heardDetail ? ` (${p.heardDetail})` : ""}` : "",
    p.message ? `\n${p.message}` : "",
    p.summary ? `\n${p.summary}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

export function leadSubject(p: LeadPayload) {
  if (p.source === "newsletter") return `Terms & Moments sign-up: ${p.email}`;
  if (p.source === "tool") return `Tool request (${p.tool || "tool"}) from ${p.email}`;
  if (p.source === "cta") return `Who needs to act: ${sentenceOf(p)}`;
  return `Axis & Sage enquiry from ${p.name || p.email}`;
}

/** Fallback when online delivery is not configured: the visitor's own email client, message intact. */
export function mailtoFor(p: LeadPayload, to = "info@axisandsage.com") {
  return `mailto:${to}?subject=${encodeURIComponent(leadSubject(p))}&body=${encodeURIComponent(leadText(p))}`;
}

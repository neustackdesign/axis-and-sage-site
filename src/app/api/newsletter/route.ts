import { NextResponse } from "next/server";
import { newsletter } from "@/content/site";
import { config, logFailure } from "@/lib/server/config";
import { upsertSubscriber } from "@/lib/server/db";
import { htmlEmail, sendMail } from "@/lib/server/email";
import { gate, parseLead, readJson, recordConversion } from "@/lib/server/pipeline";
import { signToken } from "@/lib/server/signing";

/** Newsletter sign-up: stored as pending, confirmed by a signed link (double opt-in). */
export async function POST(request: Request) {
  const lead = parseLead({ ...(await readJson(request)), source: "newsletter" });
  if (!lead) return NextResponse.json({ message: "We couldn't read that. Please try again." }, { status: 400 });
  const g = await gate(request, lead);
  if (g === "honeypot") return NextResponse.json({ message: "Check your inbox to confirm." });
  if (!g.ok) return NextResponse.json(g.body, { status: g.status });

  let saved = false;
  try { await upsertSubscriber(lead.email, lead.attribution || {}); saved = true; } catch (error) { logFailure("db_subscriber", error); }
  const link = `${config.siteUrl}/api/newsletter/confirm?token=${encodeURIComponent(signToken(lead.email))}`;
  const sent = await sendMail({
    to: [lead.email],
    subject: `Confirm your ${newsletter.name} subscription`,
    text: `One click to confirm you want ${newsletter.name}.\n\n${newsletter.line}\n\nConfirm: ${link}\n\nIf you didn't ask for this, ignore this email and nothing happens.\n\nAxis & Sage Advisory`,
    html: htmlEmail({ heading: `Confirm ${newsletter.name}`, paragraphs: [newsletter.line.replace(/'/g, "&#39;"), "If you didn't ask for this, ignore this email and nothing happens."], action: { label: "Confirm my subscription", href: link } }),
  }, "newsletter_confirm_email");
  if (!saved && !sent) return NextResponse.json({ message: "We couldn't sign you up just now. Your email app can send the request instead.", fallback: true }, { status: 503 });
  await recordConversion("newsletter_signup", "newsletter", lead.attribution || {});
  if (!sent) return NextResponse.json({ message: "You're on the list. We couldn't send the confirmation email just now; we'll send it shortly." });
  return NextResponse.json({ message: `Check ${lead.email} and click the link to confirm.` });
}

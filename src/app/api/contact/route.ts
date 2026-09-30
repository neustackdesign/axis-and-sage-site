import { NextResponse } from "next/server";
import { isContactFormConfigured } from "@/lib/contact-availability";
import { leadSources, leadSubject, leadText, validateLead, type LeadPayload } from "@/lib/leads";

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

async function readPayload(request: Request): Promise<LeadPayload | null> {
  const type = request.headers.get("content-type") || "";
  let raw: Record<string, unknown> = {};
  if (type.includes("application/json")) raw = await request.json().catch(() => ({}));
  else {
    const form = await request.formData().catch(() => null);
    if (form) raw = Object.fromEntries(form.entries());
  }
  const source = str(raw.source, 20) as LeadPayload["source"];
  if (!leadSources.includes(source)) return null;
  return {
    source,
    email: str(raw.email, 200) || "",
    name: str(raw.name, 200),
    company: str(raw.company, 200),
    role: str(raw.role, 200),
    message: str(raw.message, 4000),
    who: str(raw.who, 200),
    what: str(raw.what, 200),
    when: str(raw.when, 60),
    heard: str(raw.heard, 60),
    heardDetail: str(raw.heardDetail, 200),
    consent: raw.consent === true || raw.consent === "on" || raw.consent === "true",
    tool: str(raw.tool, 80),
    summary: str(raw.summary, 6000),
    website: str(raw.website, 200),
  };
}

export async function POST(request: Request) {
  const payload = await readPayload(request);
  if (!payload) return NextResponse.json({ message: "We couldn't read that. Please try again." }, { status: 400 });
  if (payload.website) return NextResponse.json({ message: "Thanks. One of us will reply within one working day." });
  const errors = validateLead(payload);
  if (Object.keys(errors).length) return NextResponse.json({ message: "Please check the highlighted fields.", errors }, { status: 400 });
  if (!isContactFormConfigured()) return NextResponse.json({ message: "Online sending isn't switched on yet. Your email app can send this instead." }, { status: 503 });
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [process.env.CONTACT_TO_EMAIL], reply_to: payload.email, subject: leadSubject(payload), text: leadText(payload) }),
  });
  if (!response.ok) return NextResponse.json({ message: "We couldn't send that just now. Please try again in a minute." }, { status: 502 });
  const message = payload.source === "newsletter" ? "You're on the list. The next issue comes to this address." : "Thanks. One of us will reply within one working day.";
  return NextResponse.json({ message });
}

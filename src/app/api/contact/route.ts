import { NextResponse } from "next/server";
import { gate, parseLead, processLead, readJson } from "@/lib/server/pipeline";

/** Contact form and CTA band. One pipeline: validate, Turnstile, rate limit, persist, notify, autorespond, HubSpot. */
export async function POST(request: Request) {
  const lead = parseLead(await readJson(request));
  if (!lead || (lead.source !== "contact" && lead.source !== "cta")) return NextResponse.json({ message: "We couldn't read that. Please try again." }, { status: 400 });
  const g = await gate(request, lead);
  if (g === "honeypot") return NextResponse.json({ message: "Thanks. One of us will reply within one working day." });
  if (!g.ok) return NextResponse.json(g.body, { status: g.status });
  const result = await processLead(request, lead);
  if (!result.ok) return NextResponse.json({ message: "We couldn't save or send your message just now. Your email app can send it instead.", fallback: true }, { status: 503 });
  return NextResponse.json({ message: "Thanks. One of us will reply within one working day.", redirect: lead.source === "contact" ? "/thank-you" : undefined });
}

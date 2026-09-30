import { NextResponse } from "next/server";
import { validateLead } from "@/lib/leads";
import { tooFast } from "@/lib/pipeline/core";
import { clientIp, deliverLead, parseLead, readJson, sheetPayload } from "@/lib/server/leadpath";
import { hasMx } from "@/lib/server/mx";

const THANKS = "Thanks. One of us will reply within one working day.";

/** Contact form and CTA band: validate, minimum fill time, store in Blob first, forward to the Pipeline Sheet. */
export async function POST(request: Request) {
  const raw = await readJson(request);
  const lead = parseLead(raw);
  if (!lead || (lead.source !== "contact" && lead.source !== "cta")) return NextResponse.json({ message: "We couldn't read that. Please try again." }, { status: 400 });
  const redirect = lead.source === "contact" ? "/thank-you" : undefined;
  if (lead.website || tooFast(raw.renderedAt, raw.submittedAt)) return NextResponse.json({ message: THANKS, redirect });
  const errors = validateLead(lead);
  if (Object.keys(errors).length) return NextResponse.json({ message: "Please check the highlighted fields.", errors }, { status: 400 });
  const payload = sheetPayload("lead", lead, { ip: clientIp(request), sendAutoreply: await hasMx(lead.email) });
  const result = await deliverLead(payload);
  if (!result.stored) return NextResponse.json({ message: "We couldn't save your message just now. Your email app can send it instead.", fallback: true }, { status: 503 });
  return NextResponse.json({ message: THANKS, redirect });
}

import { NextResponse } from "next/server";
import { validateLead } from "@/lib/leads";
import { subscribeOrPark, tooFast } from "@/lib/pipeline/core";
import { blobStore } from "@/lib/server/blob-store";
import { logEvent } from "@/lib/server/config";
import { parseLead, readJson, subscribe } from "@/lib/server/leadpath";

const CHECK = "Check your inbox to confirm your subscription.";

/** Newsletter: straight to MailerLite (which sends the confirmation email); parked in Blob for the cron if that fails. */
export async function POST(request: Request) {
  const raw = await readJson(request);
  const lead = parseLead({ ...raw, source: "newsletter" });
  if (!lead) return NextResponse.json({ message: "We couldn't read that. Please try again." }, { status: 400 });
  if (lead.website || tooFast(raw.renderedAt, raw.submittedAt)) return NextResponse.json({ message: CHECK });
  const errors = validateLead(lead);
  if (Object.keys(errors).length) return NextResponse.json({ message: "Please check the highlighted fields.", errors }, { status: 400 });
  const a = lead.attribution || {};
  const result = await subscribeOrPark(lead.email, { first: a.first, last: a.last }, { store: blobStore, subscribe });
  if (result.parked) logEvent("subscriber_pending", {});
  if (!result.ok) return NextResponse.json({ message: "We couldn't sign you up just now. Your email app can send the request instead.", fallback: true }, { status: 503 });
  return NextResponse.json({ message: CHECK });
}

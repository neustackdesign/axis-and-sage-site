import { NextResponse } from "next/server";
import { parseCalBooking, type CalPayload } from "@/lib/pipeline/cal";
import { verifyHexSignature } from "@/lib/pipeline/sign";
import { config, logEvent } from "@/lib/server/config";
import { deliverLead, sheetPayload } from "@/lib/server/leadpath";

/** Cal.com webhook (BOOKING_CREATED), signed with CAL_WEBHOOK_SECRET in x-cal-signature-256. Goes through the lead path as source "booking". */
export async function POST(request: Request) {
  const raw = await request.text();
  if (!config.calWebhookSecret || !verifyHexSignature(raw, request.headers.get("x-cal-signature-256") || "", config.calWebhookSecret)) {
    logEvent("cal_signature_failed", {});
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let body: CalPayload;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (body.triggerEvent && body.triggerEvent !== "BOOKING_CREATED") return NextResponse.json({ ok: true, ignored: body.triggerEvent });
  const b = parseCalBooking(body);
  if (!b) return NextResponse.json({ ok: false }, { status: 400 });
  // The sentence is the answer to the required question; other answers go to Notes; the call time is in Asia/Dubai.
  const payload = sheetPayload("lead", { source: "contact", email: b.email, name: b.name, message: b.message }, {
    source: "booking",
    sentence: b.sentence,
    booking: b.booking,
    submissionPage: "/contact#book",
  });
  // Cal.com sends the attendee its own confirmation, so there's no auto-reply; the founders get the alert.
  const result = await deliverLead(payload);
  // A 5xx makes Cal.com retry; only ask for that when even the Blob copy failed.
  return NextResponse.json({ ok: result.stored }, { status: result.stored ? 200 : 503 });
}

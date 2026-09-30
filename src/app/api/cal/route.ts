import { NextResponse } from "next/server";
import { verifyHexSignature } from "@/lib/pipeline/sign";
import { config, logEvent } from "@/lib/server/config";
import { deliverLead, sheetPayload } from "@/lib/server/leadpath";

type CalPayload = { triggerEvent?: string; payload?: { title?: string; startTime?: string; attendees?: { name?: string; email?: string }[]; responses?: Record<string, unknown> } };

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
  const p = body.payload || {};
  const attendee = p.attendees?.[0] || {};
  if (!attendee.email) return NextResponse.json({ ok: false }, { status: 400 });
  const answer = (v: unknown) => (v && typeof v === "object" && "value" in v ? String((v as { value?: unknown }).value ?? "") : String(v ?? ""));
  const notes = Object.entries(p.responses || {}).filter(([k]) => !["name", "email"].includes(k)).map(([k, v]) => `${k}: ${answer(v)}`).filter((l) => !l.endsWith(": ")).join("\n");
  const payload = sheetPayload("lead", { source: "contact", email: attendee.email, name: attendee.name, message: notes.slice(0, 4000) }, {
    source: "booking",
    sentence: p.title,
    booking: { title: p.title, startTime: p.startTime },
    sendAutoreply: false,
    submissionPage: "/contact#book",
  });
  const result = await deliverLead(payload);
  // A 5xx makes Cal.com retry; only ask for that when even the Blob copy failed.
  return NextResponse.json({ ok: result.stored }, { status: result.stored ? 200 : 503 });
}

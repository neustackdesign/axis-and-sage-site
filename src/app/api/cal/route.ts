import { after, NextResponse } from "next/server";
import { config, logFailure } from "@/lib/server/config";
import { insertLead } from "@/lib/server/db";
import { sendMail } from "@/lib/server/email";
import { syncToHubSpot } from "@/lib/server/hubspot";
import { recordConversion } from "@/lib/server/pipeline";
import { verifyHexSignature } from "@/lib/server/signing";

type CalPayload = { triggerEvent?: string; payload?: { title?: string; startTime?: string; attendees?: { name?: string; email?: string }[]; responses?: Record<string, { value?: unknown } | unknown>; metadata?: Record<string, unknown> } };

/** Cal.com webhook (BOOKING_CREATED). Signed with CAL_WEBHOOK_SECRET in the x-cal-signature-256 header. */
export async function POST(request: Request) {
  const raw = await request.text();
  if (!config.calWebhookSecret || !verifyHexSignature(raw, request.headers.get("x-cal-signature-256") || "", config.calWebhookSecret)) {
    logFailure("cal_webhook", "invalid or missing signature");
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  let body: CalPayload;
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (body.triggerEvent && body.triggerEvent !== "BOOKING_CREATED") return NextResponse.json({ ok: true, ignored: body.triggerEvent });
  const p = body.payload || {};
  const attendee = p.attendees?.[0] || {};
  if (!attendee.email) return NextResponse.json({ ok: false }, { status: 400 });
  const notes = Object.entries(p.responses || {}).map(([k, v]) => `${k}: ${typeof v === "object" && v && "value" in v ? String((v as { value?: unknown }).value ?? "") : String(v)}`).join("\n");
  const attribution = { page: "/contact#book" };
  let id: string | null = null;
  try { id = await insertLead({ source: "booking", email: attendee.email, name: attendee.name, message: notes.slice(0, 4000), booking: { title: p.title, startTime: p.startTime }, attribution }); } catch (error) { logFailure("db_booking", error); }
  await sendMail({ to: [config.notifyTo], cc: config.notifyCc, replyTo: attendee.email, subject: `Call booked: ${attendee.name || attendee.email} · ${p.startTime || ""}`, text: `${p.title || "Call"}\n${p.startTime || ""}\n${attendee.name || ""} <${attendee.email}>\n\n${notes}${id ? `\n\nLead ID: ${id}` : ""}` }, "notify_booking");
  await recordConversion("booking_complete", "cal", attribution, { leadId: id });
  after(() => syncToHubSpot({ email: attendee.email!, name: attendee.name, sentence: p.title, source: "booking" }, "call_booked"));
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { validateLead } from "@/lib/leads";
import { tooFast } from "@/lib/pipeline/core";
import { deliverLead, ipHashOf, parseLead, readJson, sheetPayload } from "@/lib/server/leadpath";
import { config } from "@/lib/server/config";

/** Rebuilds a visitor-supplied link on our own origin, keeping only the path, query and hash. */
const safeUrl = (u: unknown) => {
  if (typeof u !== "string") return undefined;
  try { const url = new URL(u); return url.pathname.startsWith("/tools/") || url.pathname === "/contact" ? `${config.siteUrl}${url.pathname}${url.search}${url.hash}`.slice(0, 4000) : undefined; } catch { return undefined; }
};

/** A tool result the visitor asked us to email. Same lead path: Blob first, the Pipeline Sheet, then Resend. */
export async function POST(request: Request) {
  const raw = await readJson(request);
  const lead = parseLead({ ...raw, source: "tool" });
  if (!lead || !lead.tool) return NextResponse.json({ message: "We couldn't read that. Please try again." }, { status: 400 });
  if (lead.website || tooFast(raw.renderedAt, raw.submittedAt)) return NextResponse.json({ stored: true, delivered: true });
  if (validateLead(lead).email) return NextResponse.json({ message: "Enter an email like name@company.com." }, { status: 400 });
  const payload = sheetPayload("tool_email", lead, {
    result: raw.result ?? null,
    shareUrl: safeUrl(raw.shareUrl),
    diagnosticUrl: safeUrl(raw.diagnosticUrl) || `${config.siteUrl}/contact?source=${encodeURIComponent(lead.tool)}#note`,
  });
  const result = await deliverLead(payload, { ipHash: ipHashOf(request) });
  if (!result.stored) return NextResponse.json({ stored: false, message: "We couldn't save that just now." }, { status: 503 });
  // `delivered` tells the visitor whether the email has gone; otherwise it's parked for the cron ("we'll email it shortly").
  return NextResponse.json({ stored: true, delivered: result.visitorMail === "sent" });
}

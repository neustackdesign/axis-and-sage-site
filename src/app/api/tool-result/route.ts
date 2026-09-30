import { after, NextResponse } from "next/server";
import { config, logFailure } from "@/lib/server/config";
import { insertToolResult, markToolEmailed } from "@/lib/server/db";
import { htmlEmail, sendMail } from "@/lib/server/email";
import { syncToHubSpot } from "@/lib/server/hubspot";
import { gate, parseLead, readJson, recordConversion } from "@/lib/server/pipeline";
import { escapeHtml } from "@/lib/text";

/** Rebuilds a visitor-supplied link on our own origin, keeping only the path, query and hash. */
const safeUrl = (u: unknown) => {
  if (typeof u !== "string") return undefined;
  try { const url = new URL(u); return url.pathname.startsWith("/tools/") || url.pathname === "/contact" ? `${config.siteUrl}${url.pathname}${url.search}${url.hash}`.slice(0, 4000) : undefined; } catch { return undefined; }
};

/** Sends a tool result to the visitor (HTML and text), records it, and notifies info@. */
export async function POST(request: Request) {
  const raw = await readJson(request);
  const lead = parseLead({ ...raw, source: "tool" });
  if (!lead || !lead.tool) return NextResponse.json({ message: "We couldn't read that. Please try again." }, { status: 400 });
  const g = await gate(request, lead);
  if (g === "honeypot") return NextResponse.json({ sent: true });
  if (!g.ok) return NextResponse.json(g.body, { status: g.status });

  const shareUrl = safeUrl(raw.shareUrl);
  const diagnosticUrl = safeUrl(raw.diagnosticUrl) || `${config.siteUrl}/contact?engagement=diagnostic#note`;
  const summary = lead.summary || "";
  let id: string | null = null;
  try { id = await insertToolResult({ tool: lead.tool, email: lead.email, result: raw.result ?? null, summary, shareUrl, attribution: lead.attribution || {} }); } catch (error) { logFailure("db_tool_result", error, { tool: lead.tool }); }

  const text = [`Your ${lead.tool} result`, "", summary, "", shareUrl ? `See it again: ${shareUrl}` : "", `Book a Diagnostic with this sentence: ${diagnosticUrl}`, "", "Axis & Sage Advisory"].filter((l, i, a) => l || a[i - 1]).join("\n");
  const html = htmlEmail({
    heading: `Your ${escapeHtml(lead.tool)} result`,
    paragraphs: [`<span style="white-space:pre-wrap;font-family:Menlo,monospace;font-size:13px;line-height:20px">${escapeHtml(summary)}</span>`, ...(shareUrl ? [`<a href="${escapeHtml(shareUrl)}" style="color:#1F1F1F">See your result again</a>`] : [])],
    action: { label: "Book a Diagnostic with this sentence", href: escapeHtml(diagnosticUrl) },
  });
  const sent = await sendMail({ to: [lead.email], subject: `Your ${lead.tool} result · Axis & Sage`, text, html }, "tool_result_visitor");
  if (sent && id) { try { await markToolEmailed(id); } catch (error) { logFailure("db_mark_tool_emailed", error); } }
  await sendMail({ to: [config.notifyTo], cc: config.notifyCc, replyTo: lead.email, subject: `Tool result (${lead.tool}) for ${lead.email}${sent ? "" : " · NOT delivered to visitor"}`, text: `${text}\n\nVisitor email ${sent ? "sent" : "FAILED"}.${id ? `\nResult ID: ${id}` : "\nNot saved to the database: see logs."}` }, "tool_result_notify");
  await recordConversion("tool_email_requested", lead.tool, lead.attribution || {}, { resultId: id, sent });
  after(() => syncToHubSpot({ email: lead.email, sentence: lead.who ? `${lead.who} ${lead.what}` : lead.tool, source: `tool: ${lead.tool}` }, "new_lead"));
  if (!sent) return NextResponse.json({ sent: false, message: "We couldn't send the email just now." }, { status: 502 });
  return NextResponse.json({ sent: true });
}

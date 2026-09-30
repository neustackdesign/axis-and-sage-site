import { NextResponse } from "next/server";
import { randomId } from "@/lib/pipeline/core";
import { forward, readJson } from "@/lib/server/leadpath";
import { logEvent } from "@/lib/server/config";

/** A completed tool: one anonymous row in the Tools tab (date, tool, answers, result, UTM source). Best effort. */
export async function POST(request: Request) {
  const raw = await readJson(request);
  if (typeof raw.tool !== "string") return new NextResponse(null, { status: 400 });
  const utmSource = typeof raw.utmSource === "string" ? raw.utmSource.slice(0, 120) : undefined;
  const ok = await forward({ type: "tool_complete", id: randomId(), createdAt: new Date().toISOString(), tool: raw.tool.slice(0, 80), result: { answers: raw.answers ?? null, result: raw.result ?? null }, utm: { first: utmSource ? { utm_source: utmSource } : undefined } }).catch(() => false);
  if (!ok) logEvent("tool_complete_forward_failed", { tool: raw.tool });
  return new NextResponse(null, { status: 204 });
}

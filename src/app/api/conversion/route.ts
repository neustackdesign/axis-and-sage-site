import { NextResponse } from "next/server";
import { sanitiseAttribution } from "@/lib/attribution";
import { checkRateLimit, clientIp } from "@/lib/server/ratelimit";
import { readJson, recordConversion } from "@/lib/server/pipeline";

/** Server-side record of tool_complete events. The conversions table is the source of truth. */
export async function POST(request: Request) {
  const raw = await readJson(request);
  if (raw.event !== "tool_complete" || typeof raw.tool !== "string") return NextResponse.json({ ok: false }, { status: 400 });
  const limit = await checkRateLimit(`conv:${clientIp(request)}`, "");
  if (!limit.ok) return NextResponse.json({ ok: false }, { status: 429 });
  await recordConversion("tool_complete", raw.tool.slice(0, 80), sanitiseAttribution(raw.attribution), typeof raw.meta === "object" ? raw.meta : undefined);
  return NextResponse.json({ ok: true });
}

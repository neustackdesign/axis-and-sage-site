import { NextResponse } from "next/server";
import { config } from "@/lib/server/config";
import { runRetry } from "@/lib/server/leadpath";

/** Daily cron (vercel.json). Vercel sends `Authorization: Bearer ${CRON_SECRET}`. */
export async function GET(request: Request) {
  if (!config.cronSecret || request.headers.get("authorization") !== `Bearer ${config.cronSecret}`) return NextResponse.json({ ok: false }, { status: 401 });
  const counts = await runRetry();
  return NextResponse.json({ ok: true, ...counts });
}

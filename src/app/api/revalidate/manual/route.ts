import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Explicit emergency full-site cache refresh, not a scheduled poller. */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Manual refresh unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }

  revalidateTag("sanity", { expire: 0 });
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, scope: "all", reason: "manual" }, { headers: { "Cache-Control": "no-store" } });
}

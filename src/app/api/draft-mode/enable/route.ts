import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/** Turns on draft mode for this browser: /api/draft-mode/enable?secret=…&redirect=/work. Fails closed without SANITY_PREVIEW_SECRET. */
export async function GET(request: NextRequest) {
  const secret = process.env.SANITY_PREVIEW_SECRET;
  const url = new URL(request.url);
  if (!secret || !process.env.SANITY_API_READ_TOKEN) return NextResponse.json({ error: "Draft preview not configured" }, { status: 503 });
  if (url.searchParams.get("secret") !== secret) return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  const target = url.searchParams.get("redirect") || "/";
  // Same-site paths only: never an open redirect.
  const path = target.startsWith("/") && !target.startsWith("//") ? target : "/";
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(path, url.origin));
}

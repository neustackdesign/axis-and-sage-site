import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { dataset, projectId } from "@/sanity/env";
import { parseContentEvent } from "@/sanity/revalidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** A signed Sanity published-content webhook. Never expose an unsigned cache purge. */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    console.error("[sanity-revalidate] SANITY_REVALIDATE_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  try {
    // Includes Content Lake propagation delay to avoid caching an older published revision.
    const { isValidSignature, body } = await parseBody<unknown>(request, secret, true);
    if (isValidSignature !== true) {
      console.warn("[sanity-revalidate] Rejected invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Headers are supplied by Sanity; never accept a correctly signed event for another dataset.
    if (request.headers.get("sanity-project-id") !== projectId || request.headers.get("sanity-dataset") !== dataset) {
      console.warn("[sanity-revalidate] Wrong Sanity project or dataset");
      return NextResponse.json({ error: "Wrong project or dataset" }, { status: 400 });
    }
    const event = parseContentEvent(body);
    if (!event) return NextResponse.json({ error: "Unsupported content event" }, { status: 400 });

    // Queries can reference other documents across many routes. Clearing both caches also
    // covers metadata, Open Graph, linked content, previous slugs and unpublishes.
    // expire: 0 guarantees a fresh server read on the next visit, not stale-while-revalidate.
    revalidateTag("sanity", { expire: 0 });
    revalidatePath("/", "layout");

    console.info("[sanity-revalidate] published content invalidated", {
      id: event._id, type: event._type, operation: request.headers.get("sanity-operation"),
      transactionId: request.headers.get("sanity-transaction-id"),
    });
    return NextResponse.json({ revalidated: true, type: event._type }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[sanity-revalidate] Failed", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}

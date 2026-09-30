import { NextResponse } from "next/server";
import { config, logFailure } from "@/lib/server/config";
import { syncToBeehiiv } from "@/lib/server/beehiiv";
import { confirmSubscriber, markSubscriberSynced } from "@/lib/server/db";
import { verifyToken } from "@/lib/server/signing";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  const email = verifyToken(token);
  if (!email) return NextResponse.redirect(`${config.siteUrl}/newsletter?confirmed=invalid`, 303);
  try { await confirmSubscriber(email); } catch (error) { logFailure("db_confirm_subscriber", error); }
  if (await syncToBeehiiv(email)) { try { await markSubscriberSynced(email); } catch (error) { logFailure("db_mark_beehiiv", error); } }
  return NextResponse.redirect(`${config.siteUrl}/newsletter?confirmed=1`, 303);
}

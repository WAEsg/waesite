import { NextResponse, type NextRequest } from "next/server";
import { trackEvent } from "@/lib/analytics";

// Lets a client component fire a server-side analytics event (e.g. a page
// view with intent, before we have a user id to attach a Server Action
// event to) without shipping a second client-side analytics SDK.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const event = typeof body?.event === "string" ? body.event : null;

  if (!event) {
    return NextResponse.json({ error: "Missing event" }, { status: 400 });
  }

  await trackEvent(event, typeof body?.distinctId === "string" ? body.distinctId : "anonymous", body?.properties);
  return NextResponse.json({ ok: true });
}

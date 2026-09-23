import "server-only";

// Same graceful-degrade idiom as getStripeClient()/verifyTurnstile() —
// callers branch on null rather than this throwing, so interview
// scheduling stays fully testable (via the manual fallback UI) before a
// real Daily.co account exists.
export function isVideoConfigured(): boolean {
  return Boolean(process.env.DAILY_API_KEY);
}

// Creates a Daily.co room for one interview and returns its hosted-UI
// URL (embedded via <iframe>, no client SDK needed for v1). Rooms expire
// a day after the interview to avoid leaving stale rooms around.
export async function createInterviewRoom(interviewId: string): Promise<string | null> {
  const apiKey = process.env.DAILY_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.daily.co/v1/rooms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: `waework-interview-${interviewId}`,
      properties: {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        enable_screenshare: true,
        enable_chat: true,
      },
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { url?: string };
  return data.url ?? null;
}

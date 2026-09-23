import "server-only";
import { PostHog } from "posthog-node";

// Same graceful-degrade idiom as Resend/Turnstile/Stripe elsewhere in this
// codebase: every call is safe to make regardless of whether analytics is
// configured — it just no-ops until POSTHOG_API_KEY is set. Uses the
// server-side SDK exclusively (not posthog-js) so every event — including
// ones that originate from a page view — goes through one server-side
// path, rather than shipping a second client bundle.
export async function trackEvent(
  event: string,
  distinctId: string,
  properties?: Record<string, unknown>
) {
  const apiKey = process.env.POSTHOG_API_KEY;
  if (!apiKey) return;

  const client = new PostHog(apiKey, {
    host: process.env.POSTHOG_HOST?.trim() || "https://us.i.posthog.com",
  });

  try {
    client.capture({ distinctId, event, properties });
  } finally {
    // Serverless/edge-style execution can end the process right after a
    // Server Action returns — flush synchronously before that happens
    // rather than relying on a background batch send.
    await client.shutdown();
  }
}

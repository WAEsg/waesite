"use client";

// Fire-and-forget client-side trigger for the /api/analytics/track route.
// `keepalive` lets the request survive a navigation that happens right
// after the call (e.g. submitting the signup form).
export function trackClientEvent(event: string, properties?: Record<string, unknown>) {
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ event, properties }),
    }).catch(() => {});
  } catch {
    // Never let analytics break the page.
  }
}

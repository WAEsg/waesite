"use client";

import Script from "next/script";

// Renders nothing (and blocks nothing) if no site key is configured yet —
// see .env.example. Cloudflare auto-renders any `cf-turnstile` div once
// its script loads, submitting the token as `cf-turnstile-response`.
export function TurnstileWidget() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (!siteKey) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />
      <div className="cf-turnstile" data-sitekey={siteKey} data-theme="dark" />
    </>
  );
}

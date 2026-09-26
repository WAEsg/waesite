// Verifies a Cloudflare Turnstile token server-side. If no secret key is
// configured (see .env.example), verification is skipped — the widget
// itself is also skipped client-side in that case, so this only matters
// once both keys are set.
export async function verifyTurnstile(token: FormDataEntryValue | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token || typeof token !== "string") {
    console.error("[turnstile] no token submitted — widget likely didn't render or didn't finish solving client-side");
    return false;
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  );
  const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };
  if (!data.success) {
    console.error("[turnstile] siteverify rejected token", data["error-codes"]);
  }
  return data.success;
}

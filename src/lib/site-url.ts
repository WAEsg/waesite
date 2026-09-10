// An env var added in a host's dashboard with no value comes through as
// an empty string, not undefined — `??` doesn't catch that (only null/
// undefined), so `new URL("")` and friends can still blow up. Treat blank
// strings as unset too.
export function getSiteUrl(fallback = "https://waework.co") {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallback;
}

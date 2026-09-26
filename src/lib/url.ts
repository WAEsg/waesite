import type { FocusEvent } from "react";
import { z } from "zod";

// Shared by every "paste a link" field (waitlist portfolio, talent
// profile resume/portfolio, hirer company website). People type
// "waework.com" or "www.waework.com" far more often than
// "https://waework.com" — native `type="url"` inputs reject the
// protocol-less versions outright, which is the wrong failure mode for
// a field like this. Normalize first, validate second.

// Domain must have at least one dot (rejects "asdf"); scheme, port and
// path/query/fragment are all optional beyond that.
const URL_PATTERN = /^https?:\/\/[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?([/?#].*)?$/i;

export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed || /^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidUrl(input: string): boolean {
  return URL_PATTERN.test(input);
}

// Normalizes an input's value in place on blur and marks it invalid
// (via setCustomValidity, which drives the browser's native inline
// validation bubble) only for genuinely malformed input — not for a
// bare domain missing "https://", since normalizeUrl already fixed
// that above. Deliberately doesn't use the `pattern` attribute: some
// browser engines mis-handle a trailing "-" inside a character class
// (e.g. `[A-Za-z0-9-]`) and silently skip pattern matching entirely,
// which would make this validation a no-op there.
export function handleUrlBlur(e: FocusEvent<HTMLInputElement>) {
  const input = e.currentTarget;
  const normalized = normalizeUrl(input.value);
  input.value = normalized;
  input.setCustomValidity(normalized && !isValidUrl(normalized) ? "Enter a valid link, e.g. waework.com" : "");
}

// Shared Zod fragment for an optional "paste a link" field — normalizes
// protocol-less input before validating, same rules as handleUrlBlur.
export const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? normalizeUrl(v) : v))
  .refine((v) => !v || isValidUrl(v), "Enter a valid URL, e.g. waework.com");

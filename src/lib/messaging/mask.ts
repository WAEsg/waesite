// Strips contact info from a message before it's stored/displayed —
// doesn't block sending, just replaces detected instances with a
// placeholder. Applies pre-match only; contract-actions.ts's message
// list components check contract existence to decide whether to still
// call this (see src/app/dashboard/_shared/messaging-actions.ts).

const PLACEHOLDER = "[contact info hidden until matched]";

// Order matters: structured patterns (URLs, platform mentions) run
// before the generic phone-number digit-run pattern. Otherwise the phone
// pattern can chew a digit run out of the middle of a URL (e.g.
// "wa.me/6591234567"), leaving the URL pattern to then mis-match against
// the leftover placeholder text instead of the original number.
const PATTERNS: RegExp[] = [
  // Email addresses.
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

  // Direct links to messaging/social platforms.
  /(?:https?:\/\/)?(?:www\.)?(?:wa\.me|t\.me|telegram\.me|instagram\.com|twitter\.com|x\.com|line\.me|skype:)\S+/gi,

  // "whatsapp/telegram/instagram/wechat/line/skype: <handle>" style
  // mentions, even without a full URL.
  /\b(whatsapp|telegram|insta(?:gram)?|wechat|line\s?id|skype)\s*[:\-]?\s*@?[\w.+-]{2,}/gi,

  // Phone numbers — a run of 7+ digits allowing spaces/dashes/dots/
  // parens and an optional leading +, so it catches most international
  // formats without also eating ordinary sentences full of small numbers.
  /(?:\+?\d[\d\s\-.()]{6,}\d)/g,

  // A bare @handle (Instagram/Twitter/Telegram-style), at least 3 chars.
  /(?<![\w@])@[\w.]{3,}/g,
];

export function maskContactInfo(text: string): string {
  let result = text;
  for (const pattern of PATTERNS) {
    result = result.replace(pattern, PLACEHOLDER);
  }
  return result;
}

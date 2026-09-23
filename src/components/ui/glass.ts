// Shared glassmorphic treatments. Dark tokens below are for the one
// intentionally-retained dark accent surface (the footer) — the *Light
// variants further down are the site-wide default. Kept centralized so
// every card/nav/form surface shares one consistent look instead of
// one-off opacity values.

export const glassCard =
  "rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl";

export const glassCardHover =
  "transition duration-200 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.09]";

export const glassPanel =
  "rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl";

// Neumorphic "resting" treatment for small controls — toggles, inputs,
// tab buttons — soft dual shadow instead of the glass card treatment.
export const neumorphicInset =
  "shadow-[inset_2px_2px_6px_rgba(0,0,0,0.35),inset_-1px_-1px_4px_rgba(255,255,255,0.04)]";

// A soft glow behind graphics/icons to lift them off the dark background.
export const glowShadow = "shadow-[0_0_30px_rgba(74,144,226,0.25)]";

// Primary CTA: Voyage Blue -> Passport Sky gradient fill, shifts on hover.
export const buttonPrimaryDark =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-voyage-blue to-passport-sky bg-[length:180%_100%] bg-left px-6 py-3 font-semibold text-frost shadow-lg shadow-voyage-blue/30 transition-[background-position,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-right hover:shadow-passport-sky/30 active:translate-y-0";

export const buttonSecondaryDark =
  "inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-6 py-3 font-semibold text-frost backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.09] active:translate-y-0";

export const buttonPrimaryDarkSm =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-voyage-blue to-passport-sky bg-[length:180%_100%] bg-left px-4 py-2.5 text-sm font-semibold text-frost shadow-md shadow-voyage-blue/25 transition-[background-position,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-right active:translate-y-0";

// A single load-bearing phrase within a paragraph — calm underline accent
// plus a small size/weight bump. Used at most once per section.
export const emphasisUnderline =
  "font-semibold text-frost underline decoration-passport-sky/50 decoration-2 underline-offset-4";

// ============================================================
// Light-theme equivalents — the site-wide default. The dark tokens
// above are kept for the one intentional dark accent surface (the
// footer) rather than deleted.
// ============================================================

// The prototype's ".card" is a plain solid-white card — no translucency,
// no backdrop-blur. Matches exactly: bg white, 1px border in --color-line,
// 24px radius (--r-lg).
export const glassCardLight = "rounded-2xl border border-line bg-white";

// ".card--lift" on hover: lift + shadow-2 + border brightens to --mist.
// Actual CSS transition timing: transform/box-shadow .45s, border-color .3s.
export const glassCardLightHover =
  "card-hover transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-2 hover:border-mist";

export const glassPanelLight = "rounded-2xl border border-line bg-white";

// Soft inset treatment for inputs/controls on a white surface — much
// lighter than neumorphicInset, which would look muddy off-black on
// paper-white.
export const neumorphicInsetLight =
  "shadow-[inset_1px_1px_3px_rgba(30,79,163,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.6)]";

// Soft blue-tinted lift behind graphics/icons on a light background,
// in place of glowShadow's dark-mode glow.
export const glowShadowLight = "shadow-[0_0_30px_rgba(74,144,226,0.15)]";

export const emphasisUnderlineLight =
  "font-semibold text-ink-navy underline decoration-passport-sky/60 decoration-2 underline-offset-4";

// Shared glassmorphic + dark-theme treatments for the marketing site.
// Kept centralized so every card/nav/form surface shares one consistent
// "frosted glass on dark navy" look instead of one-off opacity values.

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

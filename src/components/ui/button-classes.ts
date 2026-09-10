// Shared button treatments so every CTA across the site shares the same
// elevation, radius, and press feedback instead of ad hoc one-off classes.
export const buttonPrimary =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-voyage-blue to-passport-sky bg-[length:180%_100%] bg-left px-6 py-3 font-semibold text-paper-white shadow-md shadow-voyage-blue/20 transition-[background-position,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-right hover:shadow-lg hover:shadow-voyage-blue/25 active:translate-y-0 active:shadow-md";

export const buttonSecondary =
  "inline-flex items-center justify-center rounded-xl border border-ink-navy/15 bg-paper-white px-6 py-3 font-semibold text-ink-navy transition duration-200 hover:-translate-y-0.5 hover:border-voyage-blue hover:text-voyage-blue hover:shadow-md active:translate-y-0";

export const buttonPrimarySm =
  "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-voyage-blue to-passport-sky bg-[length:180%_100%] bg-left px-4 py-2 text-sm font-semibold text-paper-white shadow-sm shadow-voyage-blue/20 transition-[background-position,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-right hover:shadow-md active:translate-y-0";

export const buttonSecondarySm =
  "inline-flex items-center justify-center rounded-xl border border-ink-navy/15 px-4 py-2 text-sm font-semibold text-ink-navy transition duration-200 hover:-translate-y-0.5 hover:border-voyage-blue hover:text-voyage-blue active:translate-y-0";

export const cardHover =
  "transition duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-navy/5";

// Shared button treatments — exact spec ported from the prototype's
// `.btn`/`.btn--primary` (min-height 48px, 1.5px border, pill radius,
// font 800 body-font, lift + shadow-1 on hover, scale(.98) on press).
export const buttonPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-voyage-blue bg-voyage-blue px-[22px] py-3 font-extrabold text-white shadow-[0_6px_18px_rgba(30,79,163,0.26)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-voyage-blue-700 hover:bg-voyage-blue-700 hover:shadow-[0_10px_26px_rgba(30,79,163,0.34)] active:translate-y-0 active:scale-[0.98]";

export const buttonSecondary =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-mist bg-white px-[22px] py-3 font-extrabold text-ink-navy shadow-none transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-passport-sky hover:shadow-1 active:translate-y-0 active:scale-[0.98]";

export const buttonPrimarySm =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-voyage-blue bg-voyage-blue px-4 text-[0.9375rem] font-extrabold text-white shadow-[0_6px_18px_rgba(30,79,163,0.26)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-voyage-blue-700 hover:bg-voyage-blue-700 active:translate-y-0 active:scale-[0.98]";

export const buttonSecondarySm =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-mist bg-white px-4 text-[0.9375rem] font-extrabold text-ink-navy transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-passport-sky active:translate-y-0 active:scale-[0.98]";

// Ghost variant — transparent, voyage-blue text, cloud-blue fill on
// hover. Matches `.btn--ghost`.
export const buttonGhost =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border-[1.5px] border-transparent bg-transparent px-[22px] py-3 font-extrabold text-voyage-blue transition-colors duration-200 hover:bg-cloud-blue";

export const buttonGhostSm =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-transparent bg-transparent px-4 text-[0.9375rem] font-extrabold text-voyage-blue transition-colors duration-200 hover:bg-cloud-blue";

// For dark bands (footer, "Where to next?") — transparent, white text and
// a translucent white border that solidifies on hover. Matches
// `.btn--outline-light.btn--sm`.
export const buttonOutlineLightSm =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-[1.5px] border-white/45 bg-transparent px-4 text-[0.9375rem] font-extrabold text-white transition-[background-color,border-color] duration-200 hover:border-white hover:bg-white/10";

export const cardHover =
  "transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1.5 hover:shadow-2 hover:border-mist";

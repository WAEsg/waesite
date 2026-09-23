# WaeWork — Brand & Design Reference

Source of truth: the design tokens actually implemented in `src/app/globals.css` and `src/components/ui/`, ported exactly from the approved prototype. Use this file to keep brand-voice/visual work consistent across chats — paste it in as context when asking Claude to write copy, design assets, or review anything customer-facing.

## Who we are

WaeWork is a marketplace connecting hirers with identity-verified remote talent, worldwide. Built by **WAE (We Are Everywhere)**, headquartered in Singapore. Core promise: both sides verified (Stripe Identity), payment held and released on a schedule that matches how the work happens (Stripe Connect), neutral dispute support. Talent never pays to join, apply, or be placed.

**Positioning line:** "Great talent isn't confined to one postcode."

## Voice

- Plain, confident, slightly editorial — never hypey or full of exclamation marks.
- States facts and mechanisms directly ("Funds are held via Stripe Connect, not paid out upfront") rather than vague reassurance ("Your money is safe!").
- Short sentences. Specific numbers over vague claims (S$45/month, not "affordable").
- Talks to "hirers" and "Talent Partners" — never "freelancers," "workers," or "clients" alone.

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `voyage-blue` | `#1E4FA3` | Primary brand color — buttons, links, active states |
| `voyage-blue-700` | `#183F84` | Primary hover/pressed state |
| `passport-sky` | `#4A90E2` | Secondary accent — underlines, icon fills, gradients |
| `ink-navy` | `#172B4D` | Primary text color |
| `slate` | `#4B5C7B` | Secondary/muted text — **the single most important token**; never approximate with `ink-navy` at reduced opacity |
| `line` | `#DCE7F7` | Default border color |
| `mist` | `#C9DDF7` | Hover border / secondary border |
| `field-line` | `#6F86AD` | Form input borders |
| `cloud-blue` | `#E4EEFD` | Icon badge backgrounds, active nav pills |
| `frost` | `#F2F6FD` | Section band backgrounds (alternating with white) |
| `paper-white` | `#FBFCFE` | Page background |
| `deep-navy` | `#0F2A5C` | Dark band background (footer, "Where to next?" CTA bands) |
| `success` / `success-bg` | `#17753F` / `#E5F6EC` | Verified states, positive ticks |
| `alert` / `alert-bg` / `alert-line` | `#9A5B00` / `#FFF3DC` / `#F5C56B` | Warnings, "Early access" badges |
| `error` / `error-bg` | `#C8343A` / `#FDECEC` | Errors only |

**Rule of thumb:** never use an opacity-modified `ink-navy` (e.g. `text-ink-navy/70`) for secondary text — always the dedicated `slate` token. This was the single biggest recurring visual drift found when auditing the site against source.

## Typography

- **Display / headings:** Bricolage Grotesque, weight 800 (extrabold). Tight tracking (`-0.03em` on hero-scale, `-0.025em` on section h2, `-0.02em` on h3).
- **Body:** Nunito, weights 400–800.
- **Mono (labels, eyebrows, stats, route-style text):** B612 Mono, weights 400/700. Always uppercase, `0.06–0.16em` letter-spacing depending on size.
- **Heading scale (fluid via `clamp()`):**
  - Display/hero: `clamp(2.4rem, 4.6vw + 1rem, 4.4rem)`, line-height 1.02
  - H2: `clamp(1.7rem, 2.2vw + 1rem, 2.6rem)`, line-height 1.08
  - H3: fixed `1.25rem`
  - Lede paragraph: `clamp(1.0625rem, 0.45vw + 1rem, 1.25rem)`, line-height 1.55

## Signature components

- **Eyebrow label** — small mono uppercase label, optional leading dash, `voyage-blue` (or `#9CC2FF` on dark bands).
- **"Boarding pass" chip** (`.pass`) — the site's signature illustrative element: white card, `line` border, 14px radius, mono font throughout, bold route text with a dotted separator, non-bold meta line, a green icon stub with a dashed left border. Used for all "example match," "day 0→30," floating illustrative cards.
- **Badge-ico** — icon in a rounded-14px square, `cloud-blue` bg / `voyage-blue` icon at rest; on card hover, rotates -8°, scales 1.08, and inverts to solid `voyage-blue` bg / white icon.
- **Buttons** — fully pill-shaped (`rounded-full`), 1.5px border, extrabold text. Primary: solid `voyage-blue` fill with a soft blue shadow, lifts 2px + darkens on hover. Secondary: white fill, `mist` border, lifts on hover. Ghost: transparent, `voyage-blue` text, `cloud-blue` fill on hover.
- **"Verified" stamp** — double-border rubber-stamp look, mix-blend-multiply, rotated -7°, mono uppercase, colored by context (`voyage-blue` default, `success` green for a completed verification).
- **Chips** — pill, mono, bold, uppercase, tracked. Tone variants: neutral (white + inset line), success (green), alert (amber, used for "Early access"), plain (white + inset border).
- **Cards** — solid white, `line` border, 24px radius, no shadow at rest. On hover (`.card-hover`): lifts 6px, `shadow-2`, border brightens to `mist`.
- **"Where to next?" band** — closes nearly every page: dark navy band, one solid white primary card + one-or-two ghost (white-alpha) secondary cards, each with a bold title + arrow that nudges right on hover.

## Shadows & radius

- `shadow-1`: `0 1px 2px rgba(15,42,92,.06), 0 4px 14px rgba(15,42,92,.06)` — resting elevation
- `shadow-2`: `0 2px 4px rgba(15,42,92,.06), 0 16px 40px rgba(15,42,92,.13)` — hover/floating elevation
- Radius scale: `sm` 10px, `md` 16px, `lg`/card 24px, pill 999px

## Motion

- Standard ease: `cubic-bezier(.16,1,.3,1)` (ease-out)
- Spring ease (pops, badges): `cubic-bezier(.34,1.56,.64,1)`
- In-out ease (accordions, tab switches): `cubic-bezier(.65,0,.35,1)`
- Reveal-on-scroll: fade/slide up 24-28px, 0.6-0.8s, staggered ~70-120ms per item
- Idle float (illustrative cards): 7s ease-in-out infinite bob, ±10px
- All motion respects `prefers-reduced-motion`

## What to avoid

- Glassmorphism / translucency / backdrop-blur on cards — the brand is solid, clean white cards with crisp borders, not frosted glass.
- Generic Tailwind blues (`blue-600` etc.) — always the named tokens above.
- Sentence-case labels where the source uses mono-uppercase eyebrow/chip styling.
- Rounded-xl (12px) corners on primary cards — the brand radius for cards is 24px.

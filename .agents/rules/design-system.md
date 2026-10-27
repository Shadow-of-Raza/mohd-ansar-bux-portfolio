---
trigger: glob
globs: "src/**/*.tsx, src/**/*.css"
description: "Design tokens, colour, typography, layout and visual rules for any markup or styling in the portfolio."
---

# Design system rules

Full spec: @docs/context/03-design-system.md. Read the relevant section before styling anything new.

## Colour

- Page canvas is the persistent **space background** (`space` `#030010` + 4-point nebula + starfield); `body` is transparent.
- Allowed colour utilities come only from tokens in `src/app/globals.css`:
  - base: `space`, `void`, `night`, `navy`, `royal`, `electric`, `white`;
  - space: `nebula-solar`, `nebula-cyan`, `nebula-blue`, `nebula-violet`, `star`, `star-glow`;
  - derived: `surface-1`, `surface-2`, `electric-hover`, `electric-400`, `electric-300`, `electric-200`;
  - semantic: `fg`, `fg-muted`, `fg-subtle`, `line`, `line-strong`;
  - also `transparent` and `current`.
- No hex/rgb values in components and no arbitrary colour classes (`bg-[#…]`). If a colour seems missing, stop and ask; don't add one.
- Text hierarchy:
  - `text-fg` for headings;
  - `text-fg-muted` for body;
  - `text-fg-subtle` for meta (the lowest allowed for text). Contrast is measured against the brightest nebula areas.
- Accent text uses `text-electric-300`. `electric` is only for fills, lines, focus rings and glows, never for text on dark.
- `electric-400` is for large text (≥ 24 px) only.
- Header scrolled: `bg-space/30 backdrop-blur-md border-b border-line`. Footer: transparent root. Sticky bars: `bg-space/50 backdrop-blur-md border-line`.
- Errors use `electric-200` plus an alert icon. There is no red.

## Typography

- Use the type utilities, not ad-hoc sizes: `text-display-2xl`, `text-display-xl`, `text-display-lg`, `text-heading`, `text-title`, `text-lead`, `text-body`, `text-small`, `text-label`, `text-micro`.
- `font-display` (Archivo Black): h1–h3 only, never below 24 px, never for paragraphs.
- `font-body` (Abhaya Libre): minimum 18 px for paragraphs, line length ≤ 68ch.
- `font-label` (Alegreya SC): nav, buttons, chips, badges, eyebrows, dates. It is already small caps, so don't add `uppercase`.
- `font-accent` (Averia Serif Libre): one italic accent word per heading.
  - It comes from `*word*` in JSON, rendered via `renderAccent()` in `src/lib/utils/format.ts`.
  - Style: `font-accent italic font-normal text-electric-300`.
- Taglines, summaries and other supporting text always use font-body; font-accent is ONLY for the one *accent* word inside a heading.

## Layout & shape

- Use the `Container` component: max width 1440 px, padding `clamp(1.25rem, 4vw, 4rem)`.
- Use a 12-column grid. Prefer **asymmetric** compositions (e.g. heading in cols 1–5, content in cols 7–12).
- Section vertical padding is `clamp(5rem, 12vw, 10rem)`. The hero is `100svh` (min 640 px).
- Radius:
  - buttons `rounded-sm`;
  - cards `rounded-md`;
  - media `rounded-lg`;
  - chips and badges `rounded-full`;
  - never above 16 px.
- Elevation comes from borders and glow, not drop shadows:
  - resting card: `bg-surface-1 border border-line`;
  - hover: `border-electric/40` plus the royal glow (`03 §7`).
- At most one ambient glow in view. Backdrop blur only on the scrolled header.
- Follow the component specs in `03 §10` exactly (button heights, chip sizes, badge styles, input styles).

## Media & icons

- Images: `next/image` with `width`/`height` from JSON and a `sizes` attribute. The LCP image gets `priority`. Never use a raw `<img>`.
- Photos are slightly desaturated (`saturate(0.85) contrast(1.05)`).
- UI icons: `lucide-react`, `strokeWidth={1.5}`, 18–20 px, `currentColor`.
- Skill logos: `/icons/skills/{id}.svg`, monochrome at 70 % by default; brand colour fades in on hover/focus (300 ms).
- No emoji anywhere in the UI.

## Accessibility (always)

- Visible `:focus-visible` on every interactive element.
- Touch targets ≥ 44 × 44 px.
- One `h1` per page, with headings in order. Semantic landmarks.
- External links: `target="_blank" rel="noopener noreferrer"` plus visually hidden "(opens in new tab)".
- Hover-only info must also work on focus and tap.

## Anti-"AI look" (`03 §11`)

- Avoid: centred-everything layouts, gradient blobs, glassmorphism stacks, gradient text, identical icon-in-circle card rows, "Hi, I'm X 👋".
- Keep: numbered eyebrows (`01 — Services`), hairline dividers, strong scale contrast, grain overlay, real photos.

# 03 — Design System (Theme, Colours, Fonts)

## 1. Direction

**"Night editorial."** A near-black stage, big confident type, one electric-blue accent used sparingly, hairline structure, real photography, and light that comes from _glow_ rather than shadows. Think premium product launch page meets printed magazine — not a dashboard and not a template.

Three words to check every screen against: **dark, precise, human.**

- _Dark_ — the page is `night`, not grey. Colour is rare and therefore meaningful.
- _Precise_ — strict grid, consistent spacing, hairline borders, aligned baselines.
- _Human_ — editorial serif accents, real photos, asymmetric layouts, specific copy.

**Single theme.** There is no light mode. `color-scheme: dark` is set on `<html>`.

---

## 2. Palette

### Base palette (provided)

| Token      | Hex       | Role                                                                          |
| ---------- | --------- | ----------------------------------------------------------------------------- |
| `void`     | `#000000` | Deepest layer: footer base, image letterboxing, 3D background fade            |
| `night`    | `#080616` | **Page background** — the default canvas                                      |
| `navy`     | `#1A1953` | Raised surfaces at full strength, popovers, active states, strong borders     |
| `royal`    | `#162E93` | Secondary accent: glows, gradients, pressed states, timeline track            |
| `electric` | `#2F2FE4` | **Primary accent**: primary buttons, active indicators, focus, key highlights |
| `white`    | `#FFFFFF` | Primary text and icons                                                        |

### Derived shades (only these — nothing else)

| Token            | Hex       | Derived from          | Use                                                           |
| ---------------- | --------- | --------------------- | ------------------------------------------------------------- |
| `surface-1`      | `#0D0B25` | night → navy 25 %     | Cards, inputs                                                 |
| `surface-2`      | `#111035` | night → navy 50 %     | Card hover, chips, header background                          |
| `electric-hover` | `#4E4EE8` | electric + 15 % white | Primary button hover                                          |
| `electric-400`   | `#5F5FEA` | electric tint         | Large text (≥ 24 px) accents only                             |
| `electric-300`   | `#8F8FF1` | electric tint         | **Accent text** on dark (links, italic accent words, numbers) |
| `electric-200`   | `#C1C1F7` | electric tint         | Subtle highlighted text, selection text                       |

Opacity steps of `white` are used for text hierarchy and lines (see §3). Opacity steps of `electric`/`royal` are used for glows.

### Colour proportion (per screen)

```
night/void ≈ 75 %  ·  surfaces & lines ≈ 15 %  ·  white text ≈ 8 %  ·  electric/royal ≈ 2 %
```

If a screen looks "blue", there is too much accent. The accent should feel like a light source, not a paint colour.

---

## 3. Tokens in Tailwind v4

`src/app/globals.css`:

```css
@import "tailwindcss";

/* 1) Remove Tailwind's default colour palette so only our tokens exist */
@theme {
  --color-*: initial;

  /* base */
  --color-void: #000000;
  --color-night: #080616;
  --color-navy: #1a1953;
  --color-royal: #162e93;
  --color-electric: #2f2fe4;
  --color-white: #ffffff;

  /* derived */
  --color-surface-1: #0d0b25;
  --color-surface-2: #111035;
  --color-electric-hover: #4e4ee8;
  --color-electric-400: #5f5fea;
  --color-electric-300: #8f8ff1;
  --color-electric-200: #c1c1f7;

  /* semantic text & lines (white with alpha) */
  --color-fg: #ffffff;
  --color-fg-muted: rgb(255 255 255 / 0.68);
  --color-fg-subtle: rgb(255 255 255 / 0.55); /* lowest allowed for text */
  --color-line: rgb(255 255 255 / 0.08);
  --color-line-strong: rgb(255 255 255 / 0.16);

  /* radius */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 10px;
  --radius-lg: 16px;

  /* easing (shared with motion tokens in 04) */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
}

/* 2) Fonts come from next/font CSS variables (see §5) */
@theme inline {
  --font-display: var(--font-archivo-black);
  --font-body: var(--font-abhaya-libre);
  --font-label: var(--font-alegreya-sc);
  --font-accent: var(--font-averia-serif-libre);
}

/* 3) Base */
@layer base {
  html {
    color-scheme: dark;
    background: var(--color-night);
  }
  body {
    background: var(--color-night);
    color: var(--color-fg);
    font-family: var(--font-body);
    font-size: 1.125rem;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
  }
  ::selection {
    background: var(--color-electric);
    color: var(--color-white);
  }
  :focus-visible {
    outline: 2px solid var(--color-electric-300);
    outline-offset: 3px;
    border-radius: var(--radius-xs);
  }
}
```

Resulting classes: `bg-night`, `bg-surface-1`, `text-fg-muted`, `border-line`, `text-electric-300`, `font-display`, `font-label`, `rounded-md`, etc. `bg-transparent` and `currentColor` utilities still work.

**Rule for the agent:** never write hex values or arbitrary colour classes in components. If a colour is missing, add it here first — and question whether it's really needed.

---

## 4. Contrast & usage rules

Measured against `night` (#080616) unless noted. WCAG AA: 4.5:1 normal text, 3:1 large text (≥ 24 px, or ≥ 18.7 px bold) and UI parts.

| Foreground               | On       | Ratio  | Allowed for                                                                         |
| ------------------------ | -------- | ------ | ----------------------------------------------------------------------------------- |
| `white`                  | night    | ~20:1  | Everything                                                                          |
| `fg-muted` (white 68 %)  | night    | ~9:1   | Body copy, descriptions                                                             |
| `fg-subtle` (white 55 %) | night    | ~5.5:1 | Meta text, captions, dates                                                          |
| white 40 %               | night    | ~3.8:1 | ❌ Not for text. Decorative only                                                    |
| `electric-300`           | night    | ~7:1   | Accent text, links, italic accent words                                             |
| `electric-400`           | night    | ~4.1:1 | Large text only                                                                     |
| `electric` (#2F2FE4)     | night    | ~2.5:1 | ❌ **Never as text colour on dark.** Fills, lines, glows, focus rings at 2 px+ only |
| `white`                  | electric | ~8:1   | Primary button label ✅                                                             |
| `white`                  | royal    | ~11:1  | Badges, pressed buttons ✅                                                          |
| `white`                  | navy     | ~16:1  | Popovers, active chips ✅                                                           |

**Where each accent goes**

| Use `electric` for                                                                                                              | Use `royal` for                                                                        | Never                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Primary button fill, active nav indicator, focus ring, timeline progress, filter "on" state, cursor ring, 1 key word per screen | Ambient glows behind hero/3D/cards, timeline track, pressed states, status badge fills | Body text, large background areas, multi-colour gradients, gradient text on paragraphs |

---

## 5. Typography

### Roles

| Font                   | Role                                                                                | Weights                 | Rules                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Archivo Black**      | Display: hero name, page titles, section titles, big numbers                        | 400 (only weight)       | Uppercase or sentence case, tight leading, slight negative tracking. Never below 24 px. Never for paragraphs |
| **Abhaya Libre**       | Body: paragraphs, card text, descriptions, form text                                | 400, 500, 600, 700      | Min 18 px (it renders small), line-height 1.6–1.75, max 68 ch per line. 700 for card titles (h4)             |
| **Alegreya SC**        | Labels & UI: eyebrows, nav, buttons, chips, badges, dates, meta, table labels       | 400, 500, 700           | Small caps already — don't add `uppercase`. Letter-spacing 0.04–0.08 em                                      |
| **Averia Serif Libre** | Accent: one italic emphasised word/phrase in a heading, pull quotes, signature line | 300, 400, 700 + italics | Max **one** accent phrase per heading, coloured `electric-300`. Never body copy, never UI                    |

Signature pattern for section titles:

```
SELECTED  *work*           ← Archivo Black + Averia Serif Libre italic
```

Data supports this with `*asterisks*` in title strings (see 05 §7.4), rendered as `<em className="font-accent italic font-normal text-electric-300">`.

### Loading (`src/lib/fonts.ts`)

```ts
import { Archivo_Black, Abhaya_Libre, Alegreya_SC, Averia_Serif_Libre } from "next/font/google";

export const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-black",
});
export const abhayaLibre = Abhaya_Libre({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-abhaya-libre",
});
export const alegreyaSC = Alegreya_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-alegreya-sc",
});
export const averiaSerif = Averia_Serif_Libre({
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-averia-serif-libre",
});

export const fontVariables = [archivoBlack, abhayaLibre, alegreyaSC, averiaSerif]
  .map((f) => f.variable)
  .join(" ");
```

Apply `fontVariables` on `<html className={fontVariables}>`.

### Fluid type scale

| Token         | Size (`clamp`)                  | Line-height | Tracking | Font      | Use                           |
| ------------- | ------------------------------- | ----------- | -------- | --------- | ----------------------------- |
| `display-2xl` | `clamp(3.5rem, 11vw, 11rem)`    | 0.88        | -0.02em  | display   | Hero name                     |
| `display-xl`  | `clamp(2.75rem, 7vw, 6rem)`     | 0.92        | -0.015em | display   | Page `h1`                     |
| `display-lg`  | `clamp(2.25rem, 5vw, 4.25rem)`  | 0.95        | -0.01em  | display   | Section `h2`                  |
| `heading`     | `clamp(1.5rem, 2.4vw, 2.25rem)` | 1.1         | -0.005em | display   | `h3`, service titles          |
| `title`       | `1.375rem`                      | 1.3         | 0        | body 700  | Card titles `h4`              |
| `lead`        | `clamp(1.25rem, 1.6vw, 1.5rem)` | 1.55        | 0        | body 400  | Intros                        |
| `body`        | `1.125rem`                      | 1.7         | 0        | body 400  | Paragraphs                    |
| `small`       | `1rem`                          | 1.6         | 0        | body 400  | Secondary text                |
| `label`       | `0.875rem`                      | 1.2         | 0.06em   | label 500 | Eyebrows, nav, buttons, chips |
| `micro`       | `0.75rem`                       | 1.2         | 0.08em   | label 500 | Badges, tiny meta             |

Define these as utilities in `globals.css` with `@utility text-display-2xl { … }` etc., so components use `text-display-lg` rather than ad-hoc sizes.

---

## 6. Layout & spacing

- **Container:** `max-width: 1440px`, horizontal padding `clamp(1.25rem, 4vw, 4rem)`. Full-bleed elements (hero, marquee, footer wordmark) break out deliberately.
- **Grid:** 12 columns, gap `1.5rem` (mobile 4 cols, tablet 8 cols). Layouts are **asymmetric by default** — e.g. heading in cols 1–5, content in cols 7–12.
- **Section rhythm:** vertical padding `clamp(5rem, 12vw, 10rem)`. Hero is `100svh` (min 640 px).
- **Spacing scale:** Tailwind default 4 px scale; prefer 2, 3, 4, 6, 8, 12, 16, 24, 32.
- **Breakpoints:** Tailwind defaults (`sm 640`, `md 768`, `lg 1024`, `xl 1280`, `2xl 1536`). Full nav at `xl`.
- **Section anatomy:**
  ```
  01 — SERVICES                        ← Eyebrow (Alegreya SC, fg-subtle, number in electric-300)
  WHAT I *build*                       ← h2 display-lg with one accent word
  One-line intro in lead size…         ← fg-muted, max 52ch
  ───────────────────────────────────  ← optional hairline (line)
  [content]
  ```

## 7. Shape, borders & elevation

- **Radius:** small and sharp. Buttons `rounded-sm`, cards `rounded-md`, large media `rounded-lg`, chips/badges `rounded-full`. Never above 16 px.
- **Borders:** 1 px `line` for structure, `line-strong` on hover/active. Borders replace shadows.
- **Elevation on dark = light, not shadow:**
  - Resting card: `bg-surface-1 border border-line` + inner top highlight `inset 0 1px 0 rgb(255 255 255 / 0.04)`.
  - Hover: `border-electric/40` + glow `0 24px 60px -24px rgb(22 46 147 / 0.6)` + cursor spotlight (see 04).
  - Popovers: `bg-navy border-line-strong`.
- **Dividers:** hairlines that span the container; section numbers sit on them.

## 8. Texture, light & imagery

- **Grain overlay:** fixed full-screen SVG noise, `opacity 0.035`, `mix-blend-mode: overlay`, `pointer-events: none`. This single detail removes the flat "generated" look.
- **Ambient glow:** soft radial `royal` → transparent behind the hero object and occasionally behind a section heading. Max opacity 35 %. Never more than one glow in view.
- **Photography:** real photos only (no stock/AI people). Portrait 4:5. Treat with slight desaturation (`saturate(0.85) contrast(1.05)`) so they sit in the palette; full colour on hover is allowed.
- **Project covers:** screenshots on a `navy`/`surface-2` plate with generous padding, or full-bleed 16:10. Consistent treatment across all projects.
- **Image reveals:** clip-path masks (see 04), never plain fade-ins for large media.

## 9. Iconography

- **UI icons:** Lucide, `stroke-width 1.5`, 18–20 px, `currentColor`.
- **Skill logos:** SVGs in `public/icons/skills/{id}.svg`. Default state: **monochrome white at 70 %** (`grayscale` + `brightness` filter or a mono variant). Hover/focus: original brand colour fades in over 300 ms. This keeps the palette intact while honouring real logos.
- **Social icons:** monochrome, same hover behaviour as links.
- No emoji in UI.

## 10. Component visual specs

| Component                     | Spec                                                                                                                                                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Button — primary**          | `bg-electric text-white`, height 48 px, `px-6`, `rounded-sm`, `font-label text-label`. Hover `bg-electric-hover` + text roll (04). Pressed `bg-royal`. Optional trailing arrow icon that nudges 4 px on hover             |
| **Button — secondary**        | Transparent, `border border-line-strong`, white text. Hover border `electric`, subtle `surface-2` fill                                                                                                                    |
| **Link — inline**             | `text-electric-300`, underline drawn on hover (scaleX from left)                                                                                                                                                          |
| **Chip (tech)**               | `bg-surface-2 border border-line rounded-full px-3 h-8`, logo 14 px + `font-label text-micro`. Active (filter on): `bg-navy border-electric`                                                                              |
| **Badge (status/type)**       | `rounded-full px-2.5 h-6 font-label text-micro`. _Pursuing / Present_: `bg-royal` + pulsing dot. _Open source_: `border border-electric/50 text-electric-200`                                                             |
| **Card**                      | `bg-surface-1 border border-line rounded-md p-6 md:p-8`. Hover lift `-4px`, border + glow + spotlight. Whole card clickable via stretched link; nested links sit above it (`relative z-10`)                               |
| **Input / textarea / select** | `bg-surface-1 border border-line rounded-sm h-12 px-4`, label above in `font-label text-label text-fg-subtle`. Focus: `border-electric` + focus ring. Error: message in `electric-200` with an icon (don't introduce red) |
| **Popover (skill usage)**     | `bg-navy border border-line-strong rounded-md p-4 w-64`, arrow, max 5 items then "+N more"                                                                                                                                |
| **Timeline**                  | Track 1 px `royal`; progress line 2 px `electric` (scroll-scrubbed); nodes 10 px rings that fill `electric` when active                                                                                                   |
| **Header**                    | 72 px tall (64 mobile). Scrolled: `bg-night/70 backdrop-blur-md border-b border-line`                                                                                                                                     |

> **Error colour note:** the palette has no red. Errors use `electric-200` text + an alert icon + clear wording. If you want a dedicated error colour later, add it to §2 deliberately.

## 11. "Not AI-generated" checklist

Before accepting any screen, it must pass all of these:

- [ ] No centred-everything layout; at least one asymmetric composition per page.
- [ ] No purple/blue gradient blobs floating in the background; one ambient glow max.
- [ ] No glassmorphism stacks (blur is for the header only).
- [ ] No three identical cards with an icon-in-a-circle on top as the only idea — vary scale, numbering, or layout.
- [ ] No gradient text on headings; accent comes from the Averia italic word.
- [ ] No emoji, no "Hi, I'm X 👋", no "passionate developer".
- [ ] Real photos and real screenshots; consistent image treatment.
- [ ] Numbered sections and hairline structure are present.
- [ ] Typography has strong scale contrast (huge display vs. small labels).
- [ ] Grain overlay is on.
- [ ] Every animation has a purpose (reveals content, gives feedback, or guides attention).

## 12. Accessibility baseline

- Contrast per §4. Focus visible on everything interactive.
- Touch targets ≥ 44 × 44 px. Hover-only information (skill usage) also available via focus and tap.
- Text resizes to 200 % without loss. No text baked into images.
- `prefers-reduced-motion` honoured (see 04 §7).

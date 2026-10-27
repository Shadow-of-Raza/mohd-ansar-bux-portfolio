# 04 — Motion, 3D, Effects & Transitions

## 1. Principles

"Cinematic" means **weight, timing and restraint** — few large, well-timed moves rather than many small twitchy ones.

1. **Purpose first.** Every animation reveals content, gives feedback, or directs attention. Otherwise cut it.
2. **One hero moment per page.** Home: the 3D hero. Inner pages: the page-title reveal. Everything else supports it.
3. **Slow in, confident out.** Long expo-out easings; no bounce, no elastic, no spring overshoot on layout.
4. **Transform & opacity only** (plus `clip-path` for image reveals). Never animate `width`, `height`, `top`, `left`, `margin` or box-shadow size on scroll.
5. **Animate once.** Reveal-on-scroll runs once per element; scrolling back up doesn't replay it.
6. **Smooth, never hijacked.** Lenis smooths the wheel; it never snaps, never blocks, never changes scroll distance. Max one pinned sequence per page.
7. **Reduced motion is a first-class design**, not an afterthought (§7).

---

## 2. Library ownership

Each library has a clear job. **Never animate the same element with two libraries.**

| Library                      | Owns                                                                                                                                                                             | Doesn't do                          |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Lenis**                    | Smooth scrolling, programmatic `scrollTo` (anchors, back-to-top), scroll velocity value                                                                                          | Any element animation               |
| **GSAP + ScrollTrigger**     | Scroll-_linked_ motion: scrubbed timelines, pinning, parallax, timeline line drawing, horizontal scroll, preloader timeline                                                      | Hover/state animations              |
| **GSAP SplitText**           | Splitting headings into lines/words/chars for masked reveals                                                                                                                     | —                                   |
| **Motion** (`motion/react`)  | State & interaction: hover, tap, `AnimatePresence` (menus, popovers, filters), `layout` animations, header show/hide, page-enter in `template.tsx`, simple `whileInView` reveals | Scrubbed or pinned scroll sequences |
| **Canvas 2D (Starfield)**    | Global starfield canvas: frame-rate independent rAF loop, scroll sampled once per frame, 3 depth layers, 30 fps cap on light devices                                            | 3D mesh rendering                   |
| **React Three Fiber / drei** | The hero 3D scene only (rendered with `alpha: true` over the space background)                                                                                                   | DOM animation                       |
| **CSS**                      | Underline draws, colour/border transitions, grain, marquee loop, skill-logo colour fade, nebula drift (scroll-driven CSS animation)                                              | Anything needing JS timing          |

---

## 3. Motion tokens

`src/lib/motion/tokens.ts`:

```ts
export const duration = {
  instant: 0.12, // colour/border feedback
  fast: 0.2, // hover, popover
  base: 0.45, // most reveals
  slow: 0.8, // section headings, image reveals
  cinematic: 1.2, // hero, page curtain, preloader exit
} as const;

// Motion uses cubic-bezier arrays; GSAP uses named eases.
export const ease = {
  out: [0.16, 1, 0.3, 1], // GSAP: "expo.out"     — default for reveals
  inOut: [0.76, 0, 0.24, 1], // GSAP: "power4.inOut" — curtains, transitions
  soft: [0.33, 1, 0.68, 1], // GSAP: "power2.out"   — hovers
} as const;

export const stagger = { tight: 0.04, base: 0.08, loose: 0.12 } as const;

export const distance = { sm: 16, md: 32, lg: 64 } as const; // px for y-offset reveals

export const viewport = { once: true, margin: "0px 0px -12% 0px" } as const;
```

The same easings exist as CSS variables in `globals.css` (`--ease-out-expo`, `--ease-in-out-quart`) for CSS transitions.

---

## 4. Global effects

### 4.1 Preloader (first visit per session)

- Full-screen `night` panel. Monogram centre, a counter `000 → 100` in Alegreya SC bottom-right, thin `electric` progress line.
- Progress is driven by `document.fonts.ready` + hero poster image load; minimum 1.0 s, **maximum 1.8 s** (never block longer).
- Exit: panel slides up (`yPercent: -100`, 1.2 s, `power4.inOut`) revealing the hero; the hero name reveal starts 0.2 s before the panel finishes.
- Shown once per session (`sessionStorage` flag). Skipped entirely with reduced motion. The hero text is in the HTML underneath, so LCP isn't waiting on JS.

### 4.2 Page transitions (`app/template.tsx`)

- `template.tsx` remounts on every navigation → use it for an **enter** transition:
  1. A `navy` curtain covers the viewport and scales away (`scaleY 1 → 0`, origin top, 0.8 s, inOut).
  2. Page content fades/rises in (`opacity 0 → 1`, `y 24 → 0`, 0.6 s, delay 0.25 s).
- On route change: Lenis jumps to top (`lenis.scrollTo(0, { immediate: true })`) and `ScrollTrigger.refresh()` runs after the new page mounts.
- Exit animations are not used (App Router unmounts immediately). Optional future upgrade: React `<ViewTransition>` once stable in Next.

### 4.3 Smooth scroll (Lenis)

- `lerp: 0.1`, `smoothWheel: true`, native touch scrolling (`syncTouch: false`) — mobile keeps native momentum.
- Lenis is driven by the GSAP ticker so ScrollTrigger and Lenis stay in sync (code §9.1).
- All in-page anchors (`/services#web-development`, back-to-top, sub-nav) go through `lenis.scrollTo(target, { offset: -headerHeight, duration: 1.2 })`.
- Disabled with reduced motion (native scroll + `scroll-behavior: auto`).

### 4.4 Header

- Show/hide on scroll direction using Motion `useScroll` + `useMotionValueEvent` (hide after 120 px down, show on any up-scroll). `y: -100% ↔ 0`, 0.35 s.
- Background/blur state toggles after 40 px (CSS transition, 0.3 s).
- Active link indicator moves between links with Motion `layoutId`.
- Mobile menu: full-screen overlay; clip-path circle reveal from the toggle button (0.7 s inOut); links stagger in (`y 100% → 0` inside overflow-hidden masks, stagger 0.06); close reverses.

### 4.5 Scroll progress

- 2 px `electric` bar at the very top, `scaleX` bound to page scroll progress. Optional; hide on Home hero.

### 4.6 Custom cursor (optional, pointer-fine devices only)

- 8 px white dot that follows exactly + 36 px ring that follows with lag (Motion springs, low stiffness). `mix-blend-mode: difference`.
- States: over links/buttons → ring grows to 64 px; over project cards → ring shows a "View" label; over text inputs → hidden.
- Native cursor stays visible for accessibility (the custom one is decorative). Not rendered on touch or reduced motion.

### 4.7 Micro-interactions (used everywhere)

| Interaction                                  | Spec                                                                                                                                      |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Link underline**                           | 1 px line, `scaleX 0 → 1` from left on hover (0.35 s), exits to the right                                                                 |
| **Button text roll**                         | Two stacked copies of the label; on hover the first slides up out, the second slides in (0.4 s, expo.out)                                 |
| **Magnetic buttons** (primary CTAs, socials) | Element moves up to 10 px toward the cursor inside its bounds; returns with a soft spring on leave                                        |
| **Card tilt** (service & project cards)      | CSS 3D: `perspective: 1000px`, max `rotateX/Y 6°`, `translateZ` on inner image 20 px; driven by pointer position; resets on leave (0.5 s) |
| **Card spotlight**                           | Radial gradient (`electric` at 10 %) following the cursor via CSS vars `--x/--y`                                                          |
| **Chip / tile hover**                        | Border to `electric/60`, logo colour fades in (0.3 s)                                                                                     |
| **Copy email**                               | Click → label morphs to "Copied ✓" for 1.5 s (Motion `AnimatePresence` mode `wait`)                                                       |

### 4.8 Space background (nebula + starfield)

- **Nebula drift:** multi-point CSS radial gradient nebula with scroll-driven upward drift (up to 6 % over document height via CSS `animation-timeline: scroll(root block)`).
- **Starfield (Canvas 2D):** 900–2000 delicate, crisp stars across 3 small depth layers (radii 0.35–1.15 px; no oversized discs or halos) with independent sine-wave twinkling.
- **Automatic drift:** continuous, serene bottom-to-top drift at ~4.5–7 px/sec (`0.075` px/frame base, reduced by 70% for calm ambience); star positions and twinkle are decoupled from page scroll (stars do not move on scroll).
- **Tab pause:** loop cancels on `document.hidden` and resumes on visibility change.
- **Device gating:** capped at 30 fps and DPR 1 on low-end hardware or viewport width `< 768px`.
- **Reduced motion:** renders a single static frame; zero continuous animation and nebula drift disabled.

---

## 5. Per-section specification

### 5.1 HOME-00 Hero — the hero moment

- **3D scene** (spec §6) fills the right 60 % on desktop, sits behind the text on mobile at lower opacity (or poster image on low-end devices).
- **Name reveal:** SplitText by chars inside line masks; `yPercent 110 → 0`, stagger 0.03, 1.2 s, expo.out. Role line and value prop follow (words, stagger 0.04). CTAs fade up last.
- **Scroll-out (scrubbed):** as the hero leaves, text moves up slower than scroll (`yPercent -20`), fades to 0.3; the 3D camera dollies back and the object rotates 90°. Pinned for at most 50 vh on desktop only.
- **Scroll cue:** thin line that loops a "drop" animation (CSS), fades out after first scroll.

### 5.2 HOME-01 / ABOUT-01 About

- Portrait reveal: `clip-path: inset(100% 0 0 0) → inset(0)`, 1.2 s inOut, while the image inside scales `1.15 → 1`.
- Image parallax inside its frame (`yPercent -8 → 8`, scrubbed).
- Paragraphs reveal as lines (SplitText lines, stagger 0.08).
- Quick-facts numbers count up once in view (0.8 s).
- **Gallery (ABOUT-02):** items reveal with staggered clip-path masks; lightbox opens with a shared-element `layoutId` zoom from the thumbnail; arrows/keys cross-fade images.
- **Interests / Hobbies:** cards stagger in (`y 32 → 0`, opacity); hobbies rows reveal an image on hover that follows the cursor (desktop only).

### 5.3 HOME-02 / SERV Services

- Cards: stagger reveal (base stagger), then tilt + spotlight on hover.
- Card numbers (`01`, `02`) count/roll in.
- **Services page:** sticky sub-nav highlights the active service (IntersectionObserver), active chip moves with `layoutId`. Each service section: title split-reveal, "Why you need it" items stagger, process steps connect with a line drawn on scroll (scrub), FAQ accordion height animated with Motion (`height: auto`).

### 5.4 HOME-03 / EXP Experience

- LinkedIn-style list: each item rises in (`y 24 → 0`), the company logo scales from 0.9, and a left hairline draws down the role group (scrub).
- "Present" badge dot pulses (CSS, 2 s loop, opacity only).
- "Show more" bullets expand with Motion height animation; chevron rotates.

### 5.5 HOME-04 / EDU Education timeline

- Vertical track (`royal`, 1 px) is static; the **progress line** (`electric`, 2 px) scales `scaleY 0 → 1` scrubbed from section top (70 % viewport) to bottom (60 %).
- Each node "lights up" (ring fills `electric`, small glow) when the progress line passes it (ScrollTrigger per node, `toggleActions: "play none none reverse"` — the one exception to "animate once", because it reflects position).
- Cards slide in from alternating sides on desktop (`x ±48 → 0`), from below on mobile.
- "Pursuing" badge pulses.

### 5.6 HOME-05 / PROJ Projects

- **Home preview (desktop ≥ 1024 px, optional pinned showcase):** a horizontal track of project cards scrubbed by vertical scroll while the section is pinned (length = track width, capped at 200 vh). Mobile/tablet and reduced motion: a normal grid.
- **Cards:** cover image scales 1 → 1.06 on hover inside its mask, tilt + spotlight, "Read more" arrow nudges.
- **Explorer filters:** grid uses Motion `layout` + `AnimatePresence mode="popLayout"` so cards re-flow smoothly when filtering (0.45 s); removed cards fade/scale to 0.96. Result count number rolls.
- **Detail page:** cover reveals with clip-path + scale; meta bar items stagger; write-up paragraphs reveal by line; gallery images reveal with masks; pager shows a preview image of the next project on hover.

### 5.7 HOME-06 / SK Skills

- Tiles stagger in by category (tight stagger, grid order).
- Mobile home variant: two marquee rows moving in opposite directions; speed nudged by Lenis scroll velocity; pauses on touch/hover.
- **Usage popover:** opens after 80 ms hover intent (prevents flicker), `opacity 0 → 1`, `scale 0.96 → 1`, `y 6 → 0`, 0.2 s; positioned above (flips if no room). Same popover opens on focus and on tap.

### 5.8 Contact

- Headline split reveal; form fields stagger in.
- Field focus: label moves/shrinks, border transitions to `electric`.
- Submit: button shows a progress shimmer; success replaces the form with a confirmation panel (`AnimatePresence`), including a short line-draw check mark.

### 5.9 Footer

- Giant wordmark: chars rise in with a scrubbed parallax as the footer enters.
- Link columns stagger in once.
- Back-to-top: Lenis `scrollTo(0, { duration: 1.6 })`.

### 5.10 Section headings (all pages)

- Eyebrow fades in, then the heading reveals by **words** inside masks (`yPercent 100 → 0`, stagger 0.06, 0.8 s). The Averia accent word arrives last with a 0.1 s extra delay.

---

## 6. 3D hero scene

**Concept:** a single abstract, slowly breathing object — a softly distorted glass-like form (icosahedron or torus-knot base) lit by `electric` and `royal` light, floating in a sparse particle field that fades to `void`. Abstract on purpose: it reads as "engineered, precise" without being a gimmicky laptop/planet.

| Aspect        | Spec                                                                                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Geometry      | Built in code (no model download). ≤ 20k triangles                                                                                                                                                                                          |
| Material      | Desktop: `MeshTransmissionMaterial` (drei) with low samples/resolution. Fallback: `MeshPhysicalMaterial` (transmission, roughness 0.15)                                                                                                     |
| Lighting      | Ambient low + 2 coloured point/rect lights (`#2F2FE4`, `#162E93`) + drei `Lightformer`s. **No remote HDRI** (drei `Environment` presets fetch from a CDN)                                                                                   |
| Particles     | 100–300 points max (sparse or off, since global starfield exists underneath), size attenuation, white at 30 %, slow drift                                                                                                  |
| Idle motion   | Slow rotation + vertex noise "breathing" (drei `MeshDistortMaterial`-style or a custom shader), 8–12 s cycle                                                                                                                                |
| Pointer       | Camera rig parallax: up to ±0.3 units, damped (`easing.damp3`)                                                                                                                                                                              |
| Scroll        | Object rotation and camera z driven by hero ScrollTrigger progress                                                                                                                                                                          |
| Canvas        | `dpr={[1, 1.5]}`, `gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}`, transparent background (`alpha: true`) so the space background and stars show through                         |
| Loading       | Client component loaded with `next/dynamic(() => import(...), { ssr: false })` **from inside a client component** (Next doesn't allow `ssr:false` in Server Components). Poster image shows until the first frame renders, then cross-fades |
| Pausing       | `frameloop` set to `"never"` when the hero is off-screen or the tab is hidden                                                                                                                                                               |
| Device gating | Render the poster instead of WebGL if: reduced motion, no WebGL2, `navigator.hardwareConcurrency <= 4`, or `deviceMemory <= 4`, or `saveData` is on                                                                                         |

---

## 7. Reduced motion

`useReducedMotion()` (Motion) on the client + `@media (prefers-reduced-motion: reduce)` in CSS.

| Effect                                   | Full motion              | Reduced motion                   |
| ---------------------------------------- | ------------------------ | -------------------------------- |
| Lenis                                    | On                       | Off (native scroll)              |
| Preloader                                | First visit              | Skipped                          |
| Page curtain                             | Curtain + rise           | Opacity fade 0.2 s               |
| Reveals (text/image)                     | Masks, y-offsets, splits | Opacity only, 0.3 s, no splits   |
| Parallax / scrub / pinning               | On                       | Off; content laid out statically |
| Timeline progress line                   | Scrubbed                 | Fully drawn; nodes all active    |
| Horizontal project showcase              | Pinned scrub             | Normal grid                      |
| Tilt, magnetic, spotlight, custom cursor | On                       | Off                              |
| Marquee                                  | Moving                   | Static wrapped grid              |
| 3D hero                                  | WebGL                    | Static poster image              |
| Starfield                                | Twinkle + parallax       | Static single frame              |
| Nebula drift                             | Scroll-driven drift      | Off (static background)          |
| Hover colour/border feedback             | On                       | On (not motion)                  |

---

## 8. Performance budget

- 60 fps on desktop, ≥ 50 fps on mid-range mobile during scroll.
- JS for motion + 3D loaded **after** the main content: 3D chunk via dynamic import on idle; GSAP plugins registered once in `lib/motion/gsap.ts`.
- `will-change: transform` only during an active animation, removed afterwards.
- `ScrollTrigger.refresh()` after fonts load (`document.fonts.ready`) and after images in pinned sections load.
- Max one pinned section per page. No scroll listeners outside Lenis/ScrollTrigger/Motion.
- Images inside reveal masks keep their final dimensions (no CLS).

---

## 9. Implementation patterns

### 9.1 SmoothScroll provider (Lenis ↔ GSAP)

```tsx
// components/motion/SmoothScroll.tsx
"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useReducedMotion } from "motion/react";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
```

```ts
// lib/motion/gsap.ts
"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
export { gsap, ScrollTrigger, SplitText, useGSAP };
```

### 9.2 Reveal (Motion, simple in-view)

```tsx
// components/motion/Reveal.tsx
"use client";
import { motion, useReducedMotion } from "motion/react";
import { duration, ease, distance, viewport } from "@/lib/motion/tokens";

export function Reveal({
  children,
  delay = 0,
  y = distance.md,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: reduced ? 0.3 : duration.base, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}
```

### 9.3 Timeline progress (GSAP scrub)

```tsx
"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion/gsap";

export function TimelineProgress({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative">
      <span aria-hidden className="absolute top-0 left-4 h-full w-px bg-royal" />
      <span
        aria-hidden
        data-progress
        className="absolute top-0 left-4 h-full w-0.5 -translate-x-[0.5px] bg-electric"
      />
      {children}
    </div>
  );
}
```

### 9.4 Rules for the agent

- GSAP code lives in `useGSAP(() => …, { scope })` — never bare `useEffect` — so it auto-cleans on unmount/route change.
- Use `gsap.matchMedia()` for breakpoint- and reduced-motion-specific timelines.
- Motion components use tokens from `lib/motion/tokens.ts`; no inline magic numbers.
- Any component using Motion/GSAP/Lenis/R3F is a **client leaf**; its parent section stays a Server Component and passes data as props.
- Animated text must remain real text in the DOM (SplitText keeps it accessible; add `aria-label` on the parent with the full string if splitting chars).

---

## 10. Don't list

- No bounce/elastic easings, no rotating loaders, no confetti.
- No scroll-snapping or scroll-jacking; no more than one pinned section per page.
- No parallax on body text.
- No animation longer than 1.2 s (except preloader ≤ 1.8 s and scrubbed sequences).
- No auto-playing carousels.
- No animating elements above the fold in a way that delays LCP text from being visible in the initial HTML.

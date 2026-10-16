---
trigger: model_decision
description: "Read before adding or changing any animation, transition, scroll effect, hover effect, smooth scrolling or 3D, i.e. anything using motion/react, gsap, @gsap/react, lenis, three or @react-three/*."
---

# Motion & 3D rules

Full spec: @docs/context/04-motion-and-effects.md. The per-section animation specs are in §5, the 3D scene in §6, reduced motion in §7.

## Phase gate
- Motion is **Phase 6** and the 3D hero is **Phase 7** (`02 §9`).
- Before those phases, build sections **static**: no imports from `motion/react`, `gsap`, `lenis` or `@react-three/*`, unless I explicitly ask.
- Keep markup motion-ready so effects can be added later without layout changes: stable wrapper elements, `overflow-hidden` masks around headings and media, final image dimensions reserved.

## One library per element
| Library | Owns |
|---|---|
| Lenis | Smooth scroll and programmatic `scrollTo` only. Use it via the `SmoothScroll` provider and `useLenis()` |
| GSAP + ScrollTrigger + SplitText | Scroll-linked motion: scrub, pin, parallax, line drawing, text splitting, preloader timeline |
| Motion (`motion/react`) | State and interaction: hover, tap, `AnimatePresence`, `layout`, header show/hide, page enter, simple `whileInView` reveals |
| R3F / drei | The hero 3D scene only |
| CSS | Underlines, colour/border transitions, grain, marquee loop, logo colour fade |

Never animate the same element with two libraries.

## Implementation rules
- **Client leaves.** Every component using these libraries is a `"use client"` leaf. Its parent section stays a Server Component and passes data as props.
- **Tokens.** Durations, eases, staggers, distances and the viewport come from `@/lib/motion/tokens`; no inline magic numbers.
  - GSAP ease names: `out` → `"expo.out"`, `inOut` → `"power4.inOut"`, `soft` → `"power2.out"`.
- **GSAP:**
  - import from `@/lib/motion/gsap`, never from `"gsap"` directly, so plugins register once;
  - write all code inside `useGSAP(() => …, { scope: ref })`, never a bare `useEffect`;
  - use `gsap.matchMedia()` with `"(prefers-reduced-motion: no-preference)"` and breakpoint queries, and return a cleanup that reverts it.
- **Motion:** import from `motion/react` (installed major is 14). Use `useReducedMotion()`, and `whileInView` with the shared `viewport` token.
- **Lenis:** in-page anchors and back-to-top go through `lenis.scrollTo(target, { offset: -headerHeight })`. Fall back to native scrolling when Lenis is null (reduced motion).
- **Properties:** animate `transform`, `opacity` and `clip-path` only. Never animate width, height, top, left, margin or shadow size on scroll.
- **Text:** animated text stays real text in the DOM. When splitting into characters, put `aria-label` with the full string on the parent. Revert splits on cleanup.
- **Frequency:**
  - reveals run once;
  - max one pinned section per page;
  - nothing longer than 1.2 s, except the preloader (≤ 1.8 s) and scrubbed sequences.
- **3D:**
  - load with `next/dynamic(..., { ssr: false })` from inside a client component;
  - show the poster image until the first frame;
  - apply device gating per `04 §6`;
  - set `frameloop="never"` when off-screen or the tab is hidden;
  - no remote HDRI and no drei `Environment` presets.

## Reduced motion (`04 §7`)
With reduced motion, these are **off** or static:
- Lenis, preloader, splits, scrub, pinning, parallax;
- tilt, magnetic, spotlight, cursor, marquee movement;
- WebGL (the poster image shows instead).

These change form instead:
- reveals become an opacity-only fade of 0.3 s;
- the page curtain becomes a 0.2 s fade;
- the timeline is fully drawn with all nodes active.

Hover colour and border feedback stays on. Verify by emulating `prefers-reduced-motion: reduce` in the browser.

## Don't
- No bounce or elastic easing, no spinners, no confetti, no scroll-snapping or scroll-jacking.
- No parallax on body text, no auto-playing carousels.
- Never delay LCP text from being visible in the initial HTML.

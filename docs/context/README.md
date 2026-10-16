# Portfolio — Development Context Index

This folder is the single source of truth for **what** we are building, **how** it is built, **how it looks**, **how it moves**, and **how content flows**. Every prompt to the AI agent (Antigravity) should reference the relevant file(s) here instead of re-explaining the idea.

> Place these files in the repo at `docs/context/`. They are documentation only — no code imports them.

## Files

| #   | File                                | Answers                                                                | Read it when…                                          |
| --- | ----------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| 01  | `01-project-overview.md`            | What every page and section contains, in what order, and why           | Building or changing any page/section                  |
| 02  | `02-tech-stack-and-architecture.md` | Stack, versions, folder structure, component/section contracts         | Scaffolding, creating files, deciding where code lives |
| 03  | `03-design-system.md`               | Colours, fonts, spacing, components' visual spec, anti-"AI look" rules | Writing any markup or Tailwind class                   |
| 04  | `04-motion-and-effects.md`          | 3D, smooth scroll, transitions, per-section animation spec             | Adding any animation or interaction                    |
| 05  | `05-data-and-content-flow.md`       | JSON schemas, loaders, the "no data → not rendered" rule               | Touching `src/data/*.json` or anything that reads it   |

## Locked decisions (change only by editing these docs)

1. **Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4.** Fully static output except the contact form action.
2. **All content lives in `src/data/*.json`.** Components never hard-code copy that belongs to the person.
3. **Presence-driven rendering.** If data for a page, section, subsection or field is missing or empty, that UI is not rendered — and links to it (nav, footer, sitemap, buttons) disappear too.
4. **One dark theme only.** Palette: `#000000`, `#FFFFFF`, `#2F2FE4`, `#162E93`, `#1A1953`, `#080616` plus the derived shades defined in `03`. Tailwind's default colour palette is disabled.
5. **Four fonts, each with one job:** Archivo Black (display), Abhaya Libre (body), Alegreya SC (labels/UI), Averia Serif Libre (italic accent words only).
6. **Motion stack:** Lenis (smooth scroll) + GSAP/ScrollTrigger (scroll-driven, cinematic) + Motion (component state, hover, presence) + React Three Fiber (one hero 3D scene). Every effect has a `prefers-reduced-motion` fallback.
7. **Server Components by default.** `"use client"` only on interactive/animated leaf components.

## Stable IDs

Pages and sections carry IDs (e.g. `HOME-02`, `PD-04`) defined in `01-project-overview.md`. Use them in prompts, commits and the per-section context files we will write next: _"Build HOME-04 per 01 §5.1, motion per 04 §5.5, data per 05 §5.5."_

## Next steps

1. Set up how Antigravity consumes these files (rules / workflows).
2. Generate per-page and per-section build context from these docs.
3. Build in the phase order in `02 §9`.

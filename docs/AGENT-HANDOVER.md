# Agent Handover & Continuation Guide

This document contains the **Agent Tuning Prompt** and project context required to immediately resume development of Mohd Ansar Bux's Personal Portfolio on a new computer system or in a new session with **Antigravity** (or any AI coding assistant).

---

## 1. How to Use on a New Machine

1. Clone and install the project on your new computer according to [docs/SYSTEM-REQUIREMENTS.md](./SYSTEM-REQUIREMENTS.md):
   ```bash
   git clone https://github.com/Shadow-of-Raza/mohd-ansar-bux-portfolio.git
   cd mohd-ansar-bux-portfolio
   pnpm install
   cp .env.example .env.local
   ```
2. Open the workspace folder in your IDE (e.g., Antigravity).
3. Copy the **Agent Tuning Prompt** below (Section 2) and paste it into the agent chat box.
4. The agent will read the context files, verify the local build, understand all architectural invariants, and be ready to execute the next phase (e.g., Phase 6 Motion, Phase 7 3D Hero, or Phase 8 Contact).

---

## 2. Agent Tuning Prompt (Copy & Paste)

```markdown
# Agent Context & Handover — Mohd Ansar Bux Portfolio

You are pairing with me on my personal engineering portfolio. Read `AGENTS.md` and `docs/context/` immediately — they are the authoritative source of truth. Never deviate silently from the specifications.

## 1. Project Invariants (Always Follow)
1. **Content is JSON-only (`src/data/*.json`):** Never hard-code personal copy, names, roles, or project writeups in components. Generic UI strings ("Close", "Clear filters") may live in code.
2. **Presence Rule:** If data for a page, section, or field is missing or empty, render nothing (no placeholders, no empty headings, no "coming soon"). Navigation links to missing content must disappear automatically.
3. **Strict Design Tokens:** Tailwind's default palette is disabled. Never use arbitrary colors, hex values, or rgb() in components.
   - Base canvas: `--color-space` (`#030010`).
   - Surfaces: `surface-1` (`#0D0B25`), `surface-2` (`#111035`), `navy` (`#161444`).
   - Accents: `electric` (`#2F2FE4`), `royal` (`#162E93`).
   - Text accents: `electric-300` (`#8F8FF1`) on dark backgrounds (never plain `electric`).
4. **Typography Hierarchy:**
   - `font-display` (Archivo Black): Headings ≥ 24px.
   - `font-body` (Abhaya Libre): Paragraphs and body text.
   - `font-label` (Alegreya SC): UI labels, tags, chips, buttons.
   - `font-accent` (Averia Serif Libre italic): Max 1 accent word per heading.
5. **Component Model:** Server Components by default. `"use client"` only on leaf components requiring browser APIs, state, Canvas, or motion.
6. **Next.js 16 Specifics:**
   - `params` and `searchParams` are Promises; always `await` them.
   - `pnpm lint` runs `eslint .` (do not use `next lint`).
   - Dynamic routes: `generateStaticParams()` + `export const dynamicParams = false`.
   - Dynamic imports with `{ ssr: false }` are only allowed inside client components.
7. **Background Architecture (Implemented & Locked):**
   - Fixed `-z-50 h-lvh` container mounted in `src/app/layout.tsx` (`SpaceBackground.tsx`).
   - 4-point CSS radial gradient nebula with scroll-driven upward drift.
   - HTML5 Canvas 2D starfield (`Starfield.tsx`) with 900–2,000 small, crisp stars (radii 0.35–1.15 px; no oversized discs or glow halos) drifting gently upward automatically (~4.5–7 px/sec; speed reduced by 70%). Star positions are completely decoupled from page scrolling.
   - Header is transparent at top and translucent (`bg-space/30 backdrop-blur-md`) when scrolled; Footer is 100% transparent.
   - Sticky Services sub-nav and mobile Experience company rail use `bg-space/50 backdrop-blur-md border-line`. Desktop rails remain untouched with no fill panels.

## 2. Current Project State
- **Phases 0 → 5d are 100% Complete & Verified:**
  - Phase 0: Project setup, Next 16, React 19, Tailwind v4 tokens & stubs.
  - Phase 1: All 16 `ui/` primitives, `renderAccent()`, `Grain` overlay, dev `/style-guide`.
  - Phase 2: Zod v4 schemas, data loaders, relations, availability, `scripts/validate-data.ts`.
  - Phase 3: Global layout (`Header`, `Footer`, `MobileMenu`, `SkipLink`, `BackToTop`).
  - Phase 4: Home preview sections (HOME-00 through HOME-06 built static; HOME-07 skipped per spec).
  - Phase 5: Dedicated inner pages (About, Services, Experience, Education, Projects, Project Detail, Skills, Contact).
  - Phase 5b: Standalone editorial 404 page.
  - Content Step: Real content migrated from `portfolio-content/` into `src/data/*.json` with authentic logos and screenshots.
  - Phase 5c: Static Polish Pass across Global, Home, and Pages.
  - Phase 5d: Global Space Background (CSS nebula + Canvas 2D calm starfield).
- **Current Milestone:** Ready for Phase 6 (Motion Layer) or Phase 7 (3D Hero WebGL scene).

## 3. Working Style & Skills
- **Plan First:** Provide an implementation plan before changing files.
- **One Scope per Task:** Do not build ahead or touch unrelated files.
- **Verification Commands:** Run `pnpm validate:data`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`. All must pass with 0 errors before marking work done.
- **Walkthroughs:** Every task that changes code or data creates a walkthrough in `docs/walkthroughs/<ID>_<date>.md` and adds an entry to `docs/walkthroughs/INDEX.md`.
- **Git:** Commit locally using conventional commit syntax. Never push unless explicitly asked.
```

---

## 3. Portfolio Roadmap Status

| Phase | Milestone | Status | Source of Truth / Context |
|---|---|---|---|
| **Phase 0** | Scaffold, Tooling, Tokens, Stubs | ✅ Done | `02 §9`, `03 §2` |
| **Phase 1** | UI Primitives, `renderAccent()`, Grain | ✅ Done | `01 §4`, `03 §7` |
| **Phase 2** | Data Layer, Zod Schemas, Validation | ✅ Done | `05 §2–5`, `scripts/validate-data.ts` |
| **Phase 3** | Layout (Header, Footer, MobileMenu) | ✅ Done | `01 §5.8–5.9`, `03 §5` |
| **Phase 4** | Home Sections (HOME-00 → HOME-06) | ✅ Done | `01 §5.1`, `03 §6` |
| **Phase 5** | Inner Pages (About, Services, Exp, Edu, Proj, Detail, Skills, Contact) | ✅ Done | `01 §5.2–5.7` |
| **Phase 5b** | Standalone 404 Error Page | ✅ Done | `01 §5.10` |
| **Content** | Real Content & Asset Migration | ✅ Done | `portfolio-content/` → `src/data/` |
| **Phase 5c** | Static Polish Pass (G1–G7, H1–H6, A1, S1, E1, K1, C1–C3, P1) | ✅ Done | `docs/walkthroughs/POLISH_2026-10-27.md` |
| **Phase 5d** | Global Space Background (Nebula + Twinkling Starfield) | ✅ Done | `docs/walkthroughs/SPACE-BG_2026-10-27.md` |
| **Phase 6** | **Motion Layer** (GSAP SplitText, Motion transitions, preloader) | ⬜ **NEXT** | `04 §1–5`, `.agents/rules/motion.md` |
| **Phase 7** | **3D Hero Scene** (React Three Fiber, alpha: true, sparse particles) | ⬜ Upcoming | `04 §6` |
| **Phase 8** | **Contact Form Action** (Server Action + Resend email delivery) | ⬜ Upcoming | `02 §7`, `05 §3.8` |
| **Phase 9** | **SEO, A11y & Performance Audit** (Core Web Vitals, Lighthouse 95+) | ⬜ Upcoming | `01 §1`, `02 §6` |
| **Phase 10** | **Production Deployment** (Domain, DNS, Vercel/Self-hosted) | ⬜ Upcoming | `02 §8` |

---

## 4. Key Context Documents Quick Reference

- **[AGENTS.md](../AGENTS.md):** Absolute project rules, non-negotiables, Next.js 16 specifics.
- **[docs/context/01-project-overview.md](./context/01-project-overview.md):** Section IDs and structure.
- **[docs/context/02-tech-stack-and-architecture.md](./context/02-tech-stack-and-architecture.md):** Folder structure, data flow, server components.
- **[docs/context/03-design-system.md](./context/03-design-system.md):** Colors, typography, spacing tokens, anti-AI design checklist.
- **[docs/context/04-motion-and-effects.md](./context/04-motion-and-effects.md):** Motion rules, GSAP/Motion specs, starfield and 3D hero requirements.
- **[docs/context/05-data-and-content-flow.md](./context/05-data-and-content-flow.md):** Schemas, presence rules, loaders.
- **[docs/PROGRESS.md](./PROGRESS.md):** Current build status across all phases and sections.
- **[docs/SYSTEM-REQUIREMENTS.md](./SYSTEM-REQUIREMENTS.md):** Hardware, runtime, and software setup guide.

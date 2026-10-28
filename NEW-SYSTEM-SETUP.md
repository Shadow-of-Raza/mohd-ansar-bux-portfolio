# New System Setup & Continuation Guide

Follow these exact 3 steps to set up and continue development of Mohd Ansar Bux's Personal Portfolio on your new computer system.

---

## Step 1: Clone & Install

Open your terminal (PowerShell, Command Prompt, or Terminal) and run:

```bash
# 1. Clone the repository
git clone https://github.com/Shadow-of-Raza/mohd-ansar-bux-portfolio.git

# 2. Enter the project folder
cd mohd-ansar-bux-portfolio

# 3. Install dependencies using pnpm
pnpm install

# 4. Copy the environment variables template
# On Windows (PowerShell):
Copy-Item .env.example .env.local

# On macOS / Linux:
cp .env.example .env.local
```

---

## Step 2: Test & Verify the Build

Run the pre-flight verification to confirm that data schemas, linting, TypeScript types, and Next.js 16 SSG build cleanly:

```bash
pnpm validate:data && pnpm lint && pnpm typecheck && pnpm build
```

Expected result: **All 4 checks pass with 0 errors**.

To run the local development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 3: Start the Agent on the New System

1. Open the cloned `mohd-ansar-bux-portfolio` folder in **Antigravity** (or your preferred AI agent environment).
2. Start a new chat session.
3. Copy the **Agent Tuning Prompt** below and paste it into the chat:

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

## 4. Documentation References

- **Full System & Hardware Requirements:** [docs/SYSTEM-REQUIREMENTS.md](./docs/SYSTEM-REQUIREMENTS.md)
- **Agent Handover Specification:** [docs/AGENT-HANDOVER.md](./docs/AGENT-HANDOVER.md)
- **Project Roadmap & Phase Progress:** [docs/PROGRESS.md](./docs/PROGRESS.md)
- **Changelog & Walkthrough History:** [docs/walkthroughs/INDEX.md](./docs/walkthroughs/INDEX.md)
- **Authoritative Rules:** [AGENTS.md](./AGENTS.md)

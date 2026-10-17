# Portfolio — Project rules (always apply)

## What this project is

A personal portfolio for a full-stack engineer: cinematic, editorial, dark, JSON-driven. The full specification lives in `docs/context/` and is the **source of truth**. If code and docs disagree, follow the docs or stop and propose a doc change. Never silently deviate.

| Need                                                       | Read                                            |
| ---------------------------------------------------------- | ----------------------------------------------- |
| What a page/section contains (IDs like `HOME-02`, `PD-04`) | @docs/context/01-project-overview.md            |
| Where code lives, conventions, build phases                | @docs/context/02-tech-stack-and-architecture.md |
| Colours, fonts, spacing, component visuals                 | @docs/context/03-design-system.md               |
| Animation, 3D, transitions                                 | @docs/context/04-motion-and-effects.md          |
| JSON schemas, loaders, presence rules                      | @docs/context/05-data-and-content-flow.md       |
| What is already built, what's next                         | @docs/PROGRESS.md                               |

When a task names a section ID, find it in `01 §5`, then follow the matching parts of `03`, `04 §5` and `05 §5`.

## Non-negotiables

1. **Content lives only in `src/data/*.json`.** Never hard-code personal copy (names, bios, project text, section headings) in components. Generic UI strings ("Close", "Clear filters") may live in code.
2. **Presence rule.** If data for a page, section, subsection or field is missing or empty, render nothing for it: no empty heading, no placeholder, no "coming soon". Links to it (nav, footer, sitemap, buttons) disappear too. (`05 §4`)
3. **Colours = design tokens only.** Tailwind's default palette is disabled. Never write hex values, `rgb()`, or arbitrary colour classes in components. `electric` (#2F2FE4) is never a text colour on dark backgrounds; use `electric-300`. (`03 §2–4`)
4. **Fonts have fixed jobs:**
   - `font-display` → Archivo Black: headings ≥ 24 px;
   - `font-body` → Abhaya Libre: paragraphs;
   - `font-label` → Alegreya SC: UI, labels, buttons;
   - `font-accent` → Averia Serif Libre italic: max one accent word per heading.
5. **Server Components by default.** `"use client"` only on leaf components that need state, effects, events, browser APIs, Motion, GSAP, Lenis or R3F.
6. **Layering:**
   - only `app/**` files call loaders;
   - `sections/` receive data via props;
   - `components/` are data-agnostic;
   - `lib/data/*` starts with `import "server-only"`. (`02 §4`)
7. **Motion:** one library per element, every effect has a reduced-motion fallback, GSAP only inside `useGSAP(..., { scope })`. Motion is Phase 6 and 3D is Phase 7. Build sections static before then. (`04`)
8. **No new dependencies** without asking me first. Installed versions in `package.json` are authoritative; never downgrade a package to match a version number written in the docs.
9. **Don't edit `docs/context/`** unless I ask. You may update `docs/PROGRESS.md`.

## Next.js 16 specifics

- `params` and `searchParams` are Promises; always `await` them.
- There is no `next lint`; `pnpm lint` runs `eslint .`.
- `next/dynamic(..., { ssr: false })` is only allowed inside client components.
- Dynamic routes: `generateStaticParams()` + `export const dynamicParams = false`.
- Images: always `next/image` with `width`, `height` (from JSON) and `sizes`.
- Zod is v4: use `z.url()` and `z.email()`. `.default()` returns the default without parsing it; use `.prefault()` when inner defaults must apply.

## Working style

- **Plan first.** Produce an Implementation Plan + Task List and wait for my approval before changing more than 3 files, adding dependencies, or touching config.
- **One scope per task.** Build only the phase or section ID requested. Don't build ahead or "improve" unrelated files.
- **Reuse before creating.** Check `src/components/ui` and `src/components/shared` before making a new component.
- **Missing content:** ask me for real content, or, with my permission, add entries whose text starts with `[PLACEHOLDER]`. List every placeholder in the Walkthrough and in `docs/PROGRESS.md`.
- **Verify before done:** run `/verify`. For UI work also run `/review-ui`. A task isn't done until lint, typecheck and build pass.
- **Walkthrough** lists files changed, deviations from the docs (with reasons), placeholders, and screenshots at 375 / 768 / 1440 px for UI work.
- **Platform:** the dev machine is Windows. Use `pnpm` scripts and cross-platform commands; no bash-only syntax (`rm -rf`, `&&` chains in PowerShell 5, `export`).
- **Git:** never push. Commit locally only when I ask.

## Skills in this workspace

- `/build phase <N>` or `/build <SECTION-ID …>`: build a phase or sections per the docs.
- `/verify`: data validation, lint, typecheck, build, token checks, browser check.
- `/review-ui <route or SECTION-ID>`: design, accessibility and presence-rule review.

## Commands

`pnpm dev` · `pnpm lint` · `pnpm typecheck` · `pnpm format` · `pnpm validate:data` · `pnpm build`

## Next.js notes (generated by create-next-app)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

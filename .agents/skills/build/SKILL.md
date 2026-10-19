---
name: build
description: Builds one phase (e.g. "phase 1") or one or more section IDs (e.g. "HOME-02", "PD-01 PD-02") of the portfolio exactly as specified in docs/context. Use when asked to build, implement or create a phase, page, section or component of the portfolio.
---

# Build a phase or section

Usage: `/build phase <N>` or `/build <SECTION-ID> [more IDs]`. Example: `/build HOME-02`.

## 1. Load context

1. Read `docs/PROGRESS.md`. Confirm what is done.
2. Check prerequisites against the phase order in `docs/context/02-tech-stack-and-architecture.md §9`.
   - Section work (Phases 4–5) needs Phase 1 (`ui/` primitives), Phase 2 (data layer) and Phase 3 (layout) finished.
   - If a prerequisite is missing, **stop and tell me** instead of building it silently.
3. **For a phase:** read its row in `02 §9` (deliverable and "done when"), then the notes below and the doc sections they point to.
4. **For a section ID**, read:
   - its row in `01 §5` (content and actions);
   - its data shape in `05 §5` and the presence rules in `05 §4`;
   - layout and component specs in `03 §6` and `03 §10`;
   - its motion spec in `04 §5`. Note it, but don't implement motion before Phase 6 (see the motion rule).

## 2. Inventory

- List the existing components in `src/components/ui` and `src/components/shared`. Reuse them; extend one with a prop rather than duplicating it.
- List every JSON field the work needs and check `src/data/`. If content is missing:
  - ask me for the real content; or
  - ask permission to add `[PLACEHOLDER]` entries.

## 3. Plan, then stop for approval

Produce an **Implementation Plan** with:

- files to create or modify: path, server or client, purpose;
- the props type for each new component or section;
- the presence rule for the section, each subsection and each field;
- the layout at 375, 768 and 1440 px (which grid columns, what stacks);
- what is reused and what is new, and why;
- open questions.

Also produce a **Task List**. Then wait for my approval.

## 4. Implement

Order:

1. schema or loader changes;
2. `components/`;
3. the section;
4. composition in `app/**/page.tsx`.

Follow the section contract (`02 §6`), use token classes only, and keep markup motion-ready.

## 5. Verify

Run `/verify`. For UI work, also run `/review-ui` on each affected route or section.

## 6. Record

- Update `docs/PROGRESS.md`: tick the phase or IDs, add the date, notes, placeholders and deferred items.
- Save a walkthrough to `docs/walkthroughs/<ID>_<YYYY-MM-DD>.md`
  (e.g. `HOME-00_2026-10-17.md`, `Phase-02_2026-10-16.md`).
  - Never overwrite. If the file already exists, add `-2`, `-3`, …
  - An enhancement of an existing section always gets a new file.
- The walkthrough contains: what was built or changed and why, files created/modified/deleted,
  deviations from the docs and why, placeholders, deferred items, the verification table,
  and screenshots.
- Save screenshots at 375 / 768 / 1440 px to
  `docs/walkthroughs/screenshots/<ID>_<YYYY-MM-DD>/` and link them with relative paths.
- Screenshots must be copied into docs/walkthroughs/screenshots/. Never link to .gemini/ brain folders or use file:/// links; use relative paths only.
- Add one line at the top of `docs/walkthroughs/INDEX.md`:
  `| date | ID | type (build/fix/enhance/review) | one-line summary | link |`

---

## Phase notes

| Phase | Build                                                                                                                                                           | Key points                                                                                                                                                                                                              |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Type utilities check, `renderAccent()` in `lib/utils/format.ts`, all `ui/` primitives from `02 §3`, grain overlay                                               | Style guide at `src/app/(dev)/style-guide/page.tsx` that calls `notFound()` when `NODE_ENV === "production"` and is never in the sitemap. Show every primitive, every variant and state (hover, focus, disabled, error) |
| 2     | `schemas.ts` for all 8 files, `loaders.ts`, `relations.ts`, `availability.ts`, `has-content.ts`, `dates.ts`, full `validate-data.ts`, `sitemap.ts`, `robots.ts` | Done when emptying a JSON `items` array hides its page (404), its nav entry and its sitemap entry. Write the validator checks from `05 §8`                                                                              |
| 3     | `Header`, `MobileMenu`, `NavLink`, `SkipLink`, `Footer`, wired in `layout.tsx`                                                                                  | Links come from `getNavItems()`. Static behaviour now (scrolled state can use CSS); show/hide motion waits for Phase 6. Keyboard: skip link, focus trap in the menu, `Esc` closes it                                    |
| 4     | HOME-00 → HOME-07                                                                                                                                               | One section per task is fine. Static, with the poster in place of 3D                                                                                                                                                    |
| 5     | Inner pages (`01 §5.2–5.10`)                                                                                                                                    | Build page by page using section IDs                                                                                                                                                                                    |
| 6     | Lenis, reveals, page transition, header motion, micro-interactions                                                                                              | Per `04`. Verify reduced motion on every page                                                                                                                                                                           |
| 7     | 3D hero + device gating + poster cross-fade                                                                                                                     | Per `04 §6`. Measure fps                                                                                                                                                                                                |
| 8     | Contact Server Action + Resend                                                                                                                                  | Honeypot, server-side validation, env-var guard (`05 §4.3`)                                                                                                                                                             |
| 9     | SEO, accessibility audit, performance                                                                                                                           | Targets in `01 §1`                                                                                                                                                                                                      |

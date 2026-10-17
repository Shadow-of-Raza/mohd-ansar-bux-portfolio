---
name: verify
description: Runs the portfolio's full verification (data validation, lint, typecheck, production build, design-token and layering checks, and a browser check for UI changes). Use before marking any task done, or when asked to verify, check or test the project.
---

# Verify

Run every step. Report results in a table at the end. A task is **not done** while any step marked _fail_ is failing.

## 1. Commands (fail on any error)

1. `pnpm validate:data`
2. `pnpm lint`
3. `pnpm typecheck`
4. `pnpm build`

Fix failures that are within the task's scope and rerun. Never get a check to pass by:

- disabling lint rules;
- adding `// @ts-ignore`, `any` or `eslint-disable`;
- loosening a schema.

If you are stuck, ask me.

## 2. Code checks (use your code search over `src/`)

Exceptions for colour checks: `src/app/globals.css` and `src/components/three/**` (3D light colours) may contain colour literals.

| Check                     | Search for                                                                                     | Level |
| ------------------------- | ---------------------------------------------------------------------------------------------- | ----- |
| Hex colours in components | `#[0-9a-fA-F]{3,8}` in `.tsx`/`.ts`                                                            | fail  |
| Raw colour functions      | `rgb(`, `rgba(`, `hsl(` in `.tsx`                                                              | fail  |
| Arbitrary colour classes  | `-[#`                                                                                          | fail  |
| Default Tailwind palette  | `(bg                                                                                           | text  | border | ring | fill | stroke | from | via | to  | outline | decoration)-(slate | gray | zinc | neutral | stone | red | orange | amber | yellow | lime | green | emerald | teal | cyan | sky | blue | indigo | violet | purple | fuchsia | pink | rose)-\d` | fail |
| Low-contrast accent text  | `text-electric` not followed by `-200`, `-300`, `-400` or `-hover`                             | fail  |
| Layering                  | imports of `@/data/` or `@/lib/data/` outside `src/app/**`, `src/lib/data/**` and `scripts/**` | fail  |
| Server-only guard         | a `src/lib/data/*.ts` file missing `import "server-only"`                                      | fail  |
| GSAP import path          | `from "gsap"` outside `src/lib/motion/gsap.ts`                                                 | fail  |
| Client boundary           | `"use client"` in `src/sections/**` other than `ProjectsExplorer` and `ContactFormSection`     | flag  |
| Images                    | `<img ` in `.tsx`                                                                              | flag  |
| Hard-coded personal copy  | headings or paragraphs written as literal text in `sections/`                                  | flag  |
| Emoji                     | emoji characters in `.tsx`                                                                     | flag  |

## 3. Browser check (when UI changed)

1. `pnpm dev`, then open each affected route.
2. At **375, 768 and 1440 px** widths:
   - no console errors or hydration warnings;
   - no horizontal scrolling;
   - nothing overlapping or clipped;
   - take a screenshot.
3. Press Tab through the page: the focus ring is visible on every interactive element, and the order is logical.
4. From Phase 6 on: emulate `prefers-reduced-motion: reduce` and confirm the reduced versions in `04 §7`.

## 4. Report

Output a table with the columns **Step | Result (pass / fail / flag) | Notes**. Explain every flag in a sentence, and list any fixes you made.

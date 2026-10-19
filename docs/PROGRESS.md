# Build Progress

The agent updates this file at the end of every task (see `/build` step 6). Section IDs come from `docs/context/01-project-overview.md`.

## Phases (`02 §9`)

| Phase | Deliverable                                            | Status                                 | Date       | Notes                                                                                                                                                                                           |
| ----- | ------------------------------------------------------ | -------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Scaffold, tooling, tokens, data stubs                  | ✅ Done                                | 2026-10-16 | Next 16.4.1, React 19.3, Tailwind 4.3.3, Motion 14.2                                                                                                                                            |
| 1     | `ui/` primitives, `renderAccent()`, grain, style guide | ✅ Done                                | 2026-10-16 | All 16 ui/ primitives, renderAccent(), Grain overlay, dev-only /style-guide, full verify passed                                                                                                 |
| 2     | Data layer + full validator + sitemap/robots           | ✅ Done                                | 2026-10-16 | Schemas for all 8 files (Zod 4), loaders, relations, availability, dates/hasContent utils, validate-data script with all 6 error + 4 warning checks, sitemap.xml and robots.txt                 |
| 3     | Header, Footer, MobileMenu                             | 🟨 Done (static)                       | 2026-10-17 | Header, Footer, MobileMenu, NavLink, SkipLink, SocialLinks, BackToTop wired in layout.tsx. Verified keyboard navigation (skip link, Esc, focus trap) & responsive layout across 375/768/1440px. |
| 4     | Home sections                                          | 🟨 In progress (HOME-00, HOME-01, HOME-02, HOME-03, HOME-04 done) | 2026-10-19 | HOME-00 through HOME-04 Education (timeline) built static. Passed data validation, lint, typecheck, build, presence tests, and browser verification across 375/768/1440px. |
| 5     | Inner pages + project detail                           | ⬜                                     |            |                                                                                                                                                                                                 |
| 6     | Motion layer                                           | ⬜                                     |            |                                                                                                                                                                                                 |
| 7     | 3D hero                                                | ⬜                                     |            |                                                                                                                                                                                                 |
| 8     | Contact action + Resend                                | ⬜                                     |            |                                                                                                                                                                                                 |
| 9     | SEO, a11y, performance                                 | ⬜                                     |            |                                                                                                                                                                                                 |
| 10    | Deploy                                                 | ⬜                                     |            |                                                                                                                                                                                                 |

## Sections

**Global:** 🟨 GLOBAL-HEADER · 🟨 GLOBAL-FOOTER · ⬜ 404

**Home:** 🟨 HOME-00 · 🟨 HOME-01 · 🟨 HOME-02 · 🟨 HOME-03 · 🟨 HOME-04 · ⬜ HOME-05 · ⬜ HOME-06 · ⬜ HOME-07

**About:** ⬜ ABOUT-01 · ⬜ ABOUT-02 · ⬜ ABOUT-03 · ⬜ ABOUT-04 · ⬜ ABOUT-05 · ⬜ ABOUT-06

**Services:** ⬜ SERV-01 · ⬜ SERV-02 · ⬜ SERV-03 · ⬜ SERV-04

**Experience:** ⬜ EXP-01 · ⬜ EXP-02 · ⬜ EXP-03

**Education:** ⬜ EDU-01 · ⬜ EDU-02 · ⬜ EDU-03

**Projects:** ⬜ PROJ-01 · ⬜ PROJ-02 · ⬜ PROJ-03

**Project detail:** ⬜ PD-01 · ⬜ PD-02 · ⬜ PD-03 · ⬜ PD-04 · ⬜ PD-05 · ⬜ PD-06

**Skills:** ⬜ SK-01 · ⬜ SK-02 · ⬜ SK-03

**Contact:** ⬜ CON-01 · ⬜ CON-02 · ⬜ CON-03

Legend: ⬜ not started · 🟨 static done (no motion) · ✅ complete (static + motion + review)

## Placeholders to replace

All 8 data files in `src/data/` are populated with complete, valid mock/dummy information for comprehensive UI testing. They will be replaced with real user data when ready:

| File                                      | Content Populated                                                                                                      | Replaced with Real Data     |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| `src/data/site.json`                      | Name, role, hero copy, availability, socials, SEO                                                                      | Pending user confirmation   |
| `src/data/profile.json`                   | Bio, summary, quick facts, gallery, interests, hobbies, basic info                                                     | Pending user confirmation   |
| `src/data/services.json`                  | 3 full services (Web Dev, Backend, Cloud & DevOps)                                                                     | Pending user confirmation   |
| `src/data/experience.json`                | 3 companies & engineering roles with skills and projects                                                               | Pending user confirmation   |
| `src/data/education.json`                 | B.Tech CSE & Higher Secondary degrees with coursework                                                                  | Pending user confirmation   |
| `src/data/projects.json`                  | 4 diverse projects (Analytics, API Toolkit, Inventory, Portfolio)                                                      | Pending user confirmation   |
| `src/data/skills.json`                    | 12 categorized skills (100% referenced, 0 warnings)                                                                    | Pending user confirmation   |
| `src/data/contact.json`                   | Email, phone, location, response time, CTA copy                                                                        | Pending user confirmation   |
| `public/images/brand/logo.svg`            | Standalone 44×44 geometric MAB monogram badge (name rendered in text)                                                  | Done                        |
| `public/images/brand/monogram.svg`        | Standalone 44×44 geometric MAB monogram badge                                                                          | Done                        |
| `public/icons/skills/*.svg`               | 12 authentic vector brand SVG icons (Java, Spring, Node, TS, React, Next, Tailwind, MySQL, Postgres, AWS, Docker, Git) | Done                        |
| `public/images/companies/*.svg`           | 3 company SVG badges (Tech Innovators, Apex Systems, CodeCraft Labs)                                                   | Done                        |
| `public/images/institutions/*.svg`        | 2 academic institution SVG badges (IET engineering crest, St. Paul school)                                             | Done                        |
| `public/images/projects/**`               | 7 high-res WebP project covers & gallery screenshots across all 4 projects                                             | Done                        |
| `public/images/gallery/**`                | 6 high-res WebP workspace & hobby images (reading, chess, coffee)                                                      | Done                        |
| `public/resume/mohd-ansar-bux-resume.pdf` | Formatted 1-page professional PDF resume                                                                               | Done                        |

## Deferred / known issues

- Phase 6: Replace the `window` scroll listeners in `Header` and `ScrollCue` with Motion `useScroll` / Lenis (rule in `04 §8`).
- Phase 6: `BackToTop` and the ScrollCue link should scroll through Lenis.
- Phase 7: Replace `public/hero/hero-poster.webp` with a still render of the real 3D scene, so the poster→WebGL cross-fade matches.
- Phase 9: Replace the scaffold `src/app/favicon.ico` with a brand icon.
- Phase 10: Durations for "Present" roles are computed at build time (`DEFAULT_REFERENCE_DATE`). Set up an automatic weekly rebuild (Vercel Deploy Hook + scheduled trigger) so durations stay current.


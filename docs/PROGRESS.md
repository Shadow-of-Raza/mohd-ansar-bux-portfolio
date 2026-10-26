# Build Progress

The agent updates this file at the end of every task (see `/build` step 6). Section IDs come from `docs/context/01-project-overview.md`.

## Phases (`02 §9`)

| Phase | Deliverable                                            | Status                                 | Date       | Notes                                                                                                                                                                                           |
| ----- | ------------------------------------------------------ | -------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Scaffold, tooling, tokens, data stubs                  | ✅ Done                                | 2026-10-16 | Next 16.4.1, React 19.3, Tailwind 4.3.3, Motion 14.2                                                                                                                                            |
| 1     | `ui/` primitives, `renderAccent()`, grain, style guide | ✅ Done                                | 2026-10-16 | All 16 ui/ primitives, renderAccent(), Grain overlay, dev-only /style-guide, full verify passed                                                                                                 |
| 2     | Data layer + full validator + sitemap/robots           | ✅ Done                                | 2026-10-16 | Schemas for all 8 files (Zod 4), loaders, relations, availability, dates/hasContent utils, validate-data script with all 6 error + 4 warning checks, sitemap.xml and robots.txt                 |
| 3     | Header, Footer, MobileMenu                             | 🟨 Done (static)                       | 2026-10-17 | Header, Footer, MobileMenu, NavLink, SkipLink, SocialLinks, BackToTop wired in layout.tsx. Verified keyboard navigation (skip link, Esc, focus trap) & responsive layout across 375/768/1440px. |
| 4     | Home sections HOME-00 → HOME-06 (static; HOME-07 skipped) | 🟨 Done (static)                    | 2026-10-21 | HOME-00 through HOME-06 Skills built static; HOME-07 skipped (covered by global footer CTA). Passed data validation, lint, typecheck, build, presence tests, and browser verification across 375/768/1440px. |
| 5     | Inner pages (About, Services, Experience, Education, Projects, Project Detail, Skills & Contact complete) | 🟨 Done (static)                       | 2026-10-26 | ABOUT-01–05, SERV-01–03, EXP-01–02, EDU-01–02, PROJ-01–02, PD-01–06, SK-01–02, and CON-01–03 built static with SSG routes, deep-link anchors, unused skill empty-state handling, and cross-linking verified. |
| 5b    | 404 page                                               | 🟨 Done (static)                       | 2026-10-26 | Standalone editorial 404 error page (Section 5.10) with fluid 404 text, accent headline, witty message, presence-guarded projects link, noindex metadata, and HTTP 404 confirmed on production server. |
| —     | Content step (real data & asset migration)             | ✅ Done                                | 2026-10-26 | Replaced all 8 data files with Mohd Ansar Bux's real content from `portfolio-content/`. Copied real resume PDF, added 16 skill SVGs, generated/downloaded company logos and neutral monograms, captured 1600×1000 project screenshots (with fake Jane Doe data for Resume Shapeshifter), dynamic ~2+ years career experience across all roles, hobbies rendered without image placeholders, interests omitted cleanly. |
| 6     | Motion layer                                           | ⬜                                     |            |                                                                                                                                                                                                 |
| 7     | 3D hero                                                | ⬜                                     |            |                                                                                                                                                                                                 |
| 8     | Contact action + Resend                                | ⬜                                     |            |                                                                                                                                                                                                 |
| 9     | SEO, a11y, performance                                 | ⬜                                     |            |                                                                                                                                                                                                 |
| 10    | Deploy                                                 | ⬜                                     |            | Set site.url and NEXT_PUBLIC_SITE_URL to real domain before deploy.                                                                                                                             |

## Sections

**Global:** 🟨 GLOBAL-HEADER · 🟨 GLOBAL-FOOTER

**404:** 🟨 404

**Home:** 🟨 HOME-00 · 🟨 HOME-01 · 🟨 HOME-02 · 🟨 HOME-03 · 🟨 HOME-04 · 🟨 HOME-05 · 🟨 HOME-06 · ⏭ HOME-07 (Skipped: covered by the global footer CTA)

**About:** 🟨 ABOUT-01 · 🟨 ABOUT-02 · 🟨 ABOUT-03 · 🟨 ABOUT-04 · 🟨 ABOUT-05 · ⏭ ABOUT-06 (Skipped: covered by the global footer CTA)

**Services:** 🟨 SERV-01 · 🟨 SERV-02 · 🟨 SERV-03 · ⏭ SERV-04 (Skipped: covered by the global footer CTA)

**Experience:** 🟨 EXP-01 · 🟨 EXP-02 · ⏭ EXP-03 (Skipped: covered by the global footer CTA)

**Education:** 🟨 EDU-01 · 🟨 EDU-02 · ⏭ EDU-03 (Skipped: covered by the global footer CTA)

**Projects:** 🟨 PROJ-01 · 🟨 PROJ-02 · ⏭ PROJ-03 (Skipped: covered by the global footer CTA)

**Project detail:** 🟨 PD-01 · 🟨 PD-02 · 🟨 PD-03 · 🟨 PD-04 · 🟨 PD-05 · 🟨 PD-06

**Skills:** 🟨 SK-01 · 🟨 SK-02 · ⏭ SK-03 (Skipped: covered by the global footer CTA)

**Contact:** 🟨 CON-01 · 🟨 CON-02 · 🟨 CON-03

Legend: ⬜ not started · 🟨 static done (no motion) · ✅ complete (static + motion + review) · ⏭ skipped (covered by the global footer CTA)

## Placeholders to replace

All 8 data files in `src/data/` have been replaced with real content from `portfolio-content/`. Retained placeholders are explicitly marked:

| File / Asset                              | Content Populated                                                                                                      | Status / Source                      |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `src/data/site.json`                      | Real name, role, hero copy, availability, socials (including globe & instagram), placeholder URL `ansarbux.dev`        | Replaced with real data              |
| `src/data/profile.json`                   | Real bio, summary, dynamic quick facts ("2+ years"), 3 hobbies (no images), interests omitted cleanly                  | Replaced with real data              |
| `src/data/services.json`                  | 3 real services (Full-Stack Web Development, Backend Architecture & APIs, Frontend Engineering & UI)                    | Replaced with real data              |
| `src/data/experience.json`                | 4 real roles (Apex Structure, Jaitrrrm, EduBridge, Pentagon Space) with exact dates and accomplishments                 | Replaced with real data              |
| `src/data/education.json`                 | 3 real academic qualifications (B.Tech, Intermediate, High School) with monogram fallbacks                             | Replaced with real data              |
| `src/data/projects.json`                  | 3 real projects (Apex Structure, Resume Shapeshifter, Alpha Way V1) across Professional and Open-Source types          | Replaced with real data              |
| `src/data/skills.json`                    | 26 real skills across 5 categories matching resume and experience                                                      | Replaced with real data              |
| `src/data/contact.json`                   | Real contact info (email, phone, location, availability, direct channels)                                              | Replaced with real data              |
| `public/resume/mohd-ansar-bux-resume.pdf` | Real 1-page PDF resume (166 KB)                                                                                        | Replaced with real file              |
| `public/icons/skills/*.svg`               | 26 authentic vector brand SVGs (removed postgresql/docker/graphql/kubernetes; added 16 new SVGs)                       | Replaced with real icons             |
| `public/images/companies/*`               | Real logos for Apex Structure, Jaitrrrm, EduBridge; neutral monogram for Pentagon Space                                | Replaced with real / neutral badges  |
| `public/images/projects/**`               | 9 crisp 1600×1000 WebP screenshots (Resume Shapeshifter captured with fake "Jane Doe" sample data & zero popups)     | Replaced with real screenshots       |
| `public/images/profile/portrait.webp`     | Editorial monochrome portrait placeholder                                                                              | Retained placeholder (@keep-current) |
| `public/images/gallery/01–03.webp`        | 3 editorial workspace gallery photos                                                                                   | Retained placeholder (@keep-current) |
| `public/hero/hero-poster.webp`            | Visual fallback poster for hero section                                                                                | Retained placeholder (@keep-current) |

## Deferred / known issues

- Phase 6: Replace the `window` scroll listeners in `Header` and `ScrollCue` with Motion `useScroll` / Lenis (rule in `04 §8`).
- Phase 6: `BackToTop` and the ScrollCue link should scroll through Lenis.
- Phase 7: Replace `public/hero/hero-poster.webp` with a still render of the real 3D scene, so the poster→WebGL cross-fade matches.
- Phase 8: Connect Resend SDK in `sendContactMessage` Server Action (`src/app/contact/actions.ts`). Note: `CONTACT_FROM_EMAIL` must be on a verified domain (or `onboarding@resend.dev` for testing), never a Gmail address.
- Phase 9: Replace the scaffold `src/app/favicon.ico` with a brand icon.
- Phase 10: Durations for "Present" roles are computed at build time (`DEFAULT_REFERENCE_DATE`). Set up an automatic weekly rebuild (Vercel Deploy Hook + scheduled trigger) so durations stay current.
- Phase 10: Set site.url and NEXT_PUBLIC_SITE_URL to the real domain (or the Vercel URL) before deploy (currently placeholder `https://ansarbux.dev`).



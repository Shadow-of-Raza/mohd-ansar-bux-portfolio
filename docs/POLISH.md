# Static Polish Pass Checklist

This document tracks all items for the static polish pass (no motion, no 3D; those belong to Phase 6 and Phase 7).
Implementation follows structured groups with before/after screenshots at 375px and 1440px viewports.

---

## Global (G1–G7)
- [x] **G1**: Inner-page hero top spacing is inconsistent (About/Services/Experience/Education start right under the header; Contact/Skills/Projects have more room). Make every inner-page hero use the same top spacing (one shared hero layout or token: `pt-28 pb-10 md:pt-36 md:pb-14` or shared token).
- [x] **G2**: Inner-page hero eyebrows: plain label, no number ("About", not "01 — About"). Numbered eyebrows stay only on Home sections and numbered sections inside a page.
- [x] **G3**: Hero count/status badges (Skills, Projects, Services, Contact) float alone on the right at 1440. Place them under the intro, left-aligned, as on Experience/Education.
- [x] **G4**: Footer bottom bar: "Back to top", "Sitemap" and copyright must use the same text size (`text-micro font-label`).
- [x] **G5**: Badge variants (Completed, Present, Professional, Live System…): check sizes match `text-micro` and the status dot is visible on "Live System".
- [x] **G6**: On `/contact`, hide the footer CTA band (it links to the page you're on).
- [x] **G7**: Confirm every image and logo loads in a real browser (no empty plates from lazy-loading).

---

## Home (H1–H6)
- [x] **H1**: Hero name wraps to 3 lines at 1440 and pushes the CTAs below a 1440×900 screen. Tune the size/column so the CTAs are visible without scrolling at 1440×900.
- [x] **H2**: Services cards: tech-chip rows align at the bottom across cards even when one wraps (`flex-1` top block, `mt-auto` tech row).
- [x] **H3**: Experience preview: show full-time roles only (internships/training only on `/experience`). The total stays "2+ years".
- [x] **H4**: Education timeline (desktop): reduce the large empty areas beside the cards (tighten width and balance metadata).
- [x] **H5**: Projects (3 cards): no lonely last card; make the first featured card larger (bento) so it differs from the Services grid.
- [x] **H6**: Skills popover on mobile opens over the heading. Fix placement/flipping on small screens (`/skills` too).

---

## Pages (A1, S1, E1, K1, C1–C3, P1)
- [x] **A1**: **About**: hobby rows without images must look intentional (no empty column; clean editorial split row).
- [x] **S1**: **Services**: on mobile each service is very long. Collapse Process and FAQ behind toggles on mobile only. Make "Ideal for" tags readable (not tiny small caps; `text-small`).
- [x] **E1**: **Experience**: hide the native scrollbar on the mobile/tablet company rail (no-scrollbar + edge fade, like the Services sub-nav), and stop truncating company names (let pills size to content and scroll).
- [x] **K1**: **Skills**: target highlight ring-offset must match the tile's surface (night). Reduce the big vertical gaps between one-row categories at 1440. Test the deep link by clicking a tech chip on a project page.
- [x] **C1**: **Contact**: widen the hero text column so the h1 doesn't wrap onto 3 lines at 1440.
- [x] **C2**: **Contact**: screenshot the inline errors, the loading state and keyboard focus-to-first-error.
- [x] **C3**: **Contact**: in `contact.json` change `cta.title` to `"Have an idea? Let's talk."` (no accent), so it doesn't compete with the hero accent.
- [x] **P1**: **Project detail**: check long titles at 375/768 and the status badge dot.

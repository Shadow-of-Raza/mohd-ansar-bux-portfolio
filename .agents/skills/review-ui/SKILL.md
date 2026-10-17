---
name: review-ui
description: Reviews a built page or section of the portfolio against the design system, the anti-"AI look" checklist, accessibility and the presence rule. Use after building UI, or when asked to review, audit or critique a page or section.
---

# Review UI

Usage: `/review-ui <route or SECTION-ID>`. Example: `/review-ui HOME-02`.

Review only. **Don't change code** unless I approve the proposed fixes.

## 1. Visual (screenshots at 375 / 768 / 1440 px)

Check against `docs/context/03-design-system.md`:

- [ ] Colour proportion feels like `night` with rare accent; the screen does not look "blue" (`03 §2`).
- [ ] Type uses the scale utilities, with strong contrast between display and label sizes (`03 §5`).
- [ ] At most one accent word per heading, in Averia italic `electric-300`.
- [ ] Asymmetric layout on the 12-column grid; container and section rhythm are correct (`03 §6`).
- [ ] Numbered eyebrow, hairline dividers, small radii, border-and-glow elevation (`03 §6–7`).
- [ ] Components match `03 §10`: button height, chip and badge styles, card padding.
- [ ] Images use consistent treatment and aspect ratios (`03 §8`, `01 §7`).

Then go through the **"Not AI-generated" checklist (`03 §11`)** item by item and mark each one pass or fail.

## 2. Content

- [ ] Every personal string comes from JSON; nothing is hard-coded in the section.
- [ ] Copy follows `01 §7`: specific, first person, numbers over adjectives, length limits.
- [ ] Any `[PLACEHOLDER]` text is listed.

## 3. Accessibility

- [ ] One `h1` on the page, headings in order, correct landmarks.
- [ ] In a keyboard pass, every control is reachable and the focus ring is visible.
- [ ] Touch targets are ≥ 44 px.
- [ ] Images have meaningful `alt` (empty only when decorative).
- [ ] External links have the hidden "(opens in new tab)" text.
- [ ] Text/background pairs follow the allowed list in `03 §4`.
- [ ] Hover-only info also works on focus and tap.

## 4. Presence rule test

1. Back up the relevant `src/data/*.json` file to your scratch area, outside `src/`.
2. Empty the data the section depends on, one level at a time:
   - the whole list or object, so the section must disappear and links to its page must disappear if the page becomes empty;
   - one subsection (e.g. `faqs`), so only that block disappears;
   - one optional field (e.g. `links.github`), so only that element disappears.
3. After each change, reload and confirm:
   - no empty headings or wrappers;
   - no console errors;
   - `pnpm validate:data` still passes for valid-empty data.
4. **Restore the original file from the backup** and confirm it is byte-identical to the backup. Never leave data modified.

## 5. Motion (Phase 6+ only)

- [ ] The animation matches the section's spec in `04 §5`, using tokens.
- [ ] With `prefers-reduced-motion: reduce`, the behaviour matches `04 §7`.
- [ ] No layout shift while elements reveal.

## 6. Report

For each section above, output a table with the columns **Check | Pass/Fail | Evidence | Proposed fix**. End with a prioritised fix list (must-fix, should-fix, nice-to-have) and wait for my approval.

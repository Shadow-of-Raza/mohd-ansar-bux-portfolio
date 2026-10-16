---
trigger: glob
globs: "src/data/**, src/lib/data/**, src/lib/utils/**, src/sections/**, src/app/**, scripts/**"
description: "JSON content files, Zod schemas, loaders, availability, page composition and the presence rule."
---

# Data layer & presence rules

Full spec: @docs/context/05-data-and-content-flow.md (schemas and examples in §5, presence rules in §4, validator in §8).

## JSON content (`src/data/*.json`)
- Collection files share the shape `{ page, home, items }` (`05 §2`). `site`, `profile` and `contact` have their own shapes (`05 §5`).
- `id` and `slug` are kebab-case and unique per file. Other files reference skills and projects **by id or slug**, never by copying their data.
- Dates are `YYYY-MM` (or `YYYY-MM-DD`). `end: null` means present.
- Every image object has `src`, `alt`, `width`, `height`, and the file must exist in `public/`.
- Accent words go in single asterisks (`"Selected *work*"`), max one per string. Paragraphs are arrays of strings. No HTML, no `\n`.
- **Never store computed values**: durations, total experience, skill usage, counts. These are derived in `lib/data/relations.ts` and `lib/utils/dates.ts`.
- Placeholder content (only with my permission) starts with `[PLACEHOLDER]`.

## Schemas (`src/lib/data/schemas.ts`)
- Starts with `import "server-only"`. Zod 4.
- Types are inferred with `z.infer`, never hand-written.
- Empty strings become `undefined` (`optText`), and text lists drop empty items.
- Zod 4 notes:
  - prefer `z.url()` over the deprecated `z.string().url()` shown in the doc sketch;
  - `.default()` returns the default without parsing it, so use `.prefault()` when nested defaults must be applied.

## Loaders (`src/lib/data/loaders.ts`)
- Parse each file once at module level. Throw on invalid data, which fails the build.
- Filter `visible !== false`, sort per `05 §5`, slice previews by `home.limit`.
- **Return `null` when nothing renderable remains.** Use `hasContent()` from `lib/utils/has-content.ts`.
- Return plain serialisable objects (no `Map` or class instances to client components).

## Availability (`src/lib/data/availability.ts`)
- `getNavItems()` is the single source for which pages exist. The Header, the Footer "Pages" column and `app/sitemap.ts` must all use it.
- Never hand-list routes anywhere else.

## Pages (`src/app/**`)
- Only `page.tsx`, `layout.tsx`, `sitemap.ts`, `robots.ts` and `generateMetadata` call loaders.
- If a page's loader returns `null`, call `notFound()`.
- `generateMetadata()` uses `page.seo`, falling back to `site.seo`.

## Sections (`src/sections/**`)
- Props are `{ data: X | null }`. The **first statement** is the presence check: `if (!data || <empty>) return null;`
- Guard every subsection and field individually. Never render a heading or wrapper whose content is empty.
- Render "See all" / "Read more" only when the target page or anchor is guaranteed to exist (`05 §4.3`).
- Follow the section contract in `02 §6`.
- Sections never import JSON or loaders.

## Validator (`scripts/validate-data.ts`)
- When a schema or a cross-file reference changes, update the validator in the same task. It must cover every check in `05 §8`.
- Run `pnpm validate:data` after any JSON change.

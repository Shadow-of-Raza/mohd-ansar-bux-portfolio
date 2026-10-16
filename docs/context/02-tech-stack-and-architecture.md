# 02 — Tech Stack & Architecture

## 1. Stack

| Concern | Choice | Version policy | Why |
|---|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | latest `16.x` | Static generation, file routing, Metadata/Sitemap APIs, `next/image`, `next/font` |
| UI runtime | **React 19** | ships with Next 16 | Server Components, Actions |
| Language | **TypeScript** (strict) | latest `5.x` | Types inferred from data schemas |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`) | latest `4.x` | Design tokens live in CSS; default palette disabled |
| Class utils | `clsx` + `tailwind-merge` → `cn()` | latest | Conditional, conflict-free classes |
| Data validation | **Zod** | latest `4.x` | Validate every JSON file at build; infer TS types. Use v4 APIs (`z.url()`, `.prefault()`) |
| Smooth scroll | **Lenis** | latest `1.x` | Weighted, cinematic scrolling without hijacking |
| Scroll-driven animation | **GSAP** + ScrollTrigger + SplitText, `@gsap/react` | latest `3.x` | Scrubbed timelines, pinning, text splitting (all GSAP plugins are free) |
| Component animation | **Motion** (`motion/react`, formerly Framer Motion) | latest `14.x` | Hover, presence, layout animations, header show/hide |
| 3D | **three** + **@react-three/fiber** + **@react-three/drei** | R3F `9.x`, drei `10.x` (React 19) | One lazy-loaded hero scene |
| UI icons | **lucide-react** | latest | Thin, consistent stroke icons |
| Skill logos | Local SVGs in `public/icons/skills/` (sourced from Devicon / official brand kits) | — | No icon-library gaps; full control over mono/colour states |
| Email | **Resend** via a Server Action | latest | Contact form delivery |
| Lint / format | ESLint (flat config, `eslint .`) + Prettier + `prettier-plugin-tailwindcss` | latest | Next 16 removed `next lint`; run ESLint directly |
| Scripts | `tsx` | latest | Run the data validator before build |
| Package manager | **pnpm** | latest | Fast, strict |
| Runtime | Node.js **20.9+** (24 LTS used locally; `.nvmrc` = 24, match on Vercel) | — | Next 16 requirement |
| Hosting | **Vercel** | — | Zero-config Next.js, image optimisation, previews |

> Pin **major** versions in `package.json`; let the lockfile hold exact minors. **Installed versions in `package.json` are authoritative** — never downgrade a package to match this table; update the table instead.
>
> Installed at Phase 0 (2026-10-16): next 16.4.1 · react 19.3.0 · tailwindcss 4.3.3 · typescript 5.9.3 · motion 14.2.0 · gsap 3.15.0 · lenis 1.3.26 · three 0.186.1 · @react-three/fiber 9.8.2 · @react-three/drei 10.7.9 · zod 4.6.7 · pnpm 12.

### Install

```bash
pnpm create next-app@latest portfolio --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --turbopack --yes
cd portfolio

pnpm add motion gsap @gsap/react lenis three @react-three/fiber @react-three/drei zod clsx tailwind-merge lucide-react resend server-only
pnpm add -D @types/three prettier prettier-plugin-tailwindcss eslint-config-prettier tsx
```

### `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "validate:data": "tsx scripts/validate-data.ts",
    "prebuild": "pnpm validate:data",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "format": "prettier --write ."
  }
}
```

### Environment variables (`.env.local`, never committed)

```bash
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=you@yourdomain.com
CONTACT_FROM_EMAIL=portfolio@yourdomain.com   # verified sender domain in Resend
```

---

## 2. Rendering strategy

| Route | Strategy |
|---|---|
| All pages | **Static (SSG)** at build time — data is imported JSON |
| `/projects/[slug]` | `generateStaticParams()` from visible projects; `export const dynamicParams = false` → unknown slugs 404 |
| `/contact` | Static page; the form posts to a **Server Action** (runs on demand) |
| `sitemap.ts`, `robots.ts` | Generated from the same availability logic as the nav |

Next 16 note: `params` and `searchParams` are **Promises** in page props — always `await` them.

---

## 3. Folder structure

```
portfolio/
├─ .agents/
│  ├─ rules/                       # Antigravity rules: design-system, motion, data-layer
│  └─ skills/                      # /build, /verify, /review-ui
├─ AGENTS.md                       # always-on project rules for the agent
├─ docs/
│  ├─ context/                     # these .md files
│  └─ PROGRESS.md                  # build status, placeholders, deferred items
├─ public/
│  ├─ images/
│  │  ├─ brand/                    # logo.svg, monogram.svg
│  │  ├─ profile/                  # portrait(s)
│  │  ├─ gallery/                  # about-page photos
│  │  ├─ projects/{slug}/          # cover.webp, 01.webp, 02.webp…
│  │  ├─ services/                 # optional service covers
│  │  ├─ companies/                # company logos
│  │  ├─ institutions/             # school/college logos
│  │  └─ og/                       # social share images
│  ├─ icons/skills/                # react.svg, nextjs.svg, java.svg…
│  ├─ hero/                        # 3D fallback poster (hero-poster.webp)
│  └─ resume/                      # your-name-resume.pdf
├─ scripts/
│  └─ validate-data.ts             # schema + reference + file-exists checks (prebuild)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                # fonts, <SmoothScroll>, Header, Footer, Grain, Cursor
│  │  ├─ template.tsx              # page-enter transition (client)
│  │  ├─ page.tsx                  # Home — composes home sections
│  │  ├─ not-found.tsx
│  │  ├─ globals.css               # Tailwind import + @theme tokens (see 03)
│  │  ├─ sitemap.ts
│  │  ├─ robots.ts
│  │  ├─ about/page.tsx
│  │  ├─ services/page.tsx
│  │  ├─ experience/page.tsx
│  │  ├─ education/page.tsx
│  │  ├─ projects/
│  │  │  ├─ page.tsx
│  │  │  └─ [slug]/page.tsx
│  │  ├─ skills/page.tsx
│  │  └─ contact/
│  │     ├─ page.tsx
│  │     └─ actions.ts             # "use server" — sendContactMessage()
│  ├─ components/                  # reusable, data-agnostic building blocks
│  │  ├─ layout/                   # Header, Footer, MobileMenu, NavLink, SkipLink
│  │  ├─ ui/                       # Button, LinkButton, Badge, Chip, Card, Container,
│  │  │                            # Section, SectionHeading, Eyebrow, Popover, Accordion,
│  │  │                            # Input, Textarea, Select, Lightbox, CopyButton
│  │  ├─ motion/                   # SmoothScroll, Reveal, SplitHeading, Parallax,
│  │  │                            # Magnetic, TiltCard, Spotlight, Marquee, Cursor,
│  │  │                            # Preloader, PageCurtain, ScrollProgress
│  │  ├─ three/                    # HeroCanvas (client, lazy), HeroObject, Particles, Rig
│  │  └─ shared/                   # SkillChip, SkillTile, ProjectCard, ServiceCard,
│  │                               # ExperienceItem, TimelineItem, SocialLinks,
│  │                               # ResumeButton, DateRange, StatusBadge
│  ├─ sections/                    # page-specific compositions; receive data via props
│  │  ├─ home/                     # HeroSection, AboutPreviewSection, ServicesPreviewSection,
│  │  │                            # ExperiencePreviewSection, EducationTimelineSection,
│  │  │                            # ProjectsPreviewSection, SkillsShowcaseSection
│  │  ├─ about/                    # AboutIntroSection, GallerySection, InterestsSection,
│  │  │                            # HobbiesSection, PersonalInfoSection
│  │  ├─ services/                 # ServicesHeroSection, ServicesSubNav, ServiceDetailSection
│  │  ├─ experience/               # ExperienceHeroSection, ExperienceListSection
│  │  ├─ education/                # EducationHeroSection, EducationTimelineDetailSection
│  │  ├─ projects/                 # ProjectsHeroSection, ProjectsExplorer (client)
│  │  ├─ project-detail/           # PdHero, PdMeta, PdLinks, PdWriteup, PdGallery, PdPager
│  │  ├─ skills/                   # SkillsHeroSection, SkillGroupsSection
│  │  ├─ contact/                  # ContactHeroSection, ContactFormSection (client), ContactDetailsSection
│  │  └─ common/                   # ContactCtaSection, PageHero
│  ├─ data/                        # ← ALL content. See 05.
│  │  ├─ site.json
│  │  ├─ profile.json
│  │  ├─ services.json
│  │  ├─ experience.json
│  │  ├─ education.json
│  │  ├─ projects.json
│  │  ├─ skills.json
│  │  └─ contact.json
│  ├─ lib/
│  │  ├─ data/                     # server-only
│  │  │  ├─ schemas.ts             # Zod schemas + inferred types
│  │  │  ├─ loaders.ts             # getSite(), getProfile(), getProjects()…
│  │  │  ├─ relations.ts           # skill usage map, lookups by id
│  │  │  └─ availability.ts        # which pages/sections exist → nav, footer, sitemap
│  │  ├─ motion/
│  │  │  ├─ tokens.ts              # durations, easings, staggers (see 04 §3)
│  │  │  └─ gsap.ts                # "use client" — registers ScrollTrigger, SplitText once
│  │  ├─ utils/                    # cn.ts, dates.ts, has-content.ts, format.ts
│  │  ├─ fonts.ts                  # next/font declarations (see 03 §5)
│  │  └─ seo.ts                    # buildMetadata() helper
│  ├─ hooks/                       # useReducedMotion, useMediaQuery, usePointerFine,
│  │                               # useLenis, useInView, useScrollDirection
│  └─ types/                       # shared non-data types (data types come from schemas.ts)
├─ .env.local
├─ eslint.config.mjs
├─ prettier.config.mjs
├─ next.config.ts
├─ tsconfig.json
└─ package.json
```

---

## 4. Layering rules

```
app/ (routes)  ──reads──►  lib/data (server-only)
     │
     └─passes props──► sections/  ──composes──►  components/
                                                    │
                                     client leaves ("use client") only here
```

1. **Only `app/**/page.tsx`, `layout.tsx`, `sitemap.ts`, `robots.ts` and `generateMetadata` call loaders.** Sections and components never import JSON or loaders.
2. **Sections** are page-specific. They receive already-shaped data and decide layout. They may be Server Components that contain client leaves.
3. **Components** are generic and reusable across pages. No knowledge of which JSON they came from.
4. **Client components** receive only serialisable props (plain objects, strings, numbers, arrays). Never pass functions or class instances from server to client.
5. `lib/data/*` starts with `import "server-only";` so JSON parsing never ships to the browser.
6. No barrel `index.ts` files in `components/` (keeps tree-shaking and client boundaries obvious). Import by path.

---

## 5. Conventions

| Item | Rule |
|---|---|
| File names | `PascalCase.tsx` for components, `camelCase.ts` for utils/hooks, `kebab-case` for route folders and image files |
| Exports | Named exports for components (`export function ProjectCard`). Default exports only where Next requires them (pages, layouts, template, not-found) |
| Props | `type Props = {...}` above the component; accept `className?: string` on every visual component and merge with `cn()` |
| Server vs client | Server by default. Add `"use client"` only for: state, effects, event handlers, Motion/GSAP/Lenis/R3F usage, browser APIs |
| Styling | Tailwind utilities with design-token classes only (`bg-night`, `text-fg-muted`). No arbitrary hex values (`bg-[#123456]`) — the default palette is disabled (see 03 §3) |
| Copy | Section headings, labels and button text that are personal content come from JSON. Pure UI strings ("Clear filters", "Close") may live in components |
| Images | Always `next/image` with `width`, `height` (from JSON) and `sizes`. Hero/LCP image gets `priority` |
| Links | Internal: `next/link`. External: `target="_blank" rel="noopener noreferrer"` + visually-hidden "(opens in new tab)" |
| Accessibility | Semantic landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, headings in order, visible focus states, 44 px minimum touch targets |

---

## 6. Section contract

Every section component follows the same shape so presence rules are enforced in one place:

```tsx
// sections/home/ServicesPreviewSection.tsx
import type { ServicesData } from "@/lib/data/schemas";
import { Section } from "@/components/ui/Section";
import { ServiceCard } from "@/components/shared/ServiceCard";

type Props = { data: ServicesData | null };

export function ServicesPreviewSection({ data }: Props) {
  if (!data || data.featured.length === 0) return null;   // presence rule

  return (
    <Section id="services" eyebrow={data.home.eyebrow} title={data.home.title} intro={data.home.intro}>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {data.featured.map((s, i) => <ServiceCard key={s.id} service={s} index={i} />)}
      </div>
      {/* "See all" only when the Services page exists — guaranteed by data !== null */}
    </Section>
  );
}
```

`Section` renders: `<section id aria-labelledby>` → `Container` → `Eyebrow` (`01 — Services`) → `SectionHeading` (with `SplitHeading` reveal) → optional intro → children. It omits eyebrow/title/intro elements individually when their strings are empty.

---

## 7. Page composition example

```tsx
// app/page.tsx (Home)
import { getHomeData } from "@/lib/data/loaders";
import { HeroSection } from "@/sections/home/HeroSection";
// …other imports

export default function HomePage() {
  const d = getHomeData();  // every key is data | null
  return (
    <>
      <HeroSection data={d.hero} />
      <AboutPreviewSection data={d.about} />
      <ServicesPreviewSection data={d.services} />
      <ExperiencePreviewSection data={d.experience} />
      <EducationTimelineSection data={d.education} />
      <ProjectsPreviewSection data={d.projects} />
      <SkillsShowcaseSection data={d.skills} />
      <ContactCtaSection data={d.contactCta} />
    </>
  );
}
```

```tsx
// app/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getProjectBySlug, getProjects } from "@/lib/data/loaders";

export const dynamicParams = false;

export function generateStaticParams() {
  return (getProjects()?.items ?? []).map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  // …compose PD-01…PD-06
}
```

---

## 8. SEO & metadata
- `app/layout.tsx` exports base `metadata` (title template `%s — {Name}`, description, `metadataBase` from `NEXT_PUBLIC_SITE_URL`, Open Graph, Twitter card) built from `site.json`.
- Each page exports `generateMetadata()` using its JSON `page.seo` block, falling back to `site.seo`.
- `sitemap.ts` lists only available routes + every visible project slug.
- JSON-LD `Person` schema on Home (name, jobTitle, url, sameAs = socials).
- Project detail pages use the project cover as OG image.

## 9. Build phases

| Phase | Deliverable | Done when |
|---|---|---|
| 0 | Scaffold, lint/format, env, folder skeleton, tokens, data stubs ✅ | `pnpm dev`, `pnpm lint`, `pnpm typecheck` pass |
| 1 | Design tokens, fonts, `ui/` primitives | Style-guide route (dev only) shows all primitives correctly |
| 2 | Data layer: schemas, loaders, relations, availability, validator | Removing a JSON array hides its page, nav link and sitemap entry |
| 3 | Layout: Header, Footer, MobileMenu | Keyboard and mobile pass |
| 4 | Home sections HOME-00 → HOME-07 (static, no motion) | Matches 01 §5.1 |
| 5 | Inner pages + project detail | Matches 01 §5.2–5.10 |
| 6 | Motion layer: Lenis, reveals, transitions, hovers | Matches 04, reduced-motion verified |
| 7 | 3D hero scene + fallback | 60 fps desktop, poster on low-end/mobile |
| 8 | Contact action + Resend | Real email received; spam guards work |
| 9 | SEO, a11y audit, performance pass | Targets in 01 §1 met |
| 10 | Deploy to Vercel + domain | Production URL live |

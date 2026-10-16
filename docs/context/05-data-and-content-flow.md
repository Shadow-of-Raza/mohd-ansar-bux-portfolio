# 05 — Data & Content Flow

## 1. Principles

1. **JSON is the single source of truth.** All personal content lives in `src/data/*.json`. Components never contain it.
2. **Validated at build.** Every file is parsed with Zod. A typo fails the build instead of shipping a broken page.
3. **Typed end-to-end.** TypeScript types are inferred from the Zod schemas — never hand-written twice.
4. **Presence-driven rendering.** Missing or empty data → the page/section/subsection/field is **not rendered**, and every link pointing to it disappears.
5. **Reference by id, never duplicate.** Projects, services and experience reference skills by `id`. Skill usage is computed, never typed by hand.
6. **Server-only parsing.** JSON is imported and shaped on the server at build time; the browser only receives the props each client component needs.

---

## 2. Files

| File              | Holds                                                                                    | Drives                                                             |
| ----------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `site.json`       | Name, role, logo, hero copy, availability, socials, footer intro, global SEO             | Header, Footer, Hero, metadata, JSON-LD                            |
| `profile.json`    | About content: summaries, bio, portrait, resume, gallery, interests, hobbies, basic info | HOME-01, `/about`                                                  |
| `services.json`   | Services and their detail blocks                                                         | HOME-02, `/services`, footer services column, contact form options |
| `experience.json` | Companies → roles                                                                        | HOME-03, `/experience`                                             |
| `education.json`  | Education entries                                                                        | HOME-04, `/education`                                              |
| `projects.json`   | Projects and write-ups                                                                   | HOME-05, `/projects`, `/projects/[slug]`, skill usage              |
| `skills.json`     | Skill catalogue, categories, empty-usage copy                                            | HOME-06, `/skills`, every tech chip                                |
| `contact.json`    | Contact details, form copy and toggle                                                    | `/contact`, footer CTA, HOME-07                                    |

### Shared file shape

Every collection file uses the same three top-level keys so pages and home previews are configured consistently:

```json
{
  "page": { "eyebrow": "", "title": "", "intro": "", "seo": { "title": "", "description": "" } },
  "home": { "eyebrow": "", "title": "", "intro": "", "limit": 3 },
  "items": []
}
```

- `page` → the dedicated page's hero/SEO. `home` → the Home preview section's copy and item limit.
- If `items` is empty (after removing hidden items), **both** the page and the home section disappear, regardless of copy.

### Common item fields

| Field      | Type                                   | Meaning                                       |
| ---------- | -------------------------------------- | --------------------------------------------- |
| `id`       | string, unique per file                | Stable reference key (`kebab-case`)           |
| `slug`     | string, unique (where routed/anchored) | URL segment or anchor                         |
| `visible`  | boolean, default `true`                | `false` = draft; treated as absent everywhere |
| `featured` | boolean, default `false`               | Eligible for Home preview                     |
| `order`    | number, optional                       | Manual sort; lower first                      |

---

## 3. Pipeline

```
 src/data/*.json
       │  import (build time, server-only)
       ▼
 lib/data/schemas.ts ── Zod parse ──► throws on invalid shape (build fails)
       │
       ▼
 lib/data/loaders.ts
   • clean: empty strings → undefined, drop empty arrays/objects
   • filter: visible === true
   • sort: order → date desc
   • slice: home.limit for previews
   • return null when nothing remains
       │
       ├──► lib/data/relations.ts   (skill lookup, skill usage map, durations)
       │
       └──► lib/data/availability.ts (which pages/sections exist → nav, footer, sitemap)
                 │
                 ▼
 app/**/page.tsx  (server)  ── props ──►  sections/*  ──►  components/*
                                                         └─► client leaves get serialisable props only
```

`scripts/validate-data.ts` runs the same schemas **plus** cross-file checks before every build (§8).

---

## 4. Presence rules

### 4.1 What counts as "empty"

A value is empty if it is: missing, `null`, `""` / whitespace, `[]`, `{}`, an array whose items are all empty or hidden, or an object whose content fields are all empty. Flags (`visible`, `featured`) and numbers like `order` do **not** count as content.

### 4.2 The four levels

| Level          | Rule                                                                                                                          | Example                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Page**       | Loader returns `null` → page calls `notFound()`; nav, footer, sitemap and all "See all" / "Read more" links to it are removed | `education.json` has no visible items → no `/education`, no nav link, HOME-04 hidden |
| **Section**    | Section component receives `null` or empty list → `return null`                                                               | No featured services → HOME-02 hidden (Services page still exists if it has items)   |
| **Subsection** | Block inside a section renders only if its data exists                                                                        | Service has no `faqs` → FAQ block not rendered; no empty heading                     |
| **Field**      | Each field renders only if present                                                                                            | Project has no `links.github` → no GitHub button; no `score` → no score row          |

### 4.3 Derived rules

- **Home "See all" buttons** render only when the target page exists (always true when the preview has data, since preview items are a subset).
- **"Read more"** on a card links to an anchor/page that is guaranteed to exist (same item).
- **GitHub link** renders only if `type === "open-source"` **and** `links.github` exists.
- **Live link** renders whenever `links.live` exists. If neither link exists and `confidential` is true → show "Private / under NDA".
- **Services sub-nav** renders only with ≥ 2 services. **Project type filter** shows only types present; hides entirely if only one type exists. **Tech filter** lists only skills used by ≥ 1 visible project.
- **Skill popover** always renders: usage list if used, otherwise `usage.emptyLabel` + `usage.emptyCta`.
- **Contact page** exists if `contact.email` exists or `contact.form.enabled` is true. Form only renders if enabled **and** server env vars are set.
- **Resume button** renders only if `profile.resume.file` exists (validator checks the file is in `public/`).
- **Footer Services column** hides if there are no services; **socials row** hides if `site.socials` is empty.
- **Home Hero** falls back to `site.name` + `site.role` if `site.hero` is missing; it's the only section that always renders.

---

## 5. Schemas & examples

> Examples are shortened. `…` means "more items like this". Dates use `YYYY-MM` (or `YYYY-MM-DD`); `end: null` means _present_. Image objects always carry `src`, `alt`, `width`, `height`.

### 5.1 `site.json`

```json
{
  "name": "Your Name",
  "role": "Full-Stack Software Engineer",
  "location": "Indore, India",
  "url": "https://yourdomain.com",
  "logo": {
    "text": "YN",
    "src": "/images/brand/logo.svg",
    "alt": "Your Name logo",
    "width": 120,
    "height": 40
  },
  "availability": { "open": true, "label": "Open to freelance & full-time roles" },
  "hero": {
    "eyebrow": "Full-stack engineer — Indore, India",
    "headline": "I build web products that *ship*",
    "intro": "Java, Spring Boot, Node.js and React/Next.js — from database to deploy.",
    "primaryCta": { "label": "View projects", "href": "/projects" },
    "secondaryCta": { "label": "Contact me", "href": "/contact" },
    "poster": { "src": "/hero/hero-poster.webp", "alt": "", "width": 1600, "height": 1200 }
  },
  "socials": [
    { "id": "github", "label": "GitHub", "url": "https://github.com/you", "icon": "github" },
    { "id": "linkedin", "label": "LinkedIn", "url": "https://linkedin.com/in/you", "icon": "linkedin" }
  ],
  "footer": {
    "intro": "Engineer building fast, dependable web products for teams and businesses.",
    "ctaTitle": "Have a project *in mind?*"
  },
  "seo": {
    "title": "Your Name — Full-Stack Software Engineer",
    "description": "Portfolio of Your Name, full-stack engineer working with Java, Spring Boot, Node.js, React and Next.js.",
    "ogImage": {
      "src": "/images/og/default.jpg",
      "alt": "Your Name portfolio",
      "width": 1200,
      "height": 630
    },
    "keywords": ["full-stack developer", "Next.js developer", "Spring Boot developer", "Indore"]
  }
}
```

### 5.2 `profile.json`

```json
{
  "page": {
    "eyebrow": "About",
    "title": "The person *behind* the code",
    "intro": "",
    "seo": { "title": "About", "description": "" }
  },
  "home": {
    "eyebrow": "About me",
    "title": "Engineer, builder, *problem-solver*",
    "summary": ["Two short paragraphs for the home preview…", "…"],
    "facts": [
      { "label": "Experience", "value": "2+ years" },
      { "label": "Based in", "value": "Indore, India" }
    ]
  },
  "portrait": {
    "src": "/images/profile/portrait.webp",
    "alt": "Portrait of Your Name",
    "width": 1200,
    "height": 1500
  },
  "bio": ["Longer paragraph 1…", "Paragraph 2…"],
  "resume": { "file": "/resume/your-name-resume.pdf", "label": "Download resume", "updated": "2026-10" },
  "gallery": [
    {
      "src": "/images/gallery/01.webp",
      "alt": "Speaking at a meetup",
      "caption": "Meetup, 2025",
      "width": 1600,
      "height": 1067
    }
  ],
  "interests": {
    "title": "What I'm *into*",
    "items": [
      {
        "id": "system-design",
        "title": "System design",
        "description": "Designing services that stay simple as they scale.",
        "icon": "network"
      }
    ]
  },
  "hobbies": {
    "title": "Away from the *keyboard*",
    "items": [
      {
        "id": "photography",
        "title": "Photography",
        "description": "Street and travel.",
        "image": { "src": "/images/gallery/hobby-photo.webp", "alt": "", "width": 800, "height": 1000 }
      }
    ]
  },
  "basicInfo": {
    "title": "Basic *information*",
    "items": [
      { "label": "Full name", "value": "Your Name" },
      { "label": "Nationality", "value": "Indian" },
      { "label": "Languages", "value": "English, Hindi" },
      { "label": "Location", "value": "Indore, India" }
    ]
  }
}
```

`basicInfo.items` is a free label/value list: add "Date of birth" or "Marital status" only if you want them public — whatever is listed renders, nothing else does.

**About page exists** when `bio` or `home.summary` has content.

### 5.3 `services.json`

```json
{
  "page": {
    "eyebrow": "Services",
    "title": "What I can *build* for you",
    "intro": "",
    "seo": { "title": "Services", "description": "" }
  },
  "home": { "eyebrow": "Services", "title": "How I can *help*", "intro": "", "limit": 3 },
  "items": [
    {
      "id": "website-development",
      "slug": "website-development",
      "title": "Website Development",
      "tagline": "Fast, search-friendly websites that turn visitors into enquiries.",
      "summary": "Custom websites built with Next.js — quick to load, easy to find on Google, simple to update.",
      "icon": "monitor",
      "featured": true,
      "order": 1,
      "definition": ["Website development is…"],
      "whyNeeded": [
        { "title": "Be found", "description": "Most customers search online before they call or visit." },
        { "title": "Look credible", "description": "…" }
      ],
      "deliverables": ["Responsive design", "SEO setup", "Contact forms", "Analytics", "Deployment & domain"],
      "process": [
        { "title": "Discover", "description": "Goals, audience, content." },
        { "title": "Design", "description": "…" },
        { "title": "Build", "description": "…" },
        { "title": "Launch & support", "description": "…" }
      ],
      "technologies": ["nextjs", "react", "typescript", "tailwindcss", "aws"],
      "idealFor": ["Local businesses", "Startups", "Personal brands"],
      "faqs": [
        {
          "question": "How long does a website take?",
          "answer": "Typically 2–4 weeks for a small business site."
        }
      ],
      "cta": { "label": "Discuss this service" }
    }
  ]
}
```

### 5.4 `experience.json`

```json
{
  "page": {
    "eyebrow": "Experience",
    "title": "Where I've *worked*",
    "intro": "",
    "seo": { "title": "Experience", "description": "" }
  },
  "home": { "eyebrow": "Experience", "title": "Recent *roles*", "limit": 3 },
  "items": [
    {
      "id": "company-a",
      "company": {
        "name": "Company A Pvt. Ltd.",
        "logo": {
          "src": "/images/companies/company-a.svg",
          "alt": "Company A logo",
          "width": 64,
          "height": 64
        },
        "url": "https://company-a.com",
        "location": "Indore, India"
      },
      "roles": [
        {
          "id": "company-a-fse",
          "title": "Full-Stack Software Engineer",
          "employmentType": "Full-time",
          "mode": "On-site",
          "start": "2025-01",
          "end": null,
          "summary": "One line for the home preview.",
          "description": ["Paragraph about the role…"],
          "responsibilities": ["…", "…"],
          "achievements": ["Reduced report generation time from 40 s to 6 s", "…"],
          "skills": ["java", "spring-boot", "react", "mysql", "aws"],
          "projects": ["project-slug-1"]
        }
      ]
    }
  ]
}
```

- Items sort by their most recent role's `start` (desc). Roles within a company sort desc.
- Duration (`1 yr 4 mos`) and total experience are **computed** from dates (`lib/utils/dates.ts`), never typed.

### 5.5 `education.json`

```json
{
  "page": {
    "eyebrow": "Education",
    "title": "What I've *studied*",
    "intro": "",
    "seo": { "title": "Education", "description": "" }
  },
  "home": { "eyebrow": "Education", "title": "Learning *path*" },
  "items": [
    {
      "id": "btech",
      "degree": "Bachelor of Technology",
      "field": "Computer Science & Engineering",
      "institution": {
        "name": "Institute Name",
        "logo": {
          "src": "/images/institutions/institute.svg",
          "alt": "Institute logo",
          "width": 64,
          "height": 64
        },
        "url": "https://institute.edu"
      },
      "board": "University Name",
      "location": "Indore, India",
      "start": "2019-08",
      "end": "2023-06",
      "status": "completed",
      "score": { "label": "CGPA", "value": "8.2 / 10" },
      "highlights": ["Final-year project: …"],
      "coursework": ["Data Structures", "DBMS", "Operating Systems"]
    }
  ]
}
```

`status`: `"completed" | "pursuing"`. Home timeline shows **all** visible items (no limit); sorted by `start` desc.

### 5.6 `projects.json`

```json
{
  "page": {
    "eyebrow": "Projects",
    "title": "Selected *work*",
    "intro": "",
    "seo": { "title": "Projects", "description": "" }
  },
  "home": { "eyebrow": "Projects", "title": "Selected *work*", "limit": 6 },
  "items": [
    {
      "id": "project-slug-1",
      "slug": "project-slug-1",
      "title": "Project Name",
      "tagline": "One sentence on what it is.",
      "summary": "≤ 140 characters for cards.",
      "type": "professional",
      "organization": { "name": "Company A Pvt. Ltd.", "url": "https://company-a.com" },
      "role": "Full-stack developer",
      "status": "live",
      "featured": true,
      "order": 1,
      "confidential": false,
      "timeline": { "start": "2025-03", "end": "2025-05", "durationLabel": "10 weeks" },
      "links": { "github": null, "live": "https://example.com" },
      "cover": {
        "src": "/images/projects/project-slug-1/cover.webp",
        "alt": "Dashboard screenshot",
        "width": 1600,
        "height": 1000
      },
      "gallery": [
        { "src": "/images/projects/project-slug-1/01.webp", "alt": "…", "width": 1600, "height": 1000 }
      ],
      "techStack": [
        { "skill": "nextjs", "reason": "Static pages + server actions" },
        { "skill": "spring-boot" },
        { "skill": "mysql" }
      ],
      "writeup": {
        "overview": ["Intro paragraph…"],
        "purpose": ["Problem it solves…"],
        "features": ["Feature 1", "Feature 2"],
        "challenges": ["What was hard and how I solved it…"],
        "outcome": ["Result / impact…"]
      }
    }
  ]
}
```

- `type`: `"professional" | "open-source" | "freelance" | "personal"`. For `open-source`, `organization` may be omitted (UI shows "Open source").
- `status`: `"live" | "completed" | "in-progress" | "archived"`.
- **Time to complete:** shown from `timeline.durationLabel` if present, else computed from `start`/`end`.
- Sort: `featured` first, then `order`, then `timeline.end` desc (`null` end = newest).

### 5.7 `skills.json`

```json
{
  "page": {
    "eyebrow": "Skills",
    "title": "My *toolkit*",
    "intro": "",
    "seo": { "title": "Skills", "description": "" }
  },
  "home": { "eyebrow": "Skills", "title": "Tools I *work* with" },
  "usage": {
    "usedLabel": "Used in",
    "emptyLabel": "Not used in a project yet",
    "emptyCta": { "label": "Want to build something with it?", "href": "/contact" }
  },
  "categories": [
    { "id": "frontend", "label": "Frontend", "order": 1 },
    { "id": "backend", "label": "Backend", "order": 2 },
    { "id": "database", "label": "Database", "order": 3 },
    { "id": "cloud-devops", "label": "Cloud & DevOps", "order": 4 },
    { "id": "tools", "label": "Tools", "order": 5 }
  ],
  "items": [
    { "id": "java", "name": "Java", "category": "backend", "icon": "/icons/skills/java.svg" },
    {
      "id": "spring-boot",
      "name": "Spring Boot",
      "category": "backend",
      "icon": "/icons/skills/spring-boot.svg"
    },
    { "id": "nodejs", "name": "Node.js", "category": "backend", "icon": "/icons/skills/nodejs.svg" },
    {
      "id": "typescript",
      "name": "TypeScript",
      "category": "frontend",
      "icon": "/icons/skills/typescript.svg"
    },
    { "id": "react", "name": "React", "category": "frontend", "icon": "/icons/skills/react.svg" },
    { "id": "nextjs", "name": "Next.js", "category": "frontend", "icon": "/icons/skills/nextjs.svg" },
    {
      "id": "tailwindcss",
      "name": "Tailwind CSS",
      "category": "frontend",
      "icon": "/icons/skills/tailwindcss.svg"
    },
    { "id": "mysql", "name": "MySQL", "category": "database", "icon": "/icons/skills/mysql.svg" },
    { "id": "aws", "name": "AWS", "category": "cloud-devops", "icon": "/icons/skills/aws.svg" }
  ]
}
```

- **No usage data here.** Usage is computed (§6).
- Categories with no visible skills are hidden.

### 5.8 `contact.json`

```json
{
  "page": {
    "eyebrow": "Contact",
    "title": "Let's build something *together*",
    "intro": "",
    "seo": { "title": "Contact", "description": "" }
  },
  "email": "you@yourdomain.com",
  "phone": "+91 00000 00000",
  "location": "Indore, India",
  "responseTime": "Usually replies within 24 hours",
  "cta": { "title": "Have an idea? Let's *talk*.", "label": "Start a conversation" },
  "form": {
    "enabled": true,
    "otherOptionLabel": "Something else",
    "successTitle": "Message sent",
    "successMessage": "Thanks — I'll get back to you soon."
  }
}
```

Form "What can I help with?" options = visible services' titles + `otherOptionLabel`. Socials come from `site.json`.

---

## 6. Derived data (`lib/data/relations.ts`)

Computed once at build time:

| Derived                                                                                                    | From                                                               | Used by                                            |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| `skillById: Map<id, Skill>`                                                                                | skills                                                             | Every chip, validation                             |
| `skillUsage: Record<skillId, { projects: {slug,title}[]; companies: string[]; services: {slug,title}[] }>` | projects.techStack, experience.roles.skills, services.technologies | SkillTile popover, skills page                     |
| `projectsBySkill`                                                                                          | projects                                                           | Tech filter options (only skills with ≥ 1 project) |
| Role/total durations                                                                                       | experience dates                                                   | EXP-01, HOME-03                                    |
| Prev/next project                                                                                          | sorted projects                                                    | PD-06                                              |
| `serviceOptions`                                                                                           | services                                                           | Contact form select                                |

Client components (SkillTile, ProjectsExplorer) receive these as plain serialisable objects in props.

---

## 7. Code sketches

### 7.1 Helpers

```ts
// lib/utils/has-content.ts
const FLAG_KEYS = new Set(["visible", "featured", "order", "confidential"]);

export function hasContent(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  if (typeof value === "boolean") return false; // flags aren't content
  if (Array.isArray(value)) return value.some(hasContent);
  if (typeof value === "object")
    return Object.entries(value).some(([k, v]) => !FLAG_KEYS.has(k) && hasContent(v));
  return false;
}

export const nonEmpty = <T>(list: T[] | undefined | null): T[] | null =>
  list && list.length > 0 ? list : null;
```

### 7.2 Schemas (excerpt)

```ts
// lib/data/schemas.ts
import "server-only";
import { z } from "zod";

// "" and whitespace become undefined so components can rely on `?.`
const optText = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().trim().optional(),
);
const text = z.string().trim().min(1);
const textList = z
  .array(z.string().trim())
  .transform((a) => a.filter(Boolean))
  .optional();
const yearMonth = z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/);
const url = z.string().url().nullish();

export const ImageSchema = z.object({
  src: text,
  alt: z.string().default(""),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: optText,
});

const SeoSchema = z.object({ title: optText, description: optText }).partial().optional();
const PageCopy = z
  .object({ eyebrow: optText, title: optText, intro: optText, seo: SeoSchema })
  .partial()
  .default({});
const HomeCopy = z
  .object({ eyebrow: optText, title: optText, intro: optText, limit: z.number().int().positive().optional() })
  .partial()
  .default({});

const Base = {
  id: text,
  visible: z.boolean().default(true),
  featured: z.boolean().default(false),
  order: z.number().optional(),
};

export const ProjectSchema = z.object({
  ...Base,
  slug: text.regex(/^[a-z0-9-]+$/),
  title: text,
  tagline: optText,
  summary: optText,
  type: z.enum(["professional", "open-source", "freelance", "personal"]),
  organization: z.object({ name: text, url }).optional(),
  role: optText,
  status: z.enum(["live", "completed", "in-progress", "archived"]).optional(),
  confidential: z.boolean().default(false),
  timeline: z
    .object({ start: yearMonth.optional(), end: yearMonth.nullish(), durationLabel: optText })
    .optional(),
  links: z.object({ github: url, live: url }).partial().default({}),
  cover: ImageSchema.optional(),
  gallery: z.array(ImageSchema).default([]),
  techStack: z.array(z.object({ skill: text, reason: optText })).default([]),
  writeup: z
    .object({
      overview: textList,
      purpose: textList,
      features: textList,
      challenges: textList,
      outcome: textList,
    })
    .partial()
    .default({}),
});

export const ProjectsFileSchema = z.object({
  page: PageCopy,
  home: HomeCopy,
  items: z.array(ProjectSchema).default([]),
});

export type Project = z.infer<typeof ProjectSchema>;
// …same pattern for Site, Profile, Service, Experience, Education, Skill, Contact
```

### 7.3 Loaders & availability

```ts
// lib/data/loaders.ts
import "server-only";
import projectsJson from "@/data/projects.json";
import { ProjectsFileSchema, type Project } from "./schemas";

const projectsFile = ProjectsFileSchema.parse(projectsJson); // throws at build if invalid

const sortProjects = (a: Project, b: Project) =>
  Number(b.featured) - Number(a.featured) ||
  (a.order ?? Infinity) - (b.order ?? Infinity) ||
  (b.timeline?.end ?? "9999").localeCompare(a.timeline?.end ?? "9999");

export function getProjects() {
  const items = projectsFile.items.filter((p) => p.visible).sort(sortProjects);
  if (items.length === 0) return null;
  const limit = projectsFile.home.limit ?? 6;
  const featured = items.filter((p) => p.featured).slice(0, limit);
  return {
    page: projectsFile.page,
    home: projectsFile.home,
    items,
    featured: featured.length ? featured : items.slice(0, limit),
  };
}

export const getProjectBySlug = (slug: string) => getProjects()?.items.find((p) => p.slug === slug) ?? null;
```

```ts
// lib/data/availability.ts
import "server-only";
import {
  getProfile,
  getServices,
  getExperience,
  getEducation,
  getProjects,
  getSkills,
  getContact,
} from "./loaders";

export type NavItem = { href: string; label: string };

const ROUTES: (NavItem & { exists: () => boolean })[] = [
  { href: "/", label: "Home", exists: () => true },
  { href: "/about", label: "About", exists: () => getProfile() !== null },
  { href: "/services", label: "Services", exists: () => getServices() !== null },
  { href: "/experience", label: "Experience", exists: () => getExperience() !== null },
  { href: "/education", label: "Education", exists: () => getEducation() !== null },
  { href: "/projects", label: "Projects", exists: () => getProjects() !== null },
  { href: "/skills", label: "Skills", exists: () => getSkills() !== null },
];

export const getNavItems = (): NavItem[] =>
  ROUTES.filter((r) => r.exists()).map(({ href, label }) => ({ href, label }));
export const hasContactPage = () => getContact() !== null;
```

`Header`, `Footer` (Pages column = HTML sitemap) and `app/sitemap.ts` all call `getNavItems()` — one rule, three places, always in sync. Nav **order and labels** live in code (they're UI); everything else is data.

### 7.4 Text conventions inside JSON

- **Accent word:** wrap in single asterisks in any `title`/`headline` (`"Selected *work*"`). A tiny parser (`lib/utils/format.ts → renderAccent()`) turns it into the Averia italic `<em>` from 03 §5. Max one per string.
- **Paragraphs:** arrays of strings (`["para 1", "para 2"]`), never `\n` inside one string.
- **No HTML** in JSON. Links inside copy aren't supported by design — put them in structured fields.

---

## 8. Validation (`scripts/validate-data.ts`, runs on `prebuild`)

Fails the build (exit 1) with a readable list of problems if:

1. Any file fails its Zod schema.
2. Duplicate `id` or `slug` within a file.
3. A reference points nowhere: `techStack[].skill`, `roles[].skills`, `services[].technologies` → `skills.items[].id`; `roles[].projects` → `projects.items[].slug`; `skills.items[].category` → `skills.categories[].id`.
4. A local file doesn't exist in `public/`: every `src`, `icon`, `resume.file`.
5. Dates are invalid or `end` is before `start`.
6. `type: "open-source"` with a `links.github` that isn't a GitHub URL.

Warns (doesn't fail) if:

- More `featured` items than `home.limit`.
- A project has no `cover` or no `summary` (card will look thin).
- Image `alt` is empty on non-decorative images.
- A skill is not used anywhere (fine, but good to know).

---

## 9. Content workflow

**Add a project**

1. Create `public/images/projects/{slug}/` with `cover.webp` (+ gallery images).
2. Add an item to `projects.json` with a unique `id`/`slug`; reference skills by id.
3. Set `featured: true` to show it on Home.
4. `pnpm validate:data` → fix any reported issues → commit. The card, detail page, sitemap entry, filters and skill popovers update automatically.

**Hide something temporarily:** set `"visible": false`.
**Remove a whole page:** empty its `items` array (or set every item `visible: false`). Nav, footer, sitemap and home section follow.
**Add a skill:** add the SVG to `public/icons/skills/{id}.svg` and an item to `skills.json`. It appears with "Not used in a project yet" until a project references it.

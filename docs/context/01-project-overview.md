# 01 — Project Overview (Pages & Sections)

## 1. Vision

A personal portfolio for a full-stack software engineer that feels like a **cinematic, editorial, premium product site** — dark, typographic, deliberate — not a template. It should make three visitors act:

| Visitor | What they need in < 30 s | Primary action |
|---|---|---|
| Recruiter / hiring manager | Role, stack, years, proof (projects + experience) | Download resume / Contact |
| Client (business owner) | What services I offer, why they need them, proof I deliver | Contact about a service |
| Developer / collaborator | Open-source work, GitHub, tech depth | Open GitHub / Contact |

### Success criteria
- Lighthouse (mobile): Performance ≥ 90, Accessibility 100, Best Practices 100, SEO 100.
- LCP < 2.5 s, CLS < 0.1, INP < 200 ms on a mid-range Android over 4G.
- Every page is usable with reduced motion and with JavaScript-heavy effects disabled.
- All personal content is edited only in `src/data/*.json` — zero code changes to add a project, service, job or skill.

---

## 2. Refinements to the original brief

These are additions/decisions made while refining the idea. Remove any you don't want.

| Change | Reason |
|---|---|
| **Hero section (HOME-00)** added at the top of Home, before About | The 3D/cinematic first impression needs a dedicated stage; About works better as the second beat |
| ~~Contact CTA band (HOME-07)~~ **Skipped (2026-10-21)**: the global footer CTA ("Have a project in mind?") already ends every page | Avoids two near-identical contact blocks back to back |
| **Project detail page** `/projects/[slug]` instead of a modal | Shareable URLs, better SEO, room for the full write-up |
| **Service "Read more" → `/services#slug`** (anchor to that service's section) | Matches "every service has its own section" without extra pages |
| **Experience "Read more" → `/experience#id`** | Same pattern; the experience page holds full detail |
| **Sticky in-page sub-nav** on Services | Long page with many sections needs wayfinding |
| **URL-synced filters** on Projects (`?q=&type=&tech=`) | Filter state survives refresh and can be shared |
| **"Discuss this service" pre-fills the contact form** (`/contact?service=slug`) | Shorter path from interest to enquiry |
| **Skill logos monochrome by default, brand colour on hover** | Keeps the strict palette while still showing real logos |
| **No skill percentage bars** | They read as amateur and are unverifiable; usage-in-projects is stronger proof |
| **Footer sitemap** = the footer's "Pages" column (HTML sitemap) + a link to `/sitemap.xml` | Covers both humans and crawlers |
| **Custom 404 page** | Keeps the experience consistent |

---

## 3. Information architecture

| Route | Page | Data file(s) | Rendered when |
|---|---|---|---|
| `/` | Home | all | Always (individual sections follow their own rules) |
| `/about` | About Me | `profile.json` | profile intro exists |
| `/services` | Services | `services.json`, `skills.json` | ≥ 1 visible service |
| `/experience` | Experience | `experience.json`, `skills.json`, `projects.json` | ≥ 1 visible experience entry |
| `/education` | Education | `education.json` | ≥ 1 visible education entry |
| `/projects` | Projects | `projects.json`, `skills.json` | ≥ 1 visible project |
| `/projects/[slug]` | Project detail | `projects.json`, `skills.json` | the slug exists and is visible (else 404) |
| `/skills` | Skills | `skills.json`, `projects.json` | ≥ 1 visible skill |
| `/contact` | Contact | `contact.json`, `services.json`, `site.json` | email or form enabled |
| `/sitemap.xml`, `/robots.txt` | Generated | derived | Always |
| `*` | 404 | `site.json` | Unknown route |

**Nav order:** Home · About · Services · Experience · Education · Projects · Skills — plus the **Contact me** button. A link only appears if its page is rendered (see `05 §4`).

---

## 4. Global elements

### GLOBAL-HEADER
- **Left:** Logo (monogram or wordmark from `site.json`) → `/`.
- **Center/right:** page links in Alegreya SC, small caps, with an active-route indicator (thin electric underline or dot).
- **Right:** **Contact me** primary button → `/contact`.
- **Behaviour:** transparent over the hero; after 40 px of scroll gains a `night/70` background with backdrop blur and a hairline bottom border. Hides on scroll down, reappears on scroll up. Always visible when the mobile menu is open or a link inside it has focus.
- **Responsive:** full link row from `xl` (≥ 1280 px). Below that: logo + Contact button + menu toggle → full-screen overlay menu with large numbered links (`01 About`…), socials and email.
- **Accessibility:** "Skip to content" link as the first focusable element; `aria-current="page"` on the active link; menu traps focus and closes on `Esc`.

### GLOBAL-FOOTER
1. **CTA line:** large heading ("Have a project in mind?") + email (click-to-copy) + Contact button.
2. **Brand block:** logo + 1–2 line intro (`site.footer.intro`).
3. **Link columns:** *Pages* (this is the HTML sitemap — same availability rules as the header), *Services* (each → `/services#slug`, hidden if no services), *Connect* (socials).
4. **Social icons** row.
5. **Bottom bar:** `© {current year} {name}. All rights reserved.` · `Sitemap` (→ `/sitemap.xml`) · `Back to top`.
6. **Signature detail:** an oversized wordmark of the name across the bottom edge, partially cropped.

### Other global elements
- **Preloader** (first visit per session only) — see `04 §4.1`.
- **Page transition** on every route change — `04 §4.2`.
- **Grain overlay** (fixed, very low opacity) — `03 §8`.
- **Custom cursor** (pointer devices only, optional) — `04 §4.6`.
- ~~Contact CTA band (`ContactCtaSection`)~~: **skipped**. The footer CTA line is the closing call to action on every page. Do not build `ContactCtaSection`.

---

## 5. Pages

> Every section below obeys the presence rule: if its data is missing/empty it does not render, and no empty heading or placeholder is left behind.

### 5.1 Home `/`

| ID | Section | Content | Actions |
|---|---|---|---|
| HOME-00 | **Hero** | Name, role, one-line value proposition, availability badge ("Open to freelance & full-time"), 3D scene, scroll cue | `View projects` → `/projects`, `Contact me` → `/contact` |
| HOME-01 | **About Me (preview)** | One portrait, 2–3 short paragraphs (`profile.home.summary`), 2–4 quick facts (e.g. years of experience, location) | `Download resume` (PDF, `download` attribute), `More about me` → `/about` |
| HOME-02 | **Services (preview)** | Featured services as cards (max `services.home.limit`, default 3): icon, number, title, short summary, up to 3 technology chips | Per card `Read more` → `/services#slug`; section `See all services` → `/services` |
| HOME-03 | **Experience (preview)** | LinkedIn-style list of the latest `experience.home.limit` (default 3) companies: logo, role title, company, employment type, `Mon YYYY – Present · 1 yr 4 mos`, location/mode, one-line summary | Per item `Read more` → `/experience#id`; `See full experience` → `/experience` |
| HOME-04 | **Education (timeline)** | All education entries on a vertical timeline that draws itself as you scroll; each node: degree, institution, years, status badge (Completed / Pursuing) | `View education` → `/education` |
| HOME-05 | **Projects (preview)** | Featured projects as cards (max `projects.home.limit`, default 6): cover, type badge, title, organisation or "Open source", one-line summary, up to 4 tech chips (+N) | Per card `Read more` → `/projects/slug`; `See all projects` → `/projects` |
| HOME-06 | **Skills** | **All** visible skills with logo + name, grouped by category (or a two-row marquee on mobile). Hover/focus/tap shows which projects use it (shared `SkillTile`) | `Explore skills` → `/skills` |
| HOME-07 | ~~Contact CTA band~~ | **Skipped**: covered by the global footer CTA | — |

### 5.2 About Me `/about`

| ID | Section | Content |
|---|---|---|
| ABOUT-01 | **Intro** | Headline, longer bio (paragraph array), portrait, **Download resume** button (only if `profile.resume.file` exists) |
| ABOUT-02 | **Photo gallery** | Bento/masonry grid with captions; click opens a lightbox (arrow keys, `Esc`, swipe on mobile); images lazy-loaded |
| ABOUT-03 | **Interests** | Professional interests (e.g. system design, AI tooling, performance) as cards: icon, title, one sentence |
| ABOUT-04 | **Hobbies** | Personal hobbies — use a **different layout from Interests** (e.g. large list rows with a small image, or horizontal scroll) so the page doesn't repeat itself |
| ABOUT-05 | **Basic information** | Label/value grid: Full name, Date of birth, Nationality, Marital status, Languages, Location, Availability… Each row renders only if present. *(Note: DOB and marital status are optional — you can leave them out of the JSON to keep them private.)* |
| ABOUT-06 | ~~Resume CTA~~ | **Skipped**: Download resume moved into ABOUT-01; contact is covered by the global footer CTA |

### 5.3 Services `/services`

| ID | Section | Content |
|---|---|---|
| SERV-01 | **Page hero** | Title, intro, count of services |
| SERV-02 | **Sticky sub-nav** | Chips for each service with scroll-spy highlight. Renders only if ≥ 2 services |
| SERV-03 | **Service section** (repeated per service, `id="{slug}"`) | See anatomy below |
| SERV-04 | ~~Contact CTA band~~ | **Skipped**: covered by the global footer CTA |

**Service section anatomy** (each block renders only if its data exists):
1. Number + title + tagline (e.g. `01 — Website Development`).
2. **What is it?** — plain-language definition.
3. **Why do people/businesses need it?** — 3–6 reasons, each a short title + one sentence.
4. **What's included** — deliverables list.
5. **How I work** — process steps (numbered).
6. **Technologies** — skill chips with logos (from `skills.json` ids).
7. **Ideal for** — types of clients/businesses.
8. **FAQs** — accordion.
9. **CTA** — `Discuss this service` → `/contact?service={slug}`.

Planned services (content to be written in JSON): Website Development, Web Application Development, Backend & API Development, Cloud Deployment (AWS), Website Maintenance & Performance, SEO-ready Websites — adjust freely.

### 5.4 Experience `/experience`

| ID | Section | Content |
|---|---|---|
| EXP-01 | **Page hero** | Title, intro, computed total experience ("~2 years") |
| EXP-02 | **Experience list** | Grouped by company, LinkedIn style. Company: logo, name, location, website link. Each role under it: title, employment type, work mode, dates + computed duration, summary, responsibilities, achievements (numbers highlighted), tech chips, related projects (links). Current role shows a `Present` badge. Lists longer than 5 bullets collapse behind "Show more". Each company block has `id` for anchor links |
| EXP-03 | ~~Contact CTA band~~ | **Skipped**: covered by the global footer CTA |

### 5.5 Education `/education`

| ID | Section | Content |
|---|---|---|
| EDU-01 | **Page hero** | Title, intro |
| EDU-02 | **Detailed timeline** | Same timeline as HOME-04 but expanded: degree + field, institution (logo, link), university/board, location, years, status badge (`Completed` / `Pursuing` with a subtle pulse), score (CGPA/percentage, optional), highlights, coursework chips |
| EDU-03 | ~~Contact CTA band~~ | **Skipped**: covered by the global footer CTA |

### 5.6 Projects `/projects`

| ID | Section | Content |
|---|---|---|
| PROJ-01 | **Page hero** | Title, intro, total count |
| PROJ-02 | **Explorer** | **Search** (title, summary, organisation, tech names; debounced 200 ms) · **Type filter** chips: All / Professional / Open source / Freelance / Personal (only types that exist are shown) · **Tech filter** (multi-select of skills actually used by projects) · **Sort**: Featured / Newest · result count · grid of `ProjectCard`s · "No projects match" state with *Clear filters*. All filter state lives in the URL |
| PROJ-03 | ~~Contact CTA band~~ | **Skipped**: covered by the global footer CTA |

**ProjectCard:** cover image (16:10), type badge, title, organisation or "Open source", one-line summary, up to 4 tech chips (+N), `Read more` → detail page. Whole card is one link target; the GitHub/Live icons inside are separate links.

### 5.7 Project detail `/projects/[slug]`

| ID | Section | Content |
|---|---|---|
| PD-01 | **Hero** | Title, tagline, type badge, status, large cover |
| PD-02 | **Meta bar** | Organisation (or "Open source"), my role, **time to complete** (duration), year, status |
| PD-03 | **Links** | **GitHub** — only for open-source projects with a repo URL · **Live URL** — for any project that has one · private projects without a live URL show "Private / under NDA" |
| PD-04 | **Write-up** | Overview (intro) · Purpose / problem · Solution & key features · Tech stack (chips → `/skills`, optional one-line reason per tech) · Challenges & learnings · Outcome / impact |
| PD-05 | **Gallery** | Screenshots with lightbox |
| PD-06 | **Pager** | Previous / next project + back to all projects |

### 5.8 Skills `/skills`

| ID | Section | Content |
|---|---|---|
| SK-01 | **Page hero** | Title, intro, count |
| SK-02 | **Skill groups** | Categories (Frontend, Backend, Database, Cloud & DevOps, Tools…). Each `SkillTile`: logo + name |
| SK-03 | ~~Contact CTA band~~ | **Skipped**: covered by the global footer CTA |

**SkillTile hover / focus / tap popover:**
- If used: "Used in" + list of project titles (each → `/projects/slug`), optionally "At" + company names from experience.
- If not used anywhere: a short line from `skills.json → usage.emptyLabel` (e.g. "Not used in a project yet") + CTA from `usage.emptyCta` (e.g. "Want to build something with it?" → `/contact`).
- Works with keyboard (focus opens, `Esc` closes) and touch (tap toggles).

### 5.9 Contact `/contact`

| ID | Section | Content |
|---|---|---|
| CON-01 | **Page hero** | Headline, availability, typical response time |
| CON-02 | **Form** | Name, email, *What can I help with?* (select built from services + "Something else"; pre-selected from `?service=`), message. Inline validation, honeypot, loading/success/error states. Sent via a server action |
| CON-03 | **Direct details** | Email (copy button), phone, location, social links |

### 5.10 404
Large "404", one witty but professional line, links to Home and Projects.

---

## 6. Cross-linking map

```
services.technologies ──► skills.id ◄── projects.techStack ◄── experience.roles.projects
                              │                    ▲
                              └─ SkillTile "Used in" (computed, never hand-written)
```
- Skill usage is **derived** from projects (and experience) at build time — never duplicated in `skills.json`.
- Every chip that represents a skill links to `/skills#{id}` (or filters projects on the projects page).

## 7. Content & copy guidelines
- First person, specific, numbers where possible ("Cut page load from 4.1 s to 1.3 s"), not adjectives ("passionate", "dedicated", "cutting-edge").
- Headlines ≤ 8 words. Card summaries ≤ 140 characters. Service reasons ≤ 25 words each.
- Image specs: portrait 4:5 (≥ 1200 px tall), project covers 16:10 (≥ 1600 px wide), gallery mixed. Export WebP/AVIF, always provide `alt`, `width`, `height` in JSON.

## 8. Out of scope (future)
Blog, certifications, testimonials, light theme, i18n, headless CMS. The data layer (`05`) is designed so each can be added as a new JSON file + page without refactoring.

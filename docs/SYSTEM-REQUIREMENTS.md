# System Requirements & Environment Setup Guide

This document defines the complete hardware, software, and runtime environment specifications required to clone, develop, test, and build the **Mohd Ansar Bux Personal Portfolio** on any new computer system (Windows, macOS, or Linux).

---

## 1. Hardware & System Specifications

| Component | Minimum Requirement | Recommended Specification | Notes |
|---|---|---|---|
| **Operating System** | Windows 10 (64-bit), macOS 13+, or Ubuntu 22.04+ | Windows 11 (64-bit), macOS 14+ (Apple Silicon), or Linux LTS | Fully cross-platform; tested on Windows 11 with PowerShell 5.1/7. |
| **Processor (CPU)** | 4 cores, 2.0 GHz (x86_64 / arm64) | 8+ cores (Intel Core i7/i9, AMD Ryzen 7/9, Apple M-Series) | Parallel static page generation (SSG) in Next.js 16 uses multiple worker threads. |
| **Memory (RAM)** | 8 GB RAM | 16 GB+ RAM | Compiling Turbopack, running Next.js dev server, and headless browser tests simultaneously requires ~4–6 GB active memory. |
| **Storage** | 3 GB free disk space | 10 GB+ SSD | Repository and dependencies (`node_modules`) require ~600 MB; production build cache (`.next/`) requires ~400 MB. |
| **Graphics (GPU)** | Integrated GPU with WebGL 2.0 | Dedicated GPU or Apple Metal / modern integrated GPU | Required for HTML5 Canvas 2D hardware acceleration (Starfield) and Phase 7 3D WebGL scene (Three.js / React Three Fiber). |
| **Display Resolution** | 1366 × 768 minimum | 1920 × 1080 or 2560 × 1440 | Development and testing require verifying responsive layouts across 1440px (Desktop), 768px (Tablet), and 375px (Mobile). |

---

## 2. Software & Tooling Prerequisites

### 2.1 Core Runtime & Package Manager
- **Node.js:** `>= 20.9.0` (Recommended: **Node.js 20 LTS** or **22 LTS**).
  - Check version: `node -v`
  - Download: [https://nodejs.org/](https://nodejs.org/) or via `nvm` / `fnm`.
- **pnpm:** `>= 9.0.0` (Authoritative version pinned in `package.json`: `pnpm@12.11.2`).
  - Install/Update: `npm install -g pnpm` or `corepack enable && corepack prepare pnpm@12.11.2 --activate`
  - Check version: `pnpm -v`
- **Git:** `>= 2.30.0` with SSH key or GitHub CLI credentials configured.
  - Check version: `git --version`

### 2.2 Optional Tooling (Automated Verification & Screenshots)
- **Python:** `>= 3.10` (Optional; only needed for running `scripts/capture-screenshots.py`).
  - Required Python libraries: `pip install selenium`
- **Google Chrome:** Latest stable (Used by Selenium for headless visual verification).

---

## 3. Step-by-Step New Machine Setup

### Step 1: Clone the Repository
```bash
git clone https://github.com/Shadow-of-Raza/mohd-ansar-bux-portfolio.git
cd mohd-ansar-bux-portfolio
```

### Step 2: Install Node Dependencies
```bash
pnpm install
```
> [!NOTE]
> Do NOT use `npm install` or `yarn install`. The repository relies on `pnpm-lock.yaml` for strict, deterministic dependency resolution.

### Step 3: Configure Environment Variables
Copy the example environment file:
```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# macOS / Linux (Bash)
cp .env.example .env.local
```

Inspect and verify `.env.local`:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=mohdansarapex@gmail.com
CONTACT_FROM_EMAIL=notifications@mail.ansarbux.dev
```
> [!IMPORTANT]
> `.env.local` is strictly ignored by Git (`.gitignore`). Never commit production API keys or credentials to version control.

### Step 4: Run Pre-Flight Validation & Verification
Before writing any code or launching the dev server, verify that the project data, linting, types, and build compile cleanly:

```bash
# 1. Validate all JSON data files, Zod schemas, relations, and asset references
pnpm validate:data

# 2. Run ESLint (Next 16 flat config)
pnpm lint

# 3. Strict TypeScript typecheck
pnpm typecheck

# 4. Production Next.js 16 SSG build test
pnpm build
```

Expected output for all 4 commands: **Exit code 0, 0 errors**.

### Step 5: Launch the Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Key Architectural Invariants & Stack Notes

When working on this codebase on a new system or with an AI coding assistant, adhere strictly to these architectural boundaries:

1. **Next.js 16 & React 19:**
   - Turbopack is enabled by default (`next dev` uses Turbopack).
   - In Next.js 16, `params` and `searchParams` are Promises; always `await` them in server components and route handlers.
   - Dynamic SSG routes use `generateStaticParams()` + `export const dynamicParams = false`.
   - Dynamic client-only imports with `{ ssr: false }` are only permitted inside client components (`"use client"`).
   - ESLint runs via `pnpm lint` (`eslint .`), not `next lint`.

2. **Tailwind CSS v4 & Theme Tokens:**
   - Tailwind v4 uses CSS-first configuration in [src/app/globals.css](file:///c:/Projects/ANSAR-PORTFOLIO/src/app/globals.css) via `@theme`. There is no `tailwind.config.js`.
   - **Zero arbitrary colors:** Default Tailwind color palettes are disabled. Only use design tokens (`--color-space`, `--color-night`, `--color-surface-1`, `--color-electric`, `--color-royal`, `--color-fg`, `--color-line`, etc.).
   - Base canvas token is `--color-space: #030010`. `html` has `background-color: var(--color-space)` and `body` has `background: transparent`.

3. **Content Flow & Schema Validation:**
   - **Content lives strictly in `src/data/*.json`:** Never hardcode personal copy, names, roles, or project writeups in components.
   - **Presence Rule:** If data for a section, card, or field is missing or empty, render nothing (no empty tags, no placeholders, no "coming soon"). Navigation links to missing content automatically disappear.
   - Zod v4 schemas in `src/lib/data/schemas.ts` enforce shape validation on every build via `scripts/validate-data.ts`.

4. **Background Architecture:**
   - Fixed `-z-50` container in `src/components/layout/SpaceBackground.tsx`.
   - 4-point CSS radial gradient nebula with scroll-driven upward drift.
   - HTML5 Canvas 2D starfield (`src/components/motion/Starfield.tsx`) with 900–2000 delicate stars (radii 0.35–1.15 px), serene automatic bottom-to-top drift (0.075 px/frame), and independent sine-wave twinkling. Decoupled from scroll displacement.

5. **Motion Rules (Pre-Phase 6):**
   - Components must be built static first.
   - Starfield and CSS nebula drift are the only approved motion exceptions prior to Phase 6.

---

## 5. Troubleshooting & FAQ

| Issue | Cause | Solution |
|---|---|---|
| `pnpm install` fails with engine warning | Node.js version is older than `20.9.0` | Upgrade Node.js via `nvm install 20 && nvm use 20`. |
| Port 3000 is already in use | Another process is occupying the default port | Run `pnpm dev -- -p 3001` or terminate the existing process. |
| `pnpm validate:data` throws unused skill warnings | Normal non-blocking warning for skills not yet linked to projects | These are non-blocking warnings (exit code 0); safe to proceed. |
| Headless Chrome screenshots fail | Chrome is missing or Selenium is not installed | Install Chrome and run `pip install selenium`. |
| Git commands hang on Windows PowerShell | PowerShell execution policy or prompt buffer | Run commands in Windows Terminal or standard Command Prompt (`cmd.exe`). |

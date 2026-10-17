import fs from "fs";
import path from "path";

import contactJson from "../src/data/contact.json";
import educationJson from "../src/data/education.json";
import experienceJson from "../src/data/experience.json";
import profileJson from "../src/data/profile.json";
import projectsJson from "../src/data/projects.json";
import servicesJson from "../src/data/services.json";
import siteJson from "../src/data/site.json";
import skillsJson from "../src/data/skills.json";

import {
  ContactSchema,
  EducationFileSchema,
  ExperienceFileSchema,
  ProfileSchema,
  ProjectsFileSchema,
  ServicesFileSchema,
  SiteSchema,
  SkillsFileSchema,
} from "../src/lib/data/schemas";

const errors: string[] = [];
const warnings: string[] = [];

function checkFileExists(relPath: string, context: string) {
  if (!relPath) return;
  // External URLs are not local files
  if (relPath.startsWith("http://") || relPath.startsWith("https://")) return;

  const cleanPath = relPath.startsWith("/") ? relPath.slice(1) : relPath;
  const fullPath = path.join(process.cwd(), "public", cleanPath);

  if (!fs.existsSync(fullPath)) {
    errors.push(`[Missing Asset] ${context}: File "${relPath}" does not exist in public/`);
  }
}

function checkDateRange(start?: string | null, end?: string | null, context = "") {
  if (!start) return;
  const dateRegex = /^\d{4}-\d{2}(-\d{2})?$/;
  if (!dateRegex.test(start)) {
    errors.push(`[Invalid Date] ${context}: Start date "${start}" is not YYYY-MM or YYYY-MM-DD`);
  }
  if (end) {
    if (!dateRegex.test(end)) {
      errors.push(`[Invalid Date] ${context}: End date "${end}" is not YYYY-MM or YYYY-MM-DD`);
    } else if (end < start) {
      errors.push(`[Invalid Date Range] ${context}: End date "${end}" is before start date "${start}"`);
    }
  }
}

/* -------------------------------- 1. Zod Schema Validation ---------------- */

let site: ReturnType<typeof SiteSchema.parse> | undefined;
let profile: ReturnType<typeof ProfileSchema.parse> | undefined;
let services: ReturnType<typeof ServicesFileSchema.parse> | undefined;
let experience: ReturnType<typeof ExperienceFileSchema.parse> | undefined;
let education: ReturnType<typeof EducationFileSchema.parse> | undefined;
let projects: ReturnType<typeof ProjectsFileSchema.parse> | undefined;
let skills: ReturnType<typeof SkillsFileSchema.parse> | undefined;
let contact: ReturnType<typeof ContactSchema.parse> | undefined;

try {
  site = SiteSchema.parse(siteJson);
} catch (e: unknown) {
  errors.push(`[Schema: site.json] ${e instanceof Error ? e.message : String(e)}`);
}

try {
  profile = ProfileSchema.parse(profileJson);
} catch (e: unknown) {
  errors.push(`[Schema: profile.json] ${e instanceof Error ? e.message : String(e)}`);
}

try {
  services = ServicesFileSchema.parse(servicesJson);
} catch (e: unknown) {
  errors.push(`[Schema: services.json] ${e instanceof Error ? e.message : String(e)}`);
}

try {
  experience = ExperienceFileSchema.parse(experienceJson);
} catch (e: unknown) {
  errors.push(`[Schema: experience.json] ${e instanceof Error ? e.message : String(e)}`);
}

try {
  education = EducationFileSchema.parse(educationJson);
} catch (e: unknown) {
  errors.push(`[Schema: education.json] ${e instanceof Error ? e.message : String(e)}`);
}

try {
  projects = ProjectsFileSchema.parse(projectsJson);
} catch (e: unknown) {
  errors.push(`[Schema: projects.json] ${e instanceof Error ? e.message : String(e)}`);
}

try {
  skills = SkillsFileSchema.parse(skillsJson);
} catch (e: unknown) {
  errors.push(`[Schema: skills.json] ${e instanceof Error ? e.message : String(e)}`);
}

try {
  contact = ContactSchema.parse(contactJson);
  void contact;
} catch (e: unknown) {
  errors.push(`[Schema: contact.json] ${e instanceof Error ? e.message : String(e)}`);
}

/* -------------------------------- 2. Duplicates Check --------------------- */

function checkUniqueIds(items: { id: string }[], filename: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.id)) {
      errors.push(`[Duplicate ID: ${filename}] ID "${item.id}" appears multiple times`);
    }
    seen.add(item.id);
  }
}

function checkUniqueSlugs(items: { slug: string }[], filename: string) {
  const seen = new Set<string>();
  for (const item of items) {
    if (seen.has(item.slug)) {
      errors.push(`[Duplicate Slug: ${filename}] Slug "${item.slug}" appears multiple times`);
    }
    seen.add(item.slug);
  }
}

if (services) {
  checkUniqueIds(services.items, "services.json");
  checkUniqueSlugs(services.items, "services.json");
}

if (experience) {
  checkUniqueIds(experience.items, "experience.json");
  const roleIds = new Set<string>();
  for (const company of experience.items) {
    for (const role of company.roles) {
      if (roleIds.has(role.id)) {
        errors.push(`[Duplicate Role ID: experience.json] Role ID "${role.id}" appears multiple times`);
      }
      roleIds.add(role.id);
    }
  }
}

if (education) {
  checkUniqueIds(education.items, "education.json");
}

if (projects) {
  checkUniqueIds(projects.items, "projects.json");
  checkUniqueSlugs(projects.items, "projects.json");
}

if (skills) {
  checkUniqueIds(skills.items, "skills.json");
  checkUniqueIds(skills.categories, "skills.json categories");
}

/* -------------------------------- 3. Cross-File References ---------------- */

const skillIdSet = new Set(skills?.items.map((s) => s.id) ?? []);
const skillCategorySet = new Set(skills?.categories.map((c) => c.id) ?? []);
const projectSlugSet = new Set(projects?.items.map((p) => p.slug) ?? []);
const usedSkillIds = new Set<string>();

// 3a. Skills -> Categories
if (skills) {
  for (const skill of skills.items) {
    if (!skillCategorySet.has(skill.category)) {
      errors.push(
        `[Broken Reference: skills.json] Skill "${skill.id}" references non-existent category "${skill.category}"`,
      );
    }
  }
}

// 3b. Projects -> Skills
if (projects) {
  for (const project of projects.items) {
    for (const tech of project.techStack) {
      if (!skillIdSet.has(tech.skill)) {
        errors.push(
          `[Broken Reference: projects.json] Project "${project.slug}" references non-existent skill "${tech.skill}"`,
        );
      }
      usedSkillIds.add(tech.skill);
    }
  }
}

// 3c. Services -> Skills
if (services) {
  for (const service of services.items) {
    for (const tech of service.technologies) {
      if (!skillIdSet.has(tech)) {
        errors.push(
          `[Broken Reference: services.json] Service "${service.slug}" references non-existent skill "${tech}"`,
        );
      }
      usedSkillIds.add(tech);
    }
  }
}

// 3d. Experience -> Skills and Projects
if (experience) {
  for (const company of experience.items) {
    for (const role of company.roles) {
      for (const skillId of role.skills) {
        if (!skillIdSet.has(skillId)) {
          errors.push(
            `[Broken Reference: experience.json] Role "${role.id}" references non-existent skill "${skillId}"`,
          );
        }
        usedSkillIds.add(skillId);
      }
      for (const projectSlug of role.projects) {
        if (!projectSlugSet.has(projectSlug)) {
          errors.push(
            `[Broken Reference: experience.json] Role "${role.id}" references non-existent project slug "${projectSlug}"`,
          );
        }
      }
    }
  }
}

/* -------------------------------- 4. Public File Assets -------------------- */

if (site) {
  if (site.logo?.src) checkFileExists(site.logo.src, "site.json logo");
  if (site.hero?.poster?.src) checkFileExists(site.hero.poster.src, "site.json hero poster");
  if (site.seo?.ogImage?.src) checkFileExists(site.seo.ogImage.src, "site.json seo ogImage");
}

if (profile) {
  if (profile.portrait?.src) checkFileExists(profile.portrait.src, "profile.json portrait");
  if (profile.resume?.file) checkFileExists(profile.resume.file, "profile.json resume.file");
  for (const img of profile.gallery) {
    checkFileExists(img.src, `profile.json gallery image`);
  }
  for (const hobby of profile.hobbies?.items ?? []) {
    if (hobby.image?.src) checkFileExists(hobby.image.src, `profile.json hobby "${hobby.id}"`);
  }
}

if (services) {
  // Service icons could be Lucide icon names or local SVGs; if starting with '/', check file
  for (const s of services.items) {
    if (s.icon && s.icon.startsWith("/")) checkFileExists(s.icon, `services.json service "${s.slug}" icon`);
  }
}

if (experience) {
  for (const c of experience.items) {
    if (c.company.logo?.src) checkFileExists(c.company.logo.src, `experience.json company "${c.id}" logo`);
  }
}

if (education) {
  for (const e of education.items) {
    if (e.institution.logo?.src)
      checkFileExists(e.institution.logo.src, `education.json institution "${e.id}" logo`);
  }
}

if (projects) {
  for (const p of projects.items) {
    if (p.cover?.src) checkFileExists(p.cover.src, `projects.json project "${p.slug}" cover`);
    for (const g of p.gallery) {
      checkFileExists(g.src, `projects.json project "${p.slug}" gallery image`);
    }
  }
}

if (skills) {
  for (const s of skills.items) {
    if (s.icon) checkFileExists(s.icon, `skills.json skill "${s.id}" icon`);
  }
}

/* -------------------------------- 5. Date Validation ----------------------- */

if (experience) {
  for (const company of experience.items) {
    for (const role of company.roles) {
      checkDateRange(role.start, role.end, `experience.json role "${role.id}"`);
    }
  }
}

if (education) {
  for (const e of education.items) {
    checkDateRange(e.start, e.end, `education.json education "${e.id}"`);
  }
}

if (projects) {
  for (const p of projects.items) {
    if (p.timeline) {
      checkDateRange(p.timeline.start, p.timeline.end, `projects.json project "${p.slug}"`);
    }
  }
}

/* -------------------------------- 6. Open-Source GitHub URL --------------- */

if (projects) {
  for (const p of projects.items) {
    if (p.type === "open-source") {
      const gh = p.links.github;
      if (!gh) {
        errors.push(
          `[Open Source Project] Project "${p.slug}" has type "open-source" but missing links.github`,
        );
      } else if (!/^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/.test(gh)) {
        errors.push(
          `[Invalid GitHub URL] Project "${p.slug}" links.github "${gh}" is not a valid GitHub repository URL`,
        );
      }
    }
  }
}

/* -------------------------------- Warnings (Non-fatal) -------------------- */

// 1. More featured items than home.limit
if (services && services.home.limit) {
  const featured = services.items.filter((s) => s.featured).length;
  if (featured > services.home.limit) {
    warnings.push(
      `[Home Limit] services.json has ${featured} featured items, exceeding home.limit of ${services.home.limit}`,
    );
  }
}

if (projects && projects.home.limit) {
  const featured = projects.items.filter((p) => p.featured).length;
  if (featured > projects.home.limit) {
    warnings.push(
      `[Home Limit] projects.json has ${featured} featured items, exceeding home.limit of ${projects.home.limit}`,
    );
  }
}

if (experience && experience.home.limit) {
  const featured = experience.items.filter((c) => c.featured).length;
  if (featured > experience.home.limit) {
    warnings.push(
      `[Home Limit] experience.json has ${featured} featured items, exceeding home.limit of ${experience.home.limit}`,
    );
  }
}

// 2. Project has no cover or summary
if (projects) {
  for (const p of projects.items) {
    if (!p.cover) {
      warnings.push(`[Thin Card] Project "${p.slug}" has no cover image`);
    }
    if (!p.summary) {
      warnings.push(`[Thin Card] Project "${p.slug}" has no summary`);
    }
  }
}

// 3. Image alt is empty on non-decorative images
if (site && site.logo && !site.logo.alt) {
  warnings.push(`[Empty Alt] site.json logo has empty alt text`);
}
if (profile && profile.portrait && !profile.portrait.alt) {
  warnings.push(`[Empty Alt] profile.json portrait has empty alt text`);
}
if (projects) {
  for (const p of projects.items) {
    if (p.cover && !p.cover.alt) {
      warnings.push(`[Empty Alt] Project "${p.slug}" cover has empty alt text`);
    }
  }
}

// 4. Skill is not used anywhere
if (skills) {
  for (const s of skills.items) {
    if (!usedSkillIds.has(s.id)) {
      warnings.push(
        `[Unused Skill] Skill "${s.id}" (${s.name}) is not referenced by any project, role, or service`,
      );
    }
  }
}

/* -------------------------------- Output & Exit --------------------------- */

if (warnings.length > 0) {
  console.log(`\n⚠ ${warnings.length} warning(s):`);
  for (const w of warnings) {
    console.warn(`  - ${w}`);
  }
}

if (errors.length > 0) {
  console.error(`\n❌ Data validation failed with ${errors.length} error(s):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log("\n✓ All data files, schemas, cross-references, and assets validated successfully.");
process.exit(0);

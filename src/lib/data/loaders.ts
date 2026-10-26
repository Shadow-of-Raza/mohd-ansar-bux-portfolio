import "server-only";

import contactJson from "@/data/contact.json";
import educationJson from "@/data/education.json";
import experienceJson from "@/data/experience.json";
import profileJson from "@/data/profile.json";
import projectsJson from "@/data/projects.json";
import servicesJson from "@/data/services.json";
import siteJson from "@/data/site.json";
import skillsJson from "@/data/skills.json";

import {
  ContactSchema,
  EducationFileSchema,
  ExperienceFileSchema,
  ProfileSchema,
  ProjectsFileSchema,
  ServicesFileSchema,
  SiteSchema,
  SkillsFileSchema,
  type Contact,
  type Education,
  type ExperienceCompany,
  type Profile,
  type Project,
  type Service,
  type Site,
  type Skill,
  type SkillCategory,
} from "./schemas";
import { compareDatesDesc, calculateTotalExperience } from "@/lib/utils/dates";
import { hasContent } from "@/lib/utils/has-content";

/* ---------------- Module-Level Schema Parsing (Throws at build) ----------- */

const siteFile = SiteSchema.parse(siteJson);
const profileFile = ProfileSchema.parse(profileJson);
const servicesFile = ServicesFileSchema.parse(servicesJson);
const experienceFile = ExperienceFileSchema.parse(experienceJson);
const educationFile = EducationFileSchema.parse(educationJson);
const projectsFile = ProjectsFileSchema.parse(projectsJson);
const skillsFile = SkillsFileSchema.parse(skillsJson);
const contactFile = ContactSchema.parse(contactJson);

/* ------------------------------- Sorters ---------------------------------- */

const sortServices = (a: Service, b: Service) => (a.order ?? Infinity) - (b.order ?? Infinity);

const sortProjects = (a: Project, b: Project) =>
  Number(b.featured) - Number(a.featured) ||
  (a.order ?? Infinity) - (b.order ?? Infinity) ||
  compareDatesDesc(a.timeline?.end, b.timeline?.end) ||
  compareDatesDesc(a.timeline?.start, b.timeline?.start);

const sortEducation = (a: Education, b: Education) => compareDatesDesc(a.start, b.start);

const sortExperienceCompanies = (a: ExperienceCompany, b: ExperienceCompany) => {
  const latestA = a.roles[0]?.start ?? "";
  const latestB = b.roles[0]?.start ?? "";
  return (a.order ?? Infinity) - (b.order ?? Infinity) || compareDatesDesc(latestA, latestB);
};

/* ------------------------------- Loaders ---------------------------------- */

/**
 * Site data loader. Always available.
 */
export function getSite(): Site {
  return siteFile;
}

/**
 * Profile loader for /about and HOME-01.
 * Returns null if no bio or home summary is present.
 */
export function getProfile(): Profile | null {
  const hasBio = profileFile.bio.length > 0;
  const hasSummary = Boolean(profileFile.home.summary?.length);
  const hasBasic = Boolean(profileFile.basicInfo?.items.length);
  const hasPortrait = Boolean(profileFile.portrait?.src);

  if (!hasBio && !hasSummary && !hasBasic && !hasPortrait) {
    return null;
  }

  // Dynamically update the "Experience" quick fact so it updates on its own
  const totalExp = calculateTotalExperience(
    experienceFile.items.flatMap((c) => c.roles.map((r) => ({ start: r.start, end: r.end }))),
  );

  const updatedFacts = (profileFile.home.facts ?? []).map((f) =>
    f.label.toLowerCase() === "experience" ? { ...f, value: totalExp } : f,
  );

  return {
    ...profileFile,
    home: {
      ...profileFile.home,
      facts: updatedFacts,
    },
  };
}

export interface ServicesData {
  page: typeof servicesFile.page;
  home: typeof servicesFile.home;
  items: Service[];
  featured: Service[];
}

/**
 * Services loader for /services and HOME-02.
 * Returns null if no visible services exist.
 */
export function getServices(): ServicesData | null {
  const items = servicesFile.items.filter((s) => s.visible !== false).sort(sortServices);

  if (items.length === 0) return null;

  const limit = servicesFile.home.limit ?? 3;
  const featured = items.filter((s) => s.featured).slice(0, limit);

  return {
    page: servicesFile.page,
    home: servicesFile.home,
    items,
    featured: featured.length > 0 ? featured : items.slice(0, limit),
  };
}

export interface ExperienceData {
  page: typeof experienceFile.page;
  home: typeof experienceFile.home;
  items: ExperienceCompany[];
  featured: ExperienceCompany[];
}

/**
 * Experience loader for /experience and HOME-03.
 * Returns null if no visible experience companies exist.
 */
export function getExperience(): ExperienceData | null {
  const items = experienceFile.items
    .filter((c) => c.visible !== false)
    .map((company) => ({
      ...company,
      roles: [...company.roles].sort((r1, r2) => compareDatesDesc(r1.start, r2.start)),
    }))
    .filter((c) => c.roles.length > 0)
    .sort(sortExperienceCompanies);

  if (items.length === 0) return null;

  const limit = experienceFile.home.limit ?? 3;
  const featured = items.filter((c) => c.featured).slice(0, limit);

  return {
    page: experienceFile.page,
    home: experienceFile.home,
    items,
    featured: featured.length > 0 ? featured : items.slice(0, limit),
  };
}

export interface EducationData {
  page: typeof educationFile.page;
  home: typeof educationFile.home;
  items: Education[];
}

/**
 * Education loader for /education and HOME-04.
 * Returns null if no visible education entries exist.
 */
export function getEducation(): EducationData | null {
  const items = educationFile.items.filter((e) => e.visible !== false).sort(sortEducation);

  if (items.length === 0) return null;

  return {
    page: educationFile.page,
    home: educationFile.home,
    items,
  };
}

export interface ProjectsData {
  page: typeof projectsFile.page;
  home: typeof projectsFile.home;
  items: Project[];
  featured: Project[];
}

/**
 * Projects loader for /projects and HOME-05.
 * Returns null if no visible projects exist.
 */
export function getProjects(): ProjectsData | null {
  const items = projectsFile.items.filter((p) => p.visible !== false).sort(sortProjects);

  if (items.length === 0) return null;

  const limit = projectsFile.home.limit ?? 6;
  const featured = items.filter((p) => p.featured).slice(0, limit);

  return {
    page: projectsFile.page,
    home: projectsFile.home,
    items,
    featured: featured.length > 0 ? featured : items.slice(0, limit),
  };
}

/**
 * Single project lookup by slug.
 */
export function getProjectBySlug(slug: string): Project | null {
  const projects = getProjects();
  if (!projects) return null;
  return projects.items.find((p) => p.slug === slug) ?? null;
}

export interface SkillsData {
  page: typeof skillsFile.page;
  home: typeof skillsFile.home;
  usage: typeof skillsFile.usage;
  categories: SkillCategory[];
  items: Skill[];
}

/**
 * Skills loader for /skills and HOME-06.
 * Returns null if no visible skills exist.
 * Only returns categories containing at least 1 visible skill.
 */
export function getSkills(): SkillsData | null {
  const items = skillsFile.items
    .filter((s) => s.visible !== false)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  if (items.length === 0) return null;

  const activeCategoryIds = new Set(items.map((s) => s.category));
  const categories = skillsFile.categories
    .filter((cat) => activeCategoryIds.has(cat.id))
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  return {
    page: skillsFile.page,
    home: skillsFile.home,
    usage: skillsFile.usage,
    categories,
    items,
  };
}

/**
 * Contact data loader for /contact and HOME-07.
 * Returns null if email is not configured and form is disabled.
 */
export function getContact(): Contact | null {
  const hasEmail = Boolean(contactFile.email);
  const isFormEnabled = contactFile.form?.enabled !== false && hasContent(contactFile.form);

  if (!hasEmail && !isFormEnabled) {
    return null;
  }
  return contactFile;
}

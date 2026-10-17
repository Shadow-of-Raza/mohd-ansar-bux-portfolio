import "server-only";

import { getContact, getExperience, getProjects, getServices, getSkills } from "./loaders";
import type { Project, Skill } from "./schemas";
import { calculateTotalExperience } from "@/lib/utils/dates";

export interface SkillUsageItem {
  projects: { slug: string; title: string }[];
  companies: string[];
  services: { slug: string; title: string }[];
}

/**
 * Returns a Map of skill id to Skill object.
 */
export function getSkillMap(): Map<string, Skill> {
  const skillsData = getSkills();
  const map = new Map<string, Skill>();
  if (!skillsData) return map;
  for (const item of skillsData.items) {
    map.set(item.id, item);
  }
  return map;
}

/**
 * Returns a single skill by id.
 */
export function getSkillById(id: string): Skill | undefined {
  return getSkillMap().get(id);
}

/**
 * Computes which projects, companies, and services reference each skill.
 * Returns a plain serialisable record suitable for client components.
 */
export function getSkillUsage(): Record<string, SkillUsageItem> {
  const usage: Record<string, SkillUsageItem> = {};

  const ensureUsage = (id: string): SkillUsageItem => {
    let existing = usage[id];
    if (!existing) {
      existing = { projects: [], companies: [], services: [] };
      usage[id] = existing;
    }
    return existing;
  };

  // 1. Projects usage
  const projects = getProjects()?.items ?? [];
  for (const project of projects) {
    for (const item of project.techStack) {
      const u = ensureUsage(item.skill);
      if (!u.projects.some((p) => p.slug === project.slug)) {
        u.projects.push({ slug: project.slug, title: project.title });
      }
    }
  }

  // 2. Experience usage
  const companies = getExperience()?.items ?? [];
  for (const company of companies) {
    for (const role of company.roles) {
      for (const skillId of role.skills) {
        const u = ensureUsage(skillId);
        if (!u.companies.includes(company.company.name)) {
          u.companies.push(company.company.name);
        }
      }
    }
  }

  // 3. Services usage
  const services = getServices()?.items ?? [];
  for (const service of services) {
    for (const techId of service.technologies) {
      const u = ensureUsage(techId);
      if (!u.services.some((s) => s.slug === service.slug)) {
        u.services.push({ slug: service.slug, title: service.title });
      }
    }
  }

  return usage;
}

/**
 * Groups visible projects by skill ID for tech filter options.
 * Only includes skills with at least 1 project.
 */
export function getProjectsBySkill(): Record<string, Project[]> {
  const map: Record<string, Project[]> = {};
  const projects = getProjects()?.items ?? [];

  for (const project of projects) {
    for (const item of project.techStack) {
      let list = map[item.skill];
      if (!list) {
        list = [];
        map[item.skill] = list;
      }
      list.push(project);
    }
  }

  return map;
}

/**
 * Returns options for "What can I help with?" in the contact form:
 * Visible service titles + the custom otherOptionLabel (default: "Something else").
 */
export function getServiceOptions(): string[] {
  const services = getServices()?.items ?? [];
  const contact = getContact();
  const options = services.map((s) => s.title);
  const otherLabel = contact?.form?.otherOptionLabel ?? "Something else";
  return [...options, otherLabel];
}

/**
 * Returns adjacent (previous and next) visible projects for PD-06 project detail nav.
 */
export function getAdjacentProjects(currentSlug: string): {
  prev: Project | null;
  next: Project | null;
} {
  const projects = getProjects()?.items ?? [];
  const index = projects.findIndex((p) => p.slug === currentSlug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? (projects[index - 1] ?? null) : null;
  const next = index < projects.length - 1 ? (projects[index + 1] ?? null) : null;

  return { prev, next };
}

/**
 * Computes total career experience duration across all experience roles.
 */
export function getTotalExperienceDuration(): string {
  const companies = getExperience()?.items ?? [];
  const roles = companies.flatMap((c) => c.roles.map((r) => ({ start: r.start, end: r.end })));
  return calculateTotalExperience(roles);
}

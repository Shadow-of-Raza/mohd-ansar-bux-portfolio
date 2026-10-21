import "server-only";

import {
  getContact,
  getEducation,
  getExperience,
  getProfile,
  getProjects,
  getServices,
  getSkills,
} from "./loaders";

export interface NavItem {
  href: string;
  label: string;
}

interface RouteConfig extends NavItem {
  exists: () => boolean;
}

const ROUTES: RouteConfig[] = [
  { href: "/", label: "Home", exists: () => true },
  { href: "/about", label: "About", exists: () => getProfile() !== null },
  { href: "/services", label: "Services", exists: () => getServices() !== null },
  { href: "/experience", label: "Experience", exists: () => getExperience() !== null },
  { href: "/education", label: "Education", exists: () => getEducation() !== null },
  { href: "/projects", label: "Projects", exists: () => getProjects() !== null },
  { href: "/skills", label: "Skills", exists: () => getSkills() !== null },
];

/**
 * Returns available navigation items for the Header, Footer HTML sitemap, and XML sitemap.
 * Dynamically hides pages when their underlying data is empty or absent.
 */
export function getNavItems(): NavItem[] {
  return ROUTES.filter((r) => r.exists()).map(({ href, label }) => ({ href, label }));
}

/**
 * Checks whether the Contact page/route should exist.
 */
export function hasContactPage(): boolean {
  return getContact() !== null;
}

/**
 * Checks whether the About page/route should exist.
 */
export function hasAboutPage(): boolean {
  return getProfile() !== null;
}

/**
 * Checks whether the Services page/route should exist.
 */
export function hasServicesPage(): boolean {
  return getServices() !== null;
}

/**
 * Checks whether the Experience page/route should exist.
 */
export function hasExperiencePage(): boolean {
  return getExperience() !== null;
}

/**
 * Checks whether the Education page/route should exist.
 */
export function hasEducationPage(): boolean {
  return getEducation() !== null;
}

/**
 * Checks whether the Projects page/route should exist.
 */
export function hasProjectsPage(): boolean {
  return getProjects() !== null;
}

/**
 * Checks whether the Skills page/route should exist.
 */
export function hasSkillsPage(): boolean {
  return getSkills() !== null;
}

import type { MetadataRoute } from "next";
import { getNavItems, hasContactPage } from "@/lib/data/availability";
import { getProjects } from "@/lib/data/loaders";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const navItems = getNavItems();
  const projects = getProjects()?.items ?? [];

  const baseRoutes: MetadataRoute.Sitemap = navItems.map((item) => ({
    url: `${siteUrl}${item.href}`,
    lastModified: new Date(),
    changeFrequency: item.href === "/" ? "weekly" : "monthly",
    priority: item.href === "/" ? 1.0 : 0.8,
  }));

  if (hasContactPage()) {
    baseRoutes.push({
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...baseRoutes, ...projectRoutes];
}

import React, { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects } from "@/lib/data/loaders";
import { getSkillMap } from "@/lib/data/relations";
import { ProjectsHeroSection } from "@/sections/projects/ProjectsHeroSection";
import { ProjectsExplorer, type AvailableSkill } from "@/sections/projects/ProjectsExplorer";
import type { ProjectCardItem } from "@/components/shared/ProjectCard";
import { Container } from "@/components/ui/Container";

/**
 * Generate metadata for the /projects route.
 */
export async function generateMetadata(): Promise<Metadata> {
  const projectsData = getProjects();
  if (!projectsData) return {};

  const seo = projectsData.page?.seo;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ansarbux.dev";

  return {
    title: seo?.title || "Projects — Mohd Ansar Bux",
    description:
      seo?.description ||
      "Selected engineering projects built with Java, Spring Boot, React, Next.js, and TypeScript.",
    alternates: {
      canonical: `${siteUrl}/projects`,
    },
    openGraph: {
      title: seo?.title || "Projects — Mohd Ansar Bux",
      description:
        seo?.description ||
        "Selected engineering projects built with Java, Spring Boot, React, Next.js, and TypeScript.",
      url: `${siteUrl}/projects`,
      type: "website",
    },
  };
}

/**
 * Loading skeleton fallback for ProjectsExplorer during client hydration.
 */
function ProjectsExplorerSkeleton() {
  return (
    <section className="w-full pb-24" aria-hidden="true">
      <Container>
        <div className="h-44 w-full animate-pulse rounded-md border border-line bg-surface-1/40 mb-10" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[460px] w-full animate-pulse rounded-md border border-line bg-surface-1/30"
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

/**
 * Projects Page Route Component (Server Component).
 * Composes PROJ-01 (Page Hero) and PROJ-02 (Projects Explorer).
 */
export default function ProjectsPage() {
  const projectsData = getProjects();

  // Presence rule (05 §4): if no projects data or 0 items, render 404
  if (!projectsData || projectsData.items.length === 0) {
    notFound();
  }

  const { page, items } = projectsData;
  const skillMap = getSkillMap();

  // Create serializable skill dictionary for client components
  const serializableSkillMap: Record<string, { name: string; icon?: string }> = {};
  for (const [id, skill] of skillMap.entries()) {
    serializableSkillMap[id] = {
      name: skill.name,
      icon: skill.icon,
    };
  }

  // Derive lean client card items (leaving out heavy writeup, gallery, etc.)
  const leanProjects: ProjectCardItem[] = items.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    summary: p.summary,
    type: p.type,
    organization: p.organization
      ? {
          name: p.organization.name,
          url: p.organization.url,
        }
      : null,
    status: p.status,
    featured: p.featured,
    order: p.order,
    confidential: p.confidential,
    timeline: p.timeline
      ? {
          start: p.timeline.start,
          end: p.timeline.end,
          durationLabel: p.timeline.durationLabel,
        }
      : undefined,
    links: {
      github: p.links?.github ?? null,
      live: p.links?.live ?? null,
    },
    cover: p.cover
      ? {
          src: p.cover.src,
          alt: p.cover.alt,
          width: p.cover.width,
          height: p.cover.height,
        }
      : undefined,
    techStack: p.techStack.map((t) => ({
      skill: t.skill,
      reason: t.reason,
    })),
  }));

  // Derive unique project types present
  const availableTypes = Array.from(new Set(items.map((p) => p.type)));

  // Derive skills used by >= 1 visible project with usage counts
  const skillUsageCounts: Record<string, number> = {};
  for (const project of items) {
    for (const tech of project.techStack) {
      skillUsageCounts[tech.skill] = (skillUsageCounts[tech.skill] || 0) + 1;
    }
  }

  const availableSkills: AvailableSkill[] = Object.entries(skillUsageCounts)
    .map(([skillId, count]) => {
      const info = skillMap.get(skillId);
      return {
        id: skillId,
        name: info?.name || skillId.replace(/-/g, " "),
        icon: info?.icon,
        count,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  return (
    <main className="min-h-screen text-fg">
      {/* PROJ-01: Page Hero */}
      <ProjectsHeroSection
        eyebrow={page?.eyebrow}
        title={page?.title || "Selected *work*"}
        intro={page?.intro}
        totalCount={items.length}
      />

      {/* PROJ-02: Interactive Explorer wrapped in Suspense for static prerendering */}
      <Suspense fallback={<ProjectsExplorerSkeleton />}>
        <ProjectsExplorer
          projects={leanProjects}
          skillMap={serializableSkillMap}
          availableTypes={availableTypes}
          availableSkills={availableSkills}
          totalCount={items.length}
        />
      </Suspense>
    </main>
  );
}

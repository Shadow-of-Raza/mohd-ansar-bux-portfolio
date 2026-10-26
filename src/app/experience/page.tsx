import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExperience, getSkills, getProjects, getSite } from "@/lib/data/loaders";
import { calculateTotalExperience } from "@/lib/utils/dates";
import { ExperienceHeroSection } from "@/sections/experience/ExperienceHeroSection";
import { ExperienceListSection } from "@/sections/experience/ExperienceListSection";

export async function generateMetadata(): Promise<Metadata> {
  const experienceData = getExperience();
  const site = getSite();

  if (!experienceData || experienceData.items.length === 0) {
    return {
      title: "Experience",
    };
  }

  const seoTitle = experienceData.page.seo?.title || `Experience — ${site.name}`;
  const seoDescription = experienceData.page.seo?.description || site.seo?.description;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `${site.url}/experience`,
      siteName: site.name,
      images: site.seo?.ogImage ? [site.seo.ogImage.src] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      images: site.seo?.ogImage ? [site.seo.ogImage.src] : undefined,
    },
  };
}

export default function ExperiencePage() {
  const experienceData = getExperience();
  const skillsData = getSkills();
  const projectsData = getProjects();

  // Presence rule: if no visible experience companies exist, return 404
  if (!experienceData || experienceData.items.length === 0) {
    notFound();
  }

  // Compute total experience across all roles (including internships/training)
  const intervals = experienceData.items.flatMap((company) =>
    company.roles.map((role) => ({ start: role.start, end: role.end })),
  );
  const totalExperience = calculateTotalExperience(intervals);

  // Skill lookup map for badges & authentic SVG icons
  const skillMap: Record<string, { name: string; icon?: string }> = {};
  if (skillsData) {
    for (const skill of skillsData.items) {
      skillMap[skill.id] = { name: skill.name, icon: skill.icon };
    }
  }

  // Project lookup map for related project title & link
  const projectMap: Record<string, { title: string; slug: string }> = {};
  if (projectsData) {
    for (const project of projectsData.items) {
      projectMap[project.slug] = { title: project.title, slug: project.slug };
    }
  }

  return (
    <div className="flex flex-col">
      <ExperienceHeroSection
        page={experienceData.page}
        totalExperience={totalExperience}
      />
      <ExperienceListSection
        companies={experienceData.items}
        skillMap={skillMap}
        projectMap={projectMap}
      />
    </div>
  );
}

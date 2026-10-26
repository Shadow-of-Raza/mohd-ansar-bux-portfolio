import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSkills, getSite } from "@/lib/data/loaders";
import { getSkillUsage } from "@/lib/data/relations";
import { SkillsHeroSection } from "@/sections/skills/SkillsHeroSection";
import { SkillGroupsSection } from "@/sections/skills/SkillGroupsSection";

/**
 * Metadata for the /skills page.
 * Uses skills.json page.seo or site.json defaults.
 */
export async function generateMetadata(): Promise<Metadata> {
  const skillsData = getSkills();
  const site = getSite();
  const seo = skillsData?.page.seo;

  const siteName = site?.name || "Mohd Ansar Bux";
  const title = seo?.title || `Skills — ${siteName}`;
  const description =
    seo?.description ||
    skillsData?.page.intro ||
    site?.seo.description ||
    "Full-stack toolkit and technologies.";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site?.url || "https://ansarbux.dev";
  const ogImageUrl = site?.seo?.ogImage?.src
    ? `${siteUrl}${site.seo.ogImage.src}`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/skills`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/skills`,
      type: "website",
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  };
}

/**
 * Skills page (/skills).
 * Composes SK-01 (SkillsHeroSection) and SK-02 (SkillGroupsSection).
 * SK-03 (CTA band) is skipped as covered by global footer CTA.
 * Presence rule: returns 404 if no visible skills exist.
 */
export default function SkillsPage() {
  const skillsData = getSkills();

  // Presence rule: if data missing or empty, render nothing / 404
  if (!skillsData || skillsData.items.length === 0) {
    notFound();
  }

  const skillUsage = getSkillUsage();

  return (
    <div className="relative min-h-screen text-fg">
      {/* SK-01: Page Hero */}
      <SkillsHeroSection
        eyebrow={skillsData.page.eyebrow}
        title={skillsData.page.title}
        intro={skillsData.page.intro}
        totalSkills={skillsData.items.length}
        totalCategories={skillsData.categories.length}
      />

      {/* SK-02: Skill Groups */}
      <SkillGroupsSection
        categories={skillsData.categories}
        skills={skillsData.items}
        skillUsage={skillUsage}
        usageCopy={skillsData.usage}
      />
    </div>
  );
}

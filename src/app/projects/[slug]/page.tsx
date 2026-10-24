import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug, getSite } from "@/lib/data/loaders";
import { getSkillMap, getAdjacentProjects } from "@/lib/data/relations";
import { PdHero } from "@/sections/project-detail/PdHero";
import { PdMeta } from "@/sections/project-detail/PdMeta";
import { PdLinks } from "@/sections/project-detail/PdLinks";
import { PdWriteup } from "@/sections/project-detail/PdWriteup";
import { PdGallery } from "@/sections/project-detail/PdGallery";
import { PdPager, type PdPagerItem } from "@/sections/project-detail/PdPager";


/**
 * Pre-generate all static paths for visible projects at build time.
 */
export async function generateStaticParams() {
  const projectsData = getProjects();
  if (!projectsData) return [];

  return projectsData.items.map((project) => ({
    slug: project.slug,
  }));
}

/**
 * Generate route metadata for each project case study.
 * Follows design requirements (02 §8): uses project title, summary/tagline,
 * and project cover as the Open Graph image, falling back to site.seo.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  const site = getSite();

  if (!project) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || site.url || "https://ansarbux.dev";
  const title = `${project.title} — ${site.name}`;
  const description = project.tagline || project.summary || site.seo?.description || "";
  const ogImage = project.cover?.src
    ? `${siteUrl}${project.cover.src}`
    : site.seo?.ogImage
      ? `${siteUrl}${site.seo.ogImage}`
      : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/projects/${project.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/projects/${project.slug}`,
      type: "article",
      images: ogImage ? [{ url: ogImage, alt: project.cover?.alt || project.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

/**
 * Project Detail Page (Server Component).
 * Composes PD-01 through PD-06 adhering strictly to presence rules.
 */
export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  // Presence rule: unknown or hidden slugs return 404
  if (!project) {
    notFound();
  }

  // Retrieve skill mapping for technology logos and authentic names
  const skillMap = getSkillMap();
  const serializableSkillMap: Record<string, { name: string; icon?: string }> = {};
  for (const [id, skill] of skillMap.entries()) {
    serializableSkillMap[id] = {
      name: skill.name,
      icon: skill.icon,
    };
  }

  // Retrieve adjacent projects for the bottom pager
  const { prev, next } = getAdjacentProjects(slug);

  const pagerPrev: PdPagerItem | null = prev
    ? {
        slug: prev.slug,
        title: prev.title,
        type: prev.type,
        cover: prev.cover,
      }
    : null;

  const pagerNext: PdPagerItem | null = next
    ? {
        slug: next.slug,
        title: next.title,
        type: next.type,
        cover: next.cover,
      }
    : null;

  return (
    <article className="min-h-screen bg-night text-fg">
      {/* PD-01: Hero */}
      <PdHero
        title={project.title}
        tagline={project.tagline}
        type={project.type}
        status={project.status}
        cover={project.cover}
      />

      {/* PD-02: Meta bar */}
      <PdMeta
        organization={project.organization}
        role={project.role}
        type={project.type}
        status={project.status}
        timeline={project.timeline}
      />

      {/* PD-03: Action links & Confidential NDA status */}
      <PdLinks
        type={project.type}
        confidential={project.confidential}
        links={project.links}
        title={project.title}
      />

      {/* PD-04: Case study write-up */}
      <PdWriteup
        writeup={project.writeup}
        techStack={project.techStack}
        skillMap={serializableSkillMap}
      />

      {/* PD-05: Visual gallery with lightbox */}
      <PdGallery gallery={project.gallery} title={project.title} />

      {/* PD-06: Bottom adjacent project pager */}
      <PdPager prev={pagerPrev} next={pagerNext} />
    </article>
  );
}

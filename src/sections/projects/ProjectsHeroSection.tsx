import React from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { renderAccent } from "@/lib/utils/format";
import { PageHero } from "@/components/shared/PageHero";

export type ProjectsHeroSectionProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  totalCount: number;
  className?: string;
};

/**
 * PROJ-01 Page Hero (Server Component).
 * Renders the primary headline for /projects with editorial typography,
 * italic accent word in Averia Serif Libre, intro lead paragraph,
 * total projects count badge, and a hairline divider.
 */
export function ProjectsHeroSection({
  eyebrow = "Projects",
  title,
  intro,
  totalCount,
  className,
}: ProjectsHeroSectionProps) {
  const rawEyebrow = eyebrow.trim() || "Projects";
  const eyebrowText = rawEyebrow.replace(/^\d{2,3}\s*[—–-]\s*/, "");

  return (
    <PageHero
      id="projects-hero"
      aria-labelledby="projects-hero-title"
      className={className}
    >
      {/* Subtle ambient radial glow behind hero title */}
      <div
        className="pointer-events-none absolute -top-20 left-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-radial from-royal/20 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="max-w-[760px]">
          <div className="mb-3 sm:mb-4">
            <Eyebrow>{eyebrowText}</Eyebrow>
          </div>

          <h1
            id="projects-hero-title"
            className="font-display text-display-xl text-balance text-white"
          >
            {renderAccent(title)}
          </h1>

          {intro && (
            <p className="mt-4 max-w-[56ch] font-body text-lead text-pretty text-fg-muted">
              {intro}
            </p>
          )}

          {/* Qualification / Project Count Badge (left-aligned under intro per G3) */}
          {totalCount > 0 && (
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-4 py-2 font-label text-micro tracking-wider text-fg-subtle select-none">
                <span className="h-2 w-2 rounded-full bg-electric-300" aria-hidden="true" />
                <span className="text-white font-semibold">{totalCount}</span>
                <span>{totalCount === 1 ? "Project" : "Projects"}</span>
              </span>
            </div>
          )}
        </div>

        {/* Section Hairline Divider */}
        <div className="mt-8 h-px w-full bg-line sm:mt-10 lg:mt-12" aria-hidden="true" />
      </Container>
    </PageHero>
  );
}

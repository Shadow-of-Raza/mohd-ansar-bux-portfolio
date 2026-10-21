import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ProjectCard } from "@/components/shared/ProjectCard";
import { cn } from "@/lib/utils/cn";
import type { ProjectsData } from "@/lib/data/loaders";

export type ProjectsPreviewSectionProps = {
  projects: ProjectsData | null;
  skillMap?: Record<string, { name: string; icon?: string }>;
  hasProjectsPage?: boolean;
  className?: string;
};

/**
 * HOME-05 Projects (preview) section.
 * Renders featured projects as cards with 16:10 cover plate, type badge,
 * title, summary, up to 4 tech chips (+N), and stretched link to case studies.
 * Follows presence rules: returns null if data is absent or empty.
 * Adheres to docs/context/01 §5.1, 02 §6, 03 §6-11, 04 §5.6, and 05 §4-5.
 */
export function ProjectsPreviewSection({
  projects,
  skillMap,
  hasProjectsPage = true,
  className,
}: ProjectsPreviewSectionProps) {
  // Presence rule: if no projects data or zero featured items, render nothing
  if (!projects || projects.featured.length === 0) return null;

  const home = projects.home;
  const items = projects.featured;

  // Format section eyebrow with signature "05 — " number prefix if not already present
  const rawEyebrow = home.eyebrow?.trim() || "Projects";
  const eyebrowText = /^\d{2,3}\s*[—–-]\s*/.test(rawEyebrow) ? rawEyebrow : `05 — ${rawEyebrow}`;

  const title = home.title?.trim() || "Selected *work*";
  const intro = home.intro?.trim();

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className={cn("relative w-full overflow-hidden py-[clamp(5rem,12vw,10rem)]", className)}
    >
      {/* Subtle radial ambient glow behind section heading */}
      <div
        className="pointer-events-none absolute -top-32 right-1/4 h-[420px] w-[420px] rounded-full bg-radial from-royal/20 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Section Header: Asymmetric balance with heading & intro on left, CTA on right */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[720px]">
            <div className="mb-3 sm:mb-4">
              <Eyebrow>{eyebrowText}</Eyebrow>
            </div>

            <SectionHeading id="projects-title" className="text-display-lg">
              {title}
            </SectionHeading>

            {intro && (
              <p className="mt-4 max-w-[52ch] font-body text-lead text-pretty text-fg-muted">
                {intro}
              </p>
            )}
          </div>

          {/* Desktop / Tablet Header CTA Button */}
          {hasProjectsPage && (
            <div className="hidden shrink-0 md:block">
              <LinkButton
                href="/projects"
                variant="secondary"
                trailingIcon={<ArrowRight className="h-4 w-4" />}
              >
                See all projects
              </LinkButton>
            </div>
          )}
        </div>

        {/* Section Hairline Divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* Projects Cards Grid:
            - Mobile: 1 column
            - Tablet & Desktop: 2 columns with generous gap for editorial presentation
        */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {items.map((project) => (
            <ProjectCard key={project.id} project={project} skillMap={skillMap} />
          ))}
        </div>

        {/* Mobile-only Bottom CTA */}
        {hasProjectsPage && (
          <div className="mt-8 flex justify-center md:hidden">
            <LinkButton
              href="/projects"
              variant="secondary"
              className="w-full sm:w-auto"
              trailingIcon={<ArrowRight className="h-4 w-4" />}
            >
              See all projects
            </LinkButton>
          </div>
        )}
      </Container>
    </section>
  );
}

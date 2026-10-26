import React from "react";
import { ArrowRight, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ExperienceItem } from "@/components/shared/ExperienceItem";
import { calculateTotalExperience } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { ExperienceData } from "@/lib/data/loaders";

export type ExperiencePreviewSectionProps = {
  experience: ExperienceData | null;
  skillMap?: Record<string, { name: string; icon?: string }>;
  hasExperiencePage?: boolean;
  className?: string;
};

/**
 * HOME-03 Experience (preview) section.
 * Renders an editorial asymmetric layout with section heading, total commercial experience
 * metric, LinkedIn-style list of latest companies and roles, and "See full experience" CTA.
 * Strictly adheres to presence rules: returns null if data is absent or empty.
 * Follows docs/context/01 §5.1, 02 §6, 03 §6-11, 04 §5.4, and 05 §4-5.
 */
export function ExperiencePreviewSection({
  experience,
  skillMap,
  hasExperiencePage = true,
  className,
}: ExperiencePreviewSectionProps) {
  // Presence rule: if no experience data or zero featured companies, render nothing
  if (!experience || experience.featured.length === 0) return null;

  const home = experience.home;
  const items = experience.featured;

  // Format section eyebrow with signature "03 — " number prefix if not already present
  const rawEyebrow = home.eyebrow?.trim() || "Experience";
  const eyebrowText = /^\d{2,3}\s*[—–-]\s*/.test(rawEyebrow) ? rawEyebrow : `03 — ${rawEyebrow}`;

  const title = home.title?.trim() || "Recent *roles*";
  const intro = home.intro?.trim();

  // Compute total experience across all roles (including internships/training)
  const intervals = experience.items.flatMap((company) =>
    company.roles.map((role) => ({ start: role.start, end: role.end })),
  );
  const totalExperience = calculateTotalExperience(intervals);
  const statLabel = home.statLabel?.trim();
  const statDescription = home.statDescription?.trim();

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className={cn("relative w-full overflow-hidden py-[clamp(5rem,12vw,10rem)]", className)}
    >
      <Container>
        {/* Asymmetric 12-Column Grid on Desktop (cols 1-5 sticky header & stats, cols 6-12 items) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column: Heading, Intro, Total Experience Callout, and Desktop CTA */}
          <div className="flex flex-col justify-between lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <div>
              <div className="mb-3 sm:mb-4">
                <Eyebrow>{eyebrowText}</Eyebrow>
              </div>

              <SectionHeading id="experience-title" className="text-display-lg">
                {title}
              </SectionHeading>

              {intro && (
                <p className="mt-4 max-w-[48ch] font-body text-lead text-pretty text-fg-muted">
                  {intro}
                </p>
              )}

              {/* Total Experience Metric Highlight Card */}
              {totalExperience && totalExperience !== "0 mos" && (
                <div className="mt-8 rounded-md border border-line bg-surface-1 p-5 shadow-card">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-line bg-surface-2 text-electric-300">
                      <Briefcase className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {statLabel && (
                      <span className="font-label text-micro text-fg-subtle">
                        {statLabel}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 font-display text-heading text-white">
                    {totalExperience}
                  </div>
                  {statDescription && (
                    <p className="mt-1 font-body text-small text-fg-muted">
                      {statDescription}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Desktop CTA Button */}
            {hasExperiencePage && (
              <div className="mt-8 hidden lg:block">
                <LinkButton
                  href="/experience"
                  variant="secondary"
                  trailingIcon={<ArrowRight className="h-4 w-4" />}
                >
                  See full experience
                </LinkButton>
              </div>
            )}
          </div>

          {/* Right Column: LinkedIn-style Experience Items List */}
          <div className="space-y-6 sm:space-y-8 lg:col-span-7">
            {items.map((company) => (
              <ExperienceItem
                key={company.id}
                company={company}
                skillMap={skillMap}
                hasExperiencePage={hasExperiencePage}
              />
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Bottom CTA */}
        {hasExperiencePage && (
          <div className="mt-10 flex justify-center lg:hidden">
            <LinkButton
              href="/experience"
              variant="secondary"
              className="w-full sm:w-auto"
              trailingIcon={<ArrowRight className="h-4 w-4" />}
            >
              See full experience
            </LinkButton>
          </div>
        )}
      </Container>
    </section>
  );
}

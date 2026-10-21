import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { SkillTile } from "@/components/shared/SkillTile";
import { cn } from "@/lib/utils/cn";
import type { SkillsData } from "@/lib/data/loaders";
import type { SkillUsageItem } from "@/lib/data/relations";

export type SkillsShowcaseSectionProps = {
  skills: SkillsData | null;
  skillUsage?: Record<string, SkillUsageItem>;
  hasSkillsPage?: boolean;
  className?: string;
};

/**
 * HOME-06 Skills Showcase section.
 * Renders all visible skills grouped by category in an asymmetric editorial grid.
 * Each tile features monochrome-to-color logo hover transitions and an interactive
 * popover revealing derived project and company usage or empty-state contact CTA.
 * Follows presence rules: returns null if data is absent or empty.
 * Adheres to docs/context/01 §5.1, 02 §6, 03 §6-11, 04 §5.7, and 05 §4-5.
 */
export function SkillsShowcaseSection({
  skills,
  skillUsage = {},
  hasSkillsPage = true,
  className,
}: SkillsShowcaseSectionProps) {
  // Presence rule: if no skills data or zero items, render nothing
  if (!skills || skills.items.length === 0) return null;

  const home = skills.home;
  const categories = skills.categories;
  const items = skills.items;

  // Format section eyebrow with signature "06 — " number prefix if not already present
  const rawEyebrow = home.eyebrow?.trim() || "Skills";
  const eyebrowText = /^\d{2,3}\s*[—–-]\s*/.test(rawEyebrow) ? rawEyebrow : `06 — ${rawEyebrow}`;

  const title = home.title?.trim() || "Tools I *work* with";
  const intro = home.intro?.trim();

  return (
    <section
      id="skills"
      aria-labelledby="skills-title"
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
            {eyebrowText && (
              <div className="mb-3 sm:mb-4">
                <Eyebrow>{eyebrowText}</Eyebrow>
              </div>
            )}

            {title && (
              <SectionHeading id="skills-title" className="text-display-lg">
                {title}
              </SectionHeading>
            )}

            {intro && (
              <p className="mt-4 max-w-[52ch] font-body text-lead text-pretty text-fg-muted">
                {intro}
              </p>
            )}
          </div>

          {/* Desktop / Tablet Header CTA Button */}
          {hasSkillsPage && (
            <div className="hidden shrink-0 md:block">
              <LinkButton
                href="/skills"
                variant="secondary"
                trailingIcon={<ArrowRight className="h-4 w-4" />}
              >
                Explore skills
              </LinkButton>
            </div>
          )}
        </div>

        {/* Section Hairline Divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* Categories List: Editorial 12-column asymmetric rows */}
        <div className="space-y-8 sm:space-y-10 lg:space-y-12">
          {categories.map((category, index) => {
            const categorySkills = items.filter((item) => item.category === category.id);
            if (categorySkills.length === 0) return null;

            return (
              <div
                key={category.id}
                className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-8 items-start pb-8 border-b border-line/50 last:border-b-0 last:pb-0"
              >
                {/* Left: Category Label & Counter */}
                <div className="lg:col-span-3 flex items-baseline justify-between lg:flex-col lg:justify-start lg:gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-label text-micro font-bold text-electric-300">
                      {String(index + 1).padStart(2, "0")}{" //"}
                    </span>
                    <h3 className="font-label text-sm font-semibold uppercase tracking-wider text-white">
                      {category.label}
                    </h3>
                  </div>
                  <span className="font-body text-xs text-fg-subtle">
                    {categorySkills.length} {categorySkills.length === 1 ? "technology" : "technologies"}
                  </span>
                </div>

                {/* Right: Grid of SkillTiles */}
                <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-3.5">
                  {categorySkills.map((skill) => (
                    <SkillTile
                      key={skill.id}
                      skill={skill}
                      usage={skillUsage[skill.id]}
                      emptyUsageCopy={skills.usage}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile-only Bottom CTA */}
        {hasSkillsPage && (
          <div className="mt-8 flex justify-center md:hidden">
            <LinkButton
              href="/skills"
              variant="secondary"
              className="w-full sm:w-auto"
              trailingIcon={<ArrowRight className="h-4 w-4" />}
            >
              Explore skills
            </LinkButton>
          </div>
        )}
      </Container>
    </section>
  );
}

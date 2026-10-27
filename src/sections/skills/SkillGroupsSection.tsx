import React from "react";
import { Container } from "@/components/ui/Container";
import { SkillTile } from "@/components/shared/SkillTile";
import { cn } from "@/lib/utils/cn";
import type { Skill, SkillCategory } from "@/lib/data/schemas";
import type { SkillUsageItem } from "@/lib/data/relations";

export type SkillGroupsSectionProps = {
  categories: SkillCategory[];
  skills: Skill[];
  skillUsage?: Record<string, SkillUsageItem>;
  usageCopy?: {
    usedLabel?: string;
    emptyLabel?: string;
    emptyCta?: { label: string; href: string };
  };
  className?: string;
};

/**
 * SK-02 Skill Groups Section (Server Component).
 * Renders visible skills grouped by category in an asymmetric 12-column editorial layout.
 * Category rail is sticky on desktop, with responsive 1/2/3-column skill tile grid on the right.
 * Passes id={skill.id} to SkillTile so deep-links (/skills#{skillId}) from PD-04 jump
 * directly to the target skill with header scroll margin and highlight ring.
 * Follows presence rules: returns null if categories or skills are empty.
 * Adheres strictly to docs/context/01 §5.8, 02 §6, 03 §6-11, 04 §5.8, and 05 §4-5.
 */
export function SkillGroupsSection({
  categories,
  skills,
  skillUsage = {},
  usageCopy,
  className,
}: SkillGroupsSectionProps) {
  if (!categories || categories.length === 0 || !skills || skills.length === 0) {
    return null;
  }

  // Map skills by category id
  const skillsByCategory = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = skillsByCategory.get(skill.category);
    if (list) {
      list.push(skill);
    } else {
      skillsByCategory.set(skill.category, [skill]);
    }
  }

  // Filter categories to only those containing at least 1 visible skill
  const activeCategories = categories
    .filter((cat) => {
      const catSkills = skillsByCategory.get(cat.id);
      return catSkills && catSkills.length > 0;
    })
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  if (activeCategories.length === 0) return null;

  return (
    <section
      id="skill-groups"
      aria-label="Skill categories and technologies"
      className={cn("relative w-full py-12 md:py-16 lg:py-20", className)}
    >
      <Container>
        <div className="space-y-12 md:space-y-14 lg:space-y-16">
          {activeCategories.map((category, index) => {
            const catSkills = (skillsByCategory.get(category.id) ?? []).sort(
              (a, b) => (a.order ?? Infinity) - (b.order ?? Infinity),
            );

            return (
              <div
                key={category.id}
                id={`category-${category.id}`}
                className="scroll-mt-28"
              >
                {/* Asymmetric 12-column grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
                  {/* Category Rail (sticky on desktop) */}
                  <div className="md:col-span-4 lg:col-span-3">
                    <div className="md:sticky md:top-28 md:self-start">
                      <h2 className="font-display text-display-xs text-white sm:text-display-sm">
                        {category.label}
                      </h2>
                      <p className="mt-2 font-label text-xs tracking-wider uppercase text-fg-subtle">
                        {catSkills.length} {catSkills.length === 1 ? "technology" : "technologies"}
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="md:col-span-8 lg:col-span-9">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-3.5">
                      {catSkills.map((skill) => (
                        <SkillTile
                          key={skill.id}
                          id={skill.id}
                          skill={skill}
                          usage={skillUsage[skill.id]}
                          emptyUsageCopy={usageCopy}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hairline Divider between categories, except last */}
                {index < activeCategories.length - 1 && (
                  <div
                    className="mt-12 h-px w-full bg-line md:mt-14 lg:mt-16"
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

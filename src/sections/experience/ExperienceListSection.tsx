import React from "react";
import { Container } from "@/components/ui/Container";
import { ExperienceItem } from "@/components/shared/ExperienceItem";
import { ExperienceRailNav } from "@/components/shared/ExperienceRailNav";
import { cn } from "@/lib/utils/cn";
import type { ExperienceCompany } from "@/lib/data/schemas";

export type ExperienceListSectionProps = {
  companies: ExperienceCompany[];
  skillMap?: Record<string, { name: string; icon?: string }>;
  projectMap?: Record<string, { title: string; slug: string }>;
  className?: string;
};

/**
 * EXP-02 Experience List Section.
 * Implements the full LinkedIn-style experience timeline grouped by company.
 * Maps companies directly to <ExperienceItem variant="full" /> and provides the
 * page-level layout: sticky company navigation rail, anchor IDs, and scroll-margin.
 * Adheres strictly to docs/context/01 §5.4, 02 §6, 03 §6-11, and 05 §4-5.
 */
export function ExperienceListSection({
  companies,
  skillMap,
  projectMap,
  className,
}: ExperienceListSectionProps) {
  if (!companies || companies.length === 0) return null;

  const railItems = companies.map((c) => ({
    id: c.id,
    name: c.company.name,
    rolesCount: c.roles.length,
  }));

  return (
    <section
      id="experience-list"
      aria-label="Professional Experience History"
      className={cn("relative w-full pb-24 sm:pb-32 lg:pb-40", className)}
    >
      <Container>
        {/* Asymmetric 12-Column Layout with Sticky Company Rail on Desktop */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Company Rail (sticky navigation on desktop, horizontal tabs on mobile) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-28 lg:self-start">
            <ExperienceRailNav companies={railItems} />
          </aside>

          {/* Right Column: Full Experience Items with Anchor IDs and Scroll Margin */}
          <div className="space-y-10 sm:space-y-12 lg:col-span-9">
            {companies.map((company) => (
              <div
                key={company.id}
                id={company.id}
                className="scroll-mt-32 md:scroll-mt-36"
              >
                <ExperienceItem
                  company={company}
                  skillMap={skillMap}
                  projectMap={projectMap}
                  variant="full"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

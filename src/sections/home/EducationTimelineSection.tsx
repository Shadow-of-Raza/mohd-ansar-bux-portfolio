import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { TimelineItem } from "@/components/shared/TimelineItem";
import { cn } from "@/lib/utils/cn";
import type { EducationData } from "@/lib/data/loaders";

export type EducationTimelineSectionProps = {
  education: EducationData | null;
  hasEducationPage?: boolean;
  className?: string;
};

/**
 * HOME-04 Education (timeline) section.
 * Renders education entries along a vertical timeline with royal track,
 * electric progress line, and 10px node rings that alternate on desktop.
 * Strictly adheres to presence rules: returns null if data is absent or empty.
 * Follows docs/context/01 §5.1, 02 §6, 03 §6-11, 04 §5.5, and 05 §4-5.
 */
export function EducationTimelineSection({
  education,
  hasEducationPage = true,
  className,
}: EducationTimelineSectionProps) {
  // Presence rule: if no education data or zero items, render nothing
  if (!education || education.items.length === 0) return null;

  const home = education.home;
  const items = education.items;

  // Format section eyebrow with signature "04 — " number prefix if not already present
  const rawEyebrow = home.eyebrow?.trim() || "Education";
  const eyebrowText = /^\d{2,3}\s*[—–-]\s*/.test(rawEyebrow) ? rawEyebrow : `04 — ${rawEyebrow}`;

  const title = home.title?.trim() || "Learning *path*";
  const intro = home.intro?.trim();

  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className={cn("relative w-full overflow-hidden py-[clamp(5rem,12vw,10rem)]", className)}
    >
      <Container>
        {/* Section Header: Eyebrow, Heading, and Intro */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-3 sm:mb-4 flex justify-center">
            <Eyebrow>{eyebrowText}</Eyebrow>
          </div>

          <SectionHeading id="education-title" className="text-display-lg">
            {title}
          </SectionHeading>

          {intro && (
            <p className="mx-auto mt-4 max-w-[52ch] font-body text-lead text-pretty text-fg-muted">
              {intro}
            </p>
          )}
        </div>

        {/* Timeline Container */}
        <div className="relative mx-auto mt-12 sm:mt-16 max-w-5xl">
          {/* Static Track (1px royal) */}
          <span
            aria-hidden="true"
            className="absolute top-4 bottom-4 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-px bg-royal"
          />

          {/* Progress Line (2px electric, static in Phase 4; scroll-scrubbed in Phase 6) */}
          <span
            aria-hidden="true"
            data-progress
            className="absolute top-4 bottom-4 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-0.5 bg-electric"
          />

          {/* Timeline Nodes & Cards */}
          <div className="space-y-10 sm:space-y-12 md:space-y-16">
            {items.map((item, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col md:flex-row md:items-start"
                >
                  {/* Timeline 10px Ring Node: centered on line */}
                  <div
                    aria-hidden="true"
                    className="absolute top-6 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 z-10 flex h-5 w-5 items-center justify-center"
                  >
                    <span className="h-2.5 w-2.5 rounded-full border-2 border-electric bg-electric ring-4 ring-royal/40" />
                  </div>

                  {/* Timeline Card */}
                  <div
                    className={cn(
                      "w-full pl-10 sm:pl-14 md:pl-0 md:w-[calc(50%-2rem)]",
                      isEven ? "md:mr-auto" : "md:ml-auto",
                    )}
                  >
                    <TimelineItem item={item} index={index} variant="compact" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Bottom Action CTA */}
        {hasEducationPage && (
          <div className="mt-12 sm:mt-16 flex justify-center">
            <LinkButton
              href="/education"
              variant="secondary"
              trailingIcon={<ArrowRight className="h-4 w-4" />}
            >
              View education
            </LinkButton>
          </div>
        )}
      </Container>
    </section>
  );
}

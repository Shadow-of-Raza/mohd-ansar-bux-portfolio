import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { Timeline } from "@/components/shared/Timeline";
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
        <Timeline items={items} variant="compact" className="mt-12 sm:mt-16" />

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

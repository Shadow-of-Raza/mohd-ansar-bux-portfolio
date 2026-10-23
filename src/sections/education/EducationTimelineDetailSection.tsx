import React from "react";
import { Container } from "@/components/ui/Container";
import { Timeline } from "@/components/shared/Timeline";
import { cn } from "@/lib/utils/cn";
import type { Education } from "@/lib/data/schemas";

export type EducationTimelineDetailSectionProps = {
  items: Education[];
  className?: string;
};

/**
 * EDU-02 Education Detailed Timeline Section.
 * Renders the full expanded academic timeline using the shared Timeline component
 * with variant="full" (score, board, location, highlights with highlighted metrics, and coursework chips).
 * Adheres strictly to docs/context/01 §5.5, 02 §3, 03 §6-11, and 05 §4-5.
 */
export function EducationTimelineDetailSection({
  items,
  className,
}: EducationTimelineDetailSectionProps) {
  if (!items || items.length === 0) return null;

  return (
    <section
      id="education-timeline"
      aria-label="Education and Academic Credentials"
      className={cn("relative w-full pb-24 sm:pb-32 lg:pb-40", className)}
    >
      <Container>
        <Timeline items={items} variant="full" />
      </Container>
    </section>
  );
}

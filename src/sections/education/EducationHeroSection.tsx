import React from "react";
import { GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";

export type EducationHeroSectionProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  page?: {
    eyebrow?: string;
    title?: string;
    intro?: string;
  };
  count?: number;
  className?: string;
};

/**
 * EDU-01 Education Page Hero.
 * Renders the page title (h1), editorial intro paragraph,
 * qualification count badge, and hairline divider.
 * Adheres strictly to docs/context/01 §5.5, 02 §6, 03 §2-6, and 05 §4-5.
 */
export function EducationHeroSection({
  eyebrow,
  title,
  intro,
  page,
  count,
  className,
}: EducationHeroSectionProps) {
  const rawEyebrow = eyebrow || page?.eyebrow?.trim() || "Education";
  const eyebrowText = rawEyebrow.replace(/^\d{2,3}\s*[—–-]\s*/, "");
  const headingTitle = title || page?.title?.trim() || "What I've *studied*";
  const introText = intro || page?.intro?.trim();

  return (
    <PageHero
      id="education-hero"
      aria-labelledby="education-page-title"
      className={className}
    >
      <Container>
        <div className="max-w-3xl space-y-6">
          <div className="mb-2">
            <Eyebrow>{eyebrowText}</Eyebrow>
          </div>

          <SectionHeading as="h1" id="education-page-title" className="text-display-lg sm:text-display-xl">
            {headingTitle}
          </SectionHeading>

          {introText && (
            <p className="font-body text-lead text-pretty text-fg-muted max-w-[56ch]">
              {introText}
            </p>
          )}

          {count !== undefined && count > 0 && (
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-electric/30 bg-surface-2/80 px-3.5 py-1.5 font-label text-micro text-electric-200 shadow-sm backdrop-blur-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric-900/60 text-electric-300">
                  <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span>
                  {count} {count === 1 ? "Qualification" : "Qualifications"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Editorial hairline separator */}
        <div className="mt-12 sm:mt-16 w-full border-b border-line" aria-hidden="true" />
      </Container>
    </PageHero>
  );
}

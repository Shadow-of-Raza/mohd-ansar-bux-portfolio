import React from "react";
import { Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/shared/PageHero";

export type ExperienceHeroSectionProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  page?: {
    eyebrow?: string;
    title?: string;
    intro?: string;
  };
  totalExperience?: string;
  className?: string;
};

/**
 * EXP-01 Experience Page Hero.
 * Renders the page title (h1), editorial intro, and computed total commercial experience badge.
 * Adheres strictly to design system (01 §5.4, 03 §2-6, 05 §4-5).
 */
export function ExperienceHeroSection({
  eyebrow,
  title,
  intro,
  page,
  totalExperience,
  className,
}: ExperienceHeroSectionProps) {
  const rawEyebrow = eyebrow || page?.eyebrow?.trim() || "Experience";
  const eyebrowText = rawEyebrow.replace(/^\d{2,3}\s*[—–-]\s*/, "");
  const headingTitle = title || page?.title?.trim() || "Where I've *worked*";
  const introText = intro || page?.intro?.trim();

  return (
    <PageHero
      id="experience-hero"
      aria-labelledby="experience-page-title"
      className={className}
    >
      <Container>
        <div className="max-w-3xl space-y-6">
          <div className="mb-2">
            <Eyebrow>{eyebrowText}</Eyebrow>
          </div>

          <SectionHeading as="h1" id="experience-page-title" className="text-display-lg sm:text-display-xl">
            {headingTitle}
          </SectionHeading>

          {introText && (
            <p className="font-body text-lead text-pretty text-fg-muted max-w-[56ch]">
              {introText}
            </p>
          )}

          {totalExperience && totalExperience !== "0 mos" && (
            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-electric/30 bg-surface-2/80 px-3.5 py-1.5 font-label text-micro text-electric-200 shadow-sm backdrop-blur-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-electric-900/60 text-electric-300">
                  <Briefcase className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                <span>{totalExperience} Experience</span>
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

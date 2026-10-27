import React from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { renderAccent } from "@/lib/utils/format";
import { PageHero } from "@/components/shared/PageHero";

export type SkillsHeroSectionProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  totalSkills: number;
  totalCategories: number;
  className?: string;
};

/**
 * SK-01 Skills Page Hero (Server Component).
 * Renders the primary headline for /skills with editorial typography,
 * italic accent word in Averia Serif Libre, intro lead paragraph,
 * total skills and categories qualification badge, and a hairline divider.
 * Adheres strictly to docs/context/01 §5.8, 02 §6, 03 §2-6, and 05 §4-5.
 */
export function SkillsHeroSection({
  eyebrow = "Skills",
  title = "My *toolkit*",
  intro,
  totalSkills,
  totalCategories,
  className,
}: SkillsHeroSectionProps) {
  const rawEyebrow = eyebrow.trim() || "Skills";
  const eyebrowText = rawEyebrow.replace(/^\d{2,3}\s*[—–-]\s*/, "");

  return (
    <PageHero
      id="skills-hero"
      aria-labelledby="skills-hero-title"
      className={className}
    >
      {/* Subtle ambient radial glow behind hero title */}
      <div
        className="pointer-events-none absolute -top-20 left-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-radial from-royal/20 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="max-w-[760px]">
          <div className="mb-3 sm:mb-4">
            <Eyebrow>{eyebrowText}</Eyebrow>
          </div>

          <h1
            id="skills-hero-title"
            className="font-display text-display-xl text-balance text-white"
          >
            {renderAccent(title)}
          </h1>

          {intro && (
            <p className="mt-4 max-w-[56ch] font-body text-lead text-pretty text-fg-muted">
              {intro}
            </p>
          )}

          {/* Total Skills & Categories Qualification Badge (left-aligned under intro per G3) */}
          {totalSkills > 0 && (
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-4 py-2 font-label text-micro tracking-wider text-fg-subtle select-none">
                <span className="h-2 w-2 rounded-full bg-electric-300" aria-hidden="true" />
                <span className="text-white font-semibold">{totalSkills}</span>
                <span>{totalSkills === 1 ? "Skill" : "Skills"}</span>
                {totalCategories > 0 && (
                  <>
                    <span className="text-fg-subtle/50" aria-hidden="true">
                      ·
                    </span>
                    <span>
                      {totalCategories} {totalCategories === 1 ? "Category" : "Categories"}
                    </span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Hairline Divider */}
        <div className="mt-10 h-px w-full bg-line md:mt-14" aria-hidden="true" />
      </Container>
    </PageHero>
  );
}

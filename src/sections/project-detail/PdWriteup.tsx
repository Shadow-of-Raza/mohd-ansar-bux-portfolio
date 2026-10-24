import React from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils/cn";

export type PdWriteupProps = {
  writeup?: {
    overview?: string[];
    purpose?: string[];
    features?: string[];
    challenges?: string[];
    outcome?: string[];
  };
  techStack?: {
    skill: string;
    reason?: string;
  }[];
  skillMap?: Record<string, { name: string; icon?: string }>;
  className?: string;
};

/**
 * Highlight numerical figures and percentages in metric sentences.
 */
function highlightNumbers(text: string) {
  const parts = text.split(/(\b\d+(?:\.\d+)?%?|\b\d+k\+?|\b\d+\+)/gi);
  return parts.map((part, i) =>
    /^\d+(?:\.\d+)?%?$|^\d+k\+?$|^\d+\+$/i.test(part) ? (
      <span key={i} className="font-semibold text-electric-300">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/**
 * PD-04 Project Write-up Section (Server Component).
 * Renders the structured case study:
 * 1. Overview
 * 2. Purpose / Problem
 * 3. Solution & Features
 * 4. Architecture & Tech Stack (links to /skills#{skillId})
 * 5. Challenges & Learnings
 * 6. Outcome & Impact
 * Obeys presence rules: every subsection only renders if data exists.
 */
export function PdWriteup({
  writeup,
  techStack,
  skillMap,
  className,
}: PdWriteupProps) {
  const hasOverview = Boolean(writeup?.overview && writeup.overview.length > 0);
  const hasPurpose = Boolean(writeup?.purpose && writeup.purpose.length > 0);
  const hasFeatures = Boolean(writeup?.features && writeup.features.length > 0);
  const hasTech = Boolean(techStack && techStack.length > 0);
  const hasChallenges = Boolean(writeup?.challenges && writeup.challenges.length > 0);
  const hasOutcome = Boolean(writeup?.outcome && writeup.outcome.length > 0);

  // Presence rule: if entire writeup and tech stack are empty, render nothing
  if (!hasOverview && !hasPurpose && !hasFeatures && !hasTech && !hasChallenges && !hasOutcome) {
    return null;
  }

  return (
    <section id="pd-writeup" className={cn("w-full py-8 sm:py-12", className)}>
      <Container>
        <div className="space-y-12 sm:space-y-16">
          {/* =========================================================================
              1. Overview
              ========================================================================= */}
          {hasOverview && writeup?.overview && (
            <div className="border-t border-line/60 pt-8 sm:pt-12">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <div className="mb-2">
                    <Eyebrow>01 — Overview</Eyebrow>
                  </div>
                  <h2 className="font-display text-heading text-balance text-white">
                    Project Context
                  </h2>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  {writeup.overview.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="font-body text-body text-pretty text-fg-muted leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              2. Purpose / Problem
              ========================================================================= */}
          {hasPurpose && writeup?.purpose && (
            <div className="border-t border-line/60 pt-8 sm:pt-12">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <div className="mb-2">
                    <Eyebrow>02 — Problem & Goal</Eyebrow>
                  </div>
                  <h2 className="font-display text-heading text-balance text-white">
                    Purpose & Motivation
                  </h2>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  {writeup.purpose.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="font-body text-body text-pretty text-fg-muted leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              3. Solution & Key Features
              ========================================================================= */}
          {hasFeatures && writeup?.features && (
            <div className="border-t border-line/60 pt-8 sm:pt-12">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <div className="mb-2">
                    <Eyebrow>03 — Capabilities</Eyebrow>
                  </div>
                  <h2 className="font-display text-heading text-balance text-white">
                    Key Features
                  </h2>
                </div>
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {writeup.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-md border border-line bg-surface-1/60 p-4"
                      >
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-electric-300 mt-0.5" />
                        <span className="font-body text-body text-white">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              4. Architecture & Tech Stack (Links to /skills#{skillId})
              ========================================================================= */}
          {hasTech && techStack && (
            <div className="border-t border-line/60 pt-8 sm:pt-12">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <div className="mb-2">
                    <Eyebrow>04 — Architecture</Eyebrow>
                  </div>
                  <h2 className="font-display text-heading text-balance text-white">
                    Tech Stack & Rationale
                  </h2>
                  <p className="mt-3 font-body text-small text-fg-subtle">
                    Each technology was selected deliberately for performance, type safety, and operational resilience.
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {techStack.map((tech) => {
                      const skillInfo = skillMap?.[tech.skill];
                      const skillName = skillInfo?.name || tech.skill.replace(/-/g, " ");
                      const skillIcon = skillInfo?.icon;

                      return (
                        <Link
                          key={tech.skill}
                          href={`/skills#${tech.skill}`}
                          className="group relative flex flex-col justify-between rounded-md border border-line bg-surface-1 p-5 transition-all duration-200 hover:border-electric hover:shadow-card focus-visible:outline-2 focus-visible:outline-electric-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {skillIcon && (
                                <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                                  <Image
                                    src={skillIcon}
                                    alt=""
                                    width={22}
                                    height={22}
                                    className="h-5 w-5 object-contain"
                                  />
                                </span>
                              )}
                              <span className="font-label text-label font-medium text-white transition-colors duration-200 group-hover:text-electric-300">
                                {skillName}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-fg-subtle transition-transform duration-200 group-hover:translate-x-1 group-hover:text-electric-300" />
                          </div>

                          {tech.reason && (
                            <p className="mt-3 font-body text-small text-fg-muted leading-relaxed">
                              {tech.reason}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              5. Challenges & Learnings
              ========================================================================= */}
          {hasChallenges && writeup?.challenges && (
            <div className="border-t border-line/60 pt-8 sm:pt-12">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <div className="mb-2">
                    <Eyebrow>05 — Engineering</Eyebrow>
                  </div>
                  <h2 className="font-display text-heading text-balance text-white">
                    Challenges & Learnings
                  </h2>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  {writeup.challenges.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="font-body text-body text-pretty text-fg-muted leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              6. Outcome & Impact
              ========================================================================= */}
          {hasOutcome && writeup?.outcome && (
            <div className="border-t border-line/60 pt-8 sm:pt-12">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-4">
                  <div className="mb-2">
                    <Eyebrow>06 — Impact</Eyebrow>
                  </div>
                  <h2 className="font-display text-heading text-balance text-white">
                    Outcome & Results
                  </h2>
                </div>
                <div className="lg:col-span-8 space-y-4">
                  {writeup.outcome.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="font-body text-body text-pretty text-fg-muted leading-relaxed"
                    >
                      {highlightNumbers(paragraph)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

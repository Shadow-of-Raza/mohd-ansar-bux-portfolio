import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ResumeButton } from "@/components/shared/ResumeButton";
import type { Profile } from "@/lib/data/schemas";

export type AboutPreviewSectionProps = {
  profile: Profile | null;
  hasAboutPage?: boolean;
  className?: string;
};

/**
 * HOME-01 About Me (preview) section.
 * Renders portrait, editorial summary paragraphs, quick facts, and action CTAs.
 * Follows presence rules: returns null if data is absent.
 * Per docs/context/01 §5.1, 02 §6, 03 §6-11, 04 §5.2, and 05 §4-5.
 */
export function AboutPreviewSection({ profile, hasAboutPage = true, className }: AboutPreviewSectionProps) {
  if (!profile) return null;

  const home = profile.home;
  const summary = home.summary?.filter((p) => p && p.trim().length > 0) ?? [];
  const facts = home.facts?.filter((f) => f.label?.trim() && f.value?.trim()) ?? [];

  // Presence rule: if both summary and facts are empty, section does not render
  if (summary.length === 0 && facts.length === 0) return null;

  // Format section eyebrow with signature "01 — " number prefix if not already present
  const rawEyebrow = home.eyebrow?.trim() || "About me";
  const eyebrowText = /^\d{2,3}\s*[—–-]\s*/.test(rawEyebrow) ? rawEyebrow : `01 — ${rawEyebrow}`;

  const title = home.title?.trim() || "Engineer, builder, *problem-solver*";
  const portrait = profile.portrait?.src ? profile.portrait : null;
  const hasResume = Boolean(profile.resume?.file && profile.resume.file.trim().length > 0);
  const shouldRenderActions = hasAboutPage || hasResume;

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={cn("relative w-full overflow-hidden py-[clamp(5rem,12vw,10rem)]", className)}
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-[720px]">
          <div className="mb-3 sm:mb-4">
            <Eyebrow>{eyebrowText}</Eyebrow>
          </div>
          <SectionHeading id="about-title" className="text-display-lg">
            {title}
          </SectionHeading>
        </div>

        {/* Section Hairline divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* Asymmetric Content Grid */}
        {portrait ? (
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-8 lg:gap-12 xl:gap-16">
            {/* Left Column: Portrait Frame (5 cols) */}
            <div className="md:col-span-5 lg:col-span-5">
              <div className="group relative mx-auto w-full max-w-md overflow-hidden rounded-lg border border-line bg-surface-1 p-2 shadow-card transition-colors duration-300 hover:border-line-strong md:max-w-none">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-surface-2">
                  <Image
                    src={portrait.src}
                    alt={portrait.alt || "Portrait of Mohd Ansar Bux"}
                    width={portrait.width}
                    height={portrait.height}
                    sizes="(min-width: 1440px) 480px, (min-width: 1024px) 40vw, (min-width: 768px) 340px, (min-width: 640px) 440px, 100vw"
                    className="h-full w-full object-cover object-center contrast-[1.05] saturate-[0.85] transition-all duration-500 group-hover:scale-[1.02] group-hover:contrast-100 group-hover:saturate-100"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Copy, Quick Facts, and CTAs (7 cols) */}
            <div className="flex flex-col justify-between md:col-span-7 lg:col-span-7">
              {/* Summary Paragraphs */}
              {summary.length > 0 && (
                <div className="max-w-[62ch] space-y-4 text-body font-body leading-relaxed text-fg-muted">
                  {summary.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {/* Quick Facts Grid */}
              {facts.length > 0 && (
                <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-10">
                  {facts.map((fact, idx) => (
                    <div
                      key={idx}
                      className="group relative rounded-md border border-line bg-surface-1/60 p-4 transition-all duration-200 hover:border-line-strong hover:bg-surface-1 sm:p-5"
                    >
                      <span className="block text-micro font-label tracking-wider text-fg-subtle uppercase">
                        {fact.label}
                      </span>
                      <span className="mt-1.5 block font-display text-[1.125rem] leading-snug tracking-tight text-white sm:text-title">
                        {fact.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action CTAs */}
              {shouldRenderActions && (
                <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
                  {hasAboutPage && (
                    <LinkButton
                      href="/about"
                      variant="primary"
                      size="md"
                      trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                    >
                      More about me
                    </LinkButton>
                  )}
                  {hasResume && <ResumeButton resume={profile.resume} variant="secondary" size="md" />}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Graceful Fallback if Portrait is Absent */
          <div className="mx-auto max-w-4xl">
            {summary.length > 0 && (
              <div className="max-w-[64ch] space-y-4 text-body font-body leading-relaxed text-fg-muted">
                {summary.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:mt-10">
                {facts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-md border border-line bg-surface-1/60 p-4 transition-all duration-200 hover:border-line-strong hover:bg-surface-1 sm:p-5"
                  >
                    <span className="block text-micro font-label tracking-wider text-fg-subtle uppercase">
                      {fact.label}
                    </span>
                    <span className="mt-1.5 block font-display text-[1.125rem] leading-snug tracking-tight text-white sm:text-title">
                      {fact.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {shouldRenderActions && (
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10 sm:gap-4">
                {hasAboutPage && (
                  <LinkButton
                    href="/about"
                    variant="primary"
                    size="md"
                    trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                  >
                    More about me
                  </LinkButton>
                )}
                {hasResume && <ResumeButton resume={profile.resume} variant="secondary" size="md" />}
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

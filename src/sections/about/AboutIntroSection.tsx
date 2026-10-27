import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResumeButton } from "@/components/shared/ResumeButton";
import { PageHero } from "@/components/shared/PageHero";
import type { Profile } from "@/lib/data/schemas";

export type AboutIntroSectionProps = {
  profile: Profile;
  siteName?: string;
  className?: string;
};

/**
 * ABOUT-01 About Intro Section (Page Hero & Biography).
 * Renders the page h1 heading, editorial intro, portrait image,
 * full narrative biography, and resume download action.
 * Follows presence rules: page h1 always renders when profile exists.
 */
export function AboutIntroSection({ profile, siteName, className }: AboutIntroSectionProps) {
  const page = profile.page;
  const rawEyebrow = page.eyebrow?.trim() || "About";
  const eyebrowText = rawEyebrow.replace(/^\d{2,3}\s*[—–-]\s*/, "");

  // Page h1 must always render when page exists: profile.page.title, falling back to siteName
  const title = page.title?.trim() || siteName || "About";
  const intro = page.intro?.trim();
  const portrait = profile.portrait?.src ? profile.portrait : null;
  const bio = profile.bio?.filter((p) => p && p.trim().length > 0) ?? [];
  const hasResume = Boolean(profile.resume?.file && profile.resume.file.trim().length > 0);

  return (
    <PageHero
      id="about-intro"
      aria-labelledby="about-page-title"
      className={className}
    >
      <Container>
        {/* Page Hero Header */}
        <div className="max-w-[820px]">
          <div className="mb-3 sm:mb-4">
            <Eyebrow>{eyebrowText}</Eyebrow>
          </div>
          <SectionHeading as="h1" id="about-page-title" className="text-display-xl">
            {title}
          </SectionHeading>
          {intro && (
            <p className="mt-4 text-lead font-body text-fg-muted max-w-[56ch] sm:mt-6">
              {intro}
            </p>
          )}
        </div>

        {/* Hairline Divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* Asymmetric Content Composition */}
        {portrait ? (
          <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12 md:gap-8 lg:gap-12 xl:gap-16">
            {/* Left Column: Portrait Frame (5 cols on md/lg) */}
            <div className="md:col-span-5 lg:col-span-5">
              <div className="group relative mx-auto w-full max-w-md overflow-hidden rounded-lg border border-line bg-surface-1 p-2 shadow-card transition-colors duration-300 hover:border-line-strong md:max-w-none">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-surface-2">
                  <Image
                    src={portrait.src}
                    alt={portrait.alt || `${siteName || "Profile"} portrait`}
                    width={portrait.width || 1200}
                    height={portrait.height || 1500}
                    priority
                    sizes="(min-width: 1440px) 480px, (min-width: 1024px) 40vw, (min-width: 768px) 340px, (min-width: 640px) 440px, 100vw"
                    className="h-full w-full object-cover object-center contrast-[1.05] saturate-[0.85] transition-all duration-500 group-hover:scale-[1.02] group-hover:contrast-100 group-hover:saturate-100"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Bio Paragraphs & Resume CTA (7 cols on md/lg) */}
            <div className="flex flex-col justify-between md:col-span-7 lg:col-span-7">
              {bio.length > 0 && (
                <div className="max-w-[64ch] space-y-4 text-body font-body leading-relaxed text-fg-muted sm:space-y-5">
                  {bio.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}

              {hasResume && (
                <div className="mt-8 pt-2 sm:mt-10">
                  <ResumeButton resume={profile.resume} variant="primary" size="lg" />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Graceful Fallback if Portrait is Absent */
          <div className="max-w-3xl">
            {bio.length > 0 && (
              <div className="space-y-4 text-body font-body leading-relaxed text-fg-muted sm:space-y-5">
                {bio.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}

            {hasResume && (
              <div className="mt-8 pt-2 sm:mt-10">
                <ResumeButton resume={profile.resume} variant="primary" size="lg" />
              </div>
            )}
          </div>
        )}
      </Container>
    </PageHero>
  );
}

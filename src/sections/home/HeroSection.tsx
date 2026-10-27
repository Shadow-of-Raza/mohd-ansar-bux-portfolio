import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { renderAccent } from "@/lib/utils/format";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { ScrollCue } from "@/components/shared/ScrollCue";
import type { Profile, Site } from "@/lib/data/schemas";

export type HeroSectionProps = {
  site: Site;
  profile?: Profile | null;
  hasProjectsPage?: boolean;
  hasContactPage?: boolean;
  className?: string;
};

/**
 * HOME-00 Hero section (polished).
 * Renders name (h1 dominant), secondary headline, quiet availability badge,
 * edge-blended 3D poster with ambient lighting, and smart secondary CTA (resume / contact).
 * Per docs/context/01 §5.1, 03 §6 & §8, 04 §5.1 & §6, and 05 §4.
 */
export function HeroSection({
  site,
  profile,
  hasProjectsPage = true,
  hasContactPage = true,
  className,
}: HeroSectionProps) {
  const hero = site.hero;
  const availability = site.availability;

  // Eyebrow fallback: site.hero.eyebrow -> site.role — site.location -> site.role
  const eyebrow = hero?.eyebrow ?? (site.location ? `${site.role} — ${site.location}` : site.role);

  // Headline fallback: site.hero.headline -> site.role
  const headline = hero?.headline ?? site.role;

  // Primary CTA
  const primaryCta = hero?.primaryCta ?? {
    label: "View projects",
    href: "/projects",
  };
  const shouldRenderPrimary = primaryCta && (primaryCta.href !== "/projects" || hasProjectsPage);

  // Secondary CTA: prioritize resume if available to avoid duplicate "Contact me" with header
  const resume = profile?.resume;
  const hasResume = Boolean(resume?.file && resume.file.trim().length > 0);

  const fallbackSecondary = hero?.secondaryCta ?? {
    label: "Contact me",
    href: "/contact",
  };

  const secondaryCta = hasResume
    ? {
        label: resume?.label?.trim() || "Download resume",
        href: resume!.file,
        download: true,
      }
    : {
        label: fallbackSecondary.label,
        href: fallbackSecondary.href,
        download: false,
      };

  const shouldRenderSecondary =
    hasResume || (secondaryCta && (secondaryCta.href !== "/contact" || hasContactPage));

  const poster = hero?.poster;

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className={cn(
        "relative flex min-h-[100svh] min-h-[640px] w-full flex-col justify-between overflow-hidden",
        "pt-16 pb-3 sm:pt-18 sm:pb-4 lg:pt-20 lg:pb-6",
        className,
      )}
    >
      {/* 3D Scene / Poster layer (Right 50% on desktop, blended on mobile/tablet) */}
      <div
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
        aria-hidden="true"
      >
        {/* Soft radial ambient glow (max 35% opacity per 03 §8) */}
        <div className="absolute top-1/2 right-0 h-[450px] w-[450px] -translate-y-1/2 rounded-full blur-3xl hero-glow sm:h-[550px] sm:w-[550px] lg:right-[5%] lg:h-[650px] lg:w-[650px]" />

        {/* Poster image with radial edge fade to eliminate hard rectangle borders */}
        {poster && (
          <div className="absolute top-1/2 right-0 h-[65%] max-h-[700px] w-full -translate-y-1/2 hero-poster-mask opacity-25 sm:h-[75%] md:w-[60%] md:opacity-40 lg:h-[80%] lg:w-[50%] lg:opacity-95 xl:w-[48%]">
            <Image
              src={poster.src}
              alt={poster.alt || `${site.name} 3D scene visual`}
              width={poster.width}
              height={poster.height}
              priority
              sizes="(min-width: 1440px) 720px, (min-width: 1024px) 50vw, (min-width: 768px) 60vw, 100vw"
              className="h-full w-full object-contain object-center lg:object-right"
            />
          </div>
        )}
      </div>

      {/* Main hero content: vertically centered */}
      <Container className="relative z-10 flex flex-1 flex-col justify-center">
        <div className="max-w-[720px] lg:max-w-[62%] xl:max-w-[58%]">
          {/* Availability badge: quiet surface-1 style with electric dot */}
          {availability?.open && availability?.label && (
            <div className="mb-2.5 sm:mb-3">
              <Badge variant="available">{availability.label}</Badge>
            </div>
          )}

          {/* Eyebrow */}
          {eyebrow && eyebrow.trim().length > 0 && (
            <p className="mb-2 text-label font-label tracking-widest text-fg-subtle sm:mb-2.5">{eyebrow}</p>
          )}

          {/* Name as the single dominant h1 landmark at text-display-xl (H1) */}
          <h1
            id="hero-title"
            className="text-display-xl font-display tracking-tight text-balance text-white uppercase"
          >
            {site.name}
          </h1>

          {/* Headline / Value proposition: clearly secondary, around text-heading size */}
          {headline && headline.trim().length > 0 && (
            <p className="mt-2 text-heading font-display tracking-tight text-balance text-fg sm:mt-2.5">
              {renderAccent(headline)}
            </p>
          )}

          {/* Value proposition details / intro copy */}
          {hero?.intro && hero.intro.trim().length > 0 && (
            <p className="mt-2 max-w-[52ch] text-small font-body text-pretty text-fg-muted sm:mt-2.5 sm:text-lead">
              {hero.intro}
            </p>
          )}

          {/* Action CTAs */}
          {(shouldRenderPrimary || shouldRenderSecondary) && (
            <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5 sm:gap-4">
              {shouldRenderPrimary && (
                <LinkButton
                  href={primaryCta.href}
                  variant="primary"
                  size="md"
                  trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                >
                  {primaryCta.label}
                </LinkButton>
              )}
              {shouldRenderSecondary && (
                <LinkButton
                  href={secondaryCta.href}
                  download={secondaryCta.download}
                  variant="secondary"
                  size="md"
                >
                  {secondaryCta.label}
                </LinkButton>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Scroll cue (anchors toward next section; hidden under 760px viewport height) */}
      <div className="relative z-10 hidden-short-viewport w-full pt-1 sm:pt-2">
        <ScrollCue targetId="about" />
      </div>
    </section>
  );
}

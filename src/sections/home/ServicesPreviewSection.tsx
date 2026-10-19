import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { ServiceCard } from "@/components/shared/ServiceCard";
import { cn } from "@/lib/utils/cn";
import type { ServicesData } from "@/lib/data/loaders";

export type ServicesPreviewSectionProps = {
  services: ServicesData | null;
  skillMap?: Record<string, { name: string; icon?: string }>;
  hasServicesPage?: boolean;
  className?: string;
};

/**
 * HOME-02 Services (preview) section.
 * Renders featured service cards with icons, numbering, summary, tech chips,
 * and a "See all services" CTA.
 * Strictly follows presence rules: returns null if data is absent or empty.
 * Adheres to docs/context/01 §5.1, 02 §6, 03 §6-11, 04 §5.3, and 05 §4-5.
 */
export function ServicesPreviewSection({
  services,
  skillMap,
  hasServicesPage = true,
  className,
}: ServicesPreviewSectionProps) {
  // Presence rule: if no services data or zero featured items, render nothing
  if (!services || services.featured.length === 0) return null;

  const home = services.home;
  const items = services.featured;

  // Format section eyebrow with signature "02 — " number prefix if not already present
  const rawEyebrow = home.eyebrow?.trim() || "Services";
  const eyebrowText = /^\d{2,3}\s*[—–-]\s*/.test(rawEyebrow) ? rawEyebrow : `02 — ${rawEyebrow}`;

  const title = home.title?.trim() || "How I can *help*";
  const intro = home.intro?.trim();

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className={cn("relative w-full overflow-hidden py-[clamp(5rem,12vw,10rem)]", className)}
    >
      <Container>
        {/* Section Header: Asymmetric balance with heading & intro on left, CTA on right */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[720px]">
            <div className="mb-3 sm:mb-4">
              <Eyebrow>{eyebrowText}</Eyebrow>
            </div>
            <SectionHeading id="services-title" className="text-display-lg">
              {title}
            </SectionHeading>
            {intro && (
              <p className="mt-4 max-w-[52ch] font-body text-lead text-pretty text-fg-muted">
                {intro}
              </p>
            )}
          </div>

          {/* Desktop / Tablet Header CTA Button */}
          {hasServicesPage && (
            <div className="hidden shrink-0 md:block">
              <LinkButton
                href="/services"
                variant="secondary"
                trailingIcon={<ArrowRight className="h-4 w-4" />}
              >
                See all services
              </LinkButton>
            </div>
          )}
        </div>

        {/* Section Hairline divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* Services Cards Grid:
            - Mobile: 1 column
            - Tablet: 2 columns, 3rd card spans 2 columns for balanced layout
            - Desktop: 3 columns
        */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((service, index) => {
            const isThirdCardOnTablet = index === 2 && items.length === 3;
            return (
              <div
                key={service.id}
                className={cn(isThirdCardOnTablet && "md:col-span-2 lg:col-span-1")}
              >
                <ServiceCard service={service} index={index} skillMap={skillMap} />
              </div>
            );
          })}
        </div>

        {/* Mobile-only Bottom CTA */}
        {hasServicesPage && (
          <div className="mt-8 flex justify-center md:hidden">
            <LinkButton
              href="/services"
              variant="secondary"
              className="w-full sm:w-auto"
              trailingIcon={<ArrowRight className="h-4 w-4" />}
            >
              See all services
            </LinkButton>
          </div>
        )}
      </Container>
    </section>
  );
}

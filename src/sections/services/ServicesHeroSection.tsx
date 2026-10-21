import React from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

export type ServicesHeroSectionProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  count: number;
  className?: string;
};

/**
 * SERV-01 Services Page Hero (Server Component).
 * Renders the page h1 heading, introductory lead paragraph,
 * and service availability count badge.
 */
export function ServicesHeroSection({
  eyebrow = "01 — Services",
  title = "What I can *build* for you",
  intro,
  count,
  className,
}: ServicesHeroSectionProps) {
  const rawEyebrow = eyebrow?.trim() || "Services";
  const eyebrowText = /^\d{2,3}\s*[—–-]\s*/.test(rawEyebrow) ? rawEyebrow : `01 — ${rawEyebrow}`;

  return (
    <section
      id="services-hero"
      aria-labelledby="services-page-title"
      className={cn("relative w-full overflow-hidden pt-12 pb-8 sm:pt-16 lg:pt-20", className)}
    >
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[820px]">
            <div className="mb-3 sm:mb-4">
              <Eyebrow>{eyebrowText}</Eyebrow>
            </div>
            <SectionHeading as="h1" id="services-page-title" className="text-display-xl">
              {title}
            </SectionHeading>
            {intro && (
              <p className="mt-4 text-lead font-body text-fg-muted max-w-[62ch] sm:mt-6">
                {intro}
              </p>
            )}
          </div>

          {/* Dynamic Service Count Badge */}
          {count > 0 && (
            <div className="shrink-0 pb-1">
              <Badge variant="available">
                {count} {count === 1 ? "Service" : "Services"} Available
              </Badge>
            </div>
          )}
        </div>

        {/* Hairline Divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />
      </Container>
    </section>
  );
}

import React from "react";
import { Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { renderAccent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export type ContactHeroSectionProps = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  availability?: {
    open: boolean;
    label?: string;
  };
  responseTime?: string;
  className?: string;
};

/**
 * CON-01 Contact Page Hero (Server Component).
 * Renders the primary headline for /contact with editorial typography,
 * italic accent word in Averia Serif Libre, intro lead paragraph,
 * availability status pill, response time pill, and a hairline divider.
 * Adheres strictly to docs/context/01 §5.9, 02 §6, 03 §2-6, and 05 §4-5.
 */
export function ContactHeroSection({
  eyebrow = "Contact",
  title = "Let's build something *together*",
  intro,
  availability,
  responseTime,
  className,
}: ContactHeroSectionProps) {
  // Format eyebrow with signature "01 — " number prefix if not already provided
  const rawEyebrow = eyebrow.trim() || "Contact";
  const eyebrowText = /^\d{2,3}\s*[—–-]\s*/.test(rawEyebrow) ? rawEyebrow : `01 — ${rawEyebrow}`;

  return (
    <section
      id="contact-hero"
      aria-labelledby="contact-hero-title"
      className={cn("relative w-full pt-28 pb-10 md:pt-36 md:pb-14", className)}
    >
      {/* Subtle ambient radial glow behind hero title */}
      <div
        className="pointer-events-none absolute -top-20 left-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-radial from-royal/20 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[760px]">
            <div className="mb-3 sm:mb-4">
              <Eyebrow>{eyebrowText}</Eyebrow>
            </div>

            <h1
              id="contact-hero-title"
              className="font-display text-display-xl text-balance text-white"
            >
              {renderAccent(title)}
            </h1>

            {intro && (
              <p className="mt-4 max-w-[56ch] font-body text-lead text-pretty text-fg-muted">
                {intro}
              </p>
            )}
          </div>

          {/* Status & Response Time Badges */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-end">
            {availability && (
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-4 py-2 font-label text-micro tracking-wider text-fg-subtle select-none">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    availability.open ? "bg-electric animate-pulse" : "bg-fg-subtle",
                  )}
                  aria-hidden="true"
                />
                <span className="text-white font-medium">
                  {availability.label || (availability.open ? "Available" : "Unavailable")}
                </span>
              </span>
            )}

            {responseTime && (
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-4 py-2 font-label text-micro tracking-wider text-fg-subtle select-none">
                <Clock className="h-3.5 w-3.5 text-electric-300" aria-hidden="true" />
                <span>{responseTime}</span>
              </span>
            )}
          </div>
        </div>

        {/* Section Hairline Divider */}
        <div className="mt-10 h-px w-full bg-line md:mt-14" aria-hidden="true" />
      </Container>
    </section>
  );
}

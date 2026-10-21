import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/LinkButton";
import { TechChip } from "@/components/shared/TechChip";
import { Accordion } from "@/components/ui/Accordion";
import { cn } from "@/lib/utils/cn";
import type { Service } from "@/lib/data/schemas";

export type ServiceDetailSectionProps = {
  service: Service;
  index: number;
  skillMap?: Record<string, { name: string; icon?: string }>;
  className?: string;
};

/**
 * SERV-03 Service Detail Section (Server Component).
 * Renders complete service anatomy per docs/context/01 §5.3:
 * 1. Number + Title + Tagline (font-body, strictly no Averia for supporting copy)
 * 2. Plain-language definition
 * 3. Why businesses need it (card grid)
 * 4. What's included deliverables (checklist)
 * 5. How I work process sequence
 * 6. Technologies (authentic SVG tech chips)
 * 7. Ideal for (target client chips)
 * 8. FAQs (accessible accordion)
 * 9. CTA ("Discuss this service" -> /contact?service={slug})
 */
export function ServiceDetailSection({
  service,
  index,
  skillMap,
  className,
}: ServiceDetailSectionProps) {
  const numberText = String(index + 1).padStart(2, "0");
  const definition = service.definition?.filter((d) => d && d.trim().length > 0) ?? [];
  const whyNeeded = service.whyNeeded ?? [];
  const deliverables = service.deliverables?.filter((d) => d && d.trim().length > 0) ?? [];
  const processSteps = service.process ?? [];
  const technologies = service.technologies ?? [];
  const idealFor = service.idealFor?.filter((i) => i && i.trim().length > 0) ?? [];
  const faqs = service.faqs ?? [];
  const ctaLabel = service.cta?.label?.trim() || "Discuss this service";
  const contactHref = `/contact?service=${encodeURIComponent(service.slug)}`;

  const faqItems = faqs.map((faq, i) => ({
    id: `${service.slug}-faq-${i}`,
    title: faq.question,
    content: <p className="font-body text-body text-fg-muted leading-relaxed">{faq.answer}</p>,
  }));

  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className={cn(
        "relative w-full overflow-hidden scroll-mt-32 md:scroll-mt-36 py-[clamp(4rem,9vw,7.5rem)]",
        className,
      )}
    >
      <Container>
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14 xl:gap-16">
          {/* Left Column: Anchor Header, Summary, Tech, Audience, and Primary CTA (Cols 1-4 on lg) */}
          <div className="lg:col-span-4 lg:sticky lg:top-36">
            <div className="mb-3">
              <Eyebrow>{numberText} — SERVICE</Eyebrow>
            </div>
            <SectionHeading id={`${service.slug}-title`} className="text-display-lg">
              {service.title}
            </SectionHeading>

            {/* Tagline: strictly font-body, never font-accent */}
            {service.tagline && (
              <p className="mt-3 text-lead font-body text-fg-muted leading-snug">
                {service.tagline}
              </p>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
              <div className="mt-8 pt-6 border-t border-line">
                <span className="block text-micro font-label tracking-wider text-fg-subtle uppercase">
                  Technologies
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {technologies.map((techId) => {
                    const tech = skillMap?.[techId];
                    return (
                      <TechChip
                        key={techId}
                        name={tech?.name ?? techId}
                        icon={tech?.icon}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ideal For */}
            {idealFor.length > 0 && (
              <div className="mt-8 pt-6 border-t border-line">
                <span className="block text-micro font-label tracking-wider text-fg-subtle uppercase">
                  Ideal For
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {idealFor.map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-line bg-surface-2 px-3 py-1 text-micro font-label text-fg-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Desktop CTA Button */}
            <div className="mt-8 hidden lg:block pt-6 border-t border-line">
              <LinkButton
                href={contactHref}
                variant="primary"
                size="md"
                trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                className="w-full justify-center"
              >
                {ctaLabel}
              </LinkButton>
            </div>
          </div>

          {/* Right Column: Deep-dive Content Blocks (Cols 5-12 on lg) */}
          <div className="space-y-12 lg:col-span-8 lg:space-y-14">
            {/* 1. What is it? (Plain-language Definition) */}
            {definition.length > 0 && (
              <div>
                <span className="block text-micro font-label tracking-wider text-electric-300 uppercase">
                  What is it?
                </span>
                <div className="mt-3 space-y-4 text-body font-body leading-relaxed text-fg-muted max-w-[66ch]">
                  {definition.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Why do people/businesses need it? */}
            {whyNeeded.length > 0 && (
              <div className="pt-6 border-t border-line">
                <span className="block text-micro font-label tracking-wider text-electric-300 uppercase">
                  Why you need it
                </span>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                  {whyNeeded.map((reason, idx) => (
                    <div
                      key={idx}
                      className="group rounded-md border border-line bg-surface-1 p-5 transition-all duration-200 hover:border-line-strong hover:bg-surface-2/60"
                    >
                      <h4 className="font-body text-title font-bold text-white">
                        {reason.title}
                      </h4>
                      <p className="mt-2 text-body font-body leading-relaxed text-fg-muted">
                        {reason.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. What's included (Deliverables) */}
            {deliverables.length > 0 && (
              <div className="pt-6 border-t border-line">
                <span className="block text-micro font-label tracking-wider text-electric-300 uppercase">
                  What&apos;s included
                </span>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {deliverables.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 rounded-md border border-line/60 bg-surface-1/40 p-3.5 text-body font-body text-fg-muted transition-colors hover:border-line hover:text-white"
                    >
                      <Check
                        className="h-4 w-4 shrink-0 text-electric-300 mt-1"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. How I work (Process steps) */}
            {processSteps.length > 0 && (
              <div className="pt-6 border-t border-line">
                <span className="block text-micro font-label tracking-wider text-electric-300 uppercase">
                  How I work
                </span>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {processSteps.map((step, idx) => {
                    const stepNumber = String(idx + 1).padStart(2, "0");
                    return (
                      <div
                        key={idx}
                        className="group flex flex-col justify-between rounded-md border border-line bg-surface-1/60 p-5 transition-all duration-200 hover:border-line-strong hover:bg-surface-1"
                      >
                        <div>
                          <span className="font-label text-micro text-electric-300">
                            {stepNumber}
                          </span>
                          <h4 className="mt-2 font-body text-title font-bold text-white">
                            {step.title}
                          </h4>
                        </div>
                        <p className="mt-2 text-small font-body leading-relaxed text-fg-muted">
                          {step.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. FAQs (Accordion) */}
            {faqItems.length > 0 && (
              <div className="pt-6 border-t border-line">
                <span className="block text-micro font-label tracking-wider text-electric-300 uppercase">
                  Frequently Asked Questions
                </span>
                <div className="mt-4">
                  <Accordion items={faqItems} />
                </div>
              </div>
            )}

            {/* Mobile / Tablet CTA */}
            <div className="pt-6 lg:hidden">
              <LinkButton
                href={contactHref}
                variant="primary"
                size="lg"
                trailingIcon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                className="w-full justify-center"
              >
                {ctaLabel}
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

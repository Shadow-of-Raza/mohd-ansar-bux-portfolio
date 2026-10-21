import React from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/lib/data/schemas";

export type PersonalInfoSectionProps = {
  basicInfo?: Profile["basicInfo"];
  eyebrow?: string;
  className?: string;
};

/**
 * ABOUT-05 Basic Information Section (Server Component).
 * Renders a structured label/value grid for personal details and working parameters.
 * Follows presence rules: returns null if basicInfo.items is empty; omits empty fields.
 */
export function PersonalInfoSection({
  basicInfo,
  eyebrow = "05 — Details",
  className,
}: PersonalInfoSectionProps) {
  const items =
    basicInfo?.items?.filter(
      (item) => item.label?.trim() && item.value?.trim(),
    ) ?? [];

  if (!basicInfo || items.length === 0) {
    return null;
  }

  const title = basicInfo.title?.trim() || "Basic *information*";

  return (
    <section
      id="basic-info"
      aria-labelledby="basic-info-title"
      className={cn("relative w-full overflow-hidden py-[clamp(3.5rem,8vw,6rem)]", className)}
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-[720px]">
          <div className="mb-3 sm:mb-4">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <SectionHeading id="basic-info-title" className="text-display-lg">
            {title}
          </SectionHeading>
        </div>

        {/* Section Divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* Structured 4-Column Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-md border border-line bg-surface-1/60 p-5 transition-all duration-200 hover:border-line-strong hover:bg-surface-1"
            >
              <span className="block text-micro font-label tracking-wider text-fg-subtle uppercase">
                {item.label}
              </span>
              <span className="mt-1.5 block font-display text-[1.125rem] leading-snug tracking-tight text-white sm:text-title">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

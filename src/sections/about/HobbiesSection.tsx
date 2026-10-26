import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/lib/data/schemas";

export type HobbiesSectionProps = {
  hobbies?: Profile["hobbies"];
  eyebrow?: string;
  className?: string;
};

/**
 * ABOUT-04 Personal Hobbies Section (Server Component).
 * Uses an editorial horizontal list row layout with numbered items, large display titles,
 * narrative descriptions, and preview image plates to deliberately contrast with
 * the card grid layout of Interests (§5.2).
 * Follows presence rules: returns null if hobbies.items is empty.
 */
export function HobbiesSection({
  hobbies,
  eyebrow = "04 — Personal",
  className,
}: HobbiesSectionProps) {
  const items = hobbies?.items?.filter((item) => item.title && item.title.trim().length > 0) ?? [];

  if (!hobbies || items.length === 0) {
    return null;
  }

  const title = hobbies.title?.trim() || "Away from the *keyboard*";

  return (
    <section
      id="hobbies"
      aria-labelledby="hobbies-title"
      className={cn("relative w-full overflow-hidden py-[clamp(3.5rem,8vw,6rem)]", className)}
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-[720px]">
          <div className="mb-3 sm:mb-4">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <SectionHeading id="hobbies-title" className="text-display-lg">
            {title}
          </SectionHeading>
        </div>

        {/* Section Divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* Large Editorial List Rows */}
        <div className="divide-y divide-line border-y border-line">
          {items.map((item, idx) => {
            const numberText = String(idx + 1).padStart(2, "0");
            const image = item.image?.src ? item.image : null;

            return (
              <div
                key={item.id || idx}
                className="group relative py-8 transition-colors duration-300 hover:bg-surface-1/40 sm:py-10 lg:py-12"
              >
                <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-12 md:gap-8 lg:gap-12">
                  {/* Number column (Col 1-2 on desktop) */}
                  <div className="sm:col-span-2 lg:col-span-1">
                    <span className="font-label text-label tracking-wider text-electric-300">
                      {numberText}
                    </span>
                  </div>

                  {/* Title and Description column (Col 3-8 if image, Col 3-12 if no image) */}
                  <div className={cn(image ? "sm:col-span-6 lg:col-span-7" : "sm:col-span-10 lg:col-span-11")}>
                    <h3 className="font-display text-heading sm:text-display-lg text-white transition-colors duration-300 group-hover:text-electric-200">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-2 text-body font-body leading-relaxed text-fg-muted sm:mt-3 max-w-[68ch]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Preview Image Plate (Col 9-12 on desktop) */}
                  {image && (
                    <div className="sm:col-span-4 lg:col-span-4">
                      <div className="relative aspect-[16/10] w-full max-w-[320px] overflow-hidden rounded-md border border-line bg-surface-2 shadow-card transition-all duration-300 group-hover:border-line-strong sm:max-w-none">
                        <Image
                          src={image.src}
                          alt={image.alt || `${item.title} photo`}
                          width={image.width || 800}
                          height={image.height || 1000}
                          loading="lazy"
                          sizes="(min-width: 1440px) 360px, (min-width: 1024px) 28vw, (min-width: 640px) 30vw, 100vw"
                          className="h-full w-full object-cover object-center contrast-[1.05] saturate-[0.85] transition-all duration-500 group-hover:scale-[1.03] group-hover:contrast-100 group-hover:saturate-100"
                        />
                        <div
                          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/40 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-40"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

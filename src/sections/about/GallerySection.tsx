import React from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryGrid } from "@/components/shared/GalleryGrid";
import type { Image as ImageType } from "@/lib/data/schemas";

export type GallerySectionProps = {
  gallery?: ImageType[];
  eyebrow?: string;
  title?: string;
  className?: string;
};

/**
 * ABOUT-02 Gallery Section (Server Component).
 * Renders the section header, hairline divider, and delegates the interactive
 * image grid and lightbox modal state to the GalleryGrid client leaf component.
 * Follows presence rules: returns null if gallery is empty.
 */
export function GallerySection({
  gallery,
  eyebrow = "02 — Visuals",
  title = "Moments & *workspaces*",
  className,
}: GallerySectionProps) {
  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      className={cn("relative w-full overflow-hidden py-[clamp(3.5rem,8vw,6rem)]", className)}
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-[720px]">
          <div className="mb-3 sm:mb-4">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <SectionHeading id="gallery-title" className="text-display-lg">
            {title}
          </SectionHeading>
        </div>

        {/* Hairline Divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* Client Gallery Leaf */}
        <GalleryGrid images={gallery} />
      </Container>
    </section>
  );
}

import React from "react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { GalleryGrid } from "@/components/shared/GalleryGrid";
import { cn } from "@/lib/utils/cn";

export type PdGalleryProps = {
  gallery?: Array<{
    src: string;
    alt?: string;
    caption?: string;
    width?: number;
    height?: number;
  }>;
  title: string;
  className?: string;
};

/**
 * PD-05 Project Gallery Section (Server Component).
 * Renders project screenshots by reusing the shared GalleryGrid component
 * in 2-column 16:10 grid layout with full lightbox support.
 * Follows presence rules: returns null if gallery is empty.
 */
export function PdGallery({ gallery, title, className }: PdGalleryProps) {
  // Presence rule: if no gallery images, render nothing
  if (!gallery || gallery.length === 0) {
    return null;
  }

  // Format image items for GalleryGrid schema compatibility
  const normalizedImages = gallery.map((img) => ({
    src: img.src,
    alt: img.alt || `${title} screenshot`,
    caption: img.caption,
    width: img.width || 1600,
    height: img.height || 1000,
  }));

  return (
    <section
      id="pd-gallery"
      aria-labelledby="pd-gallery-title"
      className={cn("w-full border-t border-line/60 py-12 sm:py-16", className)}
    >
      <Container>
        <div className="mb-8 sm:mb-10">
          <div className="mb-2">
            <Eyebrow>Interface & Screens</Eyebrow>
          </div>
          <h2
            id="pd-gallery-title"
            className="font-display text-heading text-balance text-white"
          >
            Visual Walkthrough
          </h2>
          <p className="mt-2 font-body text-lead text-fg-muted">
            Click any screenshot to open the high-resolution lightbox.
          </p>
        </div>

        {/* Reusing shared GalleryGrid in balanced 2-column grid mode */}
        <GalleryGrid images={normalizedImages} layout="grid" />
      </Container>
    </section>
  );
}

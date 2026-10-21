"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";
import { Lightbox } from "@/components/ui/Lightbox";
import { cn } from "@/lib/utils/cn";
import type { Image as ImageType } from "@/lib/data/schemas";

export type GalleryGridProps = {
  images: ImageType[];
  className?: string;
};

/**
 * GalleryGrid client leaf component for ABOUT-02.
 * Renders an asymmetric editorial bento grid of lazy-loaded images with captions,
 * hover contrast reveal, and click-to-open lightbox modal.
 */
export function GalleryGrid({ images, className }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-12",
          className,
        )}
      >
        {images.map((img, idx) => {
          // Asymmetric bento span rules based on index and item count
          const isFeatured = idx === 0 && images.length >= 3;
          const colSpanClass = isFeatured
            ? "lg:col-span-8 lg:row-span-2"
            : images.length === 2
              ? "lg:col-span-6"
              : "lg:col-span-4";

          const aspectClass = isFeatured
            ? "aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/11]"
            : "aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10]";

          return (
            <button
              key={img.src}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              aria-label={`View photo ${idx + 1} of ${images.length}: ${img.alt || img.caption || "Gallery photo"}`}
              className={cn(
                "group relative block w-full overflow-hidden rounded-md border border-line bg-surface-1 text-left transition-all duration-300 hover:border-line-strong hover:shadow-card focus-visible:outline-2 focus-visible:outline-electric-300",
                colSpanClass,
              )}
            >
              <div className={cn("relative w-full overflow-hidden bg-surface-2", aspectClass)}>
                <Image
                  src={img.src}
                  alt={img.alt || "Gallery image"}
                  width={img.width || 1600}
                  height={img.height || 1067}
                  sizes={
                    isFeatured
                      ? "(min-width: 1440px) 900px, (min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                      : "(min-width: 1440px) 460px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  }
                  className="h-full w-full object-cover object-center contrast-[1.05] saturate-[0.85] transition-all duration-500 group-hover:scale-[1.03] group-hover:contrast-100 group-hover:saturate-100"
                  loading="lazy"
                />

                {/* Ambient vignette gradient */}
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"
                  aria-hidden="true"
                />

                {/* Inner top hairline highlight */}
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
                  aria-hidden="true"
                />

                {/* Expand icon pill */}
                <div
                  className="absolute top-3 right-3 rounded-full border border-line bg-surface-1/80 p-2 text-fg-subtle backdrop-blur-sm transition-all duration-300 group-hover:border-electric/50 group-hover:text-electric-300 sm:top-4 sm:right-4"
                  aria-hidden="true"
                >
                  <Maximize2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                </div>

                {/* Caption / Label plate */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  {img.caption && (
                    <span className="block text-micro font-label tracking-wider text-electric-300 uppercase">
                      {img.caption}
                    </span>
                  )}
                  {img.alt && (
                    <p className="mt-1 line-clamp-1 text-small font-body text-white/90 sm:text-body">
                      {img.alt}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Lightbox
        isOpen={selectedIndex !== null}
        images={images}
        currentIndex={selectedIndex ?? 0}
        onClose={() => setSelectedIndex(null)}
        onNavigate={(newIndex) => setSelectedIndex(newIndex)}
      />
    </>
  );
}

"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type LightboxProps = {
  isOpen: boolean;
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  className?: string;
};

export function Lightbox({ isOpen, images, currentIndex, onClose, onNavigate, className }: LightboxProps) {
  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const handlePrev = useCallback(() => {
    if (!hasMultiple) return;
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, hasMultiple, onNavigate]);

  const handleNext = useCallback(() => {
    if (!hasMultiple) return;
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, hasMultiple, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
      className={cn(
        "animate-in fade-in-0 fixed inset-0 z-50 flex flex-col items-center justify-between bg-void/95 p-4 backdrop-blur-md duration-200 md:p-8",
        className,
      )}
    >
      {/* Top bar with count & close button */}
      <div className="flex w-full max-w-6xl items-center justify-between">
        <span className="text-micro font-label text-fg-subtle select-none">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close lightbox"
          className="rounded-sm p-2 text-fg-muted transition-colors hover:bg-surface-2 hover:text-white focus-visible:outline-2 focus-visible:outline-electric-300"
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* Main image stage with navigation controls */}
      <div className="relative my-4 flex w-full max-w-6xl flex-1 items-center justify-center overflow-hidden">
        {hasMultiple && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 z-10 rounded-full border border-line bg-surface-1/80 p-3 text-white backdrop-blur-sm transition-colors hover:border-electric hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-electric-300 md:left-4"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>
        )}

        <div className="relative flex h-full max-h-[75vh] w-full items-center justify-center">
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            width={currentImage.width || 1200}
            height={currentImage.height || 800}
            unoptimized={currentImage.src.startsWith("data:")}
            className="max-h-[75vh] w-auto max-w-full rounded-md border border-line object-contain"
            priority
          />
        </div>

        {hasMultiple && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 z-10 rounded-full border border-line bg-surface-1/80 p-3 text-white backdrop-blur-sm transition-colors hover:border-electric hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-electric-300 md:right-4"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Caption footer */}
      {currentImage.caption && (
        <div className="w-full max-w-2xl text-center">
          <p className="text-small font-body text-fg-muted">{currentImage.caption}</p>
        </div>
      )}
    </div>
  );
}

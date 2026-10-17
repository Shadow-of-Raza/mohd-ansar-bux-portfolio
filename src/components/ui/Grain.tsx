import React from "react";
import { cn } from "@/lib/utils/cn";

export type GrainProps = {
  className?: string;
};

/**
 * Fixed full-screen SVG noise texture overlay.
 * Spec: docs/context/03-design-system.md §8
 * Opacity: 0.035, mix-blend-mode: overlay, pointer-events: none.
 */
export function Grain({ className }: GrainProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none fixed inset-0 z-50 h-full w-full select-none", className)}
      style={{
        opacity: 0.035,
        mixBlendMode: "overlay",
      }}
    >
      <svg className="h-full w-full">
        <filter id="grain-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-noise)" />
      </svg>
    </div>
  );
}

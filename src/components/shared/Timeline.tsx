import React from "react";
import { TimelineItem } from "@/components/shared/TimelineItem";
import { formatYearMonth } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { Education } from "@/lib/data/schemas";

export type TimelineVariant = "compact" | "full";

export type TimelineProps = {
  items: Education[];
  variant?: TimelineVariant;
  className?: string;
};

/**
 * Shared Timeline component for HOME-04 and EDU-02.
 * Renders the vertical 1px royal track, 2px electric data-progress line,
 * 10px node rings, and alternating left/right layout on desktop.
 * Moves period/date to the opposite side of the node on desktop (H4, feedback #5).
 */
export function Timeline({
  items,
  variant = "compact",
  className,
}: TimelineProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className={cn("relative mx-auto max-w-4xl", className)}>
      {/* Static Track (1px royal) */}
      <span
        aria-hidden="true"
        className="absolute top-4 bottom-4 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-px bg-royal"
      />

      {/* Progress Line (2px electric, static in Phase 4; scroll-scrubbed in Phase 6) */}
      <span
        aria-hidden="true"
        data-progress
        className="absolute top-4 bottom-4 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 w-0.5 bg-electric"
      />

      {/* Timeline Nodes & Cards */}
      <div className="space-y-10 sm:space-y-12 md:space-y-16">
        {items.map((item, index) => {
          const isEven = index % 2 === 0;
          const startStr = formatYearMonth(item.start);
          const endStr = item.end ? formatYearMonth(item.end) : "Present";
          const yearsString = `${startStr} – ${endStr}`;

          return (
            <div
              key={item.id}
              id={variant === "full" ? item.id : undefined}
              className={cn(
                "relative flex flex-col md:flex-row md:items-start",
                variant === "full" && "scroll-mt-32 md:scroll-mt-36",
              )}
            >
              {/* Timeline 10px Ring Node: centered on line */}
              <div
                aria-hidden="true"
                className="absolute top-6 left-4 sm:left-6 md:left-1/2 -translate-x-1/2 z-10 flex h-5 w-5 items-center justify-center"
              >
                <span className="h-2.5 w-2.5 rounded-full border-2 border-electric bg-electric ring-4 ring-royal/40" />
              </div>

              {/* Opposite Date Callout (Desktop) when card is on right */}
              {!isEven && (
                <div className="hidden md:flex md:w-[calc(50%-2rem)] md:items-center md:justify-end md:pr-8 pt-6">
                  <span className="font-label text-small font-semibold tracking-wider text-electric-300">
                    {yearsString}
                  </span>
                </div>
              )}

              {/* Timeline Card */}
              <div
                className={cn(
                  "w-full pl-10 sm:pl-14 md:pl-0 md:w-[calc(50%-2rem)]",
                  isEven ? "md:mr-auto" : "md:ml-auto",
                )}
              >
                <TimelineItem item={item} index={index} variant={variant} />
              </div>

              {/* Opposite Date Callout (Desktop) when card is on left */}
              {isEven && (
                <div className="hidden md:flex md:w-[calc(50%-2rem)] md:items-center md:pl-8 pt-6">
                  <span className="font-label text-small font-semibold tracking-wider text-electric-300">
                    {yearsString}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

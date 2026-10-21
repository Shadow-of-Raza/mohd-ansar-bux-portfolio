"use client";

import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { highlightNumbers } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export type CollapsibleBulletListProps = {
  items: string[];
  limit?: number;
  highlightMetrics?: boolean;
  bulletType?: "check" | "dot";
  className?: string;
};

/**
 * CollapsibleBulletList client leaf component for EXP-02.
 * Renders an accessible bullet list with optional number/metric highlighting.
 * Lists longer than the limit (default 5) collapse behind a "Show more" toggle
 * adhering to docs/context/01 §5.4.
 */
export function CollapsibleBulletList({
  items,
  limit = 5,
  highlightMetrics = false,
  bulletType = "dot",
  className,
}: CollapsibleBulletListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const cleanItems = items.filter((item) => item && item.trim().length > 0);
  if (cleanItems.length === 0) return null;

  const hasOverflow = cleanItems.length > limit;
  const displayedItems = isExpanded || !hasOverflow ? cleanItems : cleanItems.slice(0, limit);
  const remainingCount = cleanItems.length - limit;

  return (
    <div className={cn("space-y-3", className)}>
      <ul className="space-y-2.5">
        {displayedItems.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-body font-body leading-relaxed text-fg-muted"
          >
            {bulletType === "check" ? (
              <Check
                className="mt-1 h-4 w-4 shrink-0 text-electric-300"
                strokeWidth={2}
                aria-hidden="true"
              />
            ) : (
              <span
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-electric-300/80"
                aria-hidden="true"
              />
            )}
            <span>{highlightMetrics ? highlightNumbers(item) : item}</span>
          </li>
        ))}
      </ul>

      {hasOverflow && (
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-sm py-1 font-label text-micro font-medium tracking-wider text-electric-300 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
        >
          <span>
            {isExpanded ? "Show less" : `Show more (+${remainingCount})`}
          </span>
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180",
            )}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}

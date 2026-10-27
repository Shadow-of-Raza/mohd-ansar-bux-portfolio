"use client";

import React, { useState, useId } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type MobileCollapsibleSectionProps = {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

/**
 * MobileCollapsibleSection (Client Leaf Component).
 * Complies with static polish S1 requirements:
 * - On mobile (<md), collapses deep content behind accessible button toggles.
 * - Keeps content rendered in the DOM / HTML at all times for SEO indexability
 *   (hidden visually via CSS class when collapsed; NEVER conditionally unmounted).
 * - On tablet / desktop (md+), the toggle button is hidden and content is always visible.
 * - Uses proper aria-expanded and aria-controls attributes.
 */
export function MobileCollapsibleSection({
  title,
  count,
  children,
  defaultOpen = false,
  className,
}: MobileCollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className={cn("pt-6 border-t border-line", className)}>
      {/* Mobile Toggle Button (hidden on md+) */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-controls={contentId}
          className="group flex w-full items-center justify-between py-1.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
        >
          <span className="flex items-center gap-2 font-label text-micro font-medium uppercase tracking-wider text-electric-300">
            {title}
            {count !== undefined && (
              <span className="font-label text-micro text-fg-subtle">
                ({count})
              </span>
            )}
          </span>

          <span className="flex items-center gap-1.5 font-label text-micro text-fg-muted transition-colors group-hover:text-white">
            <span>{isOpen ? "Hide" : "Show"}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180",
              )}
              aria-hidden="true"
            />
          </span>
        </button>
      </div>

      {/* Desktop Heading (visible on md+) */}
      <div className="hidden md:block">
        <span className="block font-label text-micro uppercase tracking-wider text-electric-300">
          {title}
        </span>
      </div>

      {/* Content wrapper: ALWAYS present in HTML for SEO indexability.
          On mobile (<md): hidden visually via CSS when collapsed.
          On md+: ALWAYS visible via md:block. */}
      <div
        id={contentId}
        className={cn("mt-4", isOpen ? "block" : "hidden md:block")}
      >
        {children}
      </div>
    </div>
  );
}

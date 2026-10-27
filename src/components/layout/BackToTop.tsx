"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type BackToTopProps = {
  className?: string;
  label?: string;
};

/**
 * Accessible back-to-top button with smooth viewport scrolling.
 * Per docs/context/01-project-overview.md §4 (GLOBAL-FOOTER).
 */
export function BackToTop({ className, label = "Back to top" }: BackToTopProps) {
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={cn(
        "group inline-flex min-h-[44px] items-center gap-2 text-micro font-label tracking-[0.06em] text-fg-subtle transition-colors duration-200 select-none",
        "hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
        className,
      )}
    >
      <span>{label}</span>
      <span className="flex h-7 w-7 items-center justify-center rounded-sm border border-line transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:border-line-strong group-hover:bg-surface-2 group-hover:text-electric-300">
        <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
    </button>
  );
}

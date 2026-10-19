import React from "react";
import { cn } from "@/lib/utils/cn";

export type SkipLinkProps = {
  targetId?: string;
  className?: string;
  children?: React.ReactNode;
};

/**
 * Accessible "Skip to content" link.
 * Hidden visually until focused, allowing keyboard users to bypass navigation.
 * Per docs/context/01-project-overview.md §4 (GLOBAL-HEADER).
 */
export function SkipLink({ targetId = "main", className, children = "Skip to content" }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        "sr-only transition-all duration-200",
        "focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50",
        "focus:inline-flex focus:items-center focus:justify-center focus:rounded-sm",
        "focus:bg-electric focus:px-5 focus:py-2.5 focus:text-label focus:font-label focus:text-white",
        "focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-electric-300",
        className,
      )}
    >
      {children}
    </a>
  );
}

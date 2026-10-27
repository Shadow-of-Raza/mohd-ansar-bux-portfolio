import React from "react";
import { cn } from "@/lib/utils/cn";

export const PAGE_HERO_SPACING = "pt-28 pb-10 md:pt-36 md:pb-14";

export type PageHeroProps = React.HTMLAttributes<HTMLElement> & {
  as?: "section" | "div" | "header";
  children: React.ReactNode;
  className?: string;
};

/**
 * Shared layout wrapper for all inner-page heroes.
 * Enforces consistent top spacing under the fixed header across all pages:
 * pt-28 pb-10 md:pt-36 md:pb-14 (per item G1).
 */
export function PageHero({
  as: Component = "section",
  children,
  className,
  ...props
}: PageHeroProps) {
  return (
    <Component
      className={cn("relative w-full overflow-hidden", PAGE_HERO_SPACING, className)}
      {...props}
    >
      {children}
    </Component>
  );
}

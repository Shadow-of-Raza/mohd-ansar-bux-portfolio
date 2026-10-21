import React from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { ScrollSpyNav } from "@/components/shared/ScrollSpyNav";
import type { Service } from "@/lib/data/schemas";

export type ServicesSubNavProps = {
  services: Service[];
  className?: string;
};

/**
 * SERV-02 Sticky Sub-Navigation (Server Component).
 * Renders the sticky outer bar with breakpoint-specific offsets matching
 * the header height (top-16 on mobile, md:top-[72px] from md up).
 * Delegates scroll-spy state and interactive chip highlights to ScrollSpyNav.
 * Follows presence rules: renders only if services count is >= 2.
 */
export function ServicesSubNav({ services, className }: ServicesSubNavProps) {
  // Presence rule: only render if >= 2 visible services
  if (!services || services.length < 2) {
    return null;
  }

  const navItems = services.map((s) => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
  }));

  return (
    <div
      className={cn(
        "sticky top-16 md:top-[72px] z-30 w-full border-b border-line bg-night/85 backdrop-blur-md py-3 transition-colors",
        className,
      )}
    >
      <Container>
        <ScrollSpyNav services={navItems} />
      </Container>
    </div>
  );
}

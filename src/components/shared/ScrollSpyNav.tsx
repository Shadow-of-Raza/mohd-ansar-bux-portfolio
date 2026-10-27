"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type ScrollSpyNavProps = {
  services: Array<{
    id: string;
    slug: string;
    title: string;
  }>;
  className?: string;
};

/**
 * ScrollSpyNav client leaf component for SERV-02.
 * Observes service section positions with IntersectionObserver to highlight
 * the active service in the sticky sub-navigation bar.
 */
export function ScrollSpyNav({ services, className }: ScrollSpyNavProps) {
  const [activeSlug, setActiveSlug] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && services.some((s) => s.slug === hash)) {
        return hash;
      }
    }
    return services[0]?.slug ?? "";
  });

  useEffect(() => {
    if (typeof window === "undefined" || services.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && services.some((s) => s.slug === hash)) {
        setActiveSlug(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the entry that is intersecting closest to top
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        // Sort by bounding client top to pick the active section
        visibleEntries.sort(
          (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
        );
        const topEntry = visibleEntries[0];
        if (topEntry?.target.id) {
          setActiveSlug(topEntry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.2, 0.5],
    });

    for (const service of services) {
      const el = document.getElementById(service.slug);
      if (el) observer.observe(el);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      observer.disconnect();
    };
  }, [services]);

  const handleNavClick = (slug: string) => {
    setActiveSlug(slug);
  };

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Services in-page navigation"
      className={cn(
        "no-scrollbar flex items-center gap-2 overflow-x-auto py-1 sm:gap-3 [mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_16px,black_calc(100%-16px),transparent)]",
        className,
      )}
    >
      <span className="hidden pr-2 text-micro font-label tracking-wider text-fg-subtle uppercase lg:inline-block">
        Jump to:
      </span>
      {services.map((service, idx) => {
        const isActive = activeSlug === service.slug;
        const numberText = String(idx + 1).padStart(2, "0");

        return (
          <a
            key={service.slug}
            href={`#${service.slug}`}
            onClick={() => handleNavClick(service.slug)}
            className={cn(
              "inline-flex h-8 shrink-0 items-center gap-2 rounded-full border px-3 text-micro font-label font-medium transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
              isActive
                ? "border-electric bg-navy text-white shadow-sm"
                : "border-line bg-surface-2 text-fg-muted hover:border-line-strong hover:text-white",
            )}
          >
            <span
              className={cn(
                "font-label text-micro transition-colors",
                isActive ? "text-electric-300" : "text-fg-subtle",
              )}
            >
              {numberText}
            </span>
            <span>{service.title}</span>
          </a>
        );
      })}
    </nav>
  );
}

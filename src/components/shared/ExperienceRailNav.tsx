"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type ExperienceRailItem = {
  id: string;
  name: string;
  period?: string;
  rolesCount?: number;
};

export type ExperienceRailNavProps = {
  companies: ExperienceRailItem[];
  className?: string;
};

/**
 * ExperienceRailNav client leaf component for EXP-02.
 * Provides sticky rail navigation on desktop and horizontal scroll tabs on mobile/tablet,
 * tracking the currently active company using IntersectionObserver.
 */
export function ExperienceRailNav({ companies, className }: ExperienceRailNavProps) {
  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && companies.some((c) => c.id === hash)) {
        return hash;
      }
    }
    return companies[0]?.id ?? "";
  });

  useEffect(() => {
    if (typeof window === "undefined" || companies.length === 0) return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && companies.some((c) => c.id === hash)) {
        setActiveId(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        visibleEntries.sort(
          (a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
        );
        const topEntry = visibleEntries[0];
        if (topEntry?.target.id) {
          setActiveId(topEntry.target.id);
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-15% 0px -65% 0px",
      threshold: [0, 0.1, 0.5],
    });

    for (const comp of companies) {
      const el = document.getElementById(comp.id);
      if (el) observer.observe(el);
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      observer.disconnect();
    };
  }, [companies]);

  if (!companies || companies.length === 0) return null;

  return (
    <nav
      aria-label="Experience companies index"
      className={cn("flex flex-col gap-2", className)}
    >
      <div className="mb-2 hidden lg:block">
        <span className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
          Companies ({companies.length})
        </span>
      </div>

      {/* Desktop vertical rail */}
      <ul className="hidden lg:flex lg:flex-col lg:space-y-1.5">
        {companies.map((comp, idx) => {
          const isActive = activeId === comp.id;
          const numberText = String(idx + 1).padStart(2, "0");

          return (
            <li key={comp.id}>
              <a
                href={`#${comp.id}`}
                onClick={() => setActiveId(comp.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "group flex items-center justify-between rounded-sm border px-3 py-2.5 transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
                  isActive
                    ? "border-electric/50 bg-surface-2 text-white shadow-sm"
                    : "border-transparent bg-transparent text-fg-muted hover:border-line hover:bg-surface-1 hover:text-white",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className={cn(
                      "font-label text-micro shrink-0 transition-colors",
                      isActive ? "text-electric-300 font-semibold" : "text-fg-subtle",
                    )}
                  >
                    {numberText}
                  </span>
                  <span className="truncate font-body text-small font-medium">
                    {comp.name}
                  </span>
                </div>
                {comp.rolesCount && comp.rolesCount > 1 && (
                  <span className="font-label text-micro shrink-0 text-fg-subtle">
                    {comp.rolesCount} roles
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Mobile / Tablet horizontal scroll tabs */}
      <div className="relative w-full lg:hidden">
        {/* Left edge fade */}
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-r from-night to-transparent"
          aria-hidden="true"
        />
        {/* Right edge fade */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-6 bg-gradient-to-l from-night to-transparent"
          aria-hidden="true"
        />

        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {companies.map((comp, idx) => {
            const isActive = activeId === comp.id;
            const numberText = String(idx + 1).padStart(2, "0");

            return (
              <a
                key={comp.id}
                href={`#${comp.id}`}
                onClick={() => setActiveId(comp.id)}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "inline-flex h-8 shrink-0 items-center gap-2 rounded-full border px-3 text-micro font-label font-medium transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
                  isActive
                    ? "border-electric bg-surface-2 text-white shadow-sm"
                    : "border-line bg-surface-1 text-fg-muted hover:border-line-strong hover:text-white",
                )}
              >
                <span
                  className={cn(
                    "font-label text-micro",
                    isActive ? "text-electric-300" : "text-fg-subtle",
                  )}
                >
                  {numberText}
                </span>
                <span className="whitespace-nowrap font-medium">{comp.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

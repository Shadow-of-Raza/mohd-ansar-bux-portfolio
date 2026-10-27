"use client";

import React, { useState, useRef, useEffect, useCallback, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Skill } from "@/lib/data/schemas";
import type { SkillUsageItem } from "@/lib/data/relations";

export type SkillTileProps = {
  skill: Skill;
  usage?: SkillUsageItem;
  emptyUsageCopy?: {
    usedLabel?: string;
    emptyLabel?: string;
    emptyCta?: { label: string; href: string };
  };
  id?: string;
  className?: string;
};

/**
 * SkillTile: shared component displaying a skill logo and name.
 * Default state: monochrome white at 70%.
 * Hover/focus: authentic brand color fades in over 300ms.
 * Popover opens on 80ms hover intent, keyboard focus (Enter/Space), or tap,
 * displaying derived project/company usage or an empty-state contact CTA.
 * Adheres to docs/context/01 §5.8, 03 §9-10, 04 §5.7, and 05 §6.
 */
export function SkillTile({
  skill,
  usage,
  emptyUsageCopy,
  id,
  className,
}: SkillTileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openSide, setOpenSide] = useState<"top" | "bottom">("top");
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const popoverId = useId();

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Compute position (H6: on mobile, open downwards by default so popover doesn't cover headings above)
  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

    if (isMobile) {
      // On mobile, default to bottom so it doesn't cover the heading above
      const roomBelow = window.innerHeight - rect.bottom;
      if (roomBelow < 180 && rect.top > 240) {
        setOpenSide("top");
      } else {
        setOpenSide("bottom");
      }
    } else {
      // Desktop: flip to bottom if less than 240px from top of viewport
      if (rect.top < 240) {
        setOpenSide("bottom");
      } else {
        setOpenSide("top");
      }
    }
  }, []);

  const openWithDelay = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    calculatePosition();
    hoverTimerRef.current = setTimeout(() => {
      setIsOpen(true);
    }, 80); // 80ms hover intent delay per 04 §5.7
  }, [calculatePosition]);

  const closeWithDelay = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);

    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 120); // 120ms grace period for pointer traversal
  }, []);

  // Outside click and Escape key dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const hasProjects = Boolean(usage && usage.projects.length > 0);
  const hasCompanies = Boolean(usage && usage.companies.length > 0);
  const isUsed = hasProjects || hasCompanies;

  const usedLabel = emptyUsageCopy?.usedLabel || "Used in";
  const emptyLabel = emptyUsageCopy?.emptyLabel || "Not used in a project yet";
  const emptyCta = emptyUsageCopy?.emptyCta;

  return (
    <div
      ref={containerRef}
      id={id}
      className={cn(
        "relative inline-block w-full scroll-mt-28 rounded-md transition-all target:ring-2 target:ring-electric-300 target:ring-offset-2 target:ring-offset-space",
        className
      )}
      onMouseEnter={openWithDelay}
      onMouseLeave={closeWithDelay}
    >
      {/* Interactive Trigger Tile */}
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
        aria-label={`${skill.name} skill details`}
        onClick={() => {
          calculatePosition();
          setIsOpen((prev) => !prev);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            calculatePosition();
            setIsOpen((prev) => !prev);
          }
        }}
        className={cn(
          "group flex min-h-[50px] w-full items-center gap-3 rounded-md border border-line bg-surface-1/90 px-3.5 py-3 text-left",
          "transition-all duration-200 hover:border-electric/40 hover:bg-surface-2",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
          "cursor-pointer select-none active:scale-[0.99]",
          isOpen && "border-line-strong bg-surface-2 shadow-sm",
        )}
      >
        {/* Authentic SVG Logo with monochrome to brand color transition */}
        <div className="relative flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden">
          <Image
            src={skill.icon}
            alt=""
            width={20}
            height={20}
            className="h-5 w-5 object-contain grayscale brightness-125 opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:brightness-100 group-focus-visible:opacity-100"
          />
        </div>

        {/* Skill Name */}
        <span className="truncate font-label text-sm font-medium tracking-wide text-fg transition-colors group-hover:text-white">
          {skill.name}
        </span>

        {/* Subtle indicator of project count when available */}
        {hasProjects && (
          <span
            className="ml-auto font-label text-micro text-fg-subtle opacity-50 transition-all group-hover:text-electric-300 group-hover:opacity-100"
            aria-hidden="true"
          >
            {usage?.projects.length}
          </span>
        )}
      </div>

      {/* Popover Usage Dialog */}
      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-label={`${skill.name} usage details`}
          onMouseEnter={() => {
            if (closeTimerRef.current) {
              clearTimeout(closeTimerRef.current);
              closeTimerRef.current = null;
            }
          }}
          onMouseLeave={closeWithDelay}
          className={cn(
            "absolute z-50 w-64 max-w-[calc(100vw-2rem)] rounded-md border border-line-strong bg-navy p-4 shadow-xl",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            openSide === "top"
              ? "bottom-full left-1/2 -translate-x-1/2 mb-2.5 before:absolute before:-bottom-2.5 before:left-0 before:h-2.5 before:w-full"
              : "top-full left-1/2 -translate-x-1/2 mt-2.5 before:absolute before:-top-2.5 before:left-0 before:h-2.5 before:w-full",
          )}
        >
          {/* Header with Title and Category indicator */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-label text-sm font-bold text-white">{skill.name}</span>
            <span className="font-label text-micro uppercase tracking-wider text-fg-subtle">
              {skill.category}
            </span>
          </div>

          <div className="my-2.5 h-px w-full bg-line/60" aria-hidden="true" />

          {/* Usage Content */}
          {isUsed ? (
            <div className="space-y-2.5">
              {hasProjects && (
                <div>
                  <div className="mb-1.5 font-label text-micro uppercase tracking-wider text-fg-subtle">
                    {usedLabel}
                  </div>
                  <ul className="space-y-1">
                    {usage?.projects.slice(0, 5).map((proj) => (
                      <li key={proj.slug}>
                        <Link
                          href={`/projects/${proj.slug}`}
                          className="group/link flex items-center justify-between gap-1 text-xs text-electric-300 transition-colors hover:text-white"
                        >
                          <span className="truncate">{proj.title}</span>
                          <ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {(usage?.projects.length ?? 0) > 5 && (
                    <span className="mt-1 block font-label text-micro text-fg-subtle">
                      +{(usage?.projects.length ?? 0) - 5} more
                    </span>
                  )}
                </div>
              )}

              {hasCompanies && (
                <div className="pt-2 border-t border-line/50">
                  <span className="font-label text-micro uppercase tracking-wider text-fg-subtle">
                    At:{" "}
                  </span>
                  <span className="font-body text-xs text-fg-muted">
                    {usage?.companies.join(", ")}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="font-body text-xs text-fg-muted">{emptyLabel}</p>
              {emptyCta && (
                <Link
                  href={emptyCta.href}
                  className="inline-flex items-center gap-1.5 font-label text-micro text-electric-300 underline underline-offset-2 transition-colors hover:text-electric-hover"
                >
                  <span>{emptyCta.label}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          )}

          {/* Directional Arrow pointer */}
          <div
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute h-0 w-0 border-4 border-transparent",
              openSide === "top"
                ? "top-full left-1/2 -translate-x-1/2 border-t-navy"
                : "bottom-full left-1/2 -translate-x-1/2 border-b-navy",
            )}
          />
        </div>
      )}
    </div>
  );
}

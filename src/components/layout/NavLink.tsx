"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export type NavLinkProps = {
  href: string;
  label: string;
  number?: string;
  onClick?: () => void;
  className?: string;
  variant?: "desktop" | "mobile";
};

/**
 * Navigation link with active-route detection and Alegreya SC styling.
 * Per docs/context/01-project-overview.md §4 and 03-design-system.md §5, §10.
 */
export function NavLink({
  href,
  label,
  number,
  onClick,
  className,
  variant = "desktop",
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive =
    href === "/"
      ? pathname === "/"
      : pathname === href || (pathname.startsWith(href) && pathname[href.length] === "/");

  if (variant === "mobile") {
    return (
      <Link
        href={href}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group flex items-baseline gap-4 py-3 transition-colors duration-200 select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
          isActive ? "text-white" : "text-fg-muted hover:text-white",
          className,
        )}
      >
        {number && (
          <span
            className={cn(
              "font-label text-micro tracking-[0.08em] transition-colors duration-200",
              isActive ? "text-electric-300" : "text-fg-subtle group-hover:text-electric-300",
            )}
            aria-hidden="true"
          >
            {number}
          </span>
        )}
        <span
          className={cn(
            "font-display text-2xl tracking-tight transition-transform duration-200 sm:text-3xl",
            "group-hover:translate-x-1",
          )}
        >
          {label}
        </span>
        {isActive && (
          <span
            className="h-2 w-2 rounded-full bg-electric-300"
            aria-hidden="true"
          />
        )}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative inline-flex items-center py-2 font-label text-label tracking-[0.06em] select-none transition-colors duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-300",
        isActive ? "text-white" : "text-fg-muted hover:text-white",
        className,
      )}
    >
      <span>{label}</span>
      {/* Active-route indicator (Phase 3 CSS underline, Motion layoutId in Phase 6) */}
      {isActive ? (
        <span
          className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-electric-300"
          aria-hidden="true"
        />
      ) : (
        <span
          className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-electric-300/60 transition-all duration-200 group-hover:w-full"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

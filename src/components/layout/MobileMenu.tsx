"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Mail } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { NavLink } from "./NavLink";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { LinkButton } from "@/components/ui/LinkButton";
import type { NavItem } from "@/lib/data/availability";
import type { Site } from "@/lib/data/schemas";

export type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  hasContact: boolean;
  site: Site;
  contactEmail?: string;
};

/**
 * Full-screen mobile overlay menu for screen widths < xl (1280px).
 * Features focus trap, Escape key dismiss, body scroll lock, large numbered links,
 * and contact/social details.
 * Per docs/context/01-project-overview.md §4 and 04-motion-and-effects.md §4.4.
 */
export function MobileMenu({ isOpen, onClose, navItems, hasContact, site, contactEmail }: MobileMenuProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElementRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!dialogRef.current) return;
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) return;
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];
        if (!first || !last) return;

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button
    const timer = setTimeout(() => {
      if (dialogRef.current) {
        const closeBtn = dialogRef.current.querySelector<HTMLElement>('button[aria-label="Close menu"]');
        closeBtn?.focus();
      }
    }, 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      previouslyFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      className={cn(
        "fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-night/95 p-6 backdrop-blur-2xl sm:p-8 xl:hidden",
        "animate-in fade-in duration-200",
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between border-b border-line pb-6">
        <Link
          href="/"
          onClick={onClose}
          className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
        >
          {site.logo?.src ? (
            <Image
              src={site.logo.src}
              alt={site.logo.alt || site.name}
              width={site.logo.width || 44}
              height={site.logo.height || 44}
              className="h-9 w-9 shrink-0 object-contain transition-opacity duration-200 group-hover:opacity-85 sm:h-10 sm:w-10"
            />
          ) : (
            <span className="font-display text-lg tracking-wider text-white">
              {site.logo?.text || "MB"}
            </span>
          )}
          <span className="font-display text-base tracking-wide text-white transition-colors duration-200 group-hover:text-electric-300 sm:text-lg">
            {site.name}
          </span>
        </Link>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className={cn(
            "flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-sm border border-line text-fg-muted transition-colors duration-200",
            "hover:border-line-strong hover:bg-surface-2 hover:text-white",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
          )}
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="my-8 flex flex-col justify-center space-y-1" aria-label="Mobile navigation">
        {navItems.map((item, idx) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            number={String(idx + 1).padStart(2, "0")}
            variant="mobile"
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Bottom Actions & Socials */}
      <div className="flex flex-col gap-6 border-t border-line pt-6">
        {hasContact && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LinkButton
              href="/contact"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              onClick={onClose}
            >
              Contact me
            </LinkButton>
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex min-h-[44px] items-center gap-2 text-label font-label tracking-[0.06em] text-fg-muted transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-electric-300" aria-hidden="true" />
                <span>{contactEmail}</span>
              </a>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <SocialLinks socials={site.socials} />
          <span className="text-micro font-label tracking-[0.08em] text-fg-subtle">{site.location}</span>
        </div>
      </div>
    </div>
  );
}

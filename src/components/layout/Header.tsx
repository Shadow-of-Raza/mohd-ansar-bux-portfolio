"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";
import type { NavItem } from "@/lib/data/availability";
import type { Site } from "@/lib/data/schemas";

export type HeaderProps = {
  site: Site;
  navItems: NavItem[];
  hasContact: boolean;
  contactEmail?: string;
  className?: string;
};

/**
 * Global Header with 72px height (64px mobile), transparent hero state,
 * 40px scroll backdrop-blur transition, desktop link row, and mobile menu trigger.
 * Per docs/context/01-project-overview.md §4, 03-design-system.md §10, and 04-motion-and-effects.md §4.4.
 */
export function Header({ site, navItems, hasContact, contactEmail, className }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 left-0 z-40 h-16 transition-all duration-300 xl:h-[72px]",
          scrolled
            ? "border-b border-line bg-night/70 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
          className,
        )}
      >
        <Container className="flex h-full items-center justify-between">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="group flex items-center gap-3 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
            aria-label={`${site.name} — Home`}
          >
            {site.logo?.src ? (
              <Image
                src={site.logo.src}
                alt={site.logo.alt || site.name}
                width={site.logo.width || 44}
                height={site.logo.height || 44}
                priority
                className="h-8 w-8 shrink-0 object-contain transition-opacity duration-200 group-hover:opacity-85 xl:h-9 xl:w-9"
              />
            ) : (
              <span className="font-display text-lg tracking-wider text-white transition-colors duration-200 group-hover:text-electric-300">
                {site.logo?.text || "MB"}
              </span>
            )}
            <span className="hidden font-display text-base tracking-wide text-white transition-colors duration-200 group-hover:text-electric-300 sm:inline-block sm:text-lg">
              {site.name}
            </span>
          </Link>

          {/* Desktop Navigation Links (>= 1280px) */}
          <nav className="hidden items-center gap-7 xl:flex 2xl:gap-8" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>

          {/* Right Action / Mobile Toggle */}
          <div className="flex items-center gap-3">
            {hasContact && (
              <LinkButton href="/contact" variant="primary" size="sm" className="h-9 px-4 sm:h-10 sm:px-5">
                Contact me
              </LinkButton>
            )}

            {/* Mobile Menu Toggle Button (< 1280px) */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              className={cn(
                "flex h-11 min-h-[44px] w-11 min-w-[44px] items-center justify-center rounded-sm border border-line text-fg-muted transition-colors duration-200 xl:hidden",
                "hover:border-line-strong hover:bg-surface-2 hover:text-white",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
              )}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      {/* Full-Screen Mobile Menu Overlay */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
        hasContact={hasContact}
        site={site}
        contactEmail={contactEmail}
      />
    </>
  );
}

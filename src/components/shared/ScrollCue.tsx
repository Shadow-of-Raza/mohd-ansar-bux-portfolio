"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type ScrollCueProps = {
  targetId?: string;
  className?: string;
};

/**
 * Scroll cue: thin line that loops a "drop" animation (CSS), fades out after first scroll.
 * Per docs/context/04-motion-and-effects.md §5.1 & §7.
 */
export function ScrollCue({ targetId = "main", className }: ScrollCueProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!targetId) return;
    const el = document.getElementById(targetId);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 transition-opacity duration-300",
        scrolled ? "pointer-events-none opacity-0" : "opacity-100",
        className,
      )}
    >
      <a
        href={`#${targetId}`}
        onClick={handleClick}
        className="group flex flex-col items-center gap-2.5 text-fg-subtle transition-colors duration-200 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-electric-300"
        aria-label="Scroll to content"
      >
        <span className="text-micro font-label tracking-widest text-fg-subtle uppercase transition-colors duration-200 group-hover:text-electric-300">
          Scroll
        </span>
        <div className="relative h-10 w-[1px] overflow-hidden bg-line">
          <div className="absolute top-0 left-0 h-1/2 w-full bg-electric-300 motion-safe:animate-scroll-drop motion-reduce:static motion-reduce:h-full motion-reduce:animate-none motion-reduce:opacity-50" />
        </div>
      </a>
    </div>
  );
}

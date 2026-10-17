"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { cn } from "@/lib/utils/cn";

export type PopoverSide = "top" | "bottom" | "left" | "right";

export type PopoverProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  side?: PopoverSide;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Popover({
  trigger,
  children,
  className,
  side = "top",
  isOpen: controlledIsOpen,
  onOpenChange,
}: PopoverProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : internalIsOpen;

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const setOpen = React.useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
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
  }, [open, setOpen]);

  // Position classes based on side
  const positionClasses: Record<PopoverSide, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses: Record<PopoverSide, string> = {
    top: "top-full left-1/2 -translate-x-1/2 border-t-navy border-l-transparent border-r-transparent border-b-transparent border-4",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-b-navy border-l-transparent border-r-transparent border-t-transparent border-4",
    left: "left-full top-1/2 -translate-y-1/2 border-l-navy border-t-transparent border-b-transparent border-r-transparent border-4",
    right:
      "right-full top-1/2 -translate-y-1/2 border-r-navy border-t-transparent border-b-transparent border-l-transparent border-4",
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? popoverId : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
        className="inline-flex cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
      >
        {trigger}
      </div>

      {open && (
        <div
          id={popoverId}
          role="dialog"
          aria-modal="false"
          className={cn(
            "absolute z-50 w-64 rounded-md border border-line-strong bg-navy p-4 shadow-xl",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            positionClasses[side],
            className,
          )}
        >
          {children}
          <div
            aria-hidden="true"
            className={cn("pointer-events-none absolute h-0 w-0", arrowClasses[side])}
          />
        </div>
      )}
    </div>
  );
}

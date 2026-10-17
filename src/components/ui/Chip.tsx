import React from "react";
import { cn } from "@/lib/utils/cn";

export type ChipProps = {
  active?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  as?: "button" | "span" | "div";
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
};

export function Chip({ active = false, icon, onClick, as, className, disabled, children }: ChipProps) {
  const isInteractive = Boolean(onClick);
  const Component = as ?? (isInteractive ? "button" : "span");

  return (
    <Component
      type={Component === "button" ? "button" : undefined}
      onClick={disabled ? undefined : onClick}
      disabled={Component === "button" ? disabled : undefined}
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border px-3 text-micro font-label font-medium transition-colors duration-200 select-none",
        active ? "border-electric bg-navy text-white" : "border-line bg-surface-2 text-white",
        isInteractive &&
          !disabled &&
          "cursor-pointer hover:border-line-strong hover:bg-surface-2/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </Component>
  );
}

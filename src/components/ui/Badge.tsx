import React from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant = "default" | "present" | "pursuing" | "completed" | "open-source" | "available";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  present: "bg-royal text-white",
  pursuing: "bg-royal text-white",
  completed: "bg-surface-2 border border-line text-fg-subtle",
  available: "bg-surface-1 border border-line-strong text-fg-muted",
  "open-source": "border border-electric/50 text-electric-200 bg-transparent",
  default: "bg-surface-2 border border-line text-fg-muted",
};

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-micro font-label font-medium tracking-wider select-none",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {(variant === "present" || variant === "pursuing") && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-electric-200 opacity-75 motion-safe:animate-ping motion-reduce:hidden" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      )}
      {variant === "available" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-electric-400 opacity-75 motion-safe:animate-ping motion-reduce:hidden" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-electric" />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}

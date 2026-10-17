import React from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant = "default" | "present" | "open-source";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  present: "bg-royal text-white",
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
      {variant === "present" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electric-200 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}

import React from "react";
import { cn } from "@/lib/utils/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
  as?: "div" | "article" | "section";
  className?: string;
  children: React.ReactNode;
};

export function Card({
  interactive = false,
  as: Component = "div",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "relative rounded-md border border-line bg-surface-1 p-6 md:p-8",
        "shadow-card",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 hover:shadow-card-hover",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

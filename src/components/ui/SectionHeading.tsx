import React from "react";
import { cn } from "@/lib/utils/cn";
import { renderAccent } from "@/lib/utils/format";

export type SectionHeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  as?: "h1" | "h2" | "h3" | "h4";
  className?: string;
  children: React.ReactNode;
};

export function SectionHeading({ as: Component = "h2", className, children, ...props }: SectionHeadingProps) {
  if (!children) return null;

  const content = typeof children === "string" ? renderAccent(children) : children;

  return (
    <Component className={cn("text-display-lg tracking-tight text-fg", className)} {...props}>
      {content}
    </Component>
  );
}

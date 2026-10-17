import React from "react";
import { cn } from "@/lib/utils/cn";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section" | "article" | "main" | "header" | "footer";
  className?: string;
  children: React.ReactNode;
};

export function Container({ as: Component = "div", className, children, ...props }: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full max-w-[1440px] px-[clamp(1.25rem,4vw,4rem)]", className)}
      {...props}
    >
      {children}
    </Component>
  );
}

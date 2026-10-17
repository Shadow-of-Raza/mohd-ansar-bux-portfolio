import React from "react";
import { cn } from "@/lib/utils/cn";

export type EyebrowProps = React.HTMLAttributes<HTMLParagraphElement> & {
  className?: string;
  children: React.ReactNode;
};

export function Eyebrow({ className, children, ...props }: EyebrowProps) {
  if (!children) return null;

  // If string, format section numbers like "01 — " with the digits highlighted in electric-300
  let content = children;
  if (typeof children === "string") {
    const match = children.match(/^(\d{2,3}\s*[—–-]\s*)(.*)$/);
    if (match) {
      const [, prefix, rest] = match;
      content = (
        <>
          <span className="text-electric-300">{prefix}</span>
          <span>{rest}</span>
        </>
      );
    }
  }

  return (
    <p className={cn("flex items-center gap-2 text-label font-label text-fg-subtle", className)} {...props}>
      {content}
    </p>
  );
}

import React from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { SectionHeading } from "./SectionHeading";

export type SectionProps = {
  id?: string;
  eyebrow?: string | null;
  title?: string | null;
  intro?: string | null;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
};

export function Section({
  id,
  eyebrow,
  title,
  intro,
  className,
  containerClassName,
  children,
}: SectionProps) {
  // Presence rule: if no content or title, return null
  if (!title && !children) return null;

  const headingId = id && title ? `${id}-heading` : undefined;

  return (
    <section id={id} aria-labelledby={headingId} className={cn("py-[clamp(5rem,12vw,10rem)]", className)}>
      <Container className={containerClassName}>
        {eyebrow && eyebrow.trim().length > 0 && (
          <div className="mb-4">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}

        {title && title.trim().length > 0 && (
          <SectionHeading id={headingId} className="mb-4">
            {title}
          </SectionHeading>
        )}

        {intro && intro.trim().length > 0 && (
          <p className="mb-10 max-w-[52ch] text-lead text-fg-muted">{intro}</p>
        )}

        {children}
      </Container>
    </section>
  );
}

import React from "react";
import {
  Server,
  Layout,
  Database,
  Cpu,
  Network,
  Code,
  Terminal,
  Shield,
  Cloud,
  Layers,
  Sparkles,
  Box,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Profile } from "@/lib/data/schemas";

export type InterestsSectionProps = {
  interests?: Profile["interests"];
  eyebrow?: string;
  className?: string;
};

/**
 * Static icon resolver for professional interests.
 */
function InterestIcon({ icon, className }: { icon?: string; className?: string }) {
  switch (icon?.toLowerCase()) {
    case "server":
      return <Server className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "layout":
    case "frontend":
      return <Layout className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "database":
    case "storage":
      return <Database className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "cpu":
    case "hardware":
      return <Cpu className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "network":
    case "distributed":
      return <Network className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "code":
      return <Code className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "terminal":
    case "cli":
      return <Terminal className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "shield":
    case "security":
      return <Shield className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "cloud":
      return <Cloud className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "layers":
      return <Layers className={className} strokeWidth={1.5} aria-hidden="true" />;
    case "sparkles":
      return <Sparkles className={className} strokeWidth={1.5} aria-hidden="true" />;
    default:
      return <Box className={className} strokeWidth={1.5} aria-hidden="true" />;
  }
}

/**
 * ABOUT-03 Professional Interests Section (Server Component).
 * Renders technical areas of passion as structured cards with architectural numbers,
 * icon plates, titles, and descriptions.
 * Follows presence rules: returns null if interests.items is empty.
 */
export function InterestsSection({
  interests,
  eyebrow = "03 — Focus",
  className,
}: InterestsSectionProps) {
  const items = interests?.items?.filter((item) => item.title && item.title.trim().length > 0) ?? [];

  if (!interests || items.length === 0) {
    return null;
  }

  const title = interests.title?.trim() || "What I'm *into*";

  return (
    <section
      id="interests"
      aria-labelledby="interests-title"
      className={cn("relative w-full overflow-hidden py-[clamp(3.5rem,8vw,6rem)]", className)}
    >
      <Container>
        {/* Section Header */}
        <div className="max-w-[720px]">
          <div className="mb-3 sm:mb-4">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
          <SectionHeading id="interests-title" className="text-display-lg">
            {title}
          </SectionHeading>
        </div>

        {/* Hairline Divider */}
        <div className="my-8 h-px w-full bg-line sm:my-10 lg:my-12" aria-hidden="true" />

        {/* 4-Column Card Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {items.map((item, idx) => {
            const numberText = String(idx + 1).padStart(2, "0");

            return (
              <div
                key={item.id || idx}
                className="group relative flex flex-col justify-between rounded-md border border-line bg-surface-1 p-6 transition-all duration-300 hover:border-line-strong hover:bg-surface-2/60 hover:shadow-card md:p-7"
              >
                <div>
                  {/* Top Bar: Number + Icon Plate */}
                  <div className="flex items-center justify-between">
                    <span className="font-label text-micro tracking-wider text-electric-300">
                      {numberText}
                    </span>
                    <div className="rounded-sm border border-line bg-surface-2 p-2.5 text-white transition-colors duration-300 group-hover:border-electric/50 group-hover:text-electric-300">
                      <InterestIcon icon={item.icon} className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-5 font-body text-title font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-white">
                    {item.title}
                  </h3>

                  {/* Description */}
                  {item.description && (
                    <p className="mt-2 text-body font-body leading-relaxed text-fg-muted">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Subtle bottom hairline indicator on hover */}
                <div
                  className="mt-6 h-px w-full bg-line transition-colors duration-300 group-hover:bg-electric/40"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

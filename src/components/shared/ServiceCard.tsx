import React from "react";
import Link from "next/link";
import { ArrowRight, Monitor, Server, Cloud, Code, Terminal, Sparkles, Layers, Box, Cpu } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { TechChip } from "@/components/shared/TechChip";
import { cn } from "@/lib/utils/cn";
import type { Service } from "@/lib/data/schemas";

export type ServiceCardProps = {
  service: Service;
  index: number;
  skillMap?: Record<string, { name: string; icon?: string }>;
  className?: string;
};

/**
 * Static ServiceIcon component declared outside render.
 */
function ServiceIcon({ icon, className }: { icon?: string | null; className?: string }) {
  switch (icon?.toLowerCase()) {
    case "monitor":
    case "screen":
    case "web":
      return <Monitor className={className} aria-hidden="true" />;
    case "server":
    case "backend":
    case "api":
      return <Server className={className} aria-hidden="true" />;
    case "cloud":
    case "devops":
      return <Cloud className={className} aria-hidden="true" />;
    case "terminal":
    case "cli":
      return <Terminal className={className} aria-hidden="true" />;
    case "code":
      return <Code className={className} aria-hidden="true" />;
    case "sparkles":
      return <Sparkles className={className} aria-hidden="true" />;
    case "layers":
      return <Layers className={className} aria-hidden="true" />;
    case "cpu":
      return <Cpu className={className} aria-hidden="true" />;
    default:
      return <Box className={className} aria-hidden="true" />;
  }
}

/**
 * ServiceCard component for HOME-02 and services listings.
 * Follows design system specifications (03 §7, §9, §10):
 * - Architectural numbering (01, 02...) in Alegreya SC & electric-300.
 * - Icon housed in a minimal hairline plate (no generic icon-in-circle).
 * - Archivo Black title + Averia Serif Libre italic tagline.
 * - Up to 3 technology chips with authentic SVG logos.
 * - Stretched link on "Read more" to /services#slug for full-card clickability.
 */
export function ServiceCard({ service, index, skillMap, className }: ServiceCardProps) {
  const numberText = String(index + 1).padStart(2, "0");
  const featuredTechs = service.technologies?.slice(0, 3) ?? [];

  return (
    <Card
      as="article"
      interactive
      className={cn(
        "group flex h-full flex-col justify-between overflow-hidden p-6 sm:p-8",
        className,
      )}
    >
      <div>
        {/* Top Header: Number Anchor and Plain 20px Lucide Icon */}
        <div className="flex items-center justify-between gap-4 border-b border-line/60 pb-6">
          <div className="flex items-center gap-4">
            <span className="font-display text-heading leading-none text-fg-subtle transition-colors duration-300 group-hover:text-electric-300">
              {numberText}
            </span>
            <ServiceIcon
              icon={service.icon}
              className="h-5 w-5 shrink-0 stroke-[1.5] text-fg-subtle transition-colors duration-300 group-hover:text-electric-300"
            />
          </div>
        </div>

        {/* Title and Summary */}
        <div className="pt-6">
          <h3 className="font-display text-heading text-balance text-white transition-colors duration-200">
            {service.title}
          </h3>

          {/* Short Summary (Tagline removed) */}
          {service.summary && (
            <p className="mt-3 font-body text-body text-pretty text-fg-muted leading-relaxed line-clamp-3">
              {service.summary}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Section: Technologies & Action Link */}
      <div className="mt-8 space-y-5">
        {/* Technology Chips (up to 3) */}
        {featuredTechs.length > 0 && (
          <div className="relative z-10 flex flex-wrap gap-2">
            {featuredTechs.map((techId) => {
              const skillInfo = skillMap?.[techId];
              const skillName = skillInfo?.name || techId.replace(/-/g, " ");
              const skillIcon = skillInfo?.icon;
              return <TechChip key={techId} name={skillName} icon={skillIcon} />;
            })}
          </div>
        )}

        {/* Hairline and Read More Stretched Link */}
        <div className="flex items-center justify-between border-t border-line/60 pt-4">
          <Link
            href={`/services#${service.slug}`}
            className="group/link inline-flex items-center gap-2 font-label text-label font-medium text-electric-300 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300 after:absolute after:inset-0 after:content-['']"
          >
            <span>Read more</span>
            <ArrowRight
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-1 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </Card>
  );
}

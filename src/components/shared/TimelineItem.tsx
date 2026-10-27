import React from "react";
import Image from "next/image";
import { ExternalLink, MapPin, Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatYearMonth } from "@/lib/utils/dates";
import { highlightNumbers } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Education } from "@/lib/data/schemas";

export type TimelineItemVariant = "compact" | "full";

export type TimelineItemProps = {
  item: Education;
  index?: number;
  variant?: TimelineItemVariant;
  className?: string;
};

/**
 * InstitutionLogo component renders the authentic SVG logo or
 * falls back to institution initials when no image is provided.
 */
function InstitutionLogo({
  logo,
  name,
}: {
  logo?: Education["institution"]["logo"];
  name: string;
}) {
  if (logo?.src) {
    return (
      <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-surface-2 p-1.5 transition-colors duration-300 group-hover:border-line-strong">
        <Image
          src={logo.src}
          alt={logo.alt || `${name} logo`}
          width={logo.width || 64}
          height={logo.height || 64}
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 font-display text-label text-fg-subtle transition-colors duration-300 group-hover:border-line-strong group-hover:text-white">
      {initials || "ED"}
    </div>
  );
}

/**
 * Reusable TimelineItem component for education timeline nodes.
 * Supports compact mode (HOME-04 preview) and full mode (EDU-02 page).
 * Strictly adheres to presence rules and design tokens without dangling separators.
 */
export function TimelineItem({
  item,
  variant = "compact",
  className,
}: TimelineItemProps) {
  const isPursuing = item.status === "pursuing";
  const isCompact = variant === "compact";
  const startStr = formatYearMonth(item.start);
  const endStr = item.end ? formatYearMonth(item.end) : "Present";
  const yearsString = `${startStr} – ${endStr}`;

  return (
    <Card
      className={cn(
        "group relative flex flex-col p-5 sm:p-6 transition-all duration-300 hover:border-line-strong hover:bg-surface-1/90",
        className,
      )}
    >
      {/* Header: Institution Badge & Degree Info */}
      <div className="flex items-start gap-3.5 sm:gap-4">
        <InstitutionLogo logo={item.institution.logo} name={item.institution.name} />

        <div className="min-w-0 flex-1 space-y-1">
          {/* Degree Title and Status Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-title text-balance text-white transition-colors duration-200 group-hover:text-electric-200">
              {item.degree}
            </h3>
            <Badge variant={isPursuing ? "pursuing" : "completed"}>
              {isPursuing ? "Pursuing" : "Completed"}
            </Badge>
          </div>

          {/* Field of Study */}
          {item.field && (
            <p className="font-body text-small text-fg-muted">
              {item.field}
            </p>
          )}

          {/* Institution Link or Plain Name */}
          <div className="font-body text-small text-fg">
            {item.institution.url ? (
              <a
                href={item.institution.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-1.5 font-medium transition-colors hover:text-electric-300 focus-visible:outline-2 focus-visible:outline-electric-300"
                aria-label={`${item.institution.name} website (opens in new tab)`}
              >
                <span>{item.institution.name}</span>
                <ExternalLink className="h-3 w-3 opacity-70" aria-hidden="true" />
              </a>
            ) : (
              <span className="font-medium">{item.institution.name}</span>
            )}
          </div>
        </div>
      </div>

      {/* Compact Variant: Years Only (shown on mobile, opposite node on desktop per H4) */}
      {isCompact && (
        <div className="mt-3.5 border-t border-line/50 pt-2.5 font-label text-micro text-fg-subtle md:hidden">
          <span className="font-medium text-fg-muted">{yearsString}</span>
        </div>
      )}

      {/* Full Variant: Years (mobile only), Board, Location, and Score without dangling dot separators */}
      {!isCompact && (
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line/60 pt-3 font-label text-micro text-fg-subtle">
          <span className="font-medium text-fg-muted md:hidden">{yearsString}</span>

          {item.board && <span>{item.board}</span>}

          {item.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 opacity-60" aria-hidden="true" />
              <span>{item.location}</span>
            </span>
          )}

          {item.score && (
            <span className="inline-flex items-center gap-1 rounded-sm border border-line bg-surface-2 px-1.5 py-0.5 text-micro font-medium text-electric-200">
              <Award className="h-3 w-3" aria-hidden="true" />
              <span>
                {item.score.label}: {item.score.value}
              </span>
            </span>
          )}
        </div>
      )}

      {/* Full Variant Only: Highlights */}
      {!isCompact && item.highlights && item.highlights.length > 0 && (
        <ul className="mt-3.5 space-y-1.5 border-t border-line/40 pt-3">
          {item.highlights.map((highlight, hIdx) => (
            <li
              key={hIdx}
              className="flex items-start gap-2 font-body text-small leading-relaxed text-fg-muted"
            >
              <span
                className="mt-2 h-1 w-1 shrink-0 rounded-full bg-electric-300"
                aria-hidden="true"
              />
              <span>{highlightNumbers(highlight)}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Full Variant Only: Key Coursework Chips */}
      {!isCompact && item.coursework && item.coursework.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-line/40 pt-3">
          <span className="font-label text-micro uppercase tracking-wider text-fg-subtle">
            Key Coursework
          </span>
          <div className="flex flex-wrap gap-1.5">
            {item.coursework.map((course, cIdx) => (
              <span
                key={cIdx}
                className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 font-label text-micro text-fg-muted"
              >
                {course}
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { formatYearMonth } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

export type PdMetaProps = {
  organization?: { name: string; url?: string | null } | null;
  role?: string;
  type: string;
  status?: string;
  timeline?: {
    start?: string;
    end?: string | null;
    durationLabel?: string;
  };
  className?: string;
};

/**
 * PD-02 Meta Bar (Server Component).
 * Renders structured metadata across hairline borders:
 * organisation/client, role, timeline duration, completion dates, and status.
 */
export function PdMeta({
  organization,
  role,
  type,
  status = "completed",
  timeline,
  className,
}: PdMetaProps) {
  // Determine organization display
  const orgName = organization?.name || (type === "open-source" ? "Open source" : null);
  const orgUrl = organization?.url;

  // Format date range
  let dateText: string | null = null;
  if (timeline?.start) {
    const formattedStart = formatYearMonth(timeline.start);
    if (!timeline.end) {
      dateText = `${formattedStart} – Present`;
    } else {
      const formattedEnd = formatYearMonth(timeline.end);
      dateText = formattedStart === formattedEnd ? formattedStart : `${formattedStart} – ${formattedEnd}`;
    }
  }

  const duration = timeline?.durationLabel;

  return (
    <div
      id="pd-meta"
      className={cn("w-full border-y border-line bg-surface-1/40 py-6 my-8 sm:my-12", className)}
    >
      <Container>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {/* 1. Organisation / Client */}
          {orgName && (
            <div className="space-y-1">
              <span className="block font-label text-micro tracking-wider text-fg-subtle uppercase">
                Organisation
              </span>
              {orgUrl ? (
                <Link
                  href={orgUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 font-body text-body font-semibold text-white transition-colors duration-200 hover:text-electric-300"
                >
                  <span>{orgName}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-fg-subtle transition-colors group-hover:text-electric-300" />
                </Link>
              ) : (
                <span className="block font-body text-body font-semibold text-white">
                  {orgName}
                </span>
              )}
            </div>
          )}

          {/* 2. Role */}
          {role && (
            <div className="space-y-1">
              <span className="block font-label text-micro tracking-wider text-fg-subtle uppercase">
                Role
              </span>
              <span className="block font-body text-body font-semibold text-white">
                {role}
              </span>
            </div>
          )}

          {/* 3. Duration */}
          {duration && (
            <div className="space-y-1">
              <span className="block font-label text-micro tracking-wider text-fg-subtle uppercase">
                Duration
              </span>
              <span className="block font-body text-body font-semibold text-white">
                {duration}
              </span>
            </div>
          )}

          {/* 4. Timeline / Dates */}
          {dateText && (
            <div className="space-y-1">
              <span className="block font-label text-micro tracking-wider text-fg-subtle uppercase">
                Timeline
              </span>
              <span className="block font-body text-body font-semibold text-white">
                {dateText}
              </span>
            </div>
          )}

          {/* 5. Project Type & Status */}
          <div className="space-y-1">
            <span className="block font-label text-micro tracking-wider text-fg-subtle uppercase">
              Status & Type
            </span>
            <span className="block font-body text-body font-semibold text-white capitalize">
              {status} · {type.replace("-", " ")}
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
}

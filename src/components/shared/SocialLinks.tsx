import React from "react";
import { cn } from "@/lib/utils/cn";
import type { Site } from "@/lib/data/schemas";

export type SocialLinksProps = {
  socials: Site["socials"];
  className?: string;
  showLabels?: boolean;
};

function renderSocialIcon(iconId: string) {
  const norm = iconId.toLowerCase();
  if (norm.includes("github")) {
    return (
      <svg
        className="h-5 w-5 fill-current"
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }

  if (norm.includes("linkedin")) {
    return (
      <svg
        className="h-5 w-5 fill-current"
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.38 9.74v-8.37H5.08v8.37h2.76z" />
      </svg>
    );
  }

  if (norm.includes("twitter") || norm.includes("x")) {
    return (
      <svg
        className="h-5 w-5 fill-current"
        viewBox="0 0 24 24"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }

  // Fallback generic link icon
  return (
    <svg
      className="h-5 w-5 stroke-current"
      fill="none"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
      />
    </svg>
  );
}

/**
 * Reusable social links row with monochrome styling, 44px min touch targets,
 * and accessible external-link metadata.
 * Per docs/context/03-design-system.md §9 and 01-project-overview.md §4.
 */
export function SocialLinks({ socials, className, showLabels = false }: SocialLinksProps) {
  if (!socials || socials.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Social media links">
      {socials.map((s) => (
        <li key={s.id}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className={cn(
              "inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center gap-2.5 rounded-sm border border-line px-3 text-fg-muted select-none",
              "transition-colors duration-200 hover:border-line-strong hover:bg-surface-2 hover:text-white",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300",
            )}
          >
            {renderSocialIcon(s.icon || s.id)}
            {showLabels && (
              <span className="text-label font-label tracking-[0.06em] text-inherit">{s.label}</span>
            )}
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

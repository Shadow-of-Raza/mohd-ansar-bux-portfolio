import React from "react";
import { ExternalLink, Lock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { cn } from "@/lib/utils/cn";

export type PdLinksProps = {
  type: string;
  confidential?: boolean;
  links: {
    github?: string | null;
    live?: string | null;
  };
  title: string;
  className?: string;
};

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-4 w-4 fill-current", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/**
 * PD-03 Action Links (Server Component).
 * Renders repository and live deployment CTA buttons,
 * or displays a confidential NDA security notice when links are private.
 */
export function PdLinks({
  type,
  confidential = false,
  links,
  title,
  className,
}: PdLinksProps) {
  const showGithub = type === "open-source" && Boolean(links.github);
  const showLive = Boolean(links.live);
  const isNdaOnly = confidential && !showGithub && !showLive;

  // Presence rule: if neither link exists and not confidential, render nothing
  if (!showGithub && !showLive && !isNdaOnly) {
    return null;
  }

  return (
    <section id="pd-links" className={cn("w-full py-4 mb-8 sm:mb-12", className)}>
      <Container>
        {isNdaOnly ? (
          /* Confidential / Under NDA Advisory Notice */
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md border border-line bg-surface-1/60 p-5 backdrop-blur-sm sm:p-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-subtle">
                <Lock className="h-5 w-5 text-electric-300" aria-hidden="true" />
              </div>
              <div>
                <span className="block font-label text-label font-semibold text-white tracking-wide">
                  Private / Under NDA
                </span>
                <p className="font-body text-small text-fg-muted">
                  Source code and deployment environments are confidential under non-disclosure agreement.
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto rounded-full border border-line bg-surface-2 px-3 py-1 font-label text-micro text-fg-subtle uppercase tracking-wider">
              Protected IP
            </span>
          </div>
        ) : (
          /* Action Links Button Row */
          <div className="flex flex-wrap items-center gap-4">
            {showLive && links.live && (
              <LinkButton
                href={links.live}
                variant="primary"
                trailingIcon={<ExternalLink className="h-4 w-4" />}
              >
                <span>Visit Live System</span>
                <span className="sr-only"> for {title}</span>
              </LinkButton>
            )}

            {showGithub && links.github && (
              <LinkButton
                href={links.github}
                variant="secondary"
                icon={<GithubIcon className="h-4 w-4" />}
                trailingIcon={<ExternalLink className="h-4 w-4" />}
              >
                <span>View on GitHub</span>
                <span className="sr-only"> for {title}</span>
              </LinkButton>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

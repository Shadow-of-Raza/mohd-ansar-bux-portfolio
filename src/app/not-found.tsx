import React from "react";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { renderAccent } from "@/lib/utils/format";
import { getSite } from "@/lib/data/loaders";
import { hasProjectsPage } from "@/lib/data/availability";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * 404 Not Found Page (01 §5.10).
 * Server Component rendered inside the global layout (Header + Footer).
 * Single fluid clamp for the giant 404 display text (no eyebrow; the 404 is the label).
 * Headline with renderAccent, witty yet professional description,
 * and smart action links to Home and Projects (if projects exist).
 */
export default function NotFound() {
  const site = getSite();
  const notFoundCopy = site?.notFound;
  const hasProjects = hasProjectsPage();

  const title = notFoundCopy?.title || "Page not *found*";
  const message =
    notFoundCopy?.message ||
    "The page you are looking for has been moved, removed, or never existed in this codebase.";
  const homeLabel = notFoundCopy?.homeLabel || "Back to home";
  const projectsLabel = notFoundCopy?.projectsLabel || "Explore projects";

  return (
    <div className="relative flex min-h-[calc(100vh-14rem)] flex-col items-center justify-center py-20 md:py-28 text-fg">
      {/* Subtle ambient radial glow behind 404 display */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-radial from-royal/20 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative z-10 flex flex-col items-center text-center">
        {/* Large fluid 404 display (the 404 is the label, no eyebrow) */}
        <span
          className="font-display text-[clamp(6rem,18vw,12rem)] leading-none text-white/90 select-none tracking-tight"
          aria-hidden="true"
        >
          404
        </span>

        {/* Headline with accent word */}
        <h1 className="mt-6 font-display text-display-md text-white sm:text-display-lg text-balance max-w-[20ch]">
          {renderAccent(title)}
        </h1>

        {/* Witty but professional explanation */}
        <p className="mt-4 max-w-[48ch] font-body text-lead text-pretty text-fg-muted">
          {message}
        </p>

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto">
          <LinkButton
            href="/"
            variant="primary"
            size="md"
            icon={<ArrowLeft className="h-4 w-4" aria-hidden="true" />}
            className="w-full sm:w-auto min-w-[160px] justify-center"
          >
            {homeLabel}
          </LinkButton>

          {hasProjects && (
            <LinkButton
              href="/projects"
              variant="secondary"
              size="md"
              trailingIcon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}
              className="w-full sm:w-auto min-w-[160px] justify-center"
            >
              {projectsLabel}
            </LinkButton>
          )}
        </div>
      </Container>
    </div>
  );
}

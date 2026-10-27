import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { PageHero } from "@/components/shared/PageHero";

export type PdHeroProps = {
  title: string;
  tagline?: string;
  type: string;
  status?: string;
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  className?: string;
};

function formatTypeLabel(type: string): string {
  switch (type) {
    case "open-source":
      return "Open source";
    case "professional":
      return "Professional";
    case "freelance":
      return "Freelance";
    case "personal":
      return "Personal";
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
}

function formatStatusLabel(status: string): string {
  switch (status) {
    case "live":
      return "Live System";
    case "completed":
      return "Completed";
    case "in-progress":
      return "In Progress";
    case "archived":
      return "Archived";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

/**
 * PD-01 Project Detail Hero (Server Component).
 * Renders the top breadcrumb back link, category/status badges,
 * display title, lead tagline, and prominent 16:10 cover plate.
 */
export function PdHero({
  title,
  tagline,
  type,
  status = "completed",
  cover,
  className,
}: PdHeroProps) {
  const isLive = status.toLowerCase() === "live";

  return (
    <PageHero
      id="pd-hero"
      aria-labelledby="project-title"
      className={className}
    >
      {/* Subtle radial ambient glow behind the hero */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[450px] w-[500px] -translate-x-1/2 rounded-full bg-radial from-royal/20 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <Container>
        {/* Top Navigation Back Link */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-label text-label text-fg-subtle transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-electric-300"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>All projects</span>
          </Link>
        </div>

        {/* Category & Status Badges */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant={type === "open-source" ? "open-source" : "professional"}>
            {formatTypeLabel(type)}
          </Badge>

          <Badge variant={isLive ? "live" : "completed"}>
            {formatStatusLabel(status)}
          </Badge>
        </div>

        {/* Project Title */}
        <h1
          id="project-title"
          className="font-display text-display-xl break-words text-balance text-white"
        >
          {title}
        </h1>

        {/* Tagline / Subtitle */}
        {tagline && (
          <p className="mt-4 max-w-3xl font-body text-lead text-pretty text-fg-muted">
            {tagline}
          </p>
        )}

        {/* Cover Media Plate (16:10 Aspect Ratio) */}
        {cover && (
          <div className="mt-8 sm:mt-12 overflow-hidden rounded-md border border-line bg-surface-2 shadow-card">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={cover.src}
                alt={cover.alt || title}
                width={cover.width || 1600}
                height={cover.height || 1000}
                priority
                sizes="(min-width: 1440px) 1280px, (min-width: 768px) 90vw, 100vw"
                className="h-full w-full object-cover object-center"
              />
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
                aria-hidden="true"
              />
            </div>
          </div>
        )}
      </Container>
    </PageHero>
  );
}

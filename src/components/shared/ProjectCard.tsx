import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TechChip } from "@/components/shared/TechChip";
import { cn } from "@/lib/utils/cn";

export type ProjectCardItem = {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  summary?: string;
  type: string;
  organization?: { name: string; url?: string | null } | null;
  status?: string;
  featured?: boolean;
  order?: number;
  confidential?: boolean;
  timeline?: {
    start?: string;
    end?: string | null;
    durationLabel?: string;
  };
  links?: {
    github?: string | null;
    live?: string | null;
  };
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  techStack?: {
    skill: string;
    reason?: string;
  }[];
};

export type ProjectCardProps = {
  project: ProjectCardItem;
  skillMap?: Record<string, { name: string; icon?: string }>;
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
 * Format project type identifier into display label.
 */
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

/**
 * ProjectCard component for HOME-05 and /projects listings.
 * Follows design system specifications (01 §5.1, 03 §7, §8, §10):
 * - 16:10 cover plate with subtle scale on hover.
 * - Type badge ("Open source" / "Professional" / etc.) and organization name.
 * - Archivo Black title with hover color transition.
 * - Compact one-line summary / tagline.
 * - Up to 4 tech chips with authentic logos, plus "+N" overflow pill.
 * - Stretched link on "Read more" to /projects/[slug] for full-card clickability.
 */
export function ProjectCard({ project, skillMap, className }: ProjectCardProps) {
  const summaryText = project.summary?.trim() || project.tagline?.trim();
  const featuredTechs = project.techStack ? project.techStack.slice(0, 4) : [];
  const remainingCount = project.techStack ? Math.max(0, project.techStack.length - 4) : 0;

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
        {/* Project Cover: 16:10 Plate with Subtle Hover Zoom */}
        {project.cover && (
          <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-sm border border-line/60 bg-surface-2">
            <Image
              src={project.cover.src}
              alt={project.cover.alt || project.title}
              width={project.cover.width || 1600}
              height={project.cover.height || 1000}
              sizes="(min-width: 1280px) 680px, (min-width: 768px) 50vw, 100vw"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          </div>
        )}

        {/* Meta Bar: Type Badge, Organization, and Timeline Duration */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant={project.type === "open-source" ? "open-source" : "default"}>
              {formatTypeLabel(project.type)}
            </Badge>

            {project.organization?.name && (
              <span className="font-label text-micro tracking-wider text-fg-subtle">
                {project.organization.name}
              </span>
            )}
          </div>

          {project.timeline?.durationLabel && (
            <span className="font-label text-micro text-fg-subtle">
              {project.timeline.durationLabel}
            </span>
          )}
        </div>

        {/* Title and Summary */}
        <div className="space-y-3">
          <h3 className="font-display text-heading text-balance text-white transition-colors duration-200 group-hover:text-electric-300">
            {project.title}
          </h3>

          {summaryText && (
            <p className="font-body text-body text-pretty text-fg-muted leading-relaxed line-clamp-2">
              {summaryText}
            </p>
          )}
        </div>
      </div>

      {/* Bottom Area: Technology Chips & Action Link */}
      <div className="mt-8 space-y-5">
        {/* Up to 4 Tech Chips (+N overflow indicator) */}
        {featuredTechs.length > 0 && (
          <div className="relative z-10 flex flex-wrap items-center gap-2">
            {featuredTechs.map((item) => {
              const skillId = item.skill;
              const skillInfo = skillMap?.[skillId];
              const skillName = skillInfo?.name || skillId.replace(/-/g, " ");
              const skillIcon = skillInfo?.icon;
              return <TechChip key={skillId} name={skillName} icon={skillIcon} />;
            })}

            {remainingCount > 0 && (
              <span
                className="inline-flex h-8 items-center rounded-full border border-line/80 bg-surface-2 px-3 font-label text-micro text-fg-subtle select-none"
                title={`${remainingCount} more technologies`}
              >
                +{remainingCount}
              </span>
            )}
          </div>
        )}

        {/* Hairline Divider & Read More Stretched Link + Separate Icon Links */}
        <div className="flex items-center justify-between border-t border-line/60 pt-4">
          <Link
            href={`/projects/${project.slug}`}
            className="group/link inline-flex items-center gap-2 font-label text-label font-medium text-electric-300 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300 after:absolute after:inset-0 after:content-['']"
          >
            <span>Read more</span>
            <ArrowRight
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-1 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>

          {/* Separate External / GitHub Links or Confidential Badge */}
          <div className="relative z-10 flex items-center gap-2">
            {project.confidential && !project.links?.github && !project.links?.live && (
              <span className="font-label text-micro text-fg-subtle italic">
                Private / under NDA
              </span>
            )}

            {project.type === "open-source" && project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} on GitHub`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line bg-surface-2 text-fg-muted transition-colors duration-200 hover:border-electric hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
              >
                <GithubIcon className="h-4 w-4" />
              </a>
            )}

            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit live demo for ${project.title}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-line bg-surface-2 text-fg-muted transition-colors duration-200 hover:border-electric hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

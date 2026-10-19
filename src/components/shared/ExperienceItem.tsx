import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { TechChip } from "@/components/shared/TechChip";
import { formatYearMonth, calculateDuration, calculateTotalExperience } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { ExperienceCompany, ExperienceRole } from "@/lib/data/schemas";

export type ExperienceItemProps = {
  company: ExperienceCompany;
  skillMap?: Record<string, { name: string; icon?: string }>;
  hasExperiencePage?: boolean;
  maxSkills?: number;
  className?: string;
};

/**
 * CompanyLogo component rendering the authentic SVG badge
 * or falling back to initials when no logo image is provided.
 */
function CompanyLogo({
  logo,
  name,
}: {
  logo?: ExperienceCompany["company"]["logo"];
  name: string;
}) {
  if (logo?.src) {
    return (
      <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line bg-surface-2 p-1.5 transition-colors duration-300 group-hover:border-line-strong">
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
    <div className="flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 font-display text-label text-fg-subtle transition-colors duration-300 group-hover:border-line-strong group-hover:text-white">
      {initials || "CO"}
    </div>
  );
}

/**
 * SingleRoleContent renders a single role entry with title, Present badge,
 * dedicated company name line, meta line, date/duration in text-fg-subtle, summary, and tech chips.
 */
function SingleRoleContent({
  role,
  company,
  skillMap,
  maxSkills = 4,
}: {
  role: ExperienceRole;
  company: ExperienceCompany;
  skillMap?: Record<string, { name: string; icon?: string }>;
  maxSkills?: number;
}) {
  const isPresent = !role.end;
  const startDate = formatYearMonth(role.start);
  const endDate = role.end ? formatYearMonth(role.end) : "Present";
  const duration = calculateDuration(role.start, role.end);
  const dateString = `${startDate} – ${endDate} · ${duration.label}`;
  const summaryText = role.summary || role.description?.[0];

  const allSkills = role.skills ?? [];
  const visibleSkills = maxSkills ? allSkills.slice(0, maxSkills) : allSkills;
  const remainingSkillsCount = maxSkills ? Math.max(0, allSkills.length - maxSkills) : 0;

  return (
    <div className="space-y-3">
      {/* Role Title and Present Badge */}
      <div className="flex flex-wrap items-center gap-2.5">
        <h3 className="font-display text-heading text-balance text-white transition-colors duration-200 group-hover:text-electric-200">
          {role.title}
        </h3>
        {isPresent && <Badge variant="present">Present</Badge>}
      </div>

      {/* Company Name on its own line */}
      <div className="font-body text-small text-fg">
        {company.company.url ? (
          <a
            href={company.company.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1.5 font-medium transition-colors hover:text-electric-300 focus-visible:outline-2 focus-visible:outline-electric-300"
            aria-label={`${company.company.name} website (opens in new tab)`}
          >
            <span>{company.company.name}</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
          </a>
        ) : (
          <span className="font-medium">{company.company.name}</span>
        )}
      </div>

      {/* Employment Type, Work Mode, Location as smaller font-label meta line */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-label text-micro text-fg-subtle">
        {role.employmentType && <span>{role.employmentType}</span>}
        {role.mode && <span>{role.mode}</span>}
        {company.company.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0 text-fg-subtle/80" aria-hidden="true" />
            <span>{company.company.location}</span>
          </span>
        )}
      </div>

      {/* Date Range and Computed Duration in text-fg-subtle */}
      <p className="font-label text-label font-medium text-fg-subtle">
        {dateString}
      </p>

      {/* One-Line Summary */}
      {summaryText && (
        <p className="font-body text-body text-pretty leading-relaxed text-fg-muted line-clamp-3">
          {summaryText}
        </p>
      )}

      {/* Technology Chips (max 4, then +N) */}
      {visibleSkills.length > 0 && (
        <div className="relative z-10 flex flex-wrap gap-2 pt-1">
          {visibleSkills.map((skillId) => {
            const skillInfo = skillMap?.[skillId];
            const skillName = skillInfo?.name || skillId.replace(/-/g, " ");
            const skillIcon = skillInfo?.icon;
            return <TechChip key={skillId} name={skillName} icon={skillIcon} />;
          })}
          {remainingSkillsCount > 0 && (
            <Chip as="span" className="border-line/80 bg-surface-2 text-fg-subtle select-none">
              +{remainingSkillsCount}
            </Chip>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * MultiRoleContent renders multiple roles under a single company connected
 * by a LinkedIn-style vertical hairline timeline track.
 */
function MultiRoleContent({
  company,
  skillMap,
  maxSkills = 4,
}: {
  company: ExperienceCompany;
  skillMap?: Record<string, { name: string; icon?: string }>;
  maxSkills?: number;
}) {
  const companyIntervals = company.roles.map((r) => ({ start: r.start, end: r.end }));
  const totalCompanyDuration = calculateTotalExperience(companyIntervals);

  return (
    <div className="space-y-6">
      {/* Company Header: Name on own line, location and total duration in meta line */}
      <div className="space-y-1">
        <div className="font-body text-small text-fg">
          {company.company.url ? (
            <a
              href={company.company.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-1.5 font-medium transition-colors hover:text-electric-300 focus-visible:outline-2 focus-visible:outline-electric-300"
              aria-label={`${company.company.name} website (opens in new tab)`}
            >
              <span>{company.company.name}</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            </a>
          ) : (
            <span className="font-medium">{company.company.name}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-label text-micro text-fg-subtle">
          {company.company.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0 text-fg-subtle/80" aria-hidden="true" />
              <span>{company.company.location}</span>
            </span>
          )}
          {totalCompanyDuration && totalCompanyDuration !== "0 mos" && (
            <span>Total: {totalCompanyDuration}</span>
          )}
        </div>
      </div>

      {/* Vertical Hairline Timeline for Roles */}
      <div className="relative space-y-7 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-line">
        {company.roles.map((role) => {
          const isPresent = !role.end;
          const startDate = formatYearMonth(role.start);
          const endDate = role.end ? formatYearMonth(role.end) : "Present";
          const duration = calculateDuration(role.start, role.end);
          const dateString = `${startDate} – ${endDate} · ${duration.label}`;
          const summaryText = role.summary || role.description?.[0];

          const allSkills = role.skills ?? [];
          const visibleSkills = maxSkills ? allSkills.slice(0, maxSkills) : allSkills;
          const remainingSkillsCount = maxSkills ? Math.max(0, allSkills.length - maxSkills) : 0;

          return (
            <div key={role.id} className="relative space-y-2.5">
              {/* Timeline Node Dot */}
              <span
                className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full border border-electric bg-surface-1"
                aria-hidden="true"
              />

              {/* Role Title and Present Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-display text-heading text-balance text-white transition-colors duration-200 group-hover:text-electric-200">
                  {role.title}
                </h4>
                {isPresent && <Badge variant="present">Present</Badge>}
              </div>

              {/* Meta: Employment Type, Mode */}
              {(role.employmentType || role.mode) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-label text-micro text-fg-subtle">
                  {role.employmentType && <span>{role.employmentType}</span>}
                  {role.mode && <span>{role.mode}</span>}
                </div>
              )}

              {/* Date and duration line in text-fg-subtle */}
              <p className="font-label text-label font-medium text-fg-subtle">
                {dateString}
              </p>

              {/* Summary */}
              {summaryText && (
                <p className="font-body text-body text-pretty leading-relaxed text-fg-muted line-clamp-3">
                  {summaryText}
                </p>
              )}

              {/* Tech Chips (max 4, then +N) */}
              {visibleSkills.length > 0 && (
                <div className="relative z-10 flex flex-wrap gap-2 pt-1">
                  {visibleSkills.map((skillId) => {
                    const skillInfo = skillMap?.[skillId];
                    const skillName = skillInfo?.name || skillId.replace(/-/g, " ");
                    const skillIcon = skillInfo?.icon;
                    return <TechChip key={skillId} name={skillName} icon={skillIcon} />;
                  })}
                  {remainingSkillsCount > 0 && (
                    <Chip as="span" className="border-line/80 bg-surface-2 text-fg-subtle select-none">
                      +{remainingSkillsCount}
                    </Chip>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * ExperienceItem component for HOME-03 preview and /experience list.
 * Follows design system specifications (01 §5.1, 02 §3, 03 §7, §10, 04 §5.4, 05 §4):
 * - Company logo in an architectural container (or monogram fallback).
 * - Role title with live pulsing Present badge if currently active.
 * - Company name on its own line in font-body text-small text-fg.
 * - Employment type, work mode, and location in smaller font-label meta line.
 * - Computed date range and duration in text-fg-subtle (Mon YYYY – Present · 1 yr 4 mos).
 * - One-line editorial summary.
 * - Max 4 authentic brand SVG technology chips + (+N) overflow badge.
 * - Stretched link to /experience#id for full-card clickability (with nested links isolated).
 */
export function ExperienceItem({
  company,
  skillMap,
  hasExperiencePage = true,
  maxSkills = 4,
  className,
}: ExperienceItemProps) {
  const roles = company.roles ?? [];
  if (roles.length === 0) return null;

  const isMultiRole = roles.length > 1;
  const primaryRole = roles[0];

  return (
    <Card
      as="article"
      interactive
      className={cn(
        "group flex flex-col justify-between overflow-hidden p-6 sm:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Company Logo / Monogram */}
        <CompanyLogo logo={company.company.logo} name={company.company.name} />

        {/* Roles and Details */}
        <div className="min-w-0 flex-1">
          {isMultiRole ? (
            <MultiRoleContent
              company={company}
              skillMap={skillMap}
              maxSkills={maxSkills}
            />
          ) : (
            primaryRole && (
              <SingleRoleContent
                role={primaryRole}
                company={company}
                skillMap={skillMap}
                maxSkills={maxSkills}
              />
            )
          )}
        </div>
      </div>

      {/* Card Action Link: Read more anchor */}
      {hasExperiencePage && (
        <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
          <Link
            href={`/experience#${company.id}`}
            className="group/link inline-flex items-center gap-2 font-label text-label font-medium text-electric-300 transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300 after:absolute after:inset-0 after:content-['']"
          >
            <span>Read more</span>
            <ArrowRight
              className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/link:translate-x-1 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      )}
    </Card>
  );
}

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Chip } from "@/components/ui/Chip";
import { TechChip } from "@/components/shared/TechChip";
import { CollapsibleBulletList } from "@/components/shared/CollapsibleBulletList";
import { formatYearMonth, calculateDuration, calculateTotalExperience } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";
import type { ExperienceCompany, ExperienceRole } from "@/lib/data/schemas";

export type ExperienceItemProps = {
  company: ExperienceCompany;
  skillMap?: Record<string, { name: string; icon?: string }>;
  projectMap?: Record<string, { title: string; slug: string }>;
  hasExperiencePage?: boolean;
  maxSkills?: number;
  variant?: "compact" | "full";
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
 * SingleRoleContent renders a single role entry.
 * In "compact" mode (HOME-03): summary clamped to 3 lines, max 4 tech chips (+N).
 * In "full" mode (EXP-02): full descriptions, responsibilities, achievements (numbers highlighted),
 * all tech chips, and related project links.
 */
function SingleRoleContent({
  role,
  company,
  skillMap,
  projectMap,
  maxSkills = 4,
  variant = "compact",
}: {
  role: ExperienceRole;
  company: ExperienceCompany;
  skillMap?: Record<string, { name: string; icon?: string }>;
  projectMap?: Record<string, { title: string; slug: string }>;
  maxSkills?: number;
  variant?: "compact" | "full";
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

      {/* Summary / Descriptions */}
      {variant === "full" ? (
        <div className="space-y-2 pt-1 font-body text-body leading-relaxed text-fg-muted">
          {role.summary && <p>{role.summary}</p>}
          {role.description?.map(
            (desc, idx) =>
              desc !== role.summary && <p key={idx}>{desc}</p>,
          )}
        </div>
      ) : (
        summaryText && (
          <p className="font-body text-body text-pretty leading-relaxed text-fg-muted line-clamp-3">
            {summaryText}
          </p>
        )
      )}

      {/* Responsibilities (full variant) */}
      {variant === "full" && role.responsibilities && role.responsibilities.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
            Key Responsibilities
          </h4>
          <CollapsibleBulletList
            items={role.responsibilities}
            limit={5}
            highlightMetrics={false}
            bulletType="dot"
          />
        </div>
      )}

      {/* Achievements (full variant with highlighted numbers) */}
      {variant === "full" && role.achievements && role.achievements.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
            Key Achievements
          </h4>
          <CollapsibleBulletList
            items={role.achievements}
            limit={5}
            highlightMetrics={true}
            bulletType="check"
          />
        </div>
      )}

      {/* Technology Chips */}
      {variant === "full" ? (
        allSkills.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
              Technologies & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
              {allSkills.map((skillId) => {
                const skillInfo = skillMap?.[skillId];
                const skillName = skillInfo?.name || skillId.replace(/-/g, " ");
                const skillIcon = skillInfo?.icon;
                return <TechChip key={skillId} name={skillName} icon={skillIcon} />;
              })}
            </div>
          </div>
        )
      ) : (
        visibleSkills.length > 0 && (
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
        )
      )}

      {/* Related Projects (full variant) */}
      {variant === "full" && role.projects && role.projects.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
            Related Projects
          </h4>
          <div className="flex flex-wrap gap-2">
            {role.projects.map((slug) => {
              const project = projectMap?.[slug];
              const title = project?.title || slug.replace(/-/g, " ");
              return (
                <Link
                  key={slug}
                  href={`/projects/${slug}`}
                  className="group/proj inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface-2 px-3 py-1.5 font-label text-micro text-fg transition-colors duration-200 hover:border-electric-300 hover:text-white focus-visible:outline-2 focus-visible:outline-electric-300"
                >
                  <span>{title}</span>
                  <ArrowRight
                    className="h-3 w-3 text-electric-300 transition-transform duration-200 group-hover/proj:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
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
  projectMap,
  maxSkills = 4,
  variant = "compact",
}: {
  company: ExperienceCompany;
  skillMap?: Record<string, { name: string; icon?: string }>;
  projectMap?: Record<string, { title: string; slug: string }>;
  maxSkills?: number;
  variant?: "compact" | "full";
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

              {/* Summary / Descriptions */}
              {variant === "full" ? (
                <div className="space-y-2 pt-1 font-body text-body leading-relaxed text-fg-muted">
                  {role.summary && <p>{role.summary}</p>}
                  {role.description?.map(
                    (desc, idx) =>
                      desc !== role.summary && <p key={idx}>{desc}</p>,
                  )}
                </div>
              ) : (
                summaryText && (
                  <p className="font-body text-body text-pretty leading-relaxed text-fg-muted line-clamp-3">
                    {summaryText}
                  </p>
                )
              )}

              {/* Responsibilities (full variant) */}
              {variant === "full" && role.responsibilities && role.responsibilities.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h5 className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
                    Key Responsibilities
                  </h5>
                  <CollapsibleBulletList
                    items={role.responsibilities}
                    limit={5}
                    highlightMetrics={false}
                    bulletType="dot"
                  />
                </div>
              )}

              {/* Achievements (full variant with highlighted numbers) */}
              {variant === "full" && role.achievements && role.achievements.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h5 className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
                    Key Achievements
                  </h5>
                  <CollapsibleBulletList
                    items={role.achievements}
                    limit={5}
                    highlightMetrics={true}
                    bulletType="check"
                  />
                </div>
              )}

              {/* Technology Chips */}
              {variant === "full" ? (
                allSkills.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h5 className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
                      Technologies & Tools
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {allSkills.map((skillId) => {
                        const skillInfo = skillMap?.[skillId];
                        const skillName = skillInfo?.name || skillId.replace(/-/g, " ");
                        const skillIcon = skillInfo?.icon;
                        return <TechChip key={skillId} name={skillName} icon={skillIcon} />;
                      })}
                    </div>
                  </div>
                )
              ) : (
                visibleSkills.length > 0 && (
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
                )
              )}

              {/* Related Projects (full variant) */}
              {variant === "full" && role.projects && role.projects.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h5 className="font-label text-micro font-medium uppercase tracking-wider text-fg-subtle">
                    Related Projects
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {role.projects.map((slug) => {
                      const project = projectMap?.[slug];
                      const title = project?.title || slug.replace(/-/g, " ");
                      return (
                        <Link
                          key={slug}
                          href={`/projects/${slug}`}
                          className="group/proj inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface-2 px-3 py-1.5 font-label text-micro text-fg transition-colors duration-200 hover:border-electric-300 hover:text-white focus-visible:outline-2 focus-visible:outline-electric-300"
                        >
                          <span>{title}</span>
                          <ArrowRight
                            className="h-3 w-3 text-electric-300 transition-transform duration-200 group-hover/proj:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    })}
                  </div>
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
 * Follows design system specifications (01 §5.1, 01 §5.4, 02 §3, 03 §7, §10, 04 §5.4, 05 §4):
 * - In "compact" mode (default): identical preview card with stretched link to /experience#id.
 * - In "full" mode: expanded editorial company card with full role descriptions, collapsible
 *   responsibilities and achievements with metrics highlighting, complete tech chip rows, and related projects.
 */
export function ExperienceItem({
  company,
  skillMap,
  projectMap,
  hasExperiencePage = true,
  maxSkills = 4,
  variant = "compact",
  className,
}: ExperienceItemProps) {
  const roles = company.roles ?? [];
  if (roles.length === 0) return null;

  const isMultiRole = roles.length > 1;
  const primaryRole = roles[0];
  const isFull = variant === "full";

  return (
    <Card
      as="article"
      interactive={!isFull}
      className={cn(
        "group flex flex-col justify-between overflow-hidden",
        isFull ? "border-line bg-surface-1 p-6 sm:p-8 lg:p-10" : "p-6 sm:p-8",
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
              projectMap={projectMap}
              maxSkills={maxSkills}
              variant={variant}
            />
          ) : (
            primaryRole && (
              <SingleRoleContent
                role={primaryRole}
                company={company}
                skillMap={skillMap}
                projectMap={projectMap}
                maxSkills={maxSkills}
                variant={variant}
              />
            )
          )}
        </div>
      </div>

      {/* Card Action Link: Read more anchor (only on compact variant) */}
      {!isFull && hasExperiencePage && (
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

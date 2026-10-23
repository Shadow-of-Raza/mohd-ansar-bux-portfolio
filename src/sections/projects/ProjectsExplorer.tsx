"use client";

import React, { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal, FolderSearch } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ProjectCard, type ProjectCardItem } from "@/components/shared/ProjectCard";
import { compareDatesDesc } from "@/lib/utils/dates";
import { cn } from "@/lib/utils/cn";

export type AvailableSkill = {
  id: string;
  name: string;
  icon?: string;
  count: number;
};

export type ProjectsExplorerProps = {
  projects: ProjectCardItem[];
  skillMap: Record<string, { name: string; icon?: string }>;
  availableTypes: string[];
  availableSkills: AvailableSkill[];
  totalCount: number;
  className?: string;
};

/**
 * Format project type identifier into friendly label.
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
 * PROJ-02 Projects Explorer (Client Component).
 * Implements URL-synced search, type filtering, multi-select tech filtering,
 * sorting, result counts, card grid, and empty state.
 */
export function ProjectsExplorer({
  projects,
  skillMap,
  availableTypes,
  availableSkills,
  totalCount,
  className,
}: ProjectsExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Read URL query parameters
  const currentQuery = searchParams.get("q") || "";
  const currentType = searchParams.get("type") || "all";
  const currentTechParam = searchParams.get("tech") || "";
  const currentSort = searchParams.get("sort") || "featured";

  // Parse comma-separated tech IDs
  const selectedTechs = useMemo(() => {
    if (!currentTechParam.trim()) return [];
    return currentTechParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [currentTechParam]);

  // Local state for debounced search input typing
  const [prevQuery, setPrevQuery] = useState(currentQuery);
  const [searchInput, setSearchInput] = useState(currentQuery);

  // Sync state if URL changes externally without an effect (React recommended pattern)
  if (prevQuery !== currentQuery) {
    setPrevQuery(currentQuery);
    setSearchInput(currentQuery);
  }

  /**
   * Helper to update URL search parameters without page jumps.
   */
  const updateUrlParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all" || (key === "sort" && value === "featured")) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const queryString = params.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      startTransition(() => {
        router.replace(newUrl, { scroll: false });
      });
    },
    [pathname, router, searchParams],
  );

  // Debounce search input typing by 200 ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentQuery) {
        updateUrlParams({ q: searchInput.trim() || null });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchInput, currentQuery, updateUrlParams]);

  // Handle Type Filter Selection
  const handleTypeSelect = (type: string) => {
    updateUrlParams({ type: type === currentType ? null : type });
  };

  // Handle Tech Filter Toggle (Multi-Select)
  const handleTechToggle = (skillId: string) => {
    let next: string[];
    if (selectedTechs.includes(skillId)) {
      next = selectedTechs.filter((id) => id !== skillId);
    } else {
      next = [...selectedTechs, skillId];
    }
    updateUrlParams({ tech: next.length > 0 ? next.join(",") : null });
  };

  // Handle Sort Change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrlParams({ sort: e.target.value });
  };

  // Clear All Active Filters
  const handleClearAll = () => {
    setSearchInput("");
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  // Filter & Sort Projects
  const filteredProjects = useMemo(() => {
    const queryLower = currentQuery.toLowerCase().trim();

    return projects
      .filter((project) => {
        // 1. Text Search Match
        if (queryLower) {
          const titleMatch = project.title.toLowerCase().includes(queryLower);
          const summaryMatch = (project.summary || "").toLowerCase().includes(queryLower);
          const taglineMatch = (project.tagline || "").toLowerCase().includes(queryLower);
          const orgMatch = (project.organization?.name || "").toLowerCase().includes(queryLower);

          const techMatch = (project.techStack || []).some((t) => {
            const skillInfo = skillMap[t.skill];
            return (
              t.skill.toLowerCase().includes(queryLower) ||
              (skillInfo?.name && skillInfo.name.toLowerCase().includes(queryLower))
            );
          });

          if (!titleMatch && !summaryMatch && !taglineMatch && !orgMatch && !techMatch) {
            return false;
          }
        }

        // 2. Type Filter Match
        if (currentType !== "all" && project.type !== currentType) {
          return false;
        }

        // 3. Tech Filter Match (matches ANY of selected skills)
        if (selectedTechs.length > 0) {
          const projectSkills = (project.techStack || []).map((t) => t.skill);
          const hasMatchingSkill = selectedTechs.some((techId) => projectSkills.includes(techId));
          if (!hasMatchingSkill) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (currentSort === "newest") {
          return (
            compareDatesDesc(a.timeline?.end || a.timeline?.start, b.timeline?.end || b.timeline?.start) ||
            (a.order ?? Infinity) - (b.order ?? Infinity)
          );
        }
        // Default "featured"
        return (
          Number(b.featured) - Number(a.featured) ||
          (a.order ?? Infinity) - (b.order ?? Infinity) ||
          compareDatesDesc(a.timeline?.end, b.timeline?.end) ||
          compareDatesDesc(a.timeline?.start, b.timeline?.start)
        );
      });
  }, [projects, currentQuery, currentType, selectedTechs, currentSort, skillMap]);

  const hasActiveFilters = Boolean(currentQuery || currentType !== "all" || selectedTechs.length > 0);

  // Presence rule: only render type filter if >= 2 types exist
  const showTypeFilter = availableTypes.length >= 2;

  // Presence rule: only render tech filter if >= 1 skill is used by projects
  const showTechFilter = availableSkills.length > 0;

  return (
    <section
      id="projects-explorer"
      aria-label="Projects Explorer and Filters"
      className={cn("relative w-full pb-[clamp(5rem,10vw,8rem)]", className)}
    >
      <Container>
        {/* =========================================================================
            Filter Controls Bar: Search, Type Chips, Tech Chips, Sort
            ========================================================================= */}
        <div className="mb-10 space-y-6 rounded-md border border-line bg-surface-1/60 p-5 backdrop-blur-sm sm:p-6 lg:p-8">
          {/* Top Row: Search Input & Sort Dropdown */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-md lg:max-w-lg">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-fg-subtle"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, technology, keyword…"
                aria-label="Search projects"
                className="h-12 w-full rounded-sm border border-line bg-surface-2 pr-10 pl-10 font-body text-body text-fg placeholder:text-fg-subtle/60 transition-colors duration-200 focus:border-electric focus:ring-1 focus:ring-electric focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  aria-label="Clear search query"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-xs p-1 text-fg-subtle transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-electric-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-56 shrink-0">
              <Select
                id="projects-sort-select"
                aria-label="Sort projects"
                value={currentSort}
                onChange={handleSortChange}
                options={[
                  { value: "featured", label: "Sort: Featured" },
                  { value: "newest", label: "Sort: Newest" },
                ]}
              />
            </div>
          </div>

          {/* Divider between search and filter chips */}
          {(showTypeFilter || showTechFilter) && (
            <div className="h-px w-full bg-line/60" aria-hidden="true" />
          )}

          {/* Middle Row: Project Type Chips (Presence: >= 2 types exist) */}
          {showTypeFilter && (
            <div className="space-y-2">
              <span className="block font-label text-micro tracking-wider text-fg-subtle uppercase">
                Project Type:
              </span>
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 sm:flex-wrap">
                <Chip
                  active={currentType === "all"}
                  onClick={() => handleTypeSelect("all")}
                >
                  All Types
                </Chip>
                {availableTypes.map((type) => (
                  <Chip
                    key={type}
                    active={currentType === type}
                    onClick={() => handleTypeSelect(type)}
                  >
                    {formatTypeLabel(type)}
                  </Chip>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Filter Row: Tech Multi-Select Chips (Presence: >= 1 used skill) */}
          {showTechFilter && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="block font-label text-micro tracking-wider text-fg-subtle uppercase">
                  Technologies (Multi-select):
                </span>
                {selectedTechs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => updateUrlParams({ tech: null })}
                    className="font-label text-micro text-electric-300 transition-colors hover:text-white"
                  >
                    Clear tech ({selectedTechs.length})
                  </button>
                )}
              </div>
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-1 sm:flex-wrap">
                {availableSkills.map((skill) => {
                  const isSelected = selectedTechs.includes(skill.id);
                  return (
                    <Chip
                      key={skill.id}
                      active={isSelected}
                      onClick={() => handleTechToggle(skill.id)}
                    >
                      <span>{skill.name}</span>
                      <span
                        className={cn(
                          "ml-1 font-label text-micro transition-colors",
                          isSelected ? "text-electric-300" : "text-fg-subtle",
                        )}
                      >
                        {skill.count}
                      </span>
                    </Chip>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            Results Status Bar: Result Count & Active Filter Pills
            ========================================================================= */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-label text-micro tracking-wider text-fg-subtle uppercase">
            <SlidersHorizontal className="h-3.5 w-3.5 text-electric-300" aria-hidden="true" />
            <span>
              Showing{" "}
              <strong className="font-semibold text-white">
                {filteredProjects.length}
              </strong>{" "}
              of {totalCount} {totalCount === 1 ? "project" : "projects"}
            </span>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-8 px-3 text-micro text-electric-300 hover:text-white"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* =========================================================================
            Projects Grid or Empty State
            ========================================================================= */}
        {filteredProjects.length > 0 ? (
          <div
            data-project-grid
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
          >
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                skillMap={skillMap}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-md border border-line border-dashed bg-surface-1/40 py-16 px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface-2 text-fg-subtle">
              <FolderSearch className="h-7 w-7 text-electric-300" aria-hidden="true" />
            </div>
            <h3 className="font-display text-heading text-white">
              No projects match your filters
            </h3>
            <p className="mt-2 max-w-md font-body text-body text-fg-muted">
              We couldn&apos;t find any projects matching your current search or filter combination.
              Try adjusting your query or resetting all filters.
            </p>
            <div className="mt-6">
              <Button variant="primary" onClick={handleClearAll}>
                Clear all filters
              </Button>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}

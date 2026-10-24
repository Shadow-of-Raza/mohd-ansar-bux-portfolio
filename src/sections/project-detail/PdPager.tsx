import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

export type PdPagerItem = {
  slug: string;
  title: string;
  type: string;
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type PdPagerProps = {
  prev: PdPagerItem | null;
  next: PdPagerItem | null;
  className?: string;
};

/**
 * PD-06 Project Pager Navigation (Server Component).
 * Renders previous and next project preview cards with thumbnail teasers
 * and a center link returning to the main projects explorer.
 */
export function PdPager({ prev, next, className }: PdPagerProps) {
  if (!prev && !next) {
    return (
      <section className={cn("w-full border-t border-line py-12", className)}>
        <Container>
          <div className="flex justify-center">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-sm border border-line bg-surface-1 px-5 py-3 font-label text-label text-white transition-colors duration-200 hover:border-electric hover:bg-surface-2"
            >
              <LayoutGrid className="h-4 w-4 text-electric-300" />
              <span>Back to all projects</span>
            </Link>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      id="pd-pager"
      aria-label="Project pager navigation"
      className={cn("w-full border-t border-line bg-surface-1/30 py-12 sm:py-16", className)}
    >
      <Container>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12 lg:items-center">
          {/* Previous Project Card (or spacer if at beginning) */}
          <div className="lg:col-span-5">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex items-center gap-4 rounded-md border border-line bg-surface-1 p-4 sm:p-5 transition-all duration-300 hover:border-electric hover:shadow-card focus-visible:outline-2 focus-visible:outline-electric-300"
              >
                {prev.cover && (
                  <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-xs border border-line bg-surface-2 sm:block">
                    <Image
                      src={prev.cover.src}
                      alt=""
                      width={160}
                      height={100}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-label text-micro text-fg-subtle uppercase tracking-wider">
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1" />
                    <span>Previous project</span>
                  </span>
                  <p className="mt-1 truncate font-display text-body font-semibold text-white transition-colors duration-200 group-hover:text-electric-300">
                    {prev.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="hidden lg:block" aria-hidden="true" />
            )}
          </div>

          {/* Center: Back to All Projects */}
          <div className="flex justify-center order-last sm:col-span-2 sm:order-none lg:col-span-2">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full border border-line bg-surface-1 px-4 py-2 font-label text-micro tracking-wider text-fg-subtle uppercase transition-all duration-200 hover:border-electric hover:text-white"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-electric-300" />
              <span>All projects</span>
            </Link>
          </div>

          {/* Next Project Card (or spacer if at end) */}
          <div className="lg:col-span-5">
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex items-center justify-between gap-4 rounded-md border border-line bg-surface-1 p-4 sm:p-5 transition-all duration-300 hover:border-electric hover:shadow-card focus-visible:outline-2 focus-visible:outline-electric-300 text-right"
              >
                <div className="min-w-0 flex-1">
                  <span className="flex items-center justify-end gap-1.5 font-label text-micro text-fg-subtle uppercase tracking-wider">
                    <span>Next project</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                  <p className="mt-1 truncate font-display text-body font-semibold text-white transition-colors duration-200 group-hover:text-electric-300">
                    {next.title}
                  </p>
                </div>
                {next.cover && (
                  <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-xs border border-line bg-surface-2 sm:block">
                    <Image
                      src={next.cover.src}
                      alt=""
                      width={160}
                      height={100}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
              </Link>
            ) : (
              <div className="hidden lg:block" aria-hidden="true" />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { BackToTop } from "./BackToTop";
import { CurrentYear } from "./CurrentYear";
import { renderAccent } from "@/lib/utils/format";
import type { NavItem } from "@/lib/data/availability";
import type { Contact, Site } from "@/lib/data/schemas";
import type { ServicesData } from "@/lib/data/loaders";

export type FooterProps = {
  site: Site;
  navItems: NavItem[];
  hasContact: boolean;
  contact: Contact | null;
  services: ServicesData | null;
  className?: string;
};

/**
 * Global Footer following the 6-part specification in docs/context/01-project-overview.md §4:
 * 1. CTA line: large heading + email copy + contact button.
 * 2. Brand block: logo + intro copy.
 * 3. Link columns: Pages (HTML sitemap), Services (/services#slug), Connect (socials).
 * 4. Social icons row.
 * 5. Bottom bar: copyright, sitemap.xml link, back-to-top.
 * 6. Signature detail: oversized cropped wordmark of the name across the bottom edge.
 */
export function Footer({
  site,
  navItems,
  hasContact,
  contact,
  services,
  className,
}: FooterProps) {
  const hasCtaHeading = Boolean(site.footer?.ctaTitle);
  const hasEmail = Boolean(contact?.email);
  const showCtaLine = hasCtaHeading || hasEmail || hasContact;
  const showServicesColumn = Boolean(services && services.items.length > 0);
  const showConnectColumn = Boolean(site.socials && site.socials.length > 0);

  return (
    <footer
      className={cn("relative overflow-hidden border-t border-line bg-night pt-20 md:pt-28", className)}
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Site Footer
      </h2>

      <Container className="relative z-10 flex flex-col gap-16 md:gap-24">
        {/* 1. CTA Line */}
        {showCtaLine && (
          <div className="flex flex-col justify-between gap-8 border-b border-line pb-16 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              {hasCtaHeading && (
                <p className="font-display text-display-lg leading-[0.95] text-white">
                  {renderAccent(site.footer?.ctaTitle)}
                </p>
              )}
              {site.role && (
                <p className="mt-3 font-body text-lead text-fg-muted">
                  {site.role} — available for high-impact projects and engineering roles.
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {hasEmail && contact?.email && (
                <CopyButton
                  text={contact.email}
                  label={contact.email}
                  copiedLabel="Email Copied"
                  variant="secondary"
                  size="md"
                  ariaLabel={`Copy email address ${contact.email}`}
                />
              )}

              {hasContact && (
                <LinkButton href="/contact" variant="primary" size="md">
                  Contact me
                </LinkButton>
              )}
            </div>
          </div>
        )}

        {/* 2 & 3. Brand Block & Link Columns */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Block (cols 1–5 on desktop) */}
          <div className="flex flex-col gap-5 sm:col-span-2 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
              aria-label={`${site.name} — Home`}
            >
              {site.logo?.src ? (
                <Image
                  src={site.logo.src}
                  alt={site.logo.alt || site.name}
                  width={site.logo.width || 120}
                  height={site.logo.height || 40}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                <span className="font-display text-xl tracking-wider text-white">
                  {site.logo?.text || site.name}
                </span>
              )}
            </Link>

            {site.footer?.intro && (
              <p className="max-w-sm font-body text-body text-fg-muted">
                {site.footer.intro}
              </p>
            )}

            {/* Social icons row */}
            {showConnectColumn && (
              <div className="mt-2">
                <SocialLinks socials={site.socials} />
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="hidden lg:col-span-1 lg:block" />

          {/* Link Columns */}
          {/* Pages Column (HTML Sitemap) */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h3 className="border-b border-line pb-2 font-label text-micro tracking-[0.08em] text-fg-subtle">
              Pages
            </h3>
            <ul className="flex flex-col space-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-body text-small text-fg-muted transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column (hidden if no visible services exist) */}
          {showServicesColumn && services && (
            <div className="flex flex-col gap-4 lg:col-span-2">
              <h3 className="border-b border-line pb-2 font-label text-micro tracking-[0.08em] text-fg-subtle">
                Services
              </h3>
              <ul className="flex flex-col space-y-2.5">
                {services.items.map((srv) => (
                  <li key={srv.id}>
                    <Link
                      href={`/services#${srv.slug}`}
                      className="font-body text-small text-fg-muted transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
                    >
                      {srv.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Connect Column (social link text list) */}
          {showConnectColumn && (
            <div className="flex flex-col gap-4 lg:col-span-2">
              <h3 className="border-b border-line pb-2 font-label text-micro tracking-[0.08em] text-fg-subtle">
                Connect
              </h3>
              <ul className="flex flex-col space-y-2.5">
                {site.socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-body text-small text-fg-muted transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
                    >
                      <span>{s.label}</span>
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 5. Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-line py-8 sm:flex-row">
          <p className="font-label text-micro tracking-[0.06em] text-fg-subtle">
            © <CurrentYear /> {site.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/sitemap.xml"
              className="font-label text-micro tracking-[0.06em] text-fg-subtle transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
            >
              Sitemap
            </Link>

            <BackToTop />
          </div>
        </div>
      </Container>

      {/* 6. Signature oversized cropped wordmark along the bottom edge */}
      {site.name && (
        <div
          aria-hidden="true"
          className="pointer-events-none -mt-4 w-full select-none overflow-hidden text-center opacity-60 md:-mt-8"
        >
          <span className="inline-block translate-y-[26%] font-display text-[13vw] leading-none tracking-tight text-white/[0.03] uppercase whitespace-nowrap">
            {site.name}
          </span>
        </div>
      )}
    </footer>
  );
}

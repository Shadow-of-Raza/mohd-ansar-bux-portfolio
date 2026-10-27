"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { LinkButton } from "@/components/ui/LinkButton";
import { CopyButton } from "@/components/ui/CopyButton";
import { renderAccent } from "@/lib/utils/format";
import type { Contact, Site } from "@/lib/data/schemas";

export type FooterCtaBandProps = {
  site: Site;
  contact: Contact | null;
  hasContact: boolean;
};

/**
 * Footer CTA Band.
 * Renders the primary CTA band on all pages EXCEPT /contact (where the user
 * is already on the contact page, per item G6).
 */
export function FooterCtaBand({ site, contact, hasContact }: FooterCtaBandProps) {
  const pathname = usePathname();

  // Item G6: On /contact, hide the footer CTA band
  if (pathname === "/contact") {
    return null;
  }

  const hasCtaHeading = Boolean(site.footer?.ctaTitle);
  const hasEmail = Boolean(contact?.email);
  const showCtaLine = hasCtaHeading || hasEmail || hasContact;

  if (!showCtaLine) {
    return null;
  }

  return (
    <div className="flex flex-col justify-between gap-8 border-b border-line pb-16 lg:flex-row lg:items-end">
      <div className="max-w-2xl">
        {hasCtaHeading && (
          <p className="text-display-lg font-display leading-[0.95] text-white">
            {renderAccent(site.footer?.ctaTitle)}
          </p>
        )}
        {site.role && (
          <p className="mt-3 text-lead font-body text-fg-muted">
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
  );
}

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { SocialLinks } from "@/components/shared/SocialLinks";
import { renderAccent } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Site } from "@/lib/data/schemas";

export type ContactDetailsSectionProps = {
  email?: string;
  phone?: string;
  location?: string;
  socials?: Site["socials"];
  ctaTitle?: string;
  className?: string;
};

/**
 * CON-03 Contact Details Section (Server Component).
 * Renders direct communication channels: email with copy action, phone,
 * physical location, and authentic social links.
 * Follows presence rules: hides any channel that is missing or empty.
 * Adheres strictly to docs/context/01 §5.9, 02 §6, and 03 §6-11.
 */
export function ContactDetailsSection({
  email,
  phone,
  location,
  socials = [],
  ctaTitle,
  className,
}: ContactDetailsSectionProps) {
  const hasDirectChannels = Boolean(email || phone || location);
  const hasSocials = Boolean(socials && socials.length > 0);

  if (!hasDirectChannels && !hasSocials) return null;

  return (
    <div className={cn("space-y-8", className)}>
      {/* Editorial Section Subheading */}
      <div>
        <h2 className="font-display text-display-xs text-white sm:text-display-sm">
          {renderAccent(ctaTitle || "Direct Channels")}
        </h2>
        <p className="mt-2 font-body text-body text-fg-muted">
          Prefer reaching out directly? Feel free to send an email, call, or connect on socials.
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="space-y-4">
        {/* Email Card */}
        {email && (
          <div className="flex flex-col gap-3 rounded-md border border-line bg-surface-1 p-5 transition-colors sm:flex-row sm:items-center sm:justify-between hover:border-line-strong">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-electric-300">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <span className="block font-label text-micro tracking-wider uppercase text-fg-subtle">
                  Email
                </span>
                <a
                  href={`mailto:${email}`}
                  className="font-label text-sm text-white transition-colors hover:text-electric-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
                >
                  {email}
                </a>
              </div>
            </div>
            <div className="self-end sm:self-center">
              <CopyButton text={email} label="Copy email" size="sm" />
            </div>
          </div>
        )}

        {/* Phone Card */}
        {phone && (
          <div className="flex items-center gap-3.5 rounded-md border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-electric-300">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="block font-label text-micro tracking-wider uppercase text-fg-subtle">
                Phone
              </span>
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="font-label text-sm text-white transition-colors hover:text-electric-300 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
              >
                {phone}
              </a>
            </div>
          </div>
        )}

        {/* Location Card */}
        {location && (
          <div className="flex items-center gap-3.5 rounded-md border border-line bg-surface-1 p-5 transition-colors hover:border-line-strong">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-electric-300">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <span className="block font-label text-micro tracking-wider uppercase text-fg-subtle">
                Location
              </span>
              <span className="font-body text-sm text-fg">
                {location}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Social Profiles Row */}
      {hasSocials && (
        <div className="pt-4 border-t border-line">
          <span className="block mb-3 font-label text-micro tracking-wider uppercase text-fg-subtle">
            Connect & Follow
          </span>
          <SocialLinks socials={socials} showLabels={true} className="flex-wrap gap-3" />
        </div>
      )}
    </div>
  );
}

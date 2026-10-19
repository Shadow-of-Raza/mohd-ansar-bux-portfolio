import React from "react";
import { Download } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import type { ButtonSize, ButtonVariant } from "@/components/ui/Button";

export type ResumeButtonProps = {
  resume?: {
    file: string;
    label: string;
    updated?: string;
  } | null;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

/**
 * Shared Resume download button.
 * Enforces presence rule: renders nothing if resume or resume.file is missing or empty.
 * Reusable across HOME-01 and ABOUT-06.
 */
export function ResumeButton({ resume, variant = "secondary", size = "md", className }: ResumeButtonProps) {
  if (!resume?.file || resume.file.trim().length === 0) {
    return null;
  }

  const label = resume.label && resume.label.trim().length > 0 ? resume.label : "Download Resume";

  return (
    <LinkButton
      href={resume.file}
      download
      variant={variant}
      size={size}
      icon={<Download className="h-4 w-4" aria-hidden="true" />}
      className={className}
    >
      {label}
    </LinkButton>
  );
}

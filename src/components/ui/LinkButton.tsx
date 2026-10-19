import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ButtonSize, ButtonVariant } from "./Button";

export type LinkButtonProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
  download?: boolean | string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-electric text-white hover:bg-electric-hover active:bg-royal",
  secondary:
    "bg-transparent border border-line-strong text-white hover:border-electric hover:bg-surface-2 active:bg-royal/30",
  ghost: "bg-transparent text-white hover:bg-surface-2 active:bg-royal/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-micro",
  md: "h-12 px-6 text-label",
  lg: "h-14 px-8 text-label",
};

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  external,
  className,
  download,
  onClick,
  children,
}: LinkButtonProps) {
  const isExternal =
    external ?? (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("mailto:"));

  const sharedClasses = cn(
    "group relative inline-flex items-center justify-center gap-2 rounded-sm font-label font-medium select-none transition-colors duration-200",
    "focus-visible:outline-2 focus-visible:outline-electric-300 focus-visible:outline-offset-3",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {isExternal && <span className="sr-only"> (opens in new tab)</span>}
      {trailingIcon && (
        <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">
          {trailingIcon}
        </span>
      )}
    </>
  );

  if (isExternal || download) {
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        download={download}
        onClick={onClick}
        className={sharedClasses}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} onClick={onClick} className={sharedClasses}>
      {content}
    </Link>
  );
}

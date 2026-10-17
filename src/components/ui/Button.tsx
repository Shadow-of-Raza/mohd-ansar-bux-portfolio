import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-electric text-white hover:bg-electric-hover active:bg-royal disabled:hover:bg-electric",
  secondary:
    "bg-transparent border border-line-strong text-white hover:border-electric hover:bg-surface-2 active:bg-royal/30 disabled:hover:border-line-strong disabled:hover:bg-transparent",
  ghost: "bg-transparent text-white hover:bg-surface-2 active:bg-royal/20 disabled:hover:bg-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-micro",
  md: "h-12 px-6 text-label",
  lg: "h-14 px-8 text-label",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  isLoading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 rounded-sm font-label font-medium transition-colors duration-200 select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-electric-300",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-current" />
      ) : (
        icon && <span className="inline-flex shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && trailingIcon && (
        <span className="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">
          {trailingIcon}
        </span>
      )}
    </button>
  );
}

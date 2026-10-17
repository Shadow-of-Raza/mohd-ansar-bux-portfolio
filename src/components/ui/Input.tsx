import React, { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, helperText, className, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-label font-label text-fg-subtle select-none">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "h-12 w-full rounded-sm border bg-surface-1 px-4 text-body font-body text-fg transition-colors duration-200 placeholder:text-fg-subtle/50",
              error
                ? "border-electric-200/60 focus:border-electric-300 focus:ring-1 focus:ring-electric-300 focus:outline-none"
                : "border-line focus:border-electric focus:ring-1 focus:ring-electric focus:outline-none",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
            {...props}
          />
        </div>
        {error ? (
          <p
            id={errorId}
            className="mt-1.5 flex items-center gap-1.5 text-small text-electric-200"
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1.5 text-small text-fg-subtle">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

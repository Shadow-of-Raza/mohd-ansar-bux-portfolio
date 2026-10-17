import React, { useId } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, label, error, helperText, className, disabled, rows = 4, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-2 block text-label font-label text-fg-subtle select-none">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "min-h-[120px] w-full resize-y rounded-sm border bg-surface-1 p-4 text-body font-body text-fg transition-colors duration-200 placeholder:text-fg-subtle/50",
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

Textarea.displayName = "Textarea";

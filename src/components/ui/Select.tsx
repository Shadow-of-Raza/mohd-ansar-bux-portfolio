import React, { useId } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, error, helperText, options, className, disabled, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="mb-2 block text-label font-label text-fg-subtle select-none">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              "h-12 w-full cursor-pointer appearance-none rounded-sm border bg-surface-1 px-4 pr-10 text-body font-body text-fg transition-colors duration-200",
              error
                ? "border-electric-200/60 focus:border-electric-300 focus:ring-1 focus:ring-electric-300 focus:outline-none"
                : "border-line focus:border-electric focus:ring-1 focus:ring-electric focus:outline-none",
              disabled && "cursor-not-allowed opacity-50",
              className,
            )}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-surface-1 text-fg"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-fg-subtle"
            strokeWidth={1.5}
            aria-hidden="true"
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

Select.displayName = "Select";

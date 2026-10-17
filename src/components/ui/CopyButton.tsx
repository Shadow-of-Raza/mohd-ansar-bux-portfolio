"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button, type ButtonSize, type ButtonVariant } from "./Button";

export type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  ariaLabel?: string;
};

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  variant = "secondary",
  size = "md",
  className,
  ariaLabel,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      aria-label={ariaLabel || (copied ? copiedLabel : `${label} ${text}`)}
      className={cn("transition-all duration-200", className)}
      icon={
        copied ? (
          <Check className="animate-in zoom-in-50 h-4 w-4 text-electric-300 duration-150" />
        ) : (
          <Copy className="h-4 w-4 text-fg-muted" />
        )
      }
    >
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </Button>
  );
}

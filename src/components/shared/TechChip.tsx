import React from "react";
import Image from "next/image";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/utils/cn";

export type TechChipProps = {
  name: string;
  icon?: string | null;
  className?: string;
};

/**
 * Reusable technology chip rendering an authentic 14px skill icon
 * with 70% monochrome default state and full brand color fade on hover.
 * Adheres to docs/context/03 §9, §10 and 05 §5.
 */
export function TechChip({ name, icon, className }: TechChipProps) {
  const iconNode = icon ? (
    <span className="relative flex h-3.5 w-3.5 shrink-0 items-center justify-center overflow-hidden">
      <Image
        src={icon}
        alt=""
        width={14}
        height={14}
        className="h-3.5 w-3.5 object-contain grayscale brightness-125 opacity-70 transition-all duration-300 hover:grayscale-0 hover:brightness-100 hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 group-hover:opacity-100"
      />
    </span>
  ) : null;

  return (
    <Chip
      icon={iconNode}
      as="span"
      className={cn("pointer-events-auto select-none border-line/80 bg-surface-2", className)}
    >
      {name}
    </Chip>
  );
}

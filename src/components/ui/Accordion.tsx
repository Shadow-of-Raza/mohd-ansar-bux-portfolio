"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type AccordionItemData = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export type AccordionProps = {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
  defaultExpandedIds?: string[];
};

export function Accordion({
  items,
  allowMultiple = false,
  className,
  defaultExpandedIds = [],
}: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={cn("w-full divide-y divide-line border-y border-line", className)}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);
        const triggerId = `accordion-trigger-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="group">
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isExpanded}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="flex w-full items-center justify-between rounded-xs py-5 text-left transition-colors duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-electric-300"
              >
                <span className="font-title text-title text-fg group-hover:text-white">{item.title}</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-fg-muted transition-transform duration-200 group-hover:text-white",
                    isExpanded && "rotate-180 text-electric-300",
                  )}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </button>
            </h3>
            {isExpanded && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="animate-in fade-in-0 pt-1 pb-6 text-body text-fg-muted duration-200"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

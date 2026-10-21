import React from "react";

/**
 * Parses a string with an optional accent word or phrase enclosed in single asterisks
 * (e.g. "Selected *work*") into React nodes, rendering the accent in Averia Serif Libre italic.
 * Per docs/context/03-design-system.md §5 and 05-data-and-content-flow.md §7.4:
 * Maximum one accent phrase per string.
 */
export function renderAccent(text?: string | null): React.ReactNode {
  if (!text) return null;

  const match = text.match(/^([\s\S]*?)\*([^*]+)\*([\s\S]*)$/);
  if (!match) return text;

  const [, before, accent, after] = match;

  return React.createElement(
    React.Fragment,
    null,
    before,
    React.createElement("em", { className: "font-accent italic font-normal text-electric-300" }, accent),
    after,
  );
}

/**
 * Highlights metrics, numbers, percentages, and multipliers in text
 * with text-electric-300 font-semibold per docs/context/01 §5.4 and 03 §2-4.
 */
export function highlightNumbers(text?: string | null): React.ReactNode {
  if (!text) return null;

  // Matches numbers with optional commas, decimals, plus, percent, multiplier (e.g., 35%, 50,000+, 2.5x, 10+)
  const regex = /(\b\d+(?:,\d+)*(?:\.\d+)?(?:%|\+|x)?\b)/g;
  const parts = text.split(regex);

  if (parts.length <= 1) return text;

  return React.createElement(
    React.Fragment,
    null,
    ...parts.map((part, i) => {
      // Re-test because regex with 'g' can have stateful lastIndex; test a fresh regex
      if (/^\d+(?:,\d+)*(?:\.\d+)?(?:%|\+|x)?$/.test(part)) {
        return React.createElement(
          "span",
          { key: i, className: "font-semibold text-electric-300" },
          part,
        );
      }
      return part;
    }),
  );
}

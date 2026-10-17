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

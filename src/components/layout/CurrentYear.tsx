"use client";

import React, { useSyncExternalStore } from "react";

export type CurrentYearProps = {
  fallback?: number;
};

const emptySubscribe = () => () => {};

/**
 * Client component that renders the current year using useSyncExternalStore.
 * Complies with React 19 and Next.js 16 prerender safety.
 */
export function CurrentYear({ fallback = 2026 }: CurrentYearProps) {
  const year = useSyncExternalStore(
    emptySubscribe,
    () => new Date().getFullYear(),
    () => fallback,
  );

  return <span suppressHydrationWarning>{year}</span>;
}

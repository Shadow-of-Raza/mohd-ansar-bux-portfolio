const FLAG_KEYS = new Set(["visible", "featured", "order", "confidential"]);

/**
 * Returns true if the value contains user-facing content.
 * Flags like visible, featured, order, and confidential do not count as content.
 */
export function hasContent(value: unknown): boolean {
  if (value == null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return true;
  if (typeof value === "boolean") return false; // flags aren't content
  if (Array.isArray(value)) return value.some(hasContent);
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).some(
      ([k, v]) => !FLAG_KEYS.has(k) && hasContent(v),
    );
  }
  return false;
}

/**
 * Returns the list if it has at least one item, otherwise null.
 */
export const nonEmpty = <T>(list: T[] | undefined | null): T[] | null =>
  list && list.length > 0 ? list : null;

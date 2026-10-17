const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export interface DurationResult {
  months: number;
  label: string;
}

/**
 * Parses YYYY-MM or YYYY-MM-DD into year and 1-based month.
 */
export function parseYearMonth(ym: string): { year: number; month: number } {
  const parts = ym.split("-");
  const yearStr = parts[0] ?? "";
  const monthStr = parts[1] ?? "";
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  return { year, month };
}

/**
 * Formats YYYY-MM (or YYYY-MM-DD) into human-readable e.g. "Jan 2025".
 */
export function formatYearMonth(ym: string | null | undefined): string {
  if (!ym) return "";
  const { year, month } = parseYearMonth(ym);
  if (isNaN(year) || isNaN(month) || month < 1 || month > 12) return ym;
  const monthName = MONTH_NAMES[month - 1];
  if (!monthName) return ym;
  return `${monthName} ${year}`;
}

/**
 * Returns month index from an epoch (year * 12 + month).
 */
function getMonthIndex(ym: string): number {
  const { year, month } = parseYearMonth(ym);
  return year * 12 + (month - 1);
}

/**
 * Calculates duration between start (YYYY-MM) and end (YYYY-MM or null for Present).
 */
export function calculateDuration(
  start: string,
  end?: string | null,
  referenceDate = new Date(),
): DurationResult {
  if (!start) return { months: 0, label: "" };

  const startIdx = getMonthIndex(start);
  let endIdx: number;

  if (end) {
    endIdx = getMonthIndex(end);
  } else {
    endIdx = referenceDate.getFullYear() * 12 + referenceDate.getMonth();
  }

  // Inclusive duration in months (e.g., Jan to Jan is 1 month)
  const totalMonths = Math.max(1, endIdx - startIdx + 1);
  const years = Math.floor(totalMonths / 12);
  const remMonths = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  }
  if (remMonths > 0) {
    parts.push(`${remMonths} ${remMonths === 1 ? "mo" : "mos"}`);
  }

  return {
    months: totalMonths,
    label: parts.length > 0 ? parts.join(" ") : "< 1 mo",
  };
}

/**
 * Computes total experience across multiple roles without double-counting overlaps.
 */
export function calculateTotalExperience(
  intervals: { start: string; end?: string | null }[],
  referenceDate = new Date(),
): string {
  if (!intervals.length) return "0 mos";

  const presentIdx = referenceDate.getFullYear() * 12 + referenceDate.getMonth();

  // Convert each role into [startMonth, endMonth]
  const ranges: [number, number][] = intervals
    .filter((i) => Boolean(i.start))
    .map((i) => {
      const s = getMonthIndex(i.start);
      const e = i.end ? getMonthIndex(i.end) : presentIdx;
      return [Math.min(s, e), Math.max(s, e)] as [number, number];
    })
    .sort((a, b) => a[0] - b[0]);

  const firstRange = ranges[0];
  if (!firstRange) return "0 mos";

  // Merge overlapping intervals
  const merged: [number, number][] = [firstRange];
  for (let i = 1; i < ranges.length; i++) {
    const current = ranges[i];
    const last = merged[merged.length - 1];
    if (current && last) {
      if (current[0] <= last[1] + 1) {
        last[1] = Math.max(last[1], current[1]);
      } else {
        merged.push(current);
      }
    }
  }

  // Sum total inclusive months
  const totalMonths = merged.reduce((acc, [s, e]) => acc + (e - s + 1), 0);
  const years = Math.floor(totalMonths / 12);
  const remMonths = totalMonths % 12;

  if (years >= 1) {
    return remMonths > 0 ? `${years}+ years` : `${years} ${years === 1 ? "year" : "years"}`;
  }
  return `${totalMonths} ${totalMonths === 1 ? "mo" : "mos"}`;
}

/**
 * Compare dates in descending order. Null or undefined (present) is treated as newest.
 */
export function compareDatesDesc(a?: string | null, b?: string | null): number {
  if (!a && !b) return 0;
  if (!a) return -1; // a is present, comes first
  if (!b) return 1; // b is present, comes first
  return b.localeCompare(a);
}

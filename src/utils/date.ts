/**
 * Converts a "YYYY-MM" string to a human-readable "Month YYYY" label.
 * Uses UTC to avoid off-by-one-day issues from local timezone offsets.
 */
export function humanizeDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date + "-01"));
}

/**
 * Formats a YYYY-MM start/end pair as a human-readable range.
 * - No end date → "Month YYYY – Present"
 * - Same start and end → "Month YYYY"
 * - Different → "Month YYYY – Month YYYY"
 */
export function formatDateRange(start: string, end?: string): string {
  const startLabel = humanizeDate(start);
  if (!end) return `${startLabel} – Present`;
  if (end === start) return startLabel;
  return `${startLabel} – ${humanizeDate(end)}`;
}

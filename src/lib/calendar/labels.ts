// Pure label/formatter + filter helpers for the calendar UI. All date
// formatting uses UTC because calendar dates are stored at UTC midnight.

import { dayKey } from "@/lib/calendar/group";

/** Long form date, e.g. "Monday, June 16". */
export function formatLongDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Date + time, e.g. "Monday, June 16 at 9:00 AM" (omits " at …" when no time). */
export function formatDateTime(date: Date, time: string | null): string {
  const base = formatLongDate(date);
  return time ? `${base} at ${time}` : base;
}

/** Month + year label for the month-view header, e.g. "June 2026". */
export function formatMonthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Range label for the week-view header, e.g. "Jun 15 – 21" or
 * "Jun 29 – Jul 5" (drops the repeated month on the right side).
 */
export function formatWeekRangeLabel(weekDays: Date[]): string {
  if (weekDays.length === 0) return "";
  const start = weekDays[0];
  const end = weekDays[weekDays.length - 1];
  const startStr = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  const sameMonth =
    start.getUTCMonth() === end.getUTCMonth() &&
    start.getUTCFullYear() === end.getUTCFullYear();
  const endStr = end.toLocaleDateString("en-US", {
    month: sameMonth ? undefined : "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return `${startStr} – ${endStr}`;
}

/** Short weekday label, e.g. "Mon". */
export function formatWeekdayShort(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    timeZone: "UTC",
  });
}

/**
 * Items on or after `from` (UTC day), preserving the pre-sorted input order.
 * Used by the agenda view to show "what needs action next".
 */
export function itemsFrom<T extends { date: Date }>(
  items: T[],
  from: Date,
): T[] {
  const fromKey = dayKey(from);
  return items.filter((it) => dayKey(it.date) >= fromKey);
}

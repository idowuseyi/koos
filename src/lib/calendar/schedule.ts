import type { CalendarItemPlan, CalendarPlan } from "@/lib/ai/calendar-schema";

const DAY_MS = 24 * 60 * 60 * 1000;

/** UTC midnight of the given date (date-only normalization). */
export function utcMidnight(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

/** The upcoming Monday at UTC midnight — today if it's already Monday. */
export function upcomingMonday(from: Date): Date {
  const d = utcMidnight(from);
  const dow = d.getUTCDay(); // 0 Sun … 6 Sat
  const delta = (1 - dow + 7) % 7; // 0 when Monday
  d.setUTCDate(d.getUTCDate() + delta);
  return d;
}

export function itemDate(start: Date, dayOffset: number): Date {
  return new Date(utcMidnight(start).getTime() + dayOffset * DAY_MS);
}

/** Parse a human time ("9:00 AM", "13:30") to minutes-since-midnight for sorting. */
export function parseTimeToMinutes(time: string): number {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!m) return 0;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const mer = m[3]?.toLowerCase();
  if (mer === "pm" && h !== 12) h += 12;
  if (mer === "am" && h === 12) h = 0;
  return h * 60 + min;
}

export interface CalendarRow {
  date: Date;
  time: string;
  platform: string;
  contentType: string;
  title: string;
  brief: string;
  designRequired: boolean;
  designType?: string;
  dimensions?: string;
  sortOrder: number;
}

export interface ScheduledCalendar {
  startDate: Date;
  endDate: Date;
  rows: CalendarRow[];
}

/** Map an AI plan onto concrete dates from `start`, sorted by (date, time). */
export function toCalendarRows(
  plan: CalendarPlan,
  start: Date,
): ScheduledCalendar {
  const startDate = utcMidnight(start);
  const withDates = plan.items.map((it: CalendarItemPlan) => ({
    ...it,
    date: itemDate(startDate, it.dayOffset),
  }));

  withDates.sort((a, b) => {
    const d = a.date.getTime() - b.date.getTime();
    if (d !== 0) return d;
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
  });

  const rows: CalendarRow[] = withDates.map((it, i) => ({
    date: it.date,
    time: it.time,
    platform: it.platform,
    contentType: it.contentType,
    title: it.title,
    brief: it.brief,
    designRequired: it.designRequired,
    designType: it.designType,
    dimensions: it.dimensions,
    sortOrder: i,
  }));

  const endDate = rows.length
    ? rows.reduce((max, r) => (r.date > max ? r.date : max), rows[0].date)
    : startDate;

  return { startDate, endDate, rows };
}

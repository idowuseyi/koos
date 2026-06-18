"use client";

import { dayKey, groupItemsByDay, weekDays } from "@/lib/calendar/group";
import { formatWeekdayShort } from "@/lib/calendar/labels";
import { cn } from "@/lib/utils";
import { CalendarItemCard } from "./calendar-item-card";
import type { CalendarItem } from "./types";

interface WeekViewProps {
  focused: Date;
  items: CalendarItem[];
  today: Date;
  onSelect: (item: CalendarItem) => void;
}

export function WeekView({ focused, items, today, onSelect }: WeekViewProps) {
  const days = weekDays(focused);
  const byDay = groupItemsByDay(items);
  const todayKey = dayKey(today);

  return (
    // On mobile the 7 columns stack into a single column to avoid horizontal
    // scroll; from sm up they become a 7-track grid.
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-7">
      {days.map((day) => {
        const key = dayKey(day);
        const dayItems = byDay.get(key) ?? [];
        const isToday = key === todayKey;
        return (
          <div
            key={key}
            className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-surface-1/40 p-2"
          >
            <div
              className={cn(
                "flex items-baseline gap-1.5 px-1 pb-1",
                isToday && "text-primary",
              )}
            >
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                {formatWeekdayShort(day)}
              </span>
              <span
                className={cn(
                  "text-sm font-semibold",
                  isToday ? "text-primary" : "text-foreground",
                )}
              >
                {day.getUTCDate()}
              </span>
            </div>
            {dayItems.length === 0 ? (
              <p className="px-1 py-2 text-[12px] text-[var(--text-muted)]">
                No items
              </p>
            ) : (
              dayItems.map((item) => (
                <CalendarItemCard
                  key={item.id}
                  item={item}
                  onSelect={onSelect}
                  compact
                />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
}

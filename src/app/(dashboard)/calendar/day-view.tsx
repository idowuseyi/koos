"use client";

import { dayKey, groupItemsByDay } from "@/lib/calendar/group";
import { formatLongDate } from "@/lib/calendar/labels";
import { CalendarItemCard } from "./calendar-item-card";
import type { CalendarItem } from "./types";

interface DayViewProps {
  focused: Date;
  items: CalendarItem[];
  onSelect: (item: CalendarItem) => void;
}

export function DayView({ focused, items, onSelect }: DayViewProps) {
  const dayItems = groupItemsByDay(items).get(dayKey(focused)) ?? [];

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-3">
      <h2 className="text-base font-semibold text-foreground">
        {formatLongDate(focused)}
      </h2>
      {dayItems.length === 0 ? (
        <p className="rounded-xl border border-[var(--border)] bg-surface-1/40 px-4 py-8 text-center text-sm text-[var(--text-muted)]">
          No items scheduled for this day.
        </p>
      ) : (
        dayItems.map((item) => (
          <CalendarItemCard key={item.id} item={item} onSelect={onSelect} />
        ))
      )}
    </div>
  );
}

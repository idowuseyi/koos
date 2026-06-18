"use client";

import { groupItemsByDay } from "@/lib/calendar/group";
import { formatLongDate, itemsFrom } from "@/lib/calendar/labels";
import { CalendarItemCard } from "./calendar-item-card";
import type { CalendarItem } from "./types";

interface AgendaViewProps {
  focused: Date;
  items: CalendarItem[];
  onSelect: (item: CalendarItem) => void;
}

export function AgendaView({ focused, items, onSelect }: AgendaViewProps) {
  const upcoming = itemsFrom(items, focused);
  const byDay = groupItemsByDay(upcoming);

  if (upcoming.length === 0) {
    return (
      <p className="mx-auto max-w-[640px] rounded-xl border border-[var(--border)] bg-surface-1/40 px-4 py-8 text-center text-sm text-[var(--text-muted)]">
        Nothing scheduled from here on.
      </p>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6">
      {[...byDay.entries()].map(([key, dayItems]) => (
        <section key={key} className="flex flex-col gap-2">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            {formatLongDate(dayItems[0].date)}
          </h2>
          {dayItems.map((item) => (
            <CalendarItemCard key={item.id} item={item} onSelect={onSelect} />
          ))}
        </section>
      ))}
    </div>
  );
}

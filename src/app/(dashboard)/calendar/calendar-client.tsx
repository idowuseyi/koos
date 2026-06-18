"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { addDays, dayKey, weekDays } from "@/lib/calendar/group";
import {
  formatLongDate,
  formatMonthLabel,
  formatWeekRangeLabel,
} from "@/lib/calendar/labels";
import { AgendaView } from "./agenda-view";
import { CalendarItemDrawer } from "./calendar-item-drawer";
import { DayView } from "./day-view";
import { MonthView } from "./month-view";
import type {
  CalendarItem,
  CalendarView,
  SerializedCalendar,
  SerializedItem,
} from "./types";
import { ViewToggle } from "./view-toggle";
import { WeekView } from "./week-view";

const VIEWS: CalendarView[] = ["month", "week", "day", "agenda"];

/** UTC midnight of the current day, for "today" highlighting. */
function utcToday(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

interface CalendarClientProps {
  calendar: SerializedCalendar;
  items: SerializedItem[];
}

export function CalendarClient({ calendar, items }: CalendarClientProps) {
  const parsedItems = useMemo<CalendarItem[]>(
    () => items.map((it) => ({ ...it, date: new Date(it.date) })),
    [items],
  );

  // Default focused date = the calendar's start (the generation week has items).
  const defaultDate = useMemo(
    () => dayKey(new Date(calendar.startDate)),
    [calendar.startDate],
  );
  const today = useMemo(utcToday, []);

  // URL state: ?view=… & ?date=YYYY-MM-DD — shareable / back-button friendly.
  const [view, setView] = useQueryState(
    "view",
    parseAsStringLiteral(VIEWS).withDefault("week"),
  );
  const [dateKey, setDateKey] = useQueryState(
    "date",
    parseAsString.withDefault(defaultDate),
  );

  const focused = useMemo(() => new Date(`${dateKey}T00:00:00Z`), [dateKey]);

  const [selected, setSelected] = useState<CalendarItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  function openItem(item: CalendarItem) {
    setSelected(item);
    setDrawerOpen(true);
  }

  function shift(direction: 1 | -1) {
    const step = view === "month" ? null : direction * 7;
    if (step === null) {
      // Move by one month, clamping the day so e.g. Jan 31 → Feb 28.
      const m = focused.getUTCMonth() + direction;
      const next = new Date(Date.UTC(focused.getUTCFullYear(), m, 1));
      setDateKey(dayKey(next));
    } else {
      setDateKey(dayKey(addDays(focused, step)));
    }
  }

  function goToday() {
    setDateKey(dayKey(today));
  }

  const label = useMemo(() => {
    if (view === "month") return formatMonthLabel(focused);
    if (view === "week") return formatWeekRangeLabel(weekDays(focused));
    if (view === "day") return formatLongDate(focused);
    return "Upcoming";
  }, [view, focused]);

  const showNav = view !== "agenda";

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {showNav && (
            <div className="flex items-center gap-1">
              <Button
                variant="icon"
                size="icon"
                aria-label={
                  view === "month" ? "Previous month" : "Previous week"
                }
                onClick={() => shift(-1)}
                className="h-11 w-11 sm:h-9 sm:w-9"
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="icon"
                size="icon"
                aria-label={view === "month" ? "Next month" : "Next week"}
                onClick={() => shift(1)}
                className="h-11 w-11 sm:h-9 sm:w-9"
              >
                <ChevronRight />
              </Button>
              <Button variant="secondary" size="lg" onClick={goToday}>
                Today
              </Button>
            </div>
          )}
          <h1 className="text-lg font-semibold text-foreground">{label}</h1>
        </div>
        <ViewToggle value={view} onChange={(v) => setView(v)} />
      </header>

      {view === "month" && (
        <MonthView
          focused={focused}
          items={parsedItems}
          today={today}
          onSelectDay={(day) => {
            setDateKey(dayKey(day));
            setView("day");
          }}
        />
      )}
      {view === "week" && (
        <WeekView
          focused={focused}
          items={parsedItems}
          today={today}
          onSelect={openItem}
        />
      )}
      {view === "day" && (
        <DayView focused={focused} items={parsedItems} onSelect={openItem} />
      )}
      {view === "agenda" && (
        <AgendaView focused={focused} items={parsedItems} onSelect={openItem} />
      )}

      <CalendarItemDrawer
        item={selected}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}

"use client";

import {
  SegmentedControl,
  type SegmentOption,
} from "@/components/ui/segmented-control";
import type { CalendarView } from "./types";

const OPTIONS: SegmentOption<CalendarView>[] = [
  { label: "Month", value: "month" },
  { label: "Week", value: "week" },
  { label: "Day", value: "day" },
  { label: "Agenda", value: "agenda" },
];

export function ViewToggle({
  value,
  onChange,
}: {
  value: CalendarView;
  onChange: (value: CalendarView) => void;
}) {
  return (
    <SegmentedControl
      options={OPTIONS}
      value={value}
      onChange={onChange}
      className="overflow-x-auto"
    />
  );
}

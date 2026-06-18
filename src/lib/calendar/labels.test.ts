import { describe, expect, it } from "vitest";
import { weekDays } from "./group";
import {
  formatDateTime,
  formatLongDate,
  formatMonthLabel,
  formatWeekdayShort,
  formatWeekRangeLabel,
  itemsFrom,
} from "./labels";

const d = (iso: string) => new Date(`${iso}T00:00:00Z`);

describe("formatLongDate", () => {
  it("formats in UTC regardless of local zone", () => {
    expect(formatLongDate(d("2026-06-16"))).toBe("Tuesday, June 16");
    expect(formatLongDate(d("2026-06-15"))).toBe("Monday, June 15");
  });
});

describe("formatDateTime", () => {
  it("appends time when present", () => {
    expect(formatDateTime(d("2026-06-15"), "9:00 AM")).toBe(
      "Monday, June 15 at 9:00 AM",
    );
  });
  it("omits time when null", () => {
    expect(formatDateTime(d("2026-06-15"), null)).toBe("Monday, June 15");
  });
});

describe("formatMonthLabel", () => {
  it("shows month and year", () => {
    expect(formatMonthLabel(d("2026-06-15"))).toBe("June 2026");
  });
});

describe("formatWeekRangeLabel", () => {
  it("collapses month when start and end share it", () => {
    expect(formatWeekRangeLabel(weekDays(d("2026-06-17")))).toBe("Jun 15 – 21");
  });
  it("keeps both months when the week crosses a boundary", () => {
    expect(formatWeekRangeLabel(weekDays(d("2026-06-30")))).toBe(
      "Jun 29 – Jul 5",
    );
  });
  it("returns empty string for empty input", () => {
    expect(formatWeekRangeLabel([])).toBe("");
  });
});

describe("formatWeekdayShort", () => {
  it("returns short weekday in UTC", () => {
    expect(formatWeekdayShort(d("2026-06-15"))).toBe("Mon");
  });
});

describe("itemsFrom", () => {
  const items = [
    { id: "a", date: d("2026-06-14") },
    { id: "b", date: d("2026-06-15") },
    { id: "c", date: d("2026-06-16") },
  ];
  it("keeps items on or after the boundary day", () => {
    expect(itemsFrom(items, d("2026-06-15")).map((i) => i.id)).toEqual([
      "b",
      "c",
    ]);
  });
  it("includes everything when boundary precedes all items", () => {
    expect(itemsFrom(items, d("2026-01-01"))).toHaveLength(3);
  });
  it("preserves input order", () => {
    const shuffled = [items[2], items[0], items[1]];
    expect(itemsFrom(shuffled, d("2026-06-14")).map((i) => i.id)).toEqual([
      "c",
      "a",
      "b",
    ]);
  });
});

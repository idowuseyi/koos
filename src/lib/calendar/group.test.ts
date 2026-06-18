import { describe, expect, it } from "vitest";
import {
  addDays,
  dayKey,
  groupItemsByDay,
  isSameMonth,
  monthMatrix,
  weekDays,
  weekStart,
} from "./group";

describe("weekStart / weekDays", () => {
  it("finds Monday of the week for any day", () => {
    expect(weekStart(new Date("2026-06-17T00:00:00Z")).toISOString()).toBe(
      "2026-06-15T00:00:00.000Z",
    ); // Wed -> Mon
    expect(weekStart(new Date("2026-06-21T00:00:00Z")).toISOString()).toBe(
      "2026-06-15T00:00:00.000Z",
    ); // Sun -> Mon
  });
  it("returns 7 consecutive days Mon..Sun", () => {
    const days = weekDays(new Date("2026-06-17T00:00:00Z"));
    expect(days).toHaveLength(7);
    expect(dayKey(days[0])).toBe("2026-06-15");
    expect(dayKey(days[6])).toBe("2026-06-21");
  });
});

describe("monthMatrix", () => {
  it("returns 6 weeks of 7 days, Mon-aligned, covering the month", () => {
    const weeks = monthMatrix(new Date("2026-06-10T00:00:00Z"));
    expect(weeks).toHaveLength(6);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    // June 2026 starts on a Monday, so the first cell is June 1.
    expect(dayKey(weeks[0][0])).toBe("2026-06-01");
    // Every day of June appears somewhere.
    const keys = weeks.flat().map(dayKey);
    expect(keys).toContain("2026-06-30");
  });
});

describe("isSameMonth", () => {
  it("compares year+month", () => {
    expect(isSameMonth(new Date("2026-06-01Z"), new Date("2026-06-30Z"))).toBe(
      true,
    );
    expect(isSameMonth(new Date("2026-06-30Z"), new Date("2026-07-01Z"))).toBe(
      false,
    );
  });
});

describe("groupItemsByDay", () => {
  it("buckets items by UTC day, preserving order", () => {
    const items = [
      { date: new Date("2026-06-15T08:00:00Z"), title: "a" },
      { date: new Date("2026-06-15T15:00:00Z"), title: "b" },
      { date: new Date("2026-06-16T09:00:00Z"), title: "c" },
    ];
    const g = groupItemsByDay(items);
    expect(g.get("2026-06-15")?.map((i) => i.title)).toEqual(["a", "b"]);
    expect(g.get("2026-06-16")?.map((i) => i.title)).toEqual(["c"]);
  });
});

describe("addDays", () => {
  it("shifts by whole days", () => {
    expect(dayKey(addDays(new Date("2026-06-15T00:00:00Z"), 7))).toBe(
      "2026-06-22",
    );
    expect(dayKey(addDays(new Date("2026-06-15T00:00:00Z"), -1))).toBe(
      "2026-06-14",
    );
  });
});

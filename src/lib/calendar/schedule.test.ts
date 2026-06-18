import { describe, expect, it } from "vitest";
import {
  itemDate,
  parseTimeToMinutes,
  toCalendarRows,
  upcomingMonday,
  utcMidnight,
} from "./schedule";

describe("upcomingMonday", () => {
  it("returns the same day when it's already Monday", () => {
    const mon = new Date("2026-06-15T10:00:00Z"); // Monday
    expect(upcomingMonday(mon).toISOString()).toBe("2026-06-15T00:00:00.000Z");
  });
  it("jumps to next Monday from a Wednesday", () => {
    const wed = new Date("2026-06-17T10:00:00Z"); // Wednesday
    expect(upcomingMonday(wed).toISOString()).toBe("2026-06-22T00:00:00.000Z");
  });
  it("returns tomorrow from a Sunday", () => {
    const sun = new Date("2026-06-21T23:00:00Z"); // Sunday
    expect(upcomingMonday(sun).toISOString()).toBe("2026-06-22T00:00:00.000Z");
  });
});

describe("itemDate", () => {
  it("adds whole days to the start", () => {
    const start = utcMidnight(new Date("2026-06-15T00:00:00Z"));
    expect(itemDate(start, 0).toISOString()).toBe("2026-06-15T00:00:00.000Z");
    expect(itemDate(start, 8).toISOString()).toBe("2026-06-23T00:00:00.000Z");
  });
});

describe("parseTimeToMinutes", () => {
  it("parses 12-hour and 24-hour times", () => {
    expect(parseTimeToMinutes("9:00 AM")).toBe(540);
    expect(parseTimeToMinutes("12:00 PM")).toBe(720);
    expect(parseTimeToMinutes("12:00 AM")).toBe(0);
    expect(parseTimeToMinutes("13:30")).toBe(810);
  });
  it("falls back to 0 for unparseable input", () => {
    expect(parseTimeToMinutes("whenever")).toBe(0);
  });
});

describe("toCalendarRows", () => {
  const start = new Date("2026-06-15T00:00:00Z"); // Monday
  const plan = {
    items: [
      {
        dayOffset: 2,
        time: "9:00 AM",
        platform: "Instagram",
        contentType: "Reel",
        title: "B",
        brief: "b",
        designRequired: true,
        designType: "Reel",
        dimensions: "1080x1920",
      },
      {
        dayOffset: 0,
        time: "3:00 PM",
        platform: "Blog",
        contentType: "Post",
        title: "A2",
        brief: "a2",
        designRequired: false,
      },
      {
        dayOffset: 0,
        time: "8:00 AM",
        platform: "Email",
        contentType: "Blast",
        title: "A1",
        brief: "a1",
        designRequired: false,
      },
    ],
  };

  it("computes dates, sorts by date then time, and assigns sortOrder", () => {
    const { startDate, endDate, rows } = toCalendarRows(plan, start);
    expect(startDate.toISOString()).toBe("2026-06-15T00:00:00.000Z");
    expect(endDate.toISOString()).toBe("2026-06-17T00:00:00.000Z");
    expect(rows.map((r) => r.title)).toEqual(["A1", "A2", "B"]);
    expect(rows.map((r) => r.sortOrder)).toEqual([0, 1, 2]);
    expect(rows[2].date.toISOString()).toBe("2026-06-17T00:00:00.000Z");
  });
});

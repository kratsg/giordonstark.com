import { describe, expect, it } from "vitest";
import { formatDateRange, humanizeDate } from "./date";

describe("humanizeDate", () => {
  it("formats a mid-year month", () => {
    expect(humanizeDate("2024-08")).toBe("August 2024");
  });

  it("formats January (month boundary)", () => {
    expect(humanizeDate("2026-01")).toBe("January 2026");
  });

  it("formats December (month boundary)", () => {
    expect(humanizeDate("2023-12")).toBe("December 2023");
  });

  it("formats a two-digit year-month", () => {
    expect(humanizeDate("2022-03")).toBe("March 2022");
  });

  it("does not shift dates due to timezone offset", () => {
    // UTC midnight on 2020-10-01 must not bleed into September in any local TZ
    expect(humanizeDate("2020-10")).toBe("October 2020");
  });
});

describe("formatDateRange", () => {
  it("returns 'Month YYYY – Present' when end is absent", () => {
    expect(formatDateRange("2024-08")).toBe("August 2024 – Present");
  });

  it("returns single label when start equals end", () => {
    expect(formatDateRange("2022-06", "2022-06")).toBe("June 2022");
  });

  it("returns full range when start and end differ", () => {
    expect(formatDateRange("2018-08", "2024-07")).toBe(
      "August 2018 – July 2024",
    );
  });

  it("handles same-year range", () => {
    expect(formatDateRange("2023-01", "2023-12")).toBe(
      "January 2023 – December 2023",
    );
  });
});

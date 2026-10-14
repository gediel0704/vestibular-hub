import { describe, expect, it } from "vitest";
import { canAccessEvaluation, checkQuota, eloUpdate, percentile } from "./rules";
describe("Academic business rules", () => {
  it("limits free daily questions to 20", () => {
    expect(checkQuota(false, 19, 1, "daily")).toBe(true);
    expect(checkQuota(false, 20, 1, "daily")).toBe(false);
  });
  it("limits free AI grading to one submission monthly", () => {
    expect(checkQuota(false, 0, 1, "ai")).toBe(true);
    expect(checkQuota(false, 1, 1, "ai")).toBe(false);
  });
  it("restricts teachers to assigned evaluations", () => {
    expect(canAccessEvaluation("teacher", "teacher", "student", "teacher")).toBe(true);
    expect(canAccessEvaluation("other", "teacher", "student", "teacher")).toBe(false);
  });
  it("requires a real minimum cohort", () => {
    expect(percentile(80, [40, 80, 100])).toBeNull();
    expect(percentile(80, [20, 40, 60, 80, 100])).toBe(70);
  });
  it("adjusts pedagogical rating according to answer correctness", () => {
    expect(eloUpdate(1000, 3, true)).toBeGreaterThan(1000);
    expect(eloUpdate(1000, 3, false)).toBeLessThan(1000);
  });
});

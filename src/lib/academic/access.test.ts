import { describe, expect, it } from "vitest";
import { academicRole, canUseAcademicAction } from "./access";

describe("Academic server permissions", () => {
  it("students cannot access teacher corrections or administrative reports", () => {
    expect(canUseAcademicAction("student", "teacher")).toBe(false);
    expect(canUseAcademicAction("student", "admin_data")).toBe(false);
    expect(canUseAcademicAction("student", "library")).toBe(true);
  });
  it("teachers cannot use student preparation or administrative actions", () => {
    expect(canUseAcademicAction("teacher", "start")).toBe(false);
    expect(canUseAcademicAction("teacher", "admin_role")).toBe(false);
    expect(canUseAcademicAction("teacher", "content_review")).toBe(true);
  });
  it("admins access every area and role precedence is deterministic", () => {
    expect(canUseAcademicAction("admin", "teacher")).toBe(true);
    expect(canUseAcademicAction("admin", "library")).toBe(true);
    expect(canUseAcademicAction("admin", "admin_data")).toBe(true);
    expect(academicRole([{ role: "teacher" }, { role: "student" }])).toBe("teacher");
    expect(academicRole([{ role: "teacher" }, { role: "admin" }])).toBe("admin");
  });
});

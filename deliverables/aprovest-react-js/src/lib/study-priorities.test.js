import { describe, expect, it } from "vitest";
import { recommendedMaterials, studyPriorities } from "./study-priorities";
import { resourcesForExam } from "./official-resources";

describe("Academic study recommendations", () => {
  it("keeps ENEM, FUVEST and Unicamp assessments separate", () => {
    const sessions = [
      { exam: "ENEM", status: "completed", score_by_topic: { Matemática: 0.4 } },
      { exam: "FUVEST", status: "completed", score_by_topic: { História: 0 } },
    ];
    expect(studyPriorities(sessions, "ENEM").map((row) => row.subject)).toEqual(["Matemática"]);
  });

  it("uses each subject's latest completed assessment and ranks its performance gap", () => {
    const sessions = [
      { id: "old", exam: "ENEM", status: "completed", completed_at: "2026-10-01", score_by_topic: { Matemática: 0, História: 0.4 } },
      { id: "new", exam: "ENEM", status: "completed", completed_at: "2026-10-14", score_by_topic: { Matemática: 0.9 } },
      { id: "pending", exam: "ENEM", status: "in_progress", completed_at: "2026-10-15", score_by_topic: { História: 1 } },
    ];
    const priorities = studyPriorities(sessions, "ENEM");
    expect(priorities.map((row) => row.subject)).toEqual(["História", "Matemática"]);
    expect(priorities[1].sessionId).toBe("new");
    expect(priorities[0].gap).toBe(0.6);
  });

  it("does not turn missing or invalid results into a diagnosis", () => {
    expect(studyPriorities([], "ENEM")).toEqual([]);
    const sessions = [{ exam: "ENEM", status: "completed", score_by_topic: { A: null, B: 80, C: -1, D: "0.4" } }];
    expect(studyPriorities(sessions, "ENEM")).toEqual([]);
  });

  it("recommends unfinished content from the chosen exam and weak subject first", () => {
    const items = [
      { id: "done", exam: "ENEM", kind: "content", subject: "Matemática", title: "A" },
      { id: "other", exam: "FUVEST", kind: "content", subject: "Matemática", title: "B" },
      { id: "history", exam: "ENEM", kind: "content", subject: "História", title: "C" },
      { id: "math", exam: "ENEM", kind: "content", subject: "Matemática", title: "D" },
    ];
    expect(recommendedMaterials(items, [{ item_id: "done", completed: true }], [{ subject: "Matemática" }], "ENEM").map((item) => item.id)).toEqual(["math", "history"]);
  });

  it("provides official resources for all three target exams without mixing their rubrics", () => {
    for (const exam of ["ENEM", "FUVEST", "Unicamp"]) {
      const resources = resourcesForExam(exam, "Redação");
      expect(resources.length).toBeGreaterThan(0);
      expect(resources.every((resource) => resource.exam === exam)).toBe(true);
    }
  });
});
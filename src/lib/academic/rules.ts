export const EXAMS = ["ENEM", "FUVEST", "Unicamp"] as const;
export function eloUpdate(rating: number, difficulty: number, correct: boolean) {
  const expected = 1 / (1 + 10 ** ((600 + difficulty * 160 - rating) / 400));
  return Math.round(rating + 32 * ((correct ? 1 : 0) - expected));
}
export function percentile(score: number, scores: number[]) {
  if (scores.length < 5) return null;
  const below = scores.filter((value) => value < score).length;
  const tied = scores.filter((value) => value === score).length;
  return Math.round((100 * (below + tied / 2)) / scores.length);
}
export function canAccessEvaluation(
  userId: string,
  role: string,
  owner: string,
  assigned: string | null,
) {
  return userId === owner || role === "admin" || (role === "teacher" && assigned === userId);
}
export function checkQuota(pro: boolean, used: number, requested: number, kind: "daily" | "ai") {
  return pro || used + requested <= (kind === "daily" ? 20 : 1);
}

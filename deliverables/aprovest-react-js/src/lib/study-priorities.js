// Ratios are stored by the academic API on a 0..1 scale, grouped by subject.
// This is a transparent pedagogical heuristic, not TRI or admission prediction.
export function studyPriorities(sessions = [], exam) {
  const relevant = sessions
    .filter((session) => session.status === "completed" && session.exam === exam)
    .sort((left, right) => {
      const leftDate = Date.parse(left.completed_at || left.started_at) || 0;
      const rightDate = Date.parse(right.completed_at || right.started_at) || 0;
      return rightDate - leftDate;
    });
  const subjects = new Map();
  for (const session of relevant) {
    for (const [subject, ratio] of Object.entries(session.score_by_topic ?? {})) {
      if (subjects.has(subject) || typeof ratio !== "number" || !Number.isFinite(ratio)) {
        continue;
      }
      if (ratio < 0 || ratio > 1) {
        continue;
      }
      subjects.set(subject, {
        subject,
        accuracy: ratio,
        gap: 1 - ratio,
        sessionId: session.id,
        assessedAt: session.completed_at || session.started_at,
      });
    }
  }
  return [...subjects.values()].sort((left, right) => {
    return right.gap - left.gap || left.subject.localeCompare(right.subject, "pt-BR");
  });
}

export function recommendedMaterials(items = [], progress = [], priorities = [], exam) {
  const completed = new Set(
    progress.filter((row) => row.completed).map((row) => row.item_id),
  );
  const position = new Map(priorities.map((row, index) => [row.subject, index]));
  return items
    .filter((item) => item.kind === "content" && item.exam === exam && !completed.has(item.id))
    .sort((left, right) => {
      const leftRank = position.get(left.subject) ?? Number.MAX_SAFE_INTEGER;
      const rightRank = position.get(right.subject) ?? Number.MAX_SAFE_INTEGER;
      return leftRank - rightRank || left.title.localeCompare(right.title, "pt-BR");
    })
    .slice(0, 3);
}
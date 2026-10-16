export function academicRole(roles: { role: string }[]) {
  return roles.some((row) => row.role === "admin")
    ? "admin"
    : roles.some((row) => row.role === "teacher")
      ? "teacher"
      : "student";
}

export function canUseAcademicAction(role: string, action: string) {
  if (role === "admin") return true;
  if (["bootstrap", "profile", "notifications", "export", "deletion", "choose_role"].includes(action))
    return true;
  if (action.startsWith("admin_")) return false;
  if (["teacher", "content_review", "human_feedback"].includes(action)) return role === "teacher";
  return role === "student";
}

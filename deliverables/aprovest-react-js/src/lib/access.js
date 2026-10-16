export function roleHome(role) {
  return role === "admin" ? "/admin" : role === "teacher" ? "/professor" : "/dashboard";
}

export function canOpenArea(role, area) {
  return role === "admin" || role === area;
}
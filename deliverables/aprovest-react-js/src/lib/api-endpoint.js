export const DEFAULT_ACADEMIC_API_URL =
  "https://project--e9888714-bf58-47ad-bf20-c65e58ff969c.lovable.app/api/public/academic";

export function academicApiEndpoint(override) {
  return override?.trim() || DEFAULT_ACADEMIC_API_URL;
}
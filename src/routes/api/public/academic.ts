import { createFileRoute } from '@tanstack/react-router';
import { academicApi } from '@/lib/academic/server/api.server';

export const Route = createFileRoute('/api/public/academic')({
  server: { handlers: { POST: ({ request }) => academicApi(request), OPTIONS: ({ request }) => academicApi(request) } },
});
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_diagnostic_questions",
  title: "Listar questões do diagnóstico",
  description:
    "Lista as questões do banco de diagnóstico do AproVest (enunciado, área, matéria, alternativas). Útil para estudar ou revisar conteúdos por área.",
  inputSchema: {
    area: z.string().trim().optional().describe("Filtra por área, ex: Matemática, Linguagens, Humanas, Natureza."),
    limit: z.number().int().optional().describe("Quantidade máxima de questões (padrão 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ area, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const take = Math.min(Math.max(limit ?? 10, 1), 50);
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("diagnostic_questions")
      .select("id,area,subject,statement,choices,difficulty,position")
      .order("position")
      .limit(take);
    if (area) query = query.ilike("area", area);
    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { questions: data ?? [] },
    };
  },
});
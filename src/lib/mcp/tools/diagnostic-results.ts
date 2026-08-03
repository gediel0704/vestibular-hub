import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_diagnostic_results",
  title: "Resultados do diagnóstico",
  description:
    "Retorna os diagnósticos concluídos do estudante autenticado, com pontuação geral e pontuação por área (Matemática, Linguagens, Humanas, Natureza), do mais recente ao mais antigo.",
  inputSchema: {
    limit: z.number().int().optional().describe("Quantidade máxima de tentativas (padrão 5)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const take = Math.min(Math.max(limit ?? 5, 1), 20);
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("diagnostic_attempts")
      .select("id,score,score_by_area,completed_at,status")
      .eq("user_id", ctx.getUserId()!)
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(take);
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const attempts = data ?? [];
    const latest = attempts[0];
    const weakest = latest?.score_by_area
      ? Object.entries(latest.score_by_area as Record<string, number>).sort((a, b) => a[1] - b[1])[0]?.[0]
      : null;
    return {
      content: [{ type: "text", text: JSON.stringify({ attempts, weakest_area: weakest }) }],
      structuredContent: { attempts, weakest_area: weakest },
    };
  },
});
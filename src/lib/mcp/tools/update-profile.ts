import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { notAuthenticated, supabaseForUser } from "../supabase";

export default defineTool({
  name: "update_my_profile",
  title: "Atualizar meu perfil",
  description:
    "Atualiza os dados de estudo do estudante autenticado (nome, curso-alvo, ano do vestibular, escola). Apenas os campos informados são alterados.",
  inputSchema: {
    full_name: z.string().trim().optional().describe("Nome completo do estudante."),
    target_course: z.string().trim().optional().describe("Curso-alvo, ex: Medicina."),
    target_year: z.number().int().optional().describe("Ano do vestibular, ex: 2027."),
    school: z.string().trim().optional().describe("Escola atual."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return notAuthenticated();
    const patch = Object.fromEntries(Object.entries(input).filter(([, v]) => v !== undefined));
    if (Object.keys(patch).length === 0) {
      return { content: [{ type: "text", text: "Nenhum campo informado para atualizar." }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", ctx.getUserId()!)
      .select("full_name,target_course,target_year,school,onboarding_completed")
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? {}) }],
      structuredContent: { profile: data },
    };
  },
});
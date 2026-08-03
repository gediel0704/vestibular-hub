import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfileTool from "./tools/get-profile";
import updateProfileTool from "./tools/update-profile";
import diagnosticResultsTool from "./tools/diagnostic-results";
import listQuestionsTool from "./tools/list-questions";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "aprovest",
  title: "AproVest",
  version: "0.1.0",
  instructions:
    "Ferramentas do AproVest, plataforma de preparação para vestibulares. Use-as para consultar e atualizar o perfil do estudante, ver os resultados do diagnóstico por área e listar questões do banco.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getProfileTool, updateProfileTool, diagnosticResultsTool, listQuestionsTool],
});
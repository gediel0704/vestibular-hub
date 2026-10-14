import { supabase } from "./supabase";

const localApi = "http://localhost:8080/api/public/academic";
const endpoint =
  import.meta.env.VITE_ACADEMIC_API_URL ||
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? localApi
    : `${window.location.origin}/api/public/academic`);

export async function api(action, data = {}, signal) {
  const { data: auth } = await supabase.auth.getSession();
  if (!auth.session) throw new Error("Entre novamente para continuar.");
  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.session.access_token}`,
      },
      body: JSON.stringify({ action, ...data }),
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error(
      "O serviço de estudo não está acessível. Confira a conexão e o endereço da API acadêmica.",
    );
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error(
      response.status === 401
        ? "A API acadêmica ainda precisa ser publicada para funcionar fora do ambiente local."
        : "A API acadêmica retornou uma resposta inválida.",
    );
  }
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Não foi possível concluir.");
  return result;
}

export function downloadJson(data, name) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

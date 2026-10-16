import { supabase } from "./supabase";
import { academicApiEndpoint } from "./api-endpoint";

const endpoint = academicApiEndpoint(import.meta.env.VITE_ACADEMIC_API_URL);

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
      "O serviço de estudo não está acessível. Confira a internet. O responsável precisa publicar a API acadêmica e conferir seu endereço.",
    );
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("O serviço de estudo não respondeu corretamente. O responsável precisa conferir se a API acadêmica foi publicada no endereço configurado.");
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

import { supabase } from "./supabase";

const endpoint =
  import.meta.env.VITE_ACADEMIC_API_URL ||
  "https://id-preview--e9888714-bf58-47ad-bf20-c65e58ff969c.lovable.app/api/public/academic";

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

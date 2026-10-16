import { academicApiEndpoint } from "../src/lib/api-endpoint.js";

const endpoint = academicApiEndpoint(process.env.VITE_ACADEMIC_API_URL);

try {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "bootstrap" }),
    signal: AbortSignal.timeout(15000),
  });
  const json = response.headers.get("content-type")?.includes("application/json");

  if (response.status !== 401 || !json) {
    throw new Error("A API nao respondeu com o contrato de autenticacao esperado.");
  }

  console.log("[OK] API academica hospedada acessivel e protegida por login.");
  console.log("A disponibilidade de IA sera verificada ao solicitar uma correcao.");
} catch (error) {
  console.warn("[AVISO] Nao foi possivel confirmar a conexao com a API.");
  console.warn(error.message);
  console.warn(
    "A interface pode abrir, mas os recursos de estudo precisam de internet e da API publicada.",
  );
  if (process.argv.includes("--obrigatorio")) {
    process.exitCode = 1;
  }
}

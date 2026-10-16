export async function readAcademicStream(response) {
  if (!response.body) {
    throw new Error("O serviço não retornou uma avaliação.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let pending = "";
  let result;

  function readLine(line) {
    if (!line.trim()) return;
    const event = JSON.parse(line);
    if (event.type === "error") {
      throw new Error(event.error || "Não foi possível concluir a avaliação.");
    }
    if (event.type === "result") result = event.data;
  }

  try {
    while (true) {
      const chunk = await reader.read();
      pending += decoder.decode(chunk.value, { stream: !chunk.done });
      const lines = pending.split("\n");
      pending = lines.pop() ?? "";
      lines.forEach(readLine);
      if (chunk.done) break;
    }
    readLine(pending);
    if (!result) throw new Error("A avaliação foi interrompida antes de concluir.");
    return result;
  } finally {
    reader.releaseLock();
  }
}

import { describe, expect, it } from "vitest";
import { readAcademicStream } from "./api-stream";

describe("Resposta de correção em fluxo", () => {
  it("ignora progresso e recupera resultado dividido entre partes", async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('{"type":"progress"}\n{"type":"res'));
        controller.enqueue(encoder.encode('ult","data":{"evaluation":{"status":"completed"}}}\n'));
        controller.close();
      },
    });
    expect(await readAcademicStream(new Response(stream))).toEqual({
      evaluation: { status: "completed" },
    });
  });

  it("não apresenta um fluxo incompleto como avaliação concluída", async () => {
    await expect(readAcademicStream(new Response('{"type":"progress"}\n')))
      .rejects.toThrow("interrompida");
  });

  it("apresenta erro terminal sem repetir a chamada", async () => {
    await expect(readAcademicStream(new Response('{"type":"error","error":"IA indisponível"}\n')))
      .rejects.toThrow("IA indisponível");
  });
});
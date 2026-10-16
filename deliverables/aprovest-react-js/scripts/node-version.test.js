import { describe, expect, it } from "vitest";
import { supportedNodeVersion } from "./node-version.mjs";

describe("Compatibilidade com Node LTS e Vite", () => {
  it("aceita Node 20 somente a partir de 20.19", () => {
    expect(supportedNodeVersion("20.18.3")).toBe(false);
    expect(supportedNodeVersion("20.19.0")).toBe(true);
  });

  it("aceita Node 22 somente a partir de 22.12", () => {
    expect(supportedNodeVersion("22.11.0")).toBe(false);
    expect(supportedNodeVersion("22.12.0")).toBe(true);
  });

  it("aceita Node 24 e rejeita versões antigas ou intermediárias", () => {
    expect(supportedNodeVersion("24.0.0")).toBe(true);
    expect(supportedNodeVersion("18.20.0")).toBe(false);
    expect(supportedNodeVersion("21.7.0")).toBe(false);
  });
});

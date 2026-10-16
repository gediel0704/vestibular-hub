import { describe, expect, it } from "vitest";
import { academicApiEndpoint } from "./api-endpoint";

describe("Academic API connection", () => {
  it("uses the hosted API without requiring a local server on another computer", () => {
    expect(academicApiEndpoint(undefined)).toBe(
      "https://project--e9888714-bf58-47ad-bf20-c65e58ff969c.lovable.app/api/public/academic",
    );
    expect(academicApiEndpoint("  ")).toBe(academicApiEndpoint(undefined));
  });

  it("allows an explicit local API for full local development", () => {
    expect(academicApiEndpoint(" http://localhost:8080/api/public/academic ")).toBe(
      "http://localhost:8080/api/public/academic",
    );
  });
});
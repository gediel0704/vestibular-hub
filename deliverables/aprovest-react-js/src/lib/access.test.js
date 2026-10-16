import { describe, expect, it } from "vitest";
import { canOpenArea, roleHome } from "./access";

describe("Áreas por perfil", () => {
  it("aluno só entra na área de aluno", () => {
    expect(canOpenArea("student", "student")).toBe(true);
    expect(canOpenArea("student", "teacher")).toBe(false);
    expect(canOpenArea("student", "admin")).toBe(false);
    expect(roleHome("student")).toBe("/dashboard");
  });
  it("professor só entra na área docente", () => {
    expect(canOpenArea("teacher", "teacher")).toBe(true);
    expect(canOpenArea("teacher", "student")).toBe(false);
    expect(canOpenArea("teacher", "admin")).toBe(false);
    expect(roleHome("teacher")).toBe("/professor");
  });
  it("administrador pode entrar nas três áreas", () => {
    for (const area of ["student", "teacher", "admin"]) {
      expect(canOpenArea("admin", area)).toBe(true);
    }
    expect(roleHome("admin")).toBe("/admin");
  });
});

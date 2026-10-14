import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [
    { title: "Definir meta — AproVest" },
    { name: "description", content: "Configure seu curso, escola e ano-alvo no AproVest." },
    { property: "og:title", content: "Definir meta — AproVest" },
    { property: "og:description", content: "Configure seu curso, escola e ano-alvo no AproVest." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [targetCourse, setTargetCourse] = useState("");
  const [targetYear, setTargetYear] = useState<number>(new Date().getFullYear() + 1);
  const [school, setSchool] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name,target_course,target_year,school,onboarding_completed")
        .eq("id", u.user.id)
        .maybeSingle();
      if (p) {
        setFullName(p.full_name ?? "");
        setTargetCourse(p.target_course ?? "");
        setTargetYear(p.target_year ?? new Date().getFullYear() + 1);
        setSchool(p.school ?? "");
        if (p.onboarding_completed) navigate({ to: "/dashboard" });
      }
    })();
  }, [navigate]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: u.user.id,
      full_name: fullName,
      target_course: targetCourse,
      target_year: targetYear,
      school,
      onboarding_completed: true,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Perfil salvo!");
    navigate({ to: "/diagnostico" });
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <Link to="/" className="mb-6 inline-block font-display text-xl font-bold">
          Apro<span style={{ color: "var(--brand)" }}>Vest</span>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Conte um pouco sobre você</CardTitle>
            <CardDescription>Isso ajuda a personalizar seu plano de estudos.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="course">Curso-alvo</Label>
                <Input id="course" required placeholder="Ex: Medicina, Engenharia, Direito…" value={targetCourse} onChange={(e) => setTargetCourse(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="year">Ano do vestibular</Label>
                <Input id="year" type="number" min={2026} max={2035} required value={targetYear} onChange={(e) => setTargetYear(Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="school">Escola atual (opcional)</Label>
                <Input id="school" value={school} onChange={(e) => setSchool(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                Salvar e ir ao diagnóstico
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
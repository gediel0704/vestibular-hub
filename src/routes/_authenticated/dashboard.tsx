import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Painel da meta — AproVest" },
      { name: "description", content: "Acompanhe sua meta e evolução acadêmica no AproVest." },
      { property: "og:title", content: "Painel da meta — AproVest" },
      {
        property: "og:description",
        content: "Acompanhe sua meta e evolução acadêmica no AproVest.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

type Profile = {
  full_name: string | null;
  target_course: string | null;
  target_year: number | null;
  onboarding_completed: boolean;
};

type LastAttempt = {
  score: number | null;
  score_by_area: Record<string, number> | null;
  completed_at: string | null;
  status: string;
};

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attempt, setAttempt] = useState<LastAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name,target_course,target_year,onboarding_completed")
        .eq("id", uid)
        .maybeSingle();
      setProfile(prof as Profile | null);

      if (prof && !prof.onboarding_completed) {
        navigate({ to: "/onboarding" });
        return;
      }

      const { data: att } = await supabase
        .from("diagnostic_attempts")
        .select("score,score_by_area,completed_at,status")
        .eq("user_id", uid)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setAttempt(att as LastAttempt | null);
      setLoading(false);
    })();
  }, [navigate]);

  async function handleLogout() {
    await supabase.auth.signOut();
    toast.success("Sessão encerrada.");
    navigate({ to: "/" });
  }

  if (loading) return <div className="p-10 text-muted-foreground">Carregando…</div>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold">
            Apro<span style={{ color: "var(--brand)" }}>Vest</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 space-y-8">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Olá, {profile?.full_name?.split(" ")[0] ?? "estudante"} 👋
          </h1>
          <p className="text-muted-foreground">
            Meta: <strong>{profile?.target_course ?? "—"}</strong>
            {profile?.target_year ? ` • ${profile.target_year}` : ""}
          </p>
        </div>

        {!attempt ? (
          <Card>
            <CardHeader>
              <CardTitle>Faça seu diagnóstico inicial</CardTitle>
              <CardDescription>
                20 questões (~30 min). A partir do resultado, montamos sua fila diária.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/diagnostico">Começar diagnóstico</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Seu último diagnóstico</CardTitle>
              <CardDescription>
                Pontuação geral: <strong>{Math.round((attempt.score ?? 0) * 100)}%</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {attempt.score_by_area &&
                Object.entries(attempt.score_by_area).map(([area, val]) => (
                  <div key={area}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{area}</span>
                      <span className="text-muted-foreground">{Math.round(val * 100)}%</span>
                    </div>
                    <Progress value={val * 100} />
                  </div>
                ))}
              <div className="pt-2">
                <Button asChild variant="outline">
                  <Link to="/diagnostico">Refazer diagnóstico</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Banca Adaptativa</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: sua fila diária personalizada por IA.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Redação Híbrida</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: envie sua redação e receba feedback.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Simulado Preditivo</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Em breve: nota prevista e chance de aprovação.
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, ChartNoAxesCombined, FilePenLine, Target } from "lucide-react";
import { AppHeader } from "../components/Layout";
import { supabase } from "../lib/supabase";
import { StudyLayout } from "../components/StudyLayout";
export default function Dashboard() {
  const [profile, setProfile] = useState(null),
    [attempt, setAttempt] = useState(null),
    [loading, setLoading] = useState(true),
    nav = useNavigate();
  useEffect(() => {
    (async () => {
      const { data: a } = await supabase.auth.getUser();
      if (!a.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("full_name,target_course,target_year,onboarding_completed")
        .eq("id", a.user.id)
        .maybeSingle();
      if (!p?.onboarding_completed) return nav("/onboarding");
      setProfile(p);
      const { data: d } = await supabase
        .from("diagnostic_attempts")
        .select("score,score_by_area")
        .eq("user_id", a.user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setAttempt(d);
      setLoading(false);
    })();
  }, [nav]);
  if (loading) return <main className="center">Montando seu painel…</main>;
  const modules = [
    {
      Icon: BrainCircuit,
      title: "Banca adaptativa",
      description: "Sua revisão diária personalizada.",
      path: "/banca",
    },
    {
      Icon: FilePenLine,
      title: "Caderno de redações",
      description: "Crie, consulte, edite e organize suas redações.",
      path: "/redacoes",
    },
    {
      Icon: ChartNoAxesCombined,
      title: "Simulado preditivo",
      description: "Avaliações cronometradas e histórico de treino.",
      path: "/simulados",
    },
  ];
  return (
    <StudyLayout title="Painel da meta">
      <main className="student">
        <div className="dashboard">
          <span className="kicker">PAINEL DO ALUNO</span>
          <h1>Olá, {profile.full_name?.split(" ")[0] || "estudante"}.</h1>
          <p className="goal">
            <Target size={18} /> Meta: <b>{profile.target_course}</b> · {profile.target_year}
          </p>
          {attempt ? (
            <section className="panel results">
              <div>
                <span>RESULTADO GERAL</span>
                <strong>{Math.round((attempt.score ?? 0) * 100)}%</strong>
              </div>
              <div>
                {Object.entries(attempt.score_by_area ?? {}).map(([area, value]) => (
                  <div className="metric" key={area}>
                    <label>
                      {area}
                      <b>{Math.round(value * 100)}%</b>
                    </label>
                    <i>
                      <em style={{ width: `${value * 100}%` }} />
                    </i>
                  </div>
                ))}
              </div>
              <Link className="btn secondary" to="/diagnostico">
                Refazer diagnóstico
              </Link>
            </section>
          ) : (
            <section className="panel empty">
              <h2>Descubra seu ponto de partida</h2>
              <p>Responda 30 exercícios de fundamentos nas quatro áreas.</p>
              <Link className="btn primary" to="/diagnostico">
                Começar diagnóstico
              </Link>
            </section>
          )}
          <div className="modules">
            {modules.map(({ Icon, title, description, path }) => {
              const content = (
                <>
                  <Icon />
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </>
              );

              return path ? (
                <Link className="panel module-link" key={title} to={path}>
                  {content}
                </Link>
              ) : (
                <article className="panel" key={title}>
                  {content}
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </StudyLayout>
  );
}

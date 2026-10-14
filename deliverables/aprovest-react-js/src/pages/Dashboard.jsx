import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, ChartNoAxesCombined, FilePenLine, Target } from "lucide-react";
import { api } from "../lib/api";
import { StudyLayout, ErrorNotice } from "../components/StudyLayout";
export default function Dashboard() {
  const [profile, setProfile] = useState(null),
    [attempt, setAttempt] = useState(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    nav = useNavigate();
  useEffect(() => {
    Promise.all([api("bootstrap"), api("history")])
      .then(([data, history]) => {
        if (!data.profile?.onboarding_completed) return nav("/onboarding");
        setProfile(data.profile);
        const latest = history.sessions.find((session) => session.status === "completed");
        setAttempt(latest ? { ...latest, score_by_area: latest.score_by_topic } : null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [nav]);
  if (loading) return <main className="center">Montando seu painel…</main>;
  if (error)
    return (
      <StudyLayout title="Painel da meta">
        <ErrorNotice error={error} />
      </StudyLayout>
    );
  if (!profile) return null;
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
    <StudyLayout title={`Olá, ${profile.full_name?.split(" ")[0] || "estudante"}.`}>
      <span className="kicker">PAINEL DO ALUNO</span>
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
    </StudyLayout>
  );
}

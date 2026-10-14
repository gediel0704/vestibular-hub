import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StudyLayout, ErrorNotice, ExamSelect } from "../components/StudyLayout";
import { api } from "../lib/api";
import { OfficialResources } from "../components/OfficialResources";
import { studyPriorities, recommendedMaterials } from "../lib/study-priorities";

export default function StudyPlan() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [exam, setExam] = useState("");
  useEffect(() => {
    let active = true;
    api("bootstrap")
      .then((bootstrap) => {
        if (active) {
          setExam(bootstrap.profile?.target_exam || "ENEM");
        }
      })
      .catch((err) => setError(err.message));
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!exam) {
      return;
    }
    let active = true;
    setError("");
    setData(null);
    Promise.all([api("history"), api("library", { exam })])
      .then(([history, library]) => {
        if (active) {
          setData({ history, library });
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message);
        }
      });
    return () => {
      active = false;
    };
  }, [exam]);
  const priorities = studyPriorities(data?.history.sessions, exam);
  const weak = priorities[0]?.subject;
  const materials = recommendedMaterials(data?.library.items, data?.library.progress, priorities, exam);
  return (
    <StudyLayout title="Seu plano de estudo">
      {exam && <ExamSelect value={exam} onChange={setExam} />}
      <ErrorNotice error={error} />
      {!data && !error && <p>Carregando seu plano…</p>}
      {data && (
        <>
      <p className="goal">
        {weak
          ? `Prioridade atual: ${weak}.`
          : "Comece pelo diagnóstico para identificar suas prioridades."}
      </p>
      {priorities.length > 0 && (
        <section className="priority-section" aria-labelledby="priority-title">
          <h2 id="priority-title">Prioridades por disciplina</h2>
          <p className="muted">Resultado mais recente de cada disciplina em {exam}. Menor taxa de acertos vem primeiro; esta ordem não é uma nota TRI.</p>
          <div className="priority-list">
            {priorities.map((priority, index) => (
              <article className="priority-row" key={priority.subject}>
                <span className="priority-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{priority.subject}</h3>
                  <p className="muted">
                    {Math.round(priority.accuracy * 100)}% de acertos
                    {priority.assessedAt && ` · ${new Date(priority.assessedAt).toLocaleDateString("pt-BR")}`}
                  </p>
                </div>
                <progress value={priority.accuracy} max={1} aria-label={`Acertos em ${priority.subject}`} />
              </article>
            ))}
          </div>
        </section>
      )}
      <ol className="study-steps">
        <li>
          <span className="kicker">01 · AVALIAR E REVISAR</span>
          <h2>{weak ? "Reforce as lacunas" : "Encontre seu ponto de partida"}</h2>
          <Link className="btn primary" to={weak ? "/banca" : "/diagnostico"}>
            {weak ? "Abrir banca diária" : "Fazer diagnóstico"}
          </Link>
        </li>
        <li>
          <span className="kicker">02 · APROFUNDAR</span>
          <h2>Leitura orientada</h2>
          {materials.map((item) => (
            <p key={item.id}>{item.subject} · {item.title}</p>
          ))}
          {!materials.length && <p className="muted">Nenhuma leitura pendente nesta banca. Consulte o programa oficial para ampliar a revisão.</p>}
          <Link className="btn secondary" to="/biblioteca">
            Abrir biblioteca
          </Link>
        </li>
        <li>
          <span className="kicker">03 · ESCREVER</span>
          <h2>Treine sua argumentação</h2>
          <Link className="btn secondary" to="/redacoes">
            Caderno de redações
          </Link>
        </li>
        <li>
          <span className="kicker">04 · MEDIR A EVOLUÇÃO</span>
          <h2>Simulado de treino</h2>
          <Link className="btn secondary" to="/simulados">
            Realizar simulado
          </Link>
        </li>
      </ol>
        </>
      )}
      {exam && <OfficialResources exam={exam} kind="Programa" />}
    </StudyLayout>
  );
}

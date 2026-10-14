import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StudyLayout, ErrorNotice } from "../components/StudyLayout";
import { api } from "../lib/api";

export default function StudyPlan() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([api("history"), api("library")])
      .then(([history, library]) => setData({ history, library }))
      .catch((err) => setError(err.message));
  }, []);
  const latest = data?.history.sessions.find((session) => session.status === "completed");
  const weak = Object.entries(latest?.score_by_topic ?? {}).sort((a, b) => a[1] - b[1])[0]?.[0];
  const materials =
    data?.library.items
      .filter((item) => item.kind === "content" && (!weak || item.subject === weak))
      .slice(0, 3) ?? [];
  return (
    <StudyLayout title="Seu plano de estudo">
      <ErrorNotice error={error} />
      <p className="goal">
        {weak
          ? `Prioridade atual: ${weak}.`
          : "Comece pelo diagnóstico para identificar suas prioridades."}
      </p>
      <ol className="study-steps">
        <li>
          <span className="kicker">01 · AVALIAR E REVISAR</span>
          <h2>{latest ? "Reforce as lacunas" : "Encontre seu ponto de partida"}</h2>
          <Link className="btn primary" to={latest ? "/banca" : "/diagnostico"}>
            {latest ? "Abrir banca diária" : "Fazer diagnóstico"}
          </Link>
        </li>
        <li>
          <span className="kicker">02 · APROFUNDAR</span>
          <h2>Leitura orientada</h2>
          {materials.map((item) => (
            <p key={item.id}>{item.title}</p>
          ))}
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
    </StudyLayout>
  );
}

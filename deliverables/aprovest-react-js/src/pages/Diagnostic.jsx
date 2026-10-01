import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppHeader } from "../components/Layout";
import { supabase } from "../lib/supabase";
export default function Diagnostic() {
  const [questions, setQuestions] = useState([]),
    [attempt, setAttempt] = useState(null),
    [user, setUser] = useState(null),
    [index, setIndex] = useState(0),
    [answers, setAnswers] = useState({}),
    [loading, setLoading] = useState(true),
    nav = useNavigate();
  useEffect(() => {
    (async () => {
      const { data: a } = await supabase.auth.getUser();
      if (!a.user) return;
      setUser(a.user.id);
      const { data: q, error } = await supabase
        .from("diagnostic_questions")
        .select("id,area,subject,statement,choices,correct_key,position")
        .order("position");
      if (error) return toast.error("Não foi possível carregar as questões.");
      setQuestions(q ?? []);
      const { data: old } = await supabase
        .from("diagnostic_attempts")
        .select("id")
        .eq("user_id", a.user.id)
        .eq("status", "in_progress")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (old) setAttempt(old.id);
      else {
        const { data: n, error: e } = await supabase
          .from("diagnostic_attempts")
          .insert({ user_id: a.user.id, status: "in_progress" })
          .select("id")
          .single();
        if (e) return toast.error("Não foi possível iniciar.");
        setAttempt(n.id);
      }
      setLoading(false);
    })();
  }, []);
  async function finish() {
    const rows = questions.map((q) => ({
      attempt_id: attempt,
      user_id: user,
      question_id: q.id,
      selected_key: answers[q.id] ?? "",
      is_correct: answers[q.id] === q.correct_key,
    }));
    const { error } = await supabase
      .from("diagnostic_answers")
      .upsert(rows, { onConflict: "attempt_id,question_id" });
    if (error) return toast.error("Não foi possível salvar.");
    const areas = {};
    let right = 0;
    questions.forEach((q) => {
      areas[q.area] ??= { r: 0, t: 0 };
      areas[q.area].t++;
      if (answers[q.id] === q.correct_key) {
        areas[q.area].r++;
        right++;
      }
    });
    const score_by_area = Object.fromEntries(Object.entries(areas).map(([k, v]) => [k, v.r / v.t]));
    const { error: e } = await supabase
      .from("diagnostic_attempts")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        score: right / questions.length,
        score_by_area,
      })
      .eq("id", attempt);
    e ? toast.error("Não foi possível concluir.") : nav("/dashboard");
  }
  if (loading) return <main className="center">Carregando questões…</main>;
  const q = questions[index];
  if (!q) return <main className="center">Nenhuma questão disponível.</main>;
  const selected = answers[q.id];
  return (
    <>
      <AppHeader />
      <div className="topbar">
        <i style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <main className="student">
        <section className="panel question">
          <span className="kicker">
            {q.area} · {q.subject} · {index + 1}/{questions.length}
          </span>
          <h1>{q.statement}</h1>
          {q.choices.map((c) => (
            <label className={selected === c.key ? "option selected" : "option"} key={c.key}>
              <input
                type="radio"
                name={q.id}
                checked={selected === c.key}
                onChange={() => setAnswers({ ...answers, [q.id]: c.key })}
              />
              <b>{c.key}</b>
              <span>{c.text}</span>
            </label>
          ))}
          <div className="actions spread">
            <button className="btn secondary" disabled={!index} onClick={() => setIndex(index - 1)}>
              Anterior
            </button>
            {index < questions.length - 1 ? (
              <button
                className="btn primary"
                disabled={!selected}
                onClick={() => setIndex(index + 1)}
              >
                Próxima
              </button>
            ) : (
              <button className="btn primary" disabled={!selected} onClick={finish}>
                Concluir diagnóstico
              </button>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

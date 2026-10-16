import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppHeader } from "../components/Layout";
import { supabase } from "../lib/supabase";
import { EXAM_OPTIONS, coursesForExams, normalizeTargetExams } from "../lib/courses";

export default function Onboarding() {
  const year = new Date().getFullYear() + 1;
  const [form, setForm] = useState({
    full_name: "",
    target_course: "",
    target_year: year,
    school: "",
    target_exams: ["ENEM"],
  });
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      const { data: a } = await supabase.auth.getUser();
      if (!a.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", a.user.id)
        .maybeSingle();
      if (data?.onboarding_completed) return nav("/dashboard");
      if (data)
        setForm({
          ...form,
          ...data,
          target_exams: normalizeTargetExams(data.target_exams ?? [data.target_exam]),
        });
    })();
  }, []);

  function toggleExam(exam) {
    const current = form.target_exams.includes(exam)
      ? form.target_exams.filter((item) => item !== exam)
      : [...form.target_exams, exam];
    if (!current.length) return toast.error("Selecione ao menos um vestibular.");
    setForm({ ...form, target_exams: current, target_course: "" });
  }

  async function submit(e) {
    e.preventDefault();
    const { data: a } = await supabase.auth.getUser();
    const exams = normalizeTargetExams(form.target_exams);
    const clean = {
      id: a.user.id,
      full_name: form.full_name.trim().slice(0, 100),
      target_course: form.target_course.trim().slice(0, 100),
      target_year: Number(form.target_year),
      school: form.school.trim().slice(0, 120),
      target_exam: exams[0],
      target_exams: exams,
      onboarding_completed: true,
    };
    if (clean.full_name.length < 2 || clean.target_course.length < 2)
      return toast.error("Preencha nome e curso.");
    const { error } = await supabase.from("profiles").upsert(clean);

    if (error) {
      toast.error("Não foi possível salvar.");
      return;
    }

    nav("/diagnostico");
  }

  const courses = coursesForExams(form.target_exams);

  return (
    <>
      <AppHeader />
      <main className="student">
        <div className="form-page">
          <span className="kicker">PERSONALIZAÇÃO</span>
          <h1>Conte um pouco sobre você</h1>
          <p>Isso ajuda a organizar sua preparação.</p>
          <form className="panel" onSubmit={submit}>
            <label>
              Nome completo
              <input
                required
                maxLength="100"
                value={form.full_name ?? ""}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </label>
            <fieldset className="exam-choice">
              <legend>Vestibulares que você vai prestar (1 a 3)</legend>
              <div className="exam-chips">
                {EXAM_OPTIONS.map((exam) => (
                  <label
                    key={exam}
                    className={
                      form.target_exams.includes(exam) ? "exam-chip selected" : "exam-chip"
                    }
                  >
                    <input
                      type="checkbox"
                      checked={form.target_exams.includes(exam)}
                      onChange={() => toggleExam(exam)}
                    />
                    {exam}
                  </label>
                ))}
              </div>
              <small className="muted">
                Os conteúdos, simulados e bancas de questões serão filtrados pelos vestibulares
                escolhidos.
              </small>
            </fieldset>
            <label>
              Curso-alvo
              <select
                required
                value={form.target_course}
                onChange={(e) => setForm({ ...form, target_course: e.target.value })}
              >
                <option value="">Selecione o curso</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Escola atual (opcional)
              <input
                maxLength="120"
                value={form.school ?? ""}
                onChange={(e) => setForm({ ...form, school: e.target.value })}
              />
            </label>
            <label>
              Ano do vestibular
              <input
                type="number"
                min={new Date().getFullYear()}
                max="2035"
                value={form.target_year}
                onChange={(e) => setForm({ ...form, target_year: e.target.value })}
              />
            </label>
            <button className="btn primary full">Salvar e iniciar diagnóstico</button>
          </form>
        </div>
      </main>
    </>
  );
}

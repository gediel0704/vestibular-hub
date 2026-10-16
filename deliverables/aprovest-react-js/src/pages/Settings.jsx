import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StudyLayout, ErrorNotice } from "../components/StudyLayout";
import { Button } from "../components/Button";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
import { EXAM_OPTIONS, coursesForExams, normalizeTargetExams } from "../lib/courses";

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: authData }, data] = await Promise.all([
          supabase.auth.getUser(),
          api("bootstrap"),
        ]);
        setEmail(authData.user?.email ?? "");
        setProfile({
          ...data.profile,
          target_exams: normalizeTargetExams(
            data.profile?.target_exams ?? [data.profile?.target_exam],
          ),
        });
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  function toggleExam(exam) {
    const current = profile.target_exams.includes(exam)
      ? profile.target_exams.filter((item) => item !== exam)
      : [...profile.target_exams, exam];
    if (!current.length) return toast.error("Selecione ao menos um vestibular.");
    setProfile({ ...profile, target_exams: current, target_course: "" });
  }

  async function saveProfile(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const exams = normalizeTargetExams(profile.target_exams);
      await api("profile", {
        full_name: profile.full_name,
        target_course: profile.target_course,
        target_university: profile.target_university ?? "",
        target_exams: exams,
        notifications_enabled: profile.notifications_enabled ?? true,
        ranking_opt_in: profile.ranking_opt_in ?? false,
      });
      await supabase
        .from("profiles")
        .update({
          school: String(profile.school ?? "").slice(0, 120),
          target_year: Number(profile.target_year) || new Date().getFullYear() + 1,
        })
        .eq("id", profile.id);
      toast.success("Perfil atualizado.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveEmail(e) {
    e.preventDefault();
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ email: email.trim() });
    setBusy(false);
    if (err) return toast.error("Não foi possível alterar o email.");
    toast.success("Enviamos um link de confirmação para o novo email.");
  }

  async function savePassword(e) {
    e.preventDefault();
    if (passwords.next.length < 6 || passwords.next.length > 72)
      return toast.error("A nova senha precisa ter entre 6 e 72 caracteres.");
    if (passwords.next !== passwords.confirm)
      return toast.error("A confirmação não confere com a nova senha.");
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({
      password: passwords.next,
      current_password: passwords.current,
    });
    setBusy(false);
    if (err) return toast.error("Não foi possível alterar a senha. Confira a senha atual.");
    setPasswords({ current: "", next: "", confirm: "" });
    toast.success("Senha alterada com sucesso.");
  }

  if (!profile)
    return (
      <StudyLayout title="Configurações">
        <ErrorNotice error={error} />
        {!error && <p className="muted">Carregando suas configurações…</p>}
      </StudyLayout>
    );

  const courses = coursesForExams(profile.target_exams);

  return (
    <StudyLayout title="Configurações" eyebrow="SUA CONTA">
      <ErrorNotice error={error} />

      <section className="panel settings-section">
        <h2>Perfil e metas</h2>
        <form className="account-form" onSubmit={saveProfile}>
          <label>
            Nome completo
            <input
              required
              maxLength="100"
              value={profile.full_name ?? ""}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </label>
          <fieldset className="exam-choice">
            <legend>Vestibulares-alvo (1 a 3)</legend>
            <div className="exam-chips">
              {EXAM_OPTIONS.map((exam) => (
                <label
                  key={exam}
                  className={
                    profile.target_exams.includes(exam) ? "exam-chip selected" : "exam-chip"
                  }
                >
                  <input
                    type="checkbox"
                    checked={profile.target_exams.includes(exam)}
                    onChange={() => toggleExam(exam)}
                  />
                  {exam}
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            Curso-alvo
            <select
              required
              value={profile.target_course ?? ""}
              onChange={(e) => setProfile({ ...profile, target_course: e.target.value })}
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
            Universidade-alvo (opcional)
            <input
              maxLength="120"
              value={profile.target_university ?? ""}
              onChange={(e) => setProfile({ ...profile, target_university: e.target.value })}
            />
          </label>
          <label>
            Escola atual (opcional)
            <input
              maxLength="120"
              value={profile.school ?? ""}
              onChange={(e) => setProfile({ ...profile, school: e.target.value })}
            />
          </label>
          <label>
            Ano do vestibular
            <input
              type="number"
              min={new Date().getFullYear()}
              max="2035"
              value={profile.target_year ?? ""}
              onChange={(e) => setProfile({ ...profile, target_year: e.target.value })}
            />
          </label>
          <Button disabled={busy}>{busy ? "Salvando…" : "Salvar perfil"}</Button>
        </form>
      </section>

      <section className="panel settings-section">
        <h2>Email de acesso</h2>
        <form className="account-form" onSubmit={saveEmail}>
          <label>
            Email
            <input
              type="email"
              required
              maxLength="255"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <Button disabled={busy}>Alterar email</Button>
        </form>
      </section>

      <section className="panel settings-section">
        <h2>Senha</h2>
        <form className="account-form" onSubmit={savePassword}>
          <label>
            Senha atual
            <input
              type="password"
              required
              minLength="6"
              maxLength="72"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
          </label>
          <label>
            Nova senha
            <input
              type="password"
              required
              minLength="6"
              maxLength="72"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
            />
          </label>
          <label>
            Confirmar nova senha
            <input
              type="password"
              required
              minLength="6"
              maxLength="72"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </label>
          <Button disabled={busy}>Alterar senha</Button>
        </form>
      </section>
    </StudyLayout>
  );
}

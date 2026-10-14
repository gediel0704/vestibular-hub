import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StudyLayout, ErrorNotice, ExamSelect } from "../components/StudyLayout";
import { Button } from "../components/Button";
import { api } from "../lib/api";

const blank = {
  kind: "content",
  title: "",
  exam: "ENEM",
  subject: "",
  topic: "",
  statement: "",
  explanation: "",
  correct_key: "A",
  difficulty: 3,
  published: false,
  origin: "authorial",
  source_url: "",
  choices: [
    { key: "A", text: "" },
    { key: "B", text: "" },
    { key: "C", text: "" },
    { key: "D", text: "" },
  ],
};
export default function Staff({ admin = false }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("items");
  const [form, setForm] = useState(null);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState("");
  const [busy, setBusy] = useState(false);
  const [scholarshipMonth, setScholarshipMonth] = useState("");
  async function load() {
    setError("");
    try {
      setData(await api(admin ? "admin_data" : "teacher"));
    } catch (err) {
      setError(err.message);
    }
  }
  useEffect(() => {
    load();
  }, [admin]);
  async function perform(action, payload) {
    setBusy(true);
    try {
      await api(action, payload);
      toast.success("Atualizado.");
      setForm(null);
      setSelected(null);
      setSummary("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <StudyLayout
      title={admin ? "Administração" : "Correções atribuídas"}
      eyebrow={admin ? "GESTÃO ACADÊMICA" : "ÁREA DO PROFESSOR"}
    >
      <ErrorNotice error={error} retry={load} />
      {admin && (
        <div className="staff-tabs">
          {[
            ["items", "Conteúdos e questões"],
            ["users", "Usuários e papéis"],
            ["evaluations", "Correção humana"],
            ["requests", "Solicitações"],
          ].map(([key, label]) => (
            <Button key={key} variant="secondary" onClick={() => setTab(key)}>
              {label}
            </Button>
          ))}
        </div>
      )}
      {data && admin && tab === "items" && (
        <>
          {!form && <Button onClick={() => setForm({ ...blank })}>Novo conteúdo ou questão</Button>}
          {form ? (
            <form
              className="essay-form"
              onSubmit={(event) => {
                event.preventDefault();
                perform("admin_item", { item: form });
              }}
            >
              <label>
                Tipo
                <select
                  value={form.kind}
                  onChange={(event) => setForm({ ...form, kind: event.target.value })}
                >
                  {[
                    ["content", "Conteúdo"],
                    ["question", "Questão"],
                    ["theme", "Tema de redação"],
                  ].map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <ExamSelect value={form.exam} onChange={(exam) => setForm({ ...form, exam })} />
              {[
                ["title", "Título"],
                ["subject", "Disciplina"],
                ["topic", "Tópico"],
                ["source_url", "Referência oficial (URL)"],
              ].map(([key, label]) => (
                <label key={key}>
                  {label}
                  <input
                    required={key !== "source_url"}
                    value={form[key]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  />
                </label>
              ))}
              <label>
                Texto ou enunciado
                <textarea
                  required
                  value={form.statement}
                  onChange={(event) => setForm({ ...form, statement: event.target.value })}
                />
              </label>
              {form.kind === "question" && (
                <>
                  <label>
                    Dificuldade
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={form.difficulty}
                      onChange={(event) =>
                        setForm({ ...form, difficulty: Number(event.target.value) })
                      }
                    />
                  </label>
                  {form.choices.map((choice, index) => (
                    <label key={choice.key}>
                      Alternativa {choice.key}
                      <input
                        required
                        value={choice.text}
                        onChange={(event) =>
                          setForm({
                            ...form,
                            choices: form.choices.map((row, i) =>
                              i === index ? { ...row, text: event.target.value } : row,
                            ),
                          })
                        }
                      />
                    </label>
                  ))}
                  <label>
                    Gabarito
                    <select
                      value={form.correct_key}
                      onChange={(event) => setForm({ ...form, correct_key: event.target.value })}
                    >
                      {form.choices.map((choice) => (
                        <option key={choice.key}>{choice.key}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Explicação
                    <textarea
                      required
                      value={form.explanation}
                      onChange={(event) => setForm({ ...form, explanation: event.target.value })}
                    />
                  </label>
                </>
              )}
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) => setForm({ ...form, published: event.target.checked })}
                />
                Publicado
              </label>
              <div className="editor-actions">
                <Button variant="secondary" onClick={() => setForm(null)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={busy}>
                  Salvar
                </Button>
              </div>
            </form>
          ) : (
            <div className="history-list">
              {data.items.map((item) => (
                <article key={item.id}>
                  <div>
                    <h3>{item.title}</h3>
                    <span>
                      {item.exam} · {item.topic} · {item.published ? "Publicado" : "Rascunho"}
                    </span>
                  </div>
                  <div className="editor-actions">
                    <Button variant="secondary" onClick={() => setForm({ ...blank, ...item })}>
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (window.confirm("Retirar este item da publicação?"))
                          perform("admin_archive", { id: item.id });
                      }}
                    >
                      Arquivar
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
      {data && admin && tab === "users" && (
        <div className="history-list">
          {data.users.map((user) => (
            <article key={user.id}>
              <div>
                <h3>{user.full_name || "Estudante"}</h3>
                <p>
                  {user.target_course} · {user.target_exam}
                </p>
                <span>
                  {data.roles
                    .filter((row) => row.user_id === user.id)
                    .map((row) => row.role)
                    .join(", ") || "student"}
                </span>
              </div>
              <select
                aria-label={`Atribuir papel a ${user.full_name || "estudante"}`}
                defaultValue=""
                onChange={(event) => {
                  if (event.target.value && window.confirm("Confirmar alteração de acesso?"))
                    perform("admin_role", { userId: user.id, role: event.target.value });
                }}
              >
                <option value="" disabled>
                  Atribuir papel
                </option>
                <option value="student">Aluno</option>
                <option value="teacher">Professor</option>
                <option value="admin">Administrador</option>
              </select>
            </article>
          ))}
        </div>
      )}
      {data && (admin ? tab === "evaluations" : true) && (
        <>
          <div className="history-list">
            {data.evaluations.map((evaluation) => (
              <article key={evaluation.id}>
                <div>
                  <h3>{evaluation.essay_snapshot.title}</h3>
                  <p>
                    {evaluation.exam} · {evaluation.status} · Prazo:{" "}
                    {evaluation.due_at ? new Date(evaluation.due_at).toLocaleString("pt-BR") : "—"}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSelected(evaluation);
                    setSummary(evaluation.feedback?.summary ?? "");
                  }}
                >
                  Abrir redação
                </Button>
                {admin && (
                  <select
                    aria-label="Atribuir corretor"
                    value={evaluation.assigned_to ?? ""}
                    onChange={(event) =>
                      perform("admin_assign", { id: evaluation.id, teacherId: event.target.value })
                    }
                  >
                    <option value="">Selecionar professor</option>
                    {data.users
                      .filter((user) =>
                        data.roles.some((row) => row.user_id === user.id && row.role === "teacher"),
                      )
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.full_name}
                        </option>
                      ))}
                  </select>
                )}
              </article>
            ))}
            {!data.evaluations.length && <p>Nenhuma redação atribuída.</p>}
          </div>
          {selected && (
            <form
              className="essay-form"
              onSubmit={(event) => {
                event.preventDefault();
                perform("human_feedback", { id: selected.id, summary });
              }}
            >
              <h2>{selected.essay_snapshot.title}</h2>
              <p>{selected.essay_snapshot.theme}</p>
              <p className="reading-text">{selected.essay_snapshot.content}</p>
              <label>
                Devolutiva pedagógica
                <textarea
                  minLength="20"
                  required
                  value={summary}
                  onChange={(event) => setSummary(event.target.value)}
                />
              </label>
              <Button type="submit" disabled={busy}>
                Entregar correção humana
              </Button>
            </form>
          )}
        </>
      )}
      {data && admin && tab === "requests" && (
        <div className="history-list">
          {data.requests.map((request) => (
            <article key={request.id}>
              <span>
                {request.kind} · {request.status}
              </span>
              <span>{new Date(request.created_at).toLocaleDateString("pt-BR")}</span>
            </article>
          ))}
          {!data.requests.length && <p>Nenhuma solicitação.</p>}
          <Button variant="secondary" onClick={() => perform("admin_resume_ai", {})}>
            Reativar IA após regularização
          </Button>
          <section className="privacy-actions">
            <h2>Bolsas mensais do ranking</h2>
            <p>Premia até 100 participantes que aceitaram o ranking, usando apenas simulados do mês encerrado.</p>
            <label>
              Mês encerrado
              <input
                type="month"
                value={scholarshipMonth}
                onChange={(event) => setScholarshipMonth(event.target.value)}
              />
            </label>
            <Button
              variant="secondary"
              disabled={!scholarshipMonth || busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const result = await api("admin_award_scholarships", {
                    month: `${scholarshipMonth}-01`,
                  });
                  toast.success(`${result.awarded} bolsa(s) concedida(s).`);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setBusy(false);
                }
              }}
            >
              Conceder bolsas do mês
            </Button>
          </section>
          <p className="muted">
            Pagamentos e relatórios financeiros dependem da configuração do serviço de cobrança.
          </p>
        </div>
      )}
    </StudyLayout>
  );
}

import { useEffect, useMemo, useState } from "react";
import { FilePenLine, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { AppHeader } from "../components/Layout";
import { supabase } from "../lib/supabase";

const emptyForm = {
  title: "",
  theme: "",
  content: "",
  status: "draft",
};

const statusLabels = {
  draft: "Rascunho",
  submitted: "Enviada",
  corrected: "Corrigida",
};

function countWords(text) {
  const cleanText = text.trim();

  if (!cleanText) {
    return 0;
  }

  return cleanText.split(/\s+/).length;
}

function validateEssay(form) {
  const title = form.title.trim();
  const theme = form.theme.trim();
  const content = form.content.trim();
  const wordCount = countWords(content);

  if (title.length < 3 || title.length > 120) {
    return "O título deve ter entre 3 e 120 caracteres.";
  }

  if (theme.length < 3 || theme.length > 180) {
    return "O tema deve ter entre 3 e 180 caracteres.";
  }

  if (content.length < 20 || content.length > 12000) {
    return "A redação deve ter entre 20 e 12.000 caracteres.";
  }

  if (wordCount > 2500) {
    return "A redação deve ter no máximo 2.500 palavras.";
  }

  if (!["draft", "submitted"].includes(form.status)) {
    return "Selecione uma situação válida.";
  }

  return null;
}

export default function Essays() {
  const [essays, setEssays] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    loadEssays();
  }, []);

  async function loadEssays() {
    setLoading(true);

    const { data, error } = await supabase
      .from("essays")
      .select("id,title,theme,content,status,word_count,created_at,updated_at")
      .order("updated_at", { ascending: false });

    if (error) {
      toast.error("Não foi possível carregar suas redações.");
    } else {
      setEssays(data ?? []);
    }

    setLoading(false);
  }

  const visibleEssays = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");

    return essays.filter((essay) => {
      const matchesStatus = statusFilter === "all" || essay.status === statusFilter;
      const matchesSearch =
        !term ||
        essay.title.toLocaleLowerCase("pt-BR").includes(term) ||
        essay.theme.toLocaleLowerCase("pt-BR").includes(term);

      return matchesStatus && matchesSearch;
    });
  }, [essays, search, statusFilter]);

  function startCreating() {
    setEditingId(null);
    setForm(emptyForm);
    setShowEditor(true);
  }

  function startEditing(essay) {
    setEditingId(essay.id);
    setForm({
      title: essay.title,
      theme: essay.theme,
      content: essay.content,
      status: essay.status === "corrected" ? "submitted" : essay.status,
    });
    setShowEditor(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeEditor() {
    setEditingId(null);
    setForm(emptyForm);
    setShowEditor(false);
  }

  function updateField(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function saveEssay(event) {
    event.preventDefault();

    const validationMessage = validateEssay(form);

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setSaving(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setSaving(false);
      toast.error("Sua sessão expirou. Entre novamente.");
      return;
    }

    const essayData = {
      user_id: authData.user.id,
      title: form.title.trim(),
      theme: form.theme.trim(),
      content: form.content.trim(),
      status: form.status,
      word_count: countWords(form.content),
    };

    const query = editingId
      ? supabase.from("essays").update(essayData).eq("id", editingId)
      : supabase.from("essays").insert(essayData);

    const { error } = await query;

    setSaving(false);

    if (error) {
      toast.error("Não foi possível salvar a redação.");
      return;
    }

    toast.success(editingId ? "Redação atualizada." : "Redação criada.");
    closeEditor();
    await loadEssays();
  }

  async function deleteEssay(essay) {
    const confirmed = window.confirm(
      `Deseja excluir a redação “${essay.title}”? Esta ação não pode ser desfeita.`,
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase.from("essays").delete().eq("id", essay.id);

    if (error) {
      toast.error("Não foi possível excluir a redação.");
      return;
    }

    setEssays((currentEssays) =>
      currentEssays.filter((currentEssay) => currentEssay.id !== essay.id),
    );
    toast.success("Redação excluída.");
  }

  const currentWordCount = countWords(form.content);

  return (
    <>
      <AppHeader />
      <main className="student">
        <div className="dashboard">
          <Link className="back-link" to="/dashboard">
            ← Voltar ao painel
          </Link>

          <div className="page-heading">
            <div>
              <span className="kicker">CADERNO DE REDAÇÕES</span>
              <h1>Suas redações</h1>
              <p>Organize rascunhos e acompanhe os textos enviados.</p>
            </div>

            {!showEditor && (
              <button className="btn primary" type="button" onClick={startCreating}>
                <Plus size={18} />
                Nova redação
              </button>
            )}
          </div>

          {showEditor ? (
            <form className="panel essay-form" onSubmit={saveEssay}>
              <h2>{editingId ? "Editar redação" : "Nova redação"}</h2>

              <label>
                Título
                <input
                  maxLength="120"
                  minLength="3"
                  name="title"
                  onChange={updateField}
                  required
                  value={form.title}
                />
              </label>

              <label>
                Tema
                <input
                  maxLength="180"
                  minLength="3"
                  name="theme"
                  onChange={updateField}
                  required
                  value={form.theme}
                />
              </label>

              <label>
                Situação
                <select name="status" onChange={updateField} value={form.status}>
                  <option value="draft">Rascunho</option>
                  <option value="submitted">Enviada</option>
                </select>
              </label>

              <label>
                Texto da redação
                <textarea
                  maxLength="12000"
                  minLength="20"
                  name="content"
                  onChange={updateField}
                  required
                  value={form.content}
                />
              </label>

              <div className="editor-meta">
                <span>{form.content.length}/12.000 caracteres</span>
                <span>{currentWordCount}/2.500 palavras</span>
              </div>

              <div className="editor-actions">
                <button className="btn secondary" type="button" onClick={closeEditor}>
                  Cancelar
                </button>
                <button className="btn primary" disabled={saving} type="submit">
                  {saving ? "Salvando…" : "Salvar redação"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="essay-toolbar">
                <label>
                  <span className="visually-hidden">Buscar redação</span>
                  <input
                    maxLength="120"
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar por título ou tema"
                    type="search"
                    value={search}
                  />
                </label>

                <select
                  aria-label="Filtrar por situação"
                  onChange={(event) => setStatusFilter(event.target.value)}
                  value={statusFilter}
                >
                  <option value="all">Todas as situações</option>
                  <option value="draft">Rascunhos</option>
                  <option value="submitted">Enviadas</option>
                  <option value="corrected">Corrigidas</option>
                </select>
              </div>

              {loading ? (
                <section className="panel empty-state">Carregando redações…</section>
              ) : (
                <div className="essay-grid">
                  {visibleEssays.length ? (
                    visibleEssays.map((essay) => (
                      <article className="panel essay-card" key={essay.id}>
                        <span className={`status status-${essay.status}`}>
                          {statusLabels[essay.status] ?? essay.status}
                        </span>
                        <h2>{essay.title}</h2>
                        <p className="essay-theme">{essay.theme}</p>
                        <p className="essay-excerpt">
                          {essay.content.length > 180
                            ? `${essay.content.slice(0, 180)}…`
                            : essay.content}
                        </p>
                        <div className="essay-meta">
                          <span>{essay.word_count} palavras</span>
                          <span>
                            Atualizada em {new Date(essay.updated_at).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <div className="essay-actions">
                          <button
                            className="btn secondary"
                            type="button"
                            onClick={() => startEditing(essay)}
                          >
                            Visualizar e editar
                          </button>
                          <button
                            className="btn danger"
                            type="button"
                            onClick={() => deleteEssay(essay)}
                          >
                            Excluir
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <section className="panel empty-state">
                      {search || statusFilter !== "all" ? (
                        <Search size={34} />
                      ) : (
                        <FilePenLine size={34} />
                      )}
                      <h2>
                        {search || statusFilter !== "all"
                          ? "Nenhuma redação encontrada"
                          : "Seu caderno está vazio"}
                      </h2>
                      <p>
                        {search || statusFilter !== "all"
                          ? "Altere a busca ou o filtro para ver outros resultados."
                          : "Crie sua primeira redação para começar a organizar seus textos."}
                      </p>
                      {!search && statusFilter === "all" && (
                        <button className="btn primary" type="button" onClick={startCreating}>
                          <Plus size={18} />
                          Criar primeira redação
                        </button>
                      )}
                    </section>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

import { NavLink } from "react-router-dom";
import { AppHeader } from "./Layout";
import { Button } from "./Button";
import { useAuth } from "../contexts/AuthContext";

const groups = [
  {
    label: "Estudos",
    links: [
      ["/dashboard", "Painel"],
      ["/biblioteca", "Conteúdos"],
      ["/plano", "Plano de estudo"],
    ],
  },
  {
    label: "Prática",
    links: [
      ["/questoes-enem", "Questões ENEM"],
      ["/banca", "Banca diária"],
      ["/simulados", "Simulados"],
    ],
  },
  {
    label: "Acompanhamento",
    links: [
      ["/redacoes", "Redações"],
      ["/historico", "Histórico"],
      ["/notificacoes", "Notificações"],
    ],
  },
  {
    label: "Conta",
    links: [
      ["/perfil", "Perfil"],
      ["/configuracoes", "Configurações"],
      ["/planos", "Assinatura"],
    ],
  },
];

export function StudyLayout({ title, eyebrow = "SUA PREPARAÇÃO", children }) {
  const { role } = useAuth();
  const studentGroups = role === "student" || role === "admin" ? groups : [];
  return (
    <>
      <AppHeader />
      <nav className="study-nav" aria-label="Preparação">
        {studentGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <button type="button" className="nav-group-toggle" aria-haspopup="true">
              {group.label} ▾
            </button>
            <div className="nav-group-menu">
              {group.links.map(([path, label]) => (
                <NavLink key={path} to={path}>
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
        {["teacher", "admin"].includes(role) && <NavLink to="/professor">Área docente</NavLink>}
        {role === "admin" && <NavLink to="/admin">Administração</NavLink>}
        {role === "teacher" && <NavLink to="/perfil">Perfil</NavLink>}
        {role === "teacher" && <NavLink to="/notificacoes">Notificações</NavLink>}
      </nav>
      <main className="student">
        <div className="dashboard">
          <span className="kicker">{eyebrow}</span>
          <h1>{title}</h1>
          {children}
        </div>
      </main>
    </>
  );
}

export function ErrorNotice({ error, retry }) {
  if (!error) return null;
  return (
    <div className="error-notice" role="alert">
      <p>{error}</p>
      {retry && (
        <Button variant="secondary" onClick={retry}>
          Tentar novamente
        </Button>
      )}
    </div>
  );
}

export function ExamSelect({ value, onChange }) {
  return (
    <label className="exam-select">
      Vestibular
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {["ENEM", "FUVEST", "Unicamp"].map((exam) => (
          <option key={exam}>{exam}</option>
        ))}
      </select>
    </label>
  );
}

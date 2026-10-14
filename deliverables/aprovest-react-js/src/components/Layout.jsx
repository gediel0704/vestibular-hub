import { Link, NavLink, Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
export const Brand = () => (
  <Link to="/" className="brand">
    <b>A</b>
    <span>
      Apro<strong>Vest</strong>
    </span>
  </Link>
);
export function PublicLayout({ children }) {
  const { user } = useAuth();
  return (
    <>
      <header>
        <div className="container nav">
          <Brand />
          <nav>
            <NavLink to="/" end>
              Início
            </NavLink>
            <NavLink to="/sobre">Sobre</NavLink>
            <Link className="btn primary" to={user ? "/dashboard" : "/auth"}>
              {user ? "Meu painel" : "Entrar"}
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer>
        <div className="container">
          <Brand />
          <span>© {new Date().getFullYear()} AproVest · Projeto acadêmico</span>
        </div>
      </footer>
    </>
  );
}
export function Protected({ children }) {
  const { user, loading } = useAuth(),
    loc = useLocation();
  if (loading) return <main className="center">Carregando…</main>;
  return user ? (
    children
  ) : (
    <Navigate to={`/auth?next=${encodeURIComponent(loc.pathname)}`} replace />
  );
}
export function AppHeader() {
  const nav = useNavigate();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const value = localStorage.getItem("aprovest-theme") === "dark";
    setDark(value);
    document.documentElement.dataset.theme = value ? "dark" : "light";
  }, []);
  return (
    <header>
      <div className="container nav">
        <Brand />
        <nav>
          <Link to="/dashboard">Painel</Link>
          <button
            className="icon"
            aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
            title={dark ? "Ativar tema claro" : "Ativar tema escuro"}
            onClick={() => {
              const next = !dark;
              setDark(next);
              document.documentElement.dataset.theme = next ? "dark" : "light";
              localStorage.setItem("aprovest-theme", next ? "dark" : "light");
            }}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          <button
            className="icon"
            title="Sair"
            onClick={async () => {
              await supabase.auth.signOut();
              nav("/");
            }}
          >
            <LogOut size={19} />
          </button>
        </nav>
      </div>
    </header>
  );
}

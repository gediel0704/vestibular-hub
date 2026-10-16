import { useEffect, useState } from "react";
import { Apple, GraduationCap, BookOpenCheck } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { Brand } from "../components/Layout";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
import { roleHome, canOpenArea } from "../lib/access";
import heroImage from "../assets/estudantes-hero.jpg";

const DEFAULT_OAUTH_BROKER =
  "https://id-preview--e9888714-bf58-47ad-bf20-c65e58ff969c.lovable.app/~oauth/initiate";

const social = createLovableAuth({
  oauthBrokerUrl: import.meta.env.VITE_OAUTH_BROKER_URL || DEFAULT_OAUTH_BROKER,
});

const valid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function Auth() {
  const [mode, setMode] = useState("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRoleChoice] = useState("student");
  const [busy, setBusy] = useState(false);
  const [params] = useSearchParams();
  const nav = useNavigate();

  const raw = params.get("next");
  const next = raw?.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";

  async function enter() {
    const { role: userRole } = await api("bootstrap");
    const area = next === "/admin" ? "admin" : next === "/professor" ? "teacher" : "student";
    nav(raw && canOpenArea(userRole, area) ? next : roleHome(userRole), { replace: true });
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => data.session && enter())
      .catch(() => toast.error("Não foi possível verificar sua área. Tente novamente."));
  }, [nav, next]);

  async function submit(e) {
    e.preventDefault();
    if (!valid(email) || password.length < 6 || password.length > 72)
      return toast.error("Revise o email e a senha.");
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setBusy(false);
      if (error) return toast.error("Email ou senha inválidos.");
      try {
        await enter();
      } catch (error) {
        toast.error(error.message);
      }
      return;
    }
    if (name.trim().length < 2) {
      setBusy(false);
      return toast.error("Informe seu nome.");
    }
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth`,
        data: { full_name: name.trim().slice(0, 100) },
      },
    });
    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }

    if (data.session) {
      try {
        await api("choose_role", { role });
      } catch {
        toast.error("Conta criada, mas não foi possível definir o perfil agora.");
      }
      setBusy(false);
      nav("/onboarding");
      return;
    }

    setBusy(false);
    toast.success("Confirme seu email para entrar. Seu perfil será definido no primeiro acesso.");
  }

  async function oauth(provider) {
    setBusy(true);
    try {
      const r = await social.signInWithOAuth(provider, {
        redirect_uri: `${location.origin}/auth?next=${encodeURIComponent(next)}`,
      });
      if (r.error) {
        return toast.error("Não foi possível continuar. Tente novamente.");
      }
      if (!r.redirected && r.tokens) {
        const { error } = await supabase.auth.setSession(r.tokens);
        if (error) return toast.error("Não foi possível concluir o login.");
        await enter();
      }
    } catch {
      toast.error("O login social foi interrompido. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth">
      <div className="auth-wrap">
        <Brand />
        <div className="auth-grid">
          <section className="panel">
            <span className="kicker">ACESSO APROVEST</span>
            <h1>Sua jornada até a aprovação</h1>
            <p>Entre ou crie sua conta gratuita.</p>
            <button
              className="btn secondary full social-button"
              disabled={busy}
              onClick={() => oauth("google")}
            >
              <span className="google-mark" aria-hidden="true">
                G
              </span>
              Continuar com Google
            </button>
            <button
              className="btn secondary full social-button"
              disabled={busy}
              onClick={() => oauth("apple")}
            >
              <Apple size={19} aria-hidden="true" />
              Continuar com Apple
            </button>
            <div className="tabs">
              <button className={mode === "in" ? "active" : ""} onClick={() => setMode("in")}>
                Entrar
              </button>
              <button className={mode === "up" ? "active" : ""} onClick={() => setMode("up")}>
                Criar conta
              </button>
            </div>
            <form onSubmit={submit}>
              {mode === "up" && (
                <>
                  <label>
                    Nome completo
                    <input
                      required
                      maxLength="100"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <fieldset className="role-choice">
                    <legend>Quero usar o AproVest como</legend>
                    <label className={role === "student" ? "role-card selected" : "role-card"}>
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={role === "student"}
                        onChange={() => setRoleChoice("student")}
                      />
                      <GraduationCap size={22} aria-hidden="true" />
                      <span>
                        <b>Aluno</b>
                        <small>Estudar, fazer simulados e redações.</small>
                      </span>
                    </label>
                    <label className={role === "teacher" ? "role-card selected" : "role-card"}>
                      <input
                        type="radio"
                        name="role"
                        value="teacher"
                        checked={role === "teacher"}
                        onChange={() => setRoleChoice("teacher")}
                      />
                      <BookOpenCheck size={22} aria-hidden="true" />
                      <span>
                        <b>Professor</b>
                        <small>Corrigir redações e avaliar conteúdos.</small>
                      </span>
                    </label>
                  </fieldset>
                </>
              )}
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
              <label>
                Senha
                <input
                  type="password"
                  required
                  minLength="6"
                  maxLength="72"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
              {mode === "in" && <Link to="/senha">Esqueci minha senha</Link>}
              <button className="btn primary full" disabled={busy}>
                {busy ? "Aguarde…" : mode === "in" ? "Entrar" : "Criar conta"}
              </button>
            </form>
          </section>
          <figure className="auth-photo">
            <img
              src={heroImage}
              alt="Estudantes brasileiros estudando juntos em uma biblioteca"
              width={1280}
              height={960}
            />
            <figcaption>
              Diagnóstico, banca adaptativa e redação com correção — tudo alinhado ao ENEM, à
              FUVEST e à Unicamp.
            </figcaption>
          </figure>
        </div>
        <Link to="/">← Voltar ao início</Link>
      </div>
    </main>
  );
}

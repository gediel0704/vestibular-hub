import { useEffect, useState } from "react";
import { Apple } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";
import { Brand } from "../components/Layout";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";
import { roleHome, canOpenArea } from "../lib/access";
const DEFAULT_OAUTH_BROKER =
  "https://id-preview--e9888714-bf58-47ad-bf20-c65e58ff969c.lovable.app/~oauth/initiate";
const social = createLovableAuth({
  oauthBrokerUrl: import.meta.env.VITE_OAUTH_BROKER_URL || DEFAULT_OAUTH_BROKER,
});
const valid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
export default function Auth() {
  const [mode, setMode] = useState("in"),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [busy, setBusy] = useState(false),
    [params] = useSearchParams(),
    nav = useNavigate();
  const raw = params.get("next"),
    next = raw?.startsWith("/") && !raw.startsWith("//") ? raw : "/dashboard";
  async function enter() {
    const { role } = await api("bootstrap");
    const area = next === "/admin" ? "admin" : next === "/professor" ? "teacher" : "student";
    nav(raw && canOpenArea(role, area) ? next : roleHome(role), { replace: true });
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
    setBusy(false);
    if (error) return toast.error(error.message);

    if (data.session) {
      nav("/onboarding");
      return;
    }

    toast.success("Confirme seu email para entrar.");
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
              <label>
                Nome completo
                <input
                  required
                  maxLength="100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
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
        <Link to="/">← Voltar ao início</Link>
      </div>
    </main>
  );
}

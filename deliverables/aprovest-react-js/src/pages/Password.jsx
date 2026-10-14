import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Brand } from "../components/Layout";
import { supabase } from "../lib/supabase";
export default function Password() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recovery, setRecovery] = useState(false);
  useEffect(() => {
    if (location.hash.includes('type=recovery')) setRecovery(true);
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setRecovery(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  async function submit(e) {
    e.preventDefault();
    if (recovery) {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) toast.error(error.message);
      else toast.success('Senha atualizada.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${location.origin}/senha`,
    });
    if (error) toast.error("Não foi possível enviar o link.");
    else toast.success("Verifique seu email.");
  }
  return (
    <main className="auth">
      <div className="auth-wrap">
        <Brand />
        <section className="panel">
          <span className="kicker">RECUPERAR ACESSO</span>
          <h1>Redefina sua senha</h1>
          <form onSubmit={submit}>
            <label>
              {recovery ? 'Nova senha' : 'Email'}
              <input
                type={recovery ? 'password' : 'email'}
                maxLength="255"
                required
                minLength={recovery ? 6 : undefined}
                value={recovery ? password : email}
                onChange={(e) => recovery ? setPassword(e.target.value) : setEmail(e.target.value)}
              />
            </label>
            <button className="btn primary full">{recovery ? 'Salvar nova senha' : 'Enviar link'}</button>
          </form>
        </section>
        <Link to="/auth">← Voltar para entrar</Link>
      </div>
    </main>
  );
}

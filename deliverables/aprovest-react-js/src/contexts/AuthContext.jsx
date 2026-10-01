import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const Context = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (active) {
          setUser(data.user ?? null);
        }
      })
      .catch((error) => {
        console.error("Não foi possível verificar a sessão:", error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return <Context.Provider value={{ user, loading }}>{children}</Context.Provider>;
}

export function useAuth() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("O controle de autenticação não foi iniciado.");
  }

  return context;
}

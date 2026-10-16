import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { api } from "../lib/api";

const Context = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [roleError, setRoleError] = useState("");

  useEffect(() => {
    let active = true;
    setRole(null);
    setRoleError("");
    if (!user)
      return () => {
        active = false;
      };
    api("bootstrap")
      .then((data) => {
        if (active) setRole(data.role);
      })
      .catch((error) => {
        if (active) setRoleError(error.message);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

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

  return <Context.Provider value={{ user, loading, role, roleError }}>{children}</Context.Provider>;
}

export function useAuth() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("O controle de autenticação não foi iniciado.");
  }

  return context;
}

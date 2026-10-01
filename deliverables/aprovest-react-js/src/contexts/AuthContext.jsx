import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
const Context = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user ?? null);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return <Context.Provider value={{ user, loading }}>{children}</Context.Provider>;
}
export const useAuth = () => useContext(Context);

import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://c--e9888714-bf58-47ad-bf20-c65e58ff969c-prod.lovable.cloud";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0Ynh5Z3lmdmdoaWt0dmRsb3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5OTI0NTIsImV4cCI6MjA5ODU2ODQ1Mn0.uXfY6VInghV04_zoXeA1BcRn3AKO288XC9LzCMheT8A";

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const configurationError =
  !url || !key
    ? "A conexão do AproVest não pôde ser inicializada. Reinicie o servidor e tente novamente."
    : null;

export const supabase = configurationError
  ? null
  : createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });

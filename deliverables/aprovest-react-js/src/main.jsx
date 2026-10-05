import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import { Toaster } from "sonner";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { configurationError } from "./lib/supabase";
import App from "./App";
import "./styles.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("O elemento principal do aplicativo não foi encontrado.");
}

function ConfigurationError() {
  return (
    <main className="startup-error">
      <section className="panel">
        <span className="kicker">CONFIGURAÇÃO NECESSÁRIA</span>
        <h1>O AproVest ainda não está conectado</h1>
        <p>{configurationError}</p>
        <ol>
          <li>Confirme que o computador está conectado à internet.</li>
          <li>Pare o servidor e execute novamente npm run dev.</li>
          <li>Consulte o terminal caso o problema continue.</li>
        </ol>
      </section>
    </main>
  );
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AppErrorBoundary>
      {configurationError ? (
        <ConfigurationError />
      ) : (
        <BrowserRouter>
          <AuthProvider>
            <App />
            <Toaster richColors />
          </AuthProvider>
        </BrowserRouter>
      )}
    </AppErrorBoundary>
  </React.StrictMode>,
);

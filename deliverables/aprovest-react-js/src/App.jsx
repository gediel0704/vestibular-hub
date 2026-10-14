import { Navigate, Route, Routes } from "react-router-dom";
import { Protected } from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Diagnostic from "./pages/Diagnostic";
import Dashboard from "./pages/Dashboard";
import Password from "./pages/Password";
import Essays from "./pages/Essays";
import Library from "./pages/Library";
import Practice from "./pages/Practice";
import StudyPlan from "./pages/StudyPlan";
import Account from "./pages/Account";
import Staff from "./pages/Staff";
export default function App() {
  const p = (x) => <Protected>{x}</Protected>;
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sobre" element={<About />} />
      <Route path="/about" element={<Navigate to="/sobre" />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/senha" element={<Password />} />
      <Route path="/onboarding" element={p(<Onboarding />)} />
      <Route path="/diagnostico" element={p(<Practice mode="diagnostic" />)} />
      <Route path="/dashboard" element={p(<Dashboard />)} />
      <Route path="/redacoes" element={p(<Essays />)} />
      <Route path="/biblioteca" element={p(<Library />)} />
      <Route path="/banca" element={p(<Practice />)} />
      <Route path="/simulados" element={p(<Practice mode="exam" />)} />
      <Route path="/plano" element={p(<StudyPlan />)} />
      <Route path="/perfil" element={p(<Account />)} />
      <Route path="/historico" element={p(<Account view="history" />)} />
      <Route path="/notificacoes" element={p(<Account view="notifications" />)} />
      <Route path="/planos" element={p(<Account view="plans" />)} />
      <Route path="/professor" element={p(<Staff />)} />
      <Route path="/admin" element={p(<Staff admin />)} />
      <Route
        path="*"
        element={
          <main className="center">
            <h1>404</h1>
            <a href="/">Voltar ao início</a>
          </main>
        }
      />
    </Routes>
  );
}

import { Navigate,useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
export function ProtectedRoute({children}){const {user,loading}=useAuth();const location=useLocation();if(loading)return <main className="status-page">Carregando sua conta…</main>;return user?children:<Navigate to={`/auth?next=${encodeURIComponent(location.pathname)}`} replace/>}

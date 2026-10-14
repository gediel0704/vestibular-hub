import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppHeader } from './Layout';
import { Button } from './Button';
import { api } from '../lib/api';

const links = [
  ['/dashboard', 'Painel'],
  ['/biblioteca', 'Conteúdos'],
  ['/banca', 'Banca diária'],
  ['/plano', 'Plano de estudo'],
  ['/redacoes', 'Redações'],
  ['/simulados', 'Simulados'],
  ['/historico', 'Histórico'],
  ['/notificacoes', 'Notificações'],
  ['/perfil', 'Perfil'],
  ['/planos', 'Assinatura'],
];

export function StudyLayout({ title, eyebrow = 'SUA PREPARAÇÃO', children }) {
  const [role, setRole] = useState('student');
  useEffect(() => {
    api('bootstrap').then((data) => setRole(data.role)).catch(() => {});
  }, []);
  return (
    <>
      <AppHeader />
      <nav className="study-nav" aria-label="Preparação">
        {links.map(([path, label]) => <NavLink key={path} to={path}>{label}</NavLink>)}
        {['teacher', 'admin'].includes(role) && <NavLink to="/professor">Correções</NavLink>}
        {role === 'admin' && <NavLink to="/admin">Administração</NavLink>}
      </nav>
      <main className="student">
        <div className="dashboard">
          <span className="kicker">{eyebrow}</span>
          <h1>{title}</h1>
          {children}
        </div>
      </main>
    </>
  );
}

export function ErrorNotice({ error, retry }) {
  if (!error) return null;
  return <div className="error-notice" role="alert"><p>{error}</p>{retry && <Button variant="secondary" onClick={retry}>Tentar novamente</Button>}</div>;
}

export function ExamSelect({ value, onChange }) {
  return <label className="exam-select">Vestibular<select value={value} onChange={(event) => onChange(event.target.value)}>{['ENEM', 'FUVEST', 'Unicamp'].map((exam) => <option key={exam}>{exam}</option>)}</select></label>;
}
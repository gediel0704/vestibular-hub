import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { StudyLayout, ErrorNotice, ExamSelect } from '../components/StudyLayout';
import { Button } from '../components/Button';
import { api, downloadJson } from '../lib/api';

export default function Account({ view = 'profile' }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const titles = { profile: 'Seu perfil', history: 'Histórico de preparação', notifications: 'Notificações', plans: 'Seu plano e créditos' };
  async function load() {
    setError('');
    try { setData(await api(view === 'history' ? 'history' : view === 'notifications' ? 'notifications' : 'bootstrap')); } catch (err) { setError(err.message); }
  }
  useEffect(() => { load(); }, [view]);
  async function save(event) {
    event.preventDefault();
    setBusy(true);
    try { await api('profile', { ...data.profile, exam: data.profile.target_exam }); toast.success('Perfil atualizado.'); } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  function field(name, value) { setData({ ...data, profile: { ...data.profile, [name]: value } }); }
  async function exportData() {
    try { downloadJson(await api('export'), 'aprovest-meus-dados.json'); } catch (err) { setError(err.message); }
  }
  async function requestDeletion() {
    if (!window.confirm('Solicitar a exclusão da conta e dos dados? O responsável receberá o pedido.')) return;
    try { await api('deletion'); toast.success('Pedido de exclusão registrado.'); } catch (err) { setError(err.message); }
  }
  return <StudyLayout title={titles[view]}><ErrorNotice error={error} retry={load} />{!data && !error && <p>Carregando…</p>}{data && view === 'profile' && <><form className="account-form" onSubmit={save}>{[['full_name', 'Nome completo'], ['target_course', 'Curso-alvo'], ['target_university', 'Universidade-alvo']].map(([name, label]) => <label key={name}>{label}<input maxLength="120" required={name === 'full_name'} value={data.profile?.[name] ?? ''} onChange={(event) => field(name, event.target.value)} /></label>)}<ExamSelect value={data.profile?.target_exam ?? 'ENEM'} onChange={(value) => field('target_exam', value)} /><label className="checkbox-label"><input type="checkbox" checked={data.profile?.notifications_enabled ?? true} onChange={(event) => field('notifications_enabled', event.target.checked)} />Receber notificações</label><label className="checkbox-label"><input type="checkbox" checked={data.profile?.ranking_opt_in ?? false} onChange={(event) => field('ranking_opt_in', event.target.checked)} />Participar do ranking público com identificação abreviada</label><Button type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar perfil'}</Button></form><section className="privacy-actions"><h2>Privacidade</h2><Button variant="secondary" onClick={exportData}>Exportar meus dados</Button><Button variant="danger" onClick={requestDeletion}>Solicitar exclusão</Button></section></>}{data && view === 'history' && <><Button variant="secondary" onClick={() => window.print()}>Exportar relatório PDF</Button><div className="history-list">{data.sessions.map((session) => <article key={session.id}><div><h2>{{ daily: 'Banca diária', diagnostic: 'Diagnóstico', exam: 'Simulado' }[session.mode]} · {session.exam}</h2><p>{new Date(session.started_at).toLocaleString('pt-BR')}</p></div><strong>{session.status === 'completed' ? `${Math.round(session.score * 100)}%` : 'Em andamento'}</strong></article>)}{!data.sessions.length && <p>Nenhuma avaliação realizada.</p>}<h2>Correções de redação</h2>{data.evaluations.map((evaluation) => <article key={evaluation.id}><span>{evaluation.essay_snapshot.title} · {evaluation.exam}</span><span>{{ completed: 'Concluída', failed: 'Falhou', queued: 'Na fila', running: 'Em avaliação' }[evaluation.status]}</span></article>)}</div></>}{data && view === 'notifications' && <div className="history-list">{data.items.map((item) => <article key={item.id}><div><h2>{item.title}</h2><p>{item.body}</p></div>{!item.read_at && <Button variant="secondary" onClick={async () => { try { await api('notifications', { id: item.id }); await load(); } catch (err) { setError(err.message); } }}>Marcar como lida</Button>}</article>)}{!data.items.length && <p>Nenhuma notificação por enquanto.</p>}</div>}{data && view === 'plans' && <section className="plans-view"><h2>{data.entitlement?.pro_until && new Date(data.entitlement.pro_until) > new Date() ? 'Plano Pro ativo' : 'Plano gratuito'}</h2><p>Até 20 questões diárias · 1 correção por IA por mês no plano gratuito.</p><p>Créditos de correção humana: <strong>{data.entitlement?.human_credits ?? 0}</strong></p><h3>Assinatura e compra de créditos</h3><p className="muted">Contratação ainda indisponível: preços e serviço de pagamento precisam ser configurados pelo responsável.</p><Button disabled>Contratação indisponível</Button></section>}</StudyLayout>;
}
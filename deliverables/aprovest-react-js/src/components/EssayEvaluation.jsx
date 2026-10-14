import { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { ExamSelect, ErrorNotice } from './StudyLayout';
import { api } from '../lib/api';

export function EssayEvaluation({ essay }) {
  const [exam, setExam] = useState('ENEM');
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const abort = useRef(null);
  useEffect(() => { api('history').then((data) => setHistory(data.evaluations.filter((row) => row.essay_id === essay.id))).catch(() => {}); return () => abort.current?.abort(); }, [essay.id]);
  async function grade(type) {
    setBusy(true);
    setError('');
    setVisible(true);
    abort.current = new AbortController();
    try {
      const result = await api('grade', { essayId: essay.id, exam, type }, abort.current.signal);
      setHistory((current) => [result.evaluation, ...current]);
    } catch (err) { setError(err.name === 'AbortError' ? 'Avaliação interrompida.' : err.message); }
    finally { setBusy(false); }
  }
  return <div className="essay-evaluation"><ExamSelect value={exam} onChange={setExam} /><div className="editor-actions"><Button disabled={busy} onClick={() => grade('ai')}>{busy ? 'Avaliando…' : 'Corrigir com IA'}</Button><Button variant="secondary" disabled={busy} onClick={() => grade('human')}>Pedir correção humana</Button><Button variant="secondary" onClick={() => setVisible(!visible)}>Histórico de correções</Button>{busy && <Button variant="danger" onClick={() => abort.current?.abort()}>Interromper</Button>}</div><ErrorNotice error={error} />{visible && <div className="evaluation-history">{history.map((evaluation) => <section key={evaluation.id}><span className="kicker">{evaluation.exam} · {evaluation.type === 'human' ? 'Correção humana' : 'Avaliação por IA'}</span><p>{evaluation.status === 'queued' ? 'Na fila de correção humana.' : evaluation.status === 'failed' ? evaluation.error_message : evaluation.status === 'running' ? 'Avaliação em andamento.' : evaluation.feedback?.summary}</p>{evaluation.feedback?.total !== null && evaluation.feedback?.total !== undefined && <h3>{evaluation.feedback.total}/1000 · estimativa de treino</h3>}{evaluation.feedback?.criteria?.map((criterion, index) => <div key={index}><strong>{criterion.name}{criterion.score !== null && ` · ${criterion.score}/200`}</strong><p>{criterion.feedback}</p></div>)}{evaluation.feedback?.passages?.map((passage, index) => <blockquote key={index}><q>{passage.quote}</q><p>{passage.comment}</p></blockquote>)}{evaluation.feedback?.next_steps?.map((step, index) => <p key={index}>• {step}</p>)}<small>{evaluation.feedback?.disclaimer}</small></section>)}{!history.length && !busy && <p>Nenhuma correção registrada.</p>}</div>}</div>;
}
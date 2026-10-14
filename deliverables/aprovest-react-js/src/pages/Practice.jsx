import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StudyLayout, ErrorNotice, ExamSelect } from '../components/StudyLayout';
import { Button } from '../components/Button';
import { api } from '../lib/api';

export default function Practice({ mode = 'daily' }) {
  const [params, setParams] = useSearchParams();
  const [exam, setExam] = useState('ENEM');
  const [data, setData] = useState(null);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [remaining, setRemaining] = useState(null);
  const title = mode === 'daily' ? 'Sua banca diária' : mode === 'exam' ? 'Simulados' : 'Diagnóstico inicial';
  async function load(id) {
    setBusy(true);
    setError('');
    try {
      const result = await api(id ? 'session' : 'start', id ? { sessionId: id } : { mode, exam });
      setData(result);
      setExam(result.session.exam);
      setParams({ sessao: result.session.id }, { replace: true });
      setKey('');
      setFeedback(null);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  useEffect(() => { if (params.get('sessao')) load(params.get('sessao')); }, []);
  useEffect(() => {
    if (!data?.session.expires_at || data.session.status === 'completed') return;
    const timer = setInterval(() => setRemaining(Math.max(0, Math.ceil((new Date(data.session.expires_at).getTime() - Date.now()) / 1000))), 1000);
    return () => clearInterval(timer);
  }, [data?.session]);
  async function answer() {
    setBusy(true);
    setError('');
    try {
      const result = await api('answer', { sessionId: data.session.id, itemId: data.item.id, key });
      if (result.completed) setData({ ...data, item: null, session: { ...data.session, status: 'completed' }, result: result.result });
      else if (mode === 'exam') await load(data.session.id);
      else setFeedback(result);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return (
    <StudyLayout title={title}>
      <ErrorNotice error={error} />
      {!data ? <section className="practice-intro"><ExamSelect value={exam} onChange={setExam} /><h2>{mode === 'daily' ? 'Questões para o seu próximo passo' : 'Uma visão do seu desempenho'}</h2><p>{mode === 'daily' ? '10 exercícios de fundamentos, priorizando revisão e dificuldade próxima ao seu desempenho.' : '30 exercícios autorais de fundamentos nas quatro áreas.'}</p>{mode === 'exam' && <p>60 minutos · Resultado de treino, não nota oficial.</p>}<Button disabled={busy} onClick={() => load()}>{busy ? 'Iniciando…' : 'Começar'}</Button></section> : data.result ? <section className="results-view"><span className="kicker">AVALIAÇÃO CONCLUÍDA</span><h2>{data.result.score}% de acertos</h2>{Object.entries(data.result.areas ?? {}).map(([area, score]) => <div className="metric" key={area}><label>{area}<b>{Math.round(score * 100)}%</b></label><progress value={score} max="1" /></div>)}{mode === 'exam' && <p>{data.result.percentile === null ? `Comparação indisponível: ${data.result.cohort_size} participante(s) comparável(is).` : `Percentil ${data.result.percentile} · ${data.result.cohort_size} participantes comparáveis.`}</p>}<p className="muted">{data.result.disclaimer}</p><Button onClick={() => { setData(null); setParams({}); }}>Nova avaliação</Button></section> : data.item && <section className="question-view"><div className="question-meta"><span>{data.session.exam} · {data.item.subject} · {data.item.topic}</span><span>{data.session.current_index + 1}/{data.session.item_ids.length}{remaining !== null && ` · ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`}</span></div><progress value={data.session.current_index} max={data.session.item_ids.length} /><h2>{data.item.statement}</h2><p className="muted">Exercício autoral de fundamentos · Nível {data.item.difficulty}</p><div className="answers">{data.item.choices.map((choice) => <label className={`answer-option ${key === choice.key ? 'selected' : ''}`} key={choice.key}><input type="radio" name="answer" value={choice.key} checked={key === choice.key} disabled={Boolean(feedback)} onChange={() => setKey(choice.key)} /><b>{choice.key}</b><span>{choice.text}</span></label>)}</div>{feedback ? <div className="answer-feedback"><h3>{feedback.correct ? 'Resposta correta' : 'Vamos revisar'}</h3><p>{feedback.explanation}</p><Button onClick={() => load(data.session.id)}>Próxima questão</Button></div> : <Button disabled={busy || (!key && remaining !== 0)} onClick={answer}>{busy ? 'Salvando…' : remaining === 0 ? 'Encerrar por tempo' : 'Confirmar resposta'}</Button>}</section>}
    </StudyLayout>
  );
}
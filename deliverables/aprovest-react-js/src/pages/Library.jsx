import { useEffect, useState } from 'react';
import { BookOpen, Check } from 'lucide-react';
import { StudyLayout, ErrorNotice, ExamSelect } from '../components/StudyLayout';
import { Button } from '../components/Button';
import { api } from '../lib/api';

export default function Library() {
  const [exam, setExam] = useState('ENEM');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  async function load() {
    setError('');
    try { setData(await api('library', { exam })); } catch (err) { setError(err.message); }
  }
  useEffect(() => { load(); }, [exam]);
  async function mark(item) {
    try {
      await api('progress', { itemId: item.id, completed: !data.progress.some((row) => row.item_id === item.id && row.completed) });
      await load();
    } catch (err) { setError(err.message); }
  }
  const items = data?.items.filter((item) => item.kind === 'content' && `${item.title} ${item.topic} ${item.subject}`.toLowerCase().includes(search.toLowerCase())) ?? [];
  return (
    <StudyLayout title="Biblioteca de estudos">
      <div className="essay-toolbar"><ExamSelect value={exam} onChange={(value) => { setExam(value); setSelected(null); }} /><label>Buscar conteúdo<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} /></label></div>
      <ErrorNotice error={error} retry={load} />
      {selected ? (
        <article className="reading-view">
          <Button variant="secondary" onClick={() => setSelected(null)}>← Voltar</Button>
          <span className="kicker">{selected.subject} · {selected.topic}</span>
          <h2>{selected.title}</h2>
          <p className="reading-text">{selected.statement}</p>
          <p className="muted">Material autoral de fundamentos, não reprodução de prova oficial.</p>
          {selected.source_url && <a className="back-link" href={selected.source_url} target="_blank" rel="noreferrer">Consultar a referência da banca ↗</a>}
          <Button onClick={() => mark(selected)}><Check size={17} />{data.progress.some((row) => row.item_id === selected.id && row.completed) ? 'Marcar como não concluído' : 'Concluir leitura'}</Button>
        </article>
      ) : <div className="essay-grid">{items.map((item) => <article className="panel essay-card" key={item.id}><BookOpen /><span className="kicker">{item.subject} · {item.exam}</span><h2>{item.title}</h2><p>{item.statement.slice(0, 150)}…</p><Button variant="secondary" onClick={() => setSelected(item)}>Ler conteúdo</Button>{data.progress.some((row) => row.item_id === item.id && row.completed) && <span className="status status-corrected">Concluído</span>}</article>)}</div>}
      {!data && !error && <p>Carregando materiais…</p>}
      {data && !items.length && <p>Nenhum material encontrado.</p>}
    </StudyLayout>
  );
}
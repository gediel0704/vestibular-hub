import { useState } from "react";
import { Button } from "./Button";
import { downloadJson } from "../lib/api";

const money = (minor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(minor / 100);
const date = (value) => value ? new Date(value).toLocaleDateString("pt-BR") : "—";
const status = { pending: "A pagar", paid: "Pago", cancelled: "Cancelado" };

export function EarningsReport({ data, admin = false }) {
  const rows = data.earnings ?? [];
  const valid = rows.filter((row) => row.status !== "cancelled");
  const pending = valid.filter((row) => row.status === "pending");
  const paid = valid.filter((row) => row.status === "paid");
  const sum = (items, key) => items.reduce((total, row) => total + Number(row[key]), 0);
  return (
    <section className="staff-report">
      <h2>{admin ? "Distribuição de valores" : "Meus ganhos por correção"}</h2>
      <div className="report-metrics">
        <article><span>A pagar ao professor</span><strong>{money(sum(pending, "teacher_amount_minor"))}</strong></article>
        <article><span>Repasses pagos</span><strong>{money(sum(paid, "teacher_amount_minor"))}</strong></article>
        <article><span>Correções com remuneração registrada</span><strong>{valid.length}</strong></article>
      </div>
      <p className="muted">Cobrança não ativada. Correções sem remuneração registrada não geram saldo financeiro.</p>
      {admin && <p>Parcela bruta da plataforma: <strong>{money(sum(valid, "amount_minor") - sum(valid, "teacher_amount_minor"))}</strong>. Não representa lucro líquido; taxas, tributos e custos não estão apurados.</p>}
      <Button variant="secondary" onClick={() => downloadJson(rows, "aprovest-repasses.json")}>Exportar repasses</Button>
      <div className="report-table-wrap">
        <table className="report-table">
          <thead><tr><th>Data</th><th>Correção</th>{admin && <th>Professor</th>}<th>Base bruta</th><th>Percentual</th><th>Repasse</th><th>Situação</th></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.id}>
              <td>{date(row.created_at)}</td>
              <td>{data.evaluations?.find((item) => item.id === row.evaluation_id)?.essay_snapshot.title ?? row.evaluation_id}</td>
              {admin && <td>{data.users?.find((user) => user.id === row.teacher_id)?.full_name ?? "Professor"}</td>}
              <td>{money(row.amount_minor)}</td><td>{row.teacher_share_bps / 100}%</td>
              <td>{money(row.teacher_amount_minor)}</td><td>{status[row.status]}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {!rows.length && <p>Nenhum repasse registrado.</p>}
    </section>
  );
}

export function AdminReports({ data }) {
  const [filter, setFilter] = useState("all");
  const roles = new Map();
  for (const row of data.roles) {
    const previous = roles.get(row.user_id);
    if (row.role === "admin" || !previous || (row.role === "teacher" && previous !== "admin")) roles.set(row.user_id, row.role);
  }
  const role = (id) => roles.get(id) ?? "student";
  const students = data.users.filter((user) => role(user.id) === "student");
  const teachers = data.users.filter((user) => role(user.id) === "teacher");
  const active = data.entitlements.filter((row) => row.pro_until && new Date(row.pro_until) > new Date());
  const visible = data.users.filter((user) => filter === "all" || role(user.id) === filter);
  const labels = { student: "Aluno", teacher: "Professor", admin: "Administrador" };
  return (
    <section className="staff-report">
      <h2>Cadastros, acessos e assinaturas</h2>
      <div className="report-metrics">
        <article><span>Alunos</span><strong>{students.length}</strong></article>
        <article><span>Professores</span><strong>{teachers.length}</strong></article>
        <article><span>Acessos Pro vigentes</span><strong>{active.length}</strong></article>
      </div>
      <p className="muted">Acesso Pro pode ser concedido por bolsa. Não comprova uma assinatura paga.</p>
      <div className="editor-actions">
        <label>Perfil <select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Todos</option><option value="student">Alunos</option><option value="teacher">Professores</option><option value="admin">Administradores</option></select></label>
        <Button variant="secondary" onClick={() => downloadJson({ users: visible, entitlements: data.entitlements }, "aprovest-cadastros-assinaturas.json")}>Exportar relatório</Button>
      </div>
      <div className="report-table-wrap">
        <table className="report-table">
          <thead><tr><th>Nome</th><th>Perfil</th><th>Cadastro</th><th>Acesso</th><th>Créditos humanos</th><th>Vigência Pro</th></tr></thead>
          <tbody>{visible.map((user) => {
            const entitlement = data.entitlements.find((row) => row.user_id === user.id);
            return <tr key={user.id}><td>{user.full_name || "Sem nome"}</td><td>{labels[role(user.id)]}</td><td>{date(user.created_at)}</td><td>{entitlement?.subscription_status ?? "free"}</td><td>{entitlement?.human_credits ?? 0}</td><td>{date(entitlement?.pro_until)}</td></tr>;
          })}</tbody>
        </table>
      </div>
      <h2>Relatório financeiro</h2>
      <p>Receita de vendas, assinaturas pagas, estornos e lucro líquido: não apurados. O serviço de cobrança ainda não foi ativado.</p>
      <EarningsReport data={data} admin />
    </section>
  );
}

export function ContentReview({ data, onSubmit, busy }) {
  const [selected, setSelected] = useState(null);
  const [comments, setComments] = useState("");
  const [verdict, setVerdict] = useState("approved");
  return (
    <section className="staff-report">
      <h2>Avaliação pedagógica de conteúdos</h2>
      <div className="history-list">
        {(data.items ?? []).filter((item) => item.kind === "content").map((item) => (
          <article key={item.id}><div><h3>{item.title}</h3><p>{item.exam} · {item.subject} · {item.published ? "Publicado" : "Rascunho"}</p></div><Button variant="secondary" onClick={() => { setSelected(item); setComments(""); }}>Avaliar conteúdo</Button></article>
        ))}
      </div>
      {selected && <form className="essay-form" onSubmit={async (event) => {
        event.preventDefault();
        const saved = await onSubmit("content_review", { itemId: selected.id, verdict, comments });
        if (saved) setSelected(null);
      }}>
        <h3>{selected.title}</h3><p className="reading-text">{selected.statement}</p>
        <label>Parecer<select value={verdict} onChange={(event) => setVerdict(event.target.value)}><option value="approved">Aprovado pedagogicamente</option><option value="changes_requested">Requer ajustes</option></select></label>
        <label>Justificativa<textarea required minLength={20} value={comments} onChange={(event) => setComments(event.target.value)} /></label>
        <div className="editor-actions"><Button variant="secondary" onClick={() => setSelected(null)}>Cancelar</Button><Button type="submit" disabled={busy}>Registrar parecer</Button></div>
      </form>}
      <h3>Pareceres registrados</h3>
      <div className="history-list">{(data.reviews ?? []).map((row) => <article key={row.id}><div><h4>{row.item_snapshot?.title ?? "Conteúdo"}</h4><p>{row.verdict === "approved" ? "Aprovado" : "Requer ajustes"} · {date(row.created_at)}</p><p>{row.comments}</p></div></article>)}</div>
      {!data.reviews?.length && <p>Nenhum parecer registrado.</p>}
    </section>
  );
}
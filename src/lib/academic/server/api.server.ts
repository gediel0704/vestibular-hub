import { createClient } from '@supabase/supabase-js';
import { EXAMS, eloUpdate, percentile } from '../rules';

type Input = Record<string, any>;
class ApiError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
function ensure(value: unknown, message: string): asserts value {
  if (!value) throw new ApiError(message);
}
function dbResult<T extends { error: unknown; data: unknown }>(result: T): T['data'] {
  if (result.error) throw new ApiError((result.error as { message?: string }).message ?? 'Não foi possível salvar.');
  return result.data;
}
function safeItem(item: Input) {
  const { correct_key, explanation, ...safe } = item;
  return safe;
}

export async function academicApi(request: Request) {
  const origin = request.headers.get('origin') ?? '';
  const local = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  const same = origin === new URL(request.url).origin;
  const headers = new Headers({ 'Content-Type': 'application/json', Vary: 'Origin' });
  if (local || same) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  }
  if (request.method === 'OPTIONS') return new Response(null, { status: local || same ? 204 : 403, headers });
  const respond = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers });
  try {
    if (origin && !local && !same) throw new ApiError('Origem não autorizada.', 403);
    const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1];
    if (!token) throw new ApiError('Entre na sua conta para continuar.', 401);
    const url = process.env['SUPABASE_URL'];
    const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
    if (!url || !key) throw new ApiError('Serviço indisponível.', 503);
    const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { headers: { Authorization: `Bearer ${token}` } } });
    const { data: auth, error: authError } = await client.auth.getUser(token);
    if (authError || !auth.user) throw new ApiError('Sua sessão expirou.', 401);
    const userId = auth.user.id;
    const roles = dbResult(await client.from('user_roles').select('role').eq('user_id', userId)) as { role: string }[];
    const admin = roles.some((row) => row.role === 'admin');
    const teacher = roles.some((row) => row.role === 'teacher');
    // Identity and roles have been verified through the user-scoped client before privileged access.
    const { supabaseAdmin: db } = await import('@/integrations/supabase/client.server');
    if (Number(request.headers.get('content-length') ?? 0) > 60000) throw new ApiError('Solicitação muito grande.');
    const text = await request.text();
    if (text.length > 60000) throw new ApiError('Solicitação muito grande.');
    const input: Input = JSON.parse(text);
    const action = input.action;
    const profile = dbResult(await db.from('profiles').select('*').eq('id', userId).maybeSingle()) as Input | null;
    const exam = input.exam ?? profile?.target_exam ?? 'ENEM';
    ensure(EXAMS.includes(exam), 'Selecione uma banca válida.');

    if (action === 'bootstrap') {
      const entitlement = dbResult(await db.from('academic_entitlements').select('*').eq('user_id', userId).maybeSingle());
      return respond({ role: admin ? 'admin' : teacher ? 'teacher' : 'student', profile, entitlement, apiReady: true });
    }
    if (action === 'library') {
      const items = dbResult(await db.from('academic_items').select('*').eq('published', true).eq('exam', exam).neq('kind', 'question').order('title')) as Input[];
      const progress = dbResult(await db.from('academic_progress').select('*').eq('user_id', userId));
      return respond({ items: items.map(safeItem), progress });
    }
    if (action === 'progress') {
      const item = dbResult(await db.from('academic_items').select('id').eq('id', input.itemId).eq('published', true).eq('kind', 'content').maybeSingle());
      ensure(item, 'Conteúdo não encontrado.');
      dbResult(await db.from('academic_progress').upsert({ user_id: userId, item_id: input.itemId, completed: Boolean(input.completed), updated_at: new Date().toISOString() }, { onConflict: 'user_id,item_id' }));
      return respond({ ok: true });
    }
    if (action === 'start' || action === 'session') {
      let session: Input;
      if (action === 'session') {
        session = dbResult(await db.from('academic_sessions').select('*').eq('id', input.sessionId).eq('user_id', userId).single()) as Input;
      } else {
        ensure(['daily', 'diagnostic', 'exam'].includes(input.mode), 'Modo inválido.');
        const existing = dbResult(await db.from('academic_sessions').select('*').eq('user_id', userId).eq('mode', input.mode).eq('exam', exam).eq('status', 'in_progress').order('started_at', { ascending: false }).limit(1).maybeSingle()) as Input | null;
        if (existing) session = existing;
        else {
          const items = dbResult(await db.from('academic_items').select('*').eq('kind', 'question').eq('published', true).eq('exam', exam)) as Input[];
          const progress = dbResult(await db.from('academic_progress').select('*').eq('user_id', userId)) as Input[];
          const byId = new Map(progress.map((row) => [row.item_id, row]));
          const rank = (item: Input) => {
            const p = byId.get(item.id);
            const due = p?.due_at && new Date(p.due_at).getTime() <= Date.now();
            return (due ? -10000 : 0) + Math.abs((p?.rating ?? 1000) - (600 + item.difficulty * 160)) + (p?.completed ? 500 : 0);
          };
          const selected = input.mode === 'daily' ? items.sort((a, b) => rank(a) - rank(b)).slice(0, 10) : items.sort((a, b) => a.subject.localeCompare(b.subject)).slice(0, 30);
          ensure(selected.length >= (input.mode === 'daily' ? 1 : 30), 'Banco insuficiente para esta avaliação.');
          const id = dbResult(await db.rpc('academic_create_session', { p_user: userId, p_mode: input.mode, p_exam: exam, p_ids: selected.map((item) => item.id), p_course: profile?.target_course ?? '', p_university: profile?.target_university ?? '' }));
          session = dbResult(await db.from('academic_sessions').select('*').eq('id', id).single()) as Input;
        }
      }
      const responses = dbResult(await db.from('academic_responses').select('*').eq('session_id', session.id)) as Input[];
      const item = session.status === 'completed' ? null : dbResult(await db.from('academic_items').select('*').eq('id', session.item_ids[session.current_index]).maybeSingle()) as Input | null;
      return respond({ session, item: item ? safeItem(item) : null, responses, result: session.status === 'completed' ? await sessionResult(db, session) : null });
    }
    if (action === 'answer') {
      const session = dbResult(await db.from('academic_sessions').select('*').eq('id', input.sessionId).eq('user_id', userId).single()) as Input;
      ensure(session.status === 'in_progress', 'Esta avaliação já foi encerrada.');
      const expired = session.expires_at && new Date(session.expires_at).getTime() <= Date.now();
      if (!expired) {
        const item = dbResult(await db.from('academic_items').select('*').eq('id', session.item_ids[session.current_index]).single()) as Input;
        ensure(item.id === input.itemId, 'A questão não corresponde à etapa atual.');
        ensure(item.choices.some((choice: Input) => choice.key === input.key), 'Selecione uma alternativa válida.');
        const correct = item.correct_key === input.key;
        dbResult(await db.from('academic_responses').insert({ user_id: userId, session_id: session.id, item_id: item.id, selected_key: input.key, is_correct: correct }));
        const old = dbResult(await db.from('academic_progress').select('*').eq('user_id', userId).eq('item_id', item.id).maybeSingle()) as Input | null;
        dbResult(await db.from('academic_progress').upsert({ user_id: userId, item_id: item.id, completed: correct, rating: eloUpdate(old?.rating ?? 1000, item.difficulty, correct), due_at: new Date(Date.now() + (correct ? 7 : 1) * 86400000).toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'user_id,item_id' }));
        session.current_index++;
        if (session.current_index < session.item_ids.length) {
          dbResult(await db.from('academic_sessions').update({ current_index: session.current_index }).eq('id', session.id));
          return respond({ correct: session.mode === 'exam' ? null : correct, explanation: session.mode === 'exam' ? '' : item.explanation, next: true });
        }
      }
      const responses = dbResult(await db.from('academic_responses').select('item_id,is_correct').eq('session_id', session.id)) as Input[];
      const items = dbResult(await db.from('academic_items').select('id,subject,topic').in('id', session.item_ids)) as Input[];
      const scores: Input = {};
      for (const item of items) {
        const area = item.subject;
        scores[area] ??= { right: 0, total: 0 };
        scores[area].total++;
        if (responses.find((row) => row.item_id === item.id)?.is_correct) scores[area].right++;
      }
      const score = responses.filter((row) => row.is_correct).length / session.item_ids.length;
      const values = Object.fromEntries(Object.entries(scores).map(([key, value]) => [key, (value as Input).right / (value as Input).total]));
      const completed = { status: 'completed', completed_at: new Date().toISOString(), score, score_by_topic: values, current_index: session.current_index };
      dbResult(await db.from('academic_sessions').update(completed).eq('id', session.id));
      return respond({ completed: true, expired: Boolean(expired), result: await sessionResult(db, { ...session, ...completed }) });
    }
    if (action === 'history') {
      return respond({ sessions: dbResult(await db.from('academic_sessions').select('*').eq('user_id', userId).order('started_at', { ascending: false })), evaluations: dbResult(await db.from('academic_evaluations').select('*').eq('user_id', userId).order('created_at', { ascending: false })), progress: dbResult(await db.from('academic_progress').select('*').eq('user_id', userId)) });
    }
    if (action === 'notifications') {
      if (input.id) dbResult(await db.from('academic_notifications').update({ read_at: new Date().toISOString() }).eq('id', input.id).eq('user_id', userId));
      return respond({ items: dbResult(await db.from('academic_notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false })) });
    }
    if (action === 'profile') {
      ensure(typeof input.full_name === 'string' && input.full_name.trim().length >= 2, 'Informe seu nome.');
      dbResult(await db.from('profiles').update({ full_name: input.full_name.trim().slice(0, 100), target_exam: exam, target_course: String(input.target_course ?? '').slice(0, 100), target_university: String(input.target_university ?? '').slice(0, 120), notifications_enabled: Boolean(input.notifications_enabled), ranking_opt_in: Boolean(input.ranking_opt_in) }).eq('id', userId));
      return respond({ ok: true });
    }
    if (action === 'export') {
      return respond({ profile, sessions: dbResult(await db.from('academic_sessions').select('*').eq('user_id', userId)), essays: dbResult(await db.from('essays').select('*').eq('user_id', userId)), evaluations: dbResult(await db.from('academic_evaluations').select('*').eq('user_id', userId)), responses: dbResult(await db.from('academic_responses').select('*').eq('user_id', userId)) });
    }
    if (action === 'deletion') {
      dbResult(await db.from('academic_requests').insert({ user_id: userId, kind: 'deletion' }));
      return respond({ ok: true });
    }
    if (action === 'grade') {
      const paused = dbResult(await db.from('academic_ai_state').select('*').eq('id', 'global').maybeSingle()) as Input | null;
      if (paused?.paused) throw new ApiError(paused.reason ?? 'IA pausada pelo responsável.', 503);
      const evaluationId = dbResult(await db.rpc('academic_reserve_evaluation', { p_user: userId, p_essay: input.essayId, p_exam: exam, p_type: input.type === 'human' ? 'human' : 'ai' }));
      const evaluation = dbResult(await db.from('academic_evaluations').select('*').eq('id', evaluationId).single()) as Input;
      if (evaluation.type === 'human') return respond({ evaluation });
      dbResult(await db.from('academic_evaluations').update({ status: 'running' }).eq('id', evaluationId));
      try {
        const { gradeEssay } = await import('./ai.server');
        const feedback = await gradeEssay(request, exam, evaluation.essay_snapshot);
        dbResult(await db.from('academic_evaluations').update({ feedback, status: 'completed', completed_at: new Date().toISOString() }).eq('id', evaluationId));
        dbResult(await db.from('academic_notifications').insert({ user_id: userId, title: 'Sua correção está disponível', body: `Redação avaliada para ${exam}.` }));
        return respond({ evaluation: { ...evaluation, feedback, status: 'completed' } });
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode ?? 500;
        const message = status === 402 ? 'Saldo de IA insuficiente. O responsável precisa adicionar créditos.' : status === 403 ? 'O serviço de IA bloqueou a avaliação; o responsável precisa revisar a autorização.' : error instanceof Error ? error.message : 'A correção falhou.';
        dbResult(await db.from('academic_evaluations').update({ status: 'failed', error_message: message.slice(0, 500) }).eq('id', evaluationId));
        if ([401, 402, 403, 404].includes(status)) dbResult(await db.from('academic_ai_state').upsert({ id: 'global', paused: true, reason: message }));
        throw new ApiError(message, status);
      }
    }
    if (action === 'teacher') {
      if (!teacher && !admin) throw new ApiError('Acesso restrito.', 403);
      let query = db.from('academic_evaluations').select('*').eq('type', 'human').order('created_at');
      if (!admin) query = query.eq('assigned_to', userId);
      return respond({ evaluations: dbResult(await query) });
    }
    if (action === 'human_feedback') {
      if (!teacher && !admin) throw new ApiError('Acesso restrito.', 403);
      const evaluation = dbResult(await db.from('academic_evaluations').select('*').eq('id', input.id).eq('type', 'human').single()) as Input;
      if (!admin && evaluation.assigned_to !== userId) throw new ApiError('Redação não atribuída a você.', 403);
      ensure(typeof input.summary === 'string' && input.summary.trim().length >= 20, 'Escreva uma devolutiva de pelo menos 20 caracteres.');
      dbResult(await db.from('academic_evaluations').update({ status: 'completed', feedback: { summary: input.summary.trim().slice(0, 12000), criteria: [], type: 'human' }, completed_at: new Date().toISOString() }).eq('id', input.id));
      return respond({ ok: true });
    }
    if (typeof action === 'string' && action.startsWith('admin_')) {
      if (!admin) throw new ApiError('Acesso exclusivo do administrador.', 403);
      if (action === 'admin_data') return respond({ items: dbResult(await db.from('academic_items').select('*').order('created_at', { ascending: false })), users: dbResult(await db.from('profiles').select('id,full_name,target_course,target_exam')), roles: dbResult(await db.from('user_roles').select('*')), evaluations: dbResult(await db.from('academic_evaluations').select('*').eq('type', 'human')), requests: dbResult(await db.from('academic_requests').select('*')), entitlements: dbResult(await db.from('academic_entitlements').select('*')) });
      if (action === 'admin_role') {
        ensure(['student', 'teacher', 'admin'].includes(input.role), 'Papel inválido.');
        if (input.remove) {
          ensure(input.userId !== userId || input.role !== 'admin', 'Você não pode remover seu próprio acesso administrativo.');
          dbResult(await db.from('user_roles').delete().eq('user_id', input.userId).eq('role', input.role));
        } else dbResult(await db.from('user_roles').upsert({ user_id: input.userId, role: input.role }, { onConflict: 'user_id,role' }));
      } else if (action === 'admin_item') {
        const item = input.item;
        ensure(['question', 'content', 'theme', 'exam'].includes(item.kind), 'Tipo inválido.');
        ensure(item.title?.trim().length >= 3 && item.topic?.trim() && item.subject?.trim(), 'Título, disciplina e tópico são obrigatórios.');
        ensure(EXAMS.includes(item.exam), 'Banca inválida.');
        if (item.kind === 'question') ensure(Array.isArray(item.choices) && item.choices.length >= 2 && item.choices.some((choice: Input) => choice.key === item.correct_key), 'Alternativas e gabarito inválidos.');
        const clean = { kind: item.kind, title: item.title.slice(0, 180), subject: item.subject, topic: item.topic, exam: item.exam, statement: String(item.statement ?? '').slice(0, 20000), choices: item.choices ?? [], correct_key: item.correct_key ?? null, explanation: item.explanation ?? '', difficulty: Number(item.difficulty ?? 3), published: Boolean(item.published), origin: item.origin ?? 'authorial', source_url: item.source_url ?? '', updated_at: new Date().toISOString() };
        dbResult(item.id ? await db.from('academic_items').update(clean).eq('id', item.id) : await db.from('academic_items').insert(clean));
      } else if (action === 'admin_archive') {
        dbResult(await db.from('academic_items').update({ published: false }).eq('id', input.id));
      } else if (action === 'admin_assign') {
        const assignedRoles = dbResult(await db.from('user_roles').select('role').eq('user_id', input.teacherId)) as Input[];
        ensure(assignedRoles.some((row) => row.role === 'teacher'), 'Selecione um professor credenciado.');
        dbResult(await db.from('academic_evaluations').update({ assigned_to: input.teacherId }).eq('id', input.id).eq('type', 'human'));
      } else if (action === 'admin_resume_ai') {
        dbResult(await db.from('academic_ai_state').upsert({ id: 'global', paused: false, reason: null }));
      } else throw new ApiError('Ação administrativa desconhecida.');
      return respond({ ok: true });
    }
    throw new ApiError('Ação desconhecida.');
  } catch (error) {
    return respond({ error: error instanceof ApiError ? error.message : 'Não foi possível concluir a operação.' }, error instanceof ApiError ? error.status : 500);
  }
}

async function sessionResult(db: any, session: Input) {
  let cohort: number[] = [];
  if (session.mode === 'exam') {
    const rows = dbResult(await db.from('academic_sessions').select('score,item_ids,user_id').eq('mode', 'exam').eq('status', 'completed').eq('exam', session.exam).eq('target_course', session.target_course).eq('target_university', session.target_university)) as Input[];
    const sameQuestions = (ids: string[]) => [...ids].sort().join(',') === [...session.item_ids].sort().join(',');
    const unique = new Map<string, number>();
    for (const row of rows) if (sameQuestions(row.item_ids)) unique.set(row.user_id, Number(row.score) * 100);
    cohort = [...unique.values()];
  }
  return { score: Math.round(Number(session.score) * 100), areas: session.score_by_topic, percentile: percentile(Number(session.score) * 100, cohort), cohort_size: cohort.length, disclaimer: 'Desempenho de treino, não TRI oficial nem previsão de aprovação.' };
}
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/diagnostico")({
  head: () => ({
    meta: [
      { title: "Diagnóstico — AproVest" },
      { name: "description", content: "Avalie seu ponto de partida por área no AproVest." },
      { property: "og:title", content: "Diagnóstico — AproVest" },
      { property: "og:description", content: "Avalie seu ponto de partida por área no AproVest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Diagnostico,
});

type Choice = { key: string; text: string };
type Question = {
  id: string;
  area: string;
  subject: string;
  statement: string;
  choices: Choice[];
  correct_key: string;
  position: number;
};

function Diagnostico() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUserId(u.user.id);

      const { data: qs, error } = await supabase
        .from("diagnostic_questions")
        .select("id,area,subject,statement,choices,correct_key,position")
        .order("position");
      if (error) return toast.error(error.message);
      setQuestions((qs as Question[]) ?? []);

      const { data: a, error: aerr } = await supabase
        .from("diagnostic_attempts")
        .insert({ user_id: u.user.id, status: "in_progress" })
        .select("id")
        .single();
      if (aerr) return toast.error(aerr.message);
      setAttemptId(a.id);
      setLoading(false);
    })();
  }, []);

  const total = questions.length;
  const current = questions[idx];
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  function pick(key: string) {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: key }));
  }

  async function finish() {
    if (!attemptId || !userId) return;
    setSubmitting(true);
    const rows = questions.map((q) => ({
      attempt_id: attemptId,
      user_id: userId,
      question_id: q.id,
      selected_key: answers[q.id] ?? "",
      is_correct: (answers[q.id] ?? "") === q.correct_key,
    }));
    const { error: insErr } = await supabase.from("diagnostic_answers").insert(rows);
    if (insErr) {
      setSubmitting(false);
      return toast.error(insErr.message);
    }

    const byArea: Record<string, { correct: number; total: number }> = {};
    let correct = 0;
    for (const q of questions) {
      byArea[q.area] ??= { correct: 0, total: 0 };
      byArea[q.area].total += 1;
      if (answers[q.id] === q.correct_key) {
        byArea[q.area].correct += 1;
        correct += 1;
      }
    }
    const score_by_area = Object.fromEntries(
      Object.entries(byArea).map(([k, v]) => [k, v.total ? v.correct / v.total : 0]),
    );
    const score = questions.length ? correct / questions.length : 0;

    const { error: updErr } = await supabase
      .from("diagnostic_attempts")
      .update({ status: "completed", completed_at: new Date().toISOString(), score, score_by_area })
      .eq("id", attemptId);
    if (updErr) {
      setSubmitting(false);
      return toast.error(updErr.message);
    }

    toast.success("Diagnóstico concluído!");
    navigate({ to: "/dashboard" });
  }

  if (loading) return <div className="p-10 text-muted-foreground">Carregando questões…</div>;
  if (!current) return <div className="p-10">Nenhuma questão disponível.</div>;

  const progress = ((idx + 1) / total) * 100;
  const selected = answers[current.id] ?? "";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="font-display font-bold">
            Apro<span style={{ color: "var(--brand)" }}>Vest</span>
          </Link>
          <span className="text-sm text-muted-foreground">
            {idx + 1} / {total} • {answeredCount} respondidas
          </span>
        </div>
        <Progress value={progress} className="rounded-none h-1" />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <Card>
          <CardHeader>
            <CardDescription className="uppercase tracking-wide text-xs">
              {current.area} • {current.subject}
            </CardDescription>
            <CardTitle className="text-lg leading-relaxed">{current.statement}</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selected} onValueChange={pick} className="space-y-2">
              {current.choices.map((c) => (
                <label
                  key={c.key}
                  htmlFor={`opt-${current.id}-${c.key}`}
                  className="flex items-start gap-3 rounded-lg border p-3 hover:bg-accent cursor-pointer"
                >
                  <RadioGroupItem value={c.key} id={`opt-${current.id}-${c.key}`} />
                  <div>
                    <strong className="mr-2">{c.key})</strong>
                    <span>{c.text}</span>
                  </div>
                </label>
              ))}
            </RadioGroup>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>
                Anterior
              </Button>
              {idx < total - 1 ? (
                <Button disabled={!selected} onClick={() => setIdx(idx + 1)}>
                  Próxima
                </Button>
              ) : (
                <Button disabled={!selected || submitting} onClick={finish}>
                  {submitting ? "Enviando…" : "Concluir diagnóstico"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site/SiteNav";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre — AproVest" },
      {
        name: "description",
        content:
          "Conheça o AproVest: a plataforma de estudos que usa IA para personalizar a preparação para o vestibular.",
      },
      { property: "og:title", content: "Sobre — AproVest" },
      { property: "og:description", content: "Conheça a proposta pedagógica e tecnológica do AproVest para a preparação de vestibulandos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 0%, color-mix(in oklab, var(--brand) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--brand)" }}
          >
            Sobre o projeto
          </p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Estudar pra vestibular não deveria ser uma{" "}
            <span style={{ color: "var(--brand)" }}>aposta no escuro.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            O AproVest nasce de uma ideia simples: cada vestibulando tem lacunas diferentes, e
            seu tempo é curto demais para estudar tudo. A gente usa inteligência artificial para
            mostrar exatamente o que estudar agora.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-b border-border/60">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2">
          <div>
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand)" }}
            >
              Missão
            </p>
            <h2 className="mt-3 text-4xl font-bold">
              Democratizar a preparação de alto desempenho.
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Cursinhos premium custam o salário de uma família inteira. Plataformas gratuitas
              entregam um oceano de vídeos sem direção. Resultado: a maioria dos estudantes
              chega na prova com a sensação de não ter estudado o suficiente.
            </p>
            <p>
              O AproVest combina IA adaptativa, correção humana de redação e simulados
              preditivos em uma plataforma única, acessível e baseada em dados — para que o
              estudante saiba, todo dia, o que fazer e por quê.
            </p>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section
        className="border-b border-border/60"
        style={{ backgroundColor: "var(--surface-2)" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-2xl text-4xl font-bold">O que nos torna diferentes.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                n: "01",
                t: "Dados acima do palpite",
                d: "Cada questão respondida atualiza seu nível em centenas de tópicos. A próxima questão é escolhida pra te empurrar adiante — nem fácil demais, nem impossível.",
              },
              {
                n: "02",
                t: "Redação que ensina",
                d: "Não basta uma nota. Você recebe comentários por competência e exemplos de como reescrever o trecho — o jeito mais rápido de evoluir.",
              },
              {
                n: "03",
                t: "Impacto social embutido",
                d: "Os 100 melhores estudantes do ranking mensal ganham acesso Pro gratuito. Quem aprende mais, paga menos.",
              },
            ].map((d) => (
              <article
                key={d.n}
                className="rounded-3xl border border-border bg-card p-7"
              >
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: "var(--brand)" }}
                >
                  {d.n}
                </span>
                <h3 className="mt-2 text-xl font-bold">{d.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
            <h2 className="text-4xl font-bold">Nossos princípios.</h2>
            <ul className="space-y-6">
              {[
                {
                  t: "Transparência pedagógica",
                  d: "Mostramos por que cada questão apareceu na sua fila — sem caixa-preta.",
                },
                {
                  t: "Tempo é o recurso mais escasso",
                  d: "Cada minuto na plataforma precisa render mais que um minuto fora dela.",
                },
                {
                  t: "Aprender com o erro",
                  d: "Errar uma questão vale mais que acertar três — desde que você entenda o porquê.",
                },
              ].map((v) => (
                <li key={v.t} className="flex gap-4">
                  <span
                    className="mt-1 inline-block h-5 w-5 flex-none rounded-md"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand), var(--accent-lime))",
                    }}
                    aria-hidden
                  />
                  <div>
                    <p className="font-semibold text-foreground">{v.t}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">
            Vamos transformar o seu próximo semestre.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Crie seu plano de estudos personalizado em menos de 5 minutos.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/"
              className="rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--brand)", color: "var(--brand-foreground)" }}
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
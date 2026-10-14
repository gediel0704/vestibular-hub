import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/site/SiteNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AproVest — Sua aprovação no vestibular com IA" },
      {
        name: "description",
        content:
          "Estude o que importa: IA adaptativa, correção híbrida de redação e simulados preditivos para ENEM e vestibulares.",
      },
      { property: "og:title", content: "AproVest — Sua aprovação no vestibular com IA" },
      {
        property: "og:description",
        content:
          "Banca infinita de questões, plano de estudos adaptativo e simulados que preveem sua nota.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 50% at 80% 0%, color-mix(in oklab, var(--brand) 22%, transparent), transparent 60%), radial-gradient(40% 40% at 10% 100%, color-mix(in oklab, var(--accent-lime) 30%, transparent), transparent 60%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="flex flex-col justify-center">
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent-lime)" }}
              />
              ENEM · FUVEST · UNICAMP · UFPR
            </span>
            <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground md:text-6xl">
              Sua aprovação no vestibular,{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, var(--brand), color-mix(in oklab, var(--accent-lime) 80%, var(--brand)))",
                }}
              >
                guiada por IA.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              O AproVest aprende como você estuda, identifica suas lacunas e monta um plano diário
              focado no que mais cai — com correção de redação em até 24h e simulados que preveem
              sua nota de corte.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                id="cta"
                href="#planos"
                className="rounded-full px-6 py-3 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
                style={{ backgroundColor: "var(--brand)", color: "var(--brand-foreground)" }}
              >
                Começar grátis
              </a>
              <Link
                to="/about"
                className="rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Conhecer o projeto
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border/60 pt-6">
              {[
                { k: "+50 mil", v: "questões classificadas" },
                { k: "24h", v: "correção de redação" },
                { k: "±15 pts", v: "precisão da nota" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="text-2xl font-bold text-foreground">{s.k}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Mock device */}
          <div className="relative flex items-center justify-center">
            <div
              className="absolute -inset-6 -z-10 rounded-[2rem] blur-2xl"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in oklab, var(--brand) 35%, transparent), color-mix(in oklab, var(--accent-lime) 25%, transparent))",
              }}
              aria-hidden
            />
            <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Painel da Meta</span>
                <span>USP · Engenharia</span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Nota projetada</p>
                <p className="text-5xl font-extrabold text-foreground">742</p>
                <p className="text-xs font-semibold" style={{ color: "var(--brand)" }}>
                  + 38 pts desde o último simulado
                </p>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { l: "Matemática", v: 78 },
                  { l: "Linguagens", v: 64 },
                  { l: "Humanas", v: 71 },
                  { l: "Natureza", v: 52 },
                ].map((b) => (
                  <div key={b.l}>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-foreground">{b.l}</span>
                      <span className="text-muted-foreground">{b.v}%</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${b.v}%`,
                          background: "linear-gradient(90deg, var(--brand), var(--accent-lime))",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-6 rounded-2xl p-4 text-sm"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--accent-lime) 18%, transparent)",
                }}
              >
                <p className="font-semibold text-foreground">Tarefa de hoje</p>
                <p className="mt-1 text-muted-foreground">
                  12 questões de Cinemática + revisar redação corrigida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        className="border-t border-border/60"
        style={{ backgroundColor: "var(--surface-2)" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <p
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: "var(--brand)" }}
            >
              Como funciona
            </p>
            <h2 className="mt-3 text-4xl font-bold text-foreground">
              Três pilares para sua aprovação.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Cada recurso foi desenhado para resolver um problema real do vestibulando: tempo
              curto, conteúdo gigante e ansiedade da prova.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                tag: "01 · Banca",
                title: "IA adaptativa",
                desc: "Questões selecionadas pela sua proficiência em cada tópico, com explicação passo a passo.",
              },
              {
                tag: "02 · Redação",
                title: "Correção híbrida",
                desc: "Pré-análise por IA e revisão de corretor humano em até 24h, com nota por competência.",
              },
              {
                tag: "03 · Simulado",
                title: "Nota preditiva",
                desc: "Simulados completos que projetam sua nota final e mostram sua distância da nota de corte.",
              },
            ].map((f) => (
              <article
                key={f.title}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {f.tag}
                </span>
                <h3 className="mt-3 text-2xl font-bold text-foreground">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                <div
                  className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, color-mix(in oklab, var(--accent-lime) 35%, transparent), transparent 70%)",
                  }}
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="planos" className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div
            className="overflow-hidden rounded-3xl px-8 py-14 text-center md:px-16 md:py-20"
            style={{
              background:
                "linear-gradient(135deg, var(--brand), color-mix(in oklab, var(--brand) 70%, black))",
              color: "var(--brand-foreground)",
            }}
          >
            <h2 className="mx-auto max-w-2xl text-4xl font-bold md:text-5xl">
              Pronto pra estudar o que realmente cai?
            </h2>
            <p className="mx-auto mt-4 max-w-xl opacity-80">
              Crie sua conta grátis e receba seu primeiro plano de estudos em minutos.
            </p>
            <a
              href="#"
              className="mt-8 inline-flex rounded-full px-7 py-3 text-sm font-semibold shadow-xl"
              style={{ backgroundColor: "var(--accent-lime)", color: "var(--ink)" }}
            >
              Quero começar agora
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

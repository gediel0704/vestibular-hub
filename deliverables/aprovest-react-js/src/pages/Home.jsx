import { ArrowRight, BrainCircuit, ChartNoAxesCombined, FilePenLine, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicLayout } from "../components/Layout";
import heroPhoto from "../assets/estudantes-hero.jpg";
import approvalPhoto from "../assets/aprovacao.jpg";
import essayPhoto from "../assets/redacao.jpg";
export default function Home() {
  const cards = [
    [BrainCircuit, "Banca adaptativa", "Questões selecionadas conforme seu desempenho."],
    [FilePenLine, "Redação híbrida", "Análise inteligente combinada com orientação humana."],
    [ChartNoAxesCombined, "Simulado preditivo", "Resultados claros para acompanhar sua evolução."],
  ];
  return (
    <PublicLayout>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="kicker">
                <Target size={16} /> ENEM · FUVEST · UNICAMP
              </span>
              <h1>AproVest</h1>
              <h2>Sua preparação para o vestibular, guiada por dados.</h2>
              <p>
                Descubra seus pontos fortes, encontre suas lacunas e transforme cada sessão de
                estudo em avanço real.
              </p>
              <div className="actions">
                <Link className="btn primary" to="/auth">
                  Começar grátis <ArrowRight size={18} />
                </Link>
                <Link className="btn secondary" to="/sobre">
                  Conhecer o projeto
                </Link>
              </div>
              <div className="hero-trust">
                <span>
                  <strong>3.300+</strong>
                  questões oficiais
                </span>
                <span>
                  <strong>3</strong>
                  vestibulares
                </span>
                <span>
                  <strong>IA</strong>
                  na correção de redação
                </span>
              </div>
            </div>
            <aside className="preview">
              <figure className="hero-photo">
                <img
                  src={heroPhoto}
                  alt="Estudantes estudando juntos em uma biblioteca"
                  width={1280}
                  height={960}
                />
              </figure>
              <span>PAINEL DA META</span>
              <h3>Engenharia · USP</h3>
              <strong className="score">74%</strong>
              <small>+8% no último ciclo</small>
              {[
                ["Matemática", 78],
                ["Linguagens", 64],
                ["Humanas", 71],
                ["Natureza", 52],
              ].map(([x, v]) => (
                <div className="metric" key={x}>
                  <label>
                    {x}
                    <b>{v}%</b>
                  </label>
                  <i>
                    <em style={{ width: `${v}%` }} />
                  </i>
                </div>
              ))}
              <div className="next">
                PRÓXIMO PASSO
                <br />
                <b>Concluir diagnóstico de 20 questões</b>
              </div>
            </aside>
          </div>
        </section>
        <div className="exam-band">
          <div className="container">
            <span>Conteúdo alinhado às bancas</span>
            <b>ENEM</b>
            <b>FUVEST</b>
            <b>UNICAMP</b>
          </div>
        </div>
        <section className="section">
          <div className="container">
            <span className="kicker">EM 4 PASSOS</span>
            <h2>Do diagnóstico à aprovação.</h2>
            <ol className="steps">
              <li>
                <h3>Crie seu perfil</h3>
                <p>Escolha curso e vestibulares-alvo.</p>
              </li>
              <li>
                <h3>Faça o diagnóstico</h3>
                <p>Descubra seu nível por disciplina.</p>
              </li>
              <li>
                <h3>Treine com a banca</h3>
                <p>Questões oficiais com feedback imediato.</p>
              </li>
              <li>
                <h3>Escreva redações</h3>
                <p>Correção por competências com IA.</p>
              </li>
            </ol>
          </div>
        </section>
        <section className="section muted">
          <div className="container">
            <span className="kicker">COMO FUNCIONA</span>
            <h2>Três pilares para estudar com direção.</h2>
            <div className="cards">
              {cards.map(([Icon, title, text], i) => (
                <article key={title}>
                  <Icon />
                  <small>0{i + 1}</small>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container photo-strip">
            <figure>
              <img
                src={essayPhoto}
                alt="Estudante escrevendo uma redação em folha de respostas"
                loading="lazy"
                width={1280}
                height={960}
              />
              <figcaption>
                <h3>Redação com correção real</h3>
                <p>Análise por competências, como nas bancas oficiais.</p>
              </figcaption>
            </figure>
            <figure>
              <img
                src={approvalPhoto}
                alt="Estudante comemorando a aprovação no vestibular"
                loading="lazy"
                width={1280}
                height={960}
              />
              <figcaption>
                <h3>Foco na aprovação</h3>
                <p>Cada sessão de estudo aponta o próximo passo.</p>
              </figcaption>
            </figure>
          </div>
        </section>
        <section className="cta">
          <div className="container">
            <div>
              <span>SEU PRÓXIMO PASSO</span>
              <h2>Comece descobrindo onde você está.</h2>
            </div>
            <Link className="btn accent" to="/auth">
              Fazer diagnóstico <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

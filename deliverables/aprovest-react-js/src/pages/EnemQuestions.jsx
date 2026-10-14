import { useEffect, useState } from "react";
import { BookOpenCheck, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { StudyLayout, ErrorNotice } from "../components/StudyLayout";
import { Button } from "../components/Button";
import { api } from "../lib/api";

function QuestionContent({ text }) {
  if (!text) return null;

  const parts = text.split(/(!\[[^\]]*\]\(https?:\/\/[^)]+\))/g);

  return (
    <div className="official-question-text">
      {parts.map((part, index) => {
        const image = part.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);

        if (image) {
          return (
            <img
              key={`${image[2]}-${index}`}
              src={image[2]}
              alt={image[1] || "Ilustração da questão"}
              loading="lazy"
            />
          );
        }

        return part ? <span key={index}>{part}</span> : null;
      })}
    </div>
  );
}

export default function EnemQuestions() {
  const [exams, setExams] = useState([]);
  const [year, setYear] = useState(2023);
  const [language, setLanguage] = useState("espanhol");
  const [index, setIndex] = useState(1);
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadExams() {
    try {
      const result = await api("enem_exams");
      setExams(result.exams);
      if (result.exams.length) setYear(result.exams[0].year);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadQuestion(nextIndex = index) {
    setBusy(true);
    setError("");
    setSelected("");
    setFeedback(null);

    try {
      const result = await api("enem_question", {
        year,
        index: nextIndex,
        language,
      });
      setQuestion(result.question);
      setIndex(nextIndex);
    } catch (err) {
      setQuestion(null);
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function answer() {
    setBusy(true);
    setError("");

    try {
      const result = await api("enem_answer", {
        year,
        index,
        language,
        key: selected,
      });
      setFeedback(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    loadExams();
  }, []);

  return (
    <StudyLayout title="Questões oficiais do ENEM" eyebrow="ACERVO COMPLEMENTAR">
      <section className="official-bank-intro panel">
        <div>
          <BookOpenCheck size={28} />
          <h2>Provas anteriores para praticar</h2>
          <p>
            Consulte questões de 2009 a 2023. O diagnóstico adaptativo e os simulados do AproVest
            continuam usando a curadoria pedagógica interna.
          </p>
        </div>
        <a href="https://enem.dev" target="_blank" rel="noreferrer">
          Fonte: enem.dev <ExternalLink size={15} />
        </a>
      </section>

      <div className="official-bank-toolbar">
        <label>
          Ano da prova
          <select
            value={year}
            onChange={(event) => {
              setYear(Number(event.target.value));
              setQuestion(null);
              setIndex(1);
            }}
          >
            {exams.map((exam) => (
              <option value={exam.year} key={exam.year}>
                {exam.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Língua estrangeira
          <select
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setQuestion(null);
              setIndex(1);
            }}
          >
            <option value="espanhol">Espanhol</option>
            <option value="ingles">Inglês</option>
          </select>
        </label>
        <label>
          Número
          <input
            type="number"
            min="1"
            max="185"
            value={index}
            onChange={(event) => setIndex(Number(event.target.value))}
          />
        </label>
        <Button disabled={busy || !exams.length} onClick={() => loadQuestion()}>
          {busy ? "Buscando…" : "Abrir questão"}
        </Button>
      </div>

      <ErrorNotice error={error} retry={() => loadQuestion()} />

      {question && (
        <article className="official-question panel">
          <div className="question-meta">
            <span>
              ENEM {question.year} · {question.disciplineLabel}
            </span>
            <span>Questão {question.index}</span>
          </div>

          <QuestionContent text={question.context} />
          {question.alternativesIntroduction && <h2>{question.alternativesIntroduction}</h2>}

          <div className="answers">
            {question.alternatives.map((alternative) => (
              <label
                className={`answer-option ${selected === alternative.letter ? "selected" : ""}`}
                key={alternative.letter}
              >
                <input
                  type="radio"
                  name="official-answer"
                  value={alternative.letter}
                  checked={selected === alternative.letter}
                  disabled={Boolean(feedback)}
                  onChange={() => setSelected(alternative.letter)}
                />
                <b>{alternative.letter}</b>
                <span>{alternative.text}</span>
                {alternative.file && (
                  <img src={alternative.file} alt={`Alternativa ${alternative.letter}`} />
                )}
              </label>
            ))}
          </div>

          {feedback ? (
            <div className={`answer-feedback ${feedback.correct ? "correct" : "incorrect"}`}>
              <h3>{feedback.correct ? "Resposta correta" : "Resposta incorreta"}</h3>
              <p>Gabarito: alternativa {feedback.correctAlternative}.</p>
            </div>
          ) : (
            <Button disabled={busy || !selected} onClick={answer}>
              Confirmar resposta
            </Button>
          )}

          <div className="question-navigation">
            <Button
              variant="secondary"
              disabled={busy || index <= 1}
              onClick={() => loadQuestion(index - 1)}
            >
              <ChevronLeft size={17} /> Anterior
            </Button>
            <Button variant="secondary" disabled={busy || index >= 185} onClick={() => loadQuestion(index + 1)}>
              Próxima <ChevronRight size={17} />
            </Button>
          </div>
        </article>
      )}

      {!question && !error && (
        <div className="official-bank-empty">
          <BookOpenCheck size={42} />
          <h2>Escolha uma prova e abra a primeira questão</h2>
          <p>O gabarito permanece protegido até a confirmação da resposta.</p>
        </div>
      )}
    </StudyLayout>
  );
}
// Catálogo de cursos de graduação oferecidos pelos vestibulares acompanhados.
// Fontes: catálogos oficiais da USP/FUVEST (fuvest.br), Unicamp (comvest.unicamp.br)
// e cursos ofertados via SISU/INEP (acessounico.mec.gov.br). Revisão: outubro de 2026.
// A lista é curada e estática porque não existe API pública gratuita e oficial
// com a oferta completa de cursos dessas instituições.

export const EXAM_OPTIONS = ["ENEM", "FUVEST", "Unicamp"];

export const COURSES_BY_EXAM = {
  ENEM: [
    "Administração",
    "Agronomia",
    "Arquitetura e Urbanismo",
    "Biomedicina",
    "Ciência da Computação",
    "Ciências Biológicas",
    "Ciências Contábeis",
    "Ciências Econômicas",
    "Direito",
    "Educação Física",
    "Enfermagem",
    "Engenharia Civil",
    "Engenharia de Produção",
    "Engenharia Elétrica",
    "Engenharia Mecânica",
    "Engenharia Química",
    "Farmácia",
    "Fisioterapia",
    "Jornalismo",
    "Letras",
    "Medicina",
    "Medicina Veterinária",
    "Nutrição",
    "Odontologia",
    "Pedagogia",
    "Psicologia",
    "Publicidade e Propaganda",
    "Sistemas de Informação",
  ],
  FUVEST: [
    "Administração",
    "Arquitetura e Urbanismo",
    "Biblioteconomia",
    "Biomedicina",
    "Ciência da Computação",
    "Ciências Biológicas",
    "Ciências Econômicas",
    "Direito",
    "Educação Física",
    "Enfermagem",
    "Engenharia Civil (Poli)",
    "Engenharia de Computação (Poli)",
    "Engenharia de Produção (Poli)",
    "Engenharia Elétrica (Poli)",
    "Engenharia Mecânica (Poli)",
    "Engenharia Química (Poli)",
    "Farmácia",
    "Filosofia",
    "Física",
    "Fisioterapia",
    "Geografia",
    "História",
    "Jornalismo",
    "Letras",
    "Matemática",
    "Medicina",
    "Medicina Veterinária",
    "Nutrição",
    "Odontologia",
    "Psicologia",
    "Química",
    "Relações Internacionais",
  ],
  Unicamp: [
    "Administração",
    "Arquitetura e Urbanismo",
    "Artes Visuais",
    "Ciência da Computação",
    "Ciências Biológicas",
    "Ciências Econômicas",
    "Ciências Sociais",
    "Dança",
    "Educação Física",
    "Enfermagem",
    "Engenharia Civil",
    "Engenharia de Computação",
    "Engenharia de Controle e Automação",
    "Engenharia Elétrica",
    "Engenharia Mecânica",
    "Engenharia Química",
    "Estatística",
    "Farmácia",
    "Filosofia",
    "Física",
    "Fonoaudiologia",
    "Geografia",
    "Geologia",
    "História",
    "Letras",
    "Matemática",
    "Medicina",
    "Música",
    "Nutrição",
    "Odontologia",
    "Pedagogia",
    "Química",
    "Sistemas de Informação",
    "Teatro",
  ],
};

// União dos cursos dos vestibulares escolhidos, sem repetições, em ordem alfabética.
export function coursesForExams(exams) {
  const selected = Array.isArray(exams) && exams.length ? exams : EXAM_OPTIONS;
  const all = new Set();
  for (const exam of selected) {
    for (const course of COURSES_BY_EXAM[exam] ?? []) all.add(course);
  }
  return [...all].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

// Normaliza a lista de vestibulares-alvo: remove inválidos, limita a 3 e
// garante ao menos um selecionado.
export function normalizeTargetExams(exams) {
  const valid = (Array.isArray(exams) ? exams : []).filter((exam) =>
    EXAM_OPTIONS.includes(exam),
  );
  const unique = [...new Set(valid)].slice(0, 3);
  return unique.length ? unique : ["ENEM"];
}

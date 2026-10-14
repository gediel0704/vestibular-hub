import { ExternalLink, BookMarked } from "lucide-react";
import { resourcesForExam } from "../lib/official-resources";

export function OfficialResources({ exam, kind = "Todos", search = "" }) {
  const resources = resourcesForExam(exam, kind, search);
  return (
    <section className="official-resources" aria-labelledby="official-resources-title">
      <div className="official-bank-intro">
        <div>
          <span className="kicker">INEP · FUVEST · COMVEST · MEC</span>
          <h2 id="official-resources-title">Fontes oficiais gratuitas</h2>
          <p>
            Programas, critérios e materiais das instituições. Referências consultadas em
            14/10/2026.
          </p>
        </div>
        <BookMarked size={32} aria-hidden="true" />
      </div>
      <div className="essay-grid">
        {resources.map((resource) => (
          <article className="panel essay-card" key={resource.id}>
            <span className="kicker">
              {resource.publisher} · {resource.kind}
            </span>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <span className="muted">{resource.edition}</span>
            <a
              className="btn secondary"
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar fonte <ExternalLink size={16} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
      {!resources.length && <p>Nenhuma referência encontrada para esse filtro.</p>}
      <p className="muted resource-disclaimer">
        Consulta gratuita não equivale a licença de reprodução. Os links abrem o acervo externo;
        esses materiais não foram importados como questões interativas do AproVest.
      </p>
    </section>
  );
}

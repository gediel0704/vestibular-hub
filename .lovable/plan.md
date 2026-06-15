
# Reescrita do Documento Norteador — AproVest

## Decisões aprovadas
- **Nome do projeto:** AproVest (substitui "Curioso Mundo" em todas as ocorrências: capa, sumário, corpo do texto, tabelas).
- **Ambiente:** Web + Mobile (mantido como no original).
- **Figuras:** desenvolver novas figuras coerentes com o novo escopo.
- **Estrutura do .docx:** preservada 100% (capa, folha de rosto, sumário, seções 1.1–1.13, tabelas, paginação).
- **Conteúdo:** substituído para refletir a nova ideia — plataforma de vestibular com Banca Adaptativa por IA + Redação Híbrida + Simulado Preditivo.
- **ABNT:** corrigir qualquer desvio encontrado no original (fonte Arial/Times 12, espaçamento 1,5, margens 3/2/2/3 cm, recuo 1,25 cm, paginação no canto superior direito, títulos conforme NBR 14724).

---

## Método de geração

1. Copiar `/mnt/user-uploads/Documento_Norteador_PRIT_Info_Belval-2Ano-Int_2026_1.docx` → `/tmp/base.docx`.
2. **Unpack** com o script `extract_document.py` (skill DOCX) → `/tmp/unpacked/`.
3. **Auditoria ABNT do XML** — verificar:
   - Fonte e tamanho (corrigir para Arial 12 se houver inconsistência).
   - Espaçamento entrelinhas (ajustar para 1,5 onde estiver fora).
   - Margens da seção (`<w:pgMar>`: top 1701, bottom 1134, left 1701, right 1134 twips = 3/2/3/2 cm).
   - Recuo de primeira linha (1,25 cm = 709 twips).
   - Numeração de página a partir da Introdução.
   - Estilo dos títulos primários (caixa alta + negrito), secundários (negrito), terciários (itálico).
4. **Substituir o conteúdo textual** dos `<w:t>`, preservando `<w:pPr>`, `<w:rPr>`, tabelas, relacionamentos, sumário e estilos.
5. **Gerar as novas figuras** (Figura 1 e Figura 2 + adicionais se necessário) com `imagegen--generate_image`, salvar em `/tmp/figuras/`, inserir no `word/media/` e atualizar `document.xml.rels` + `[Content_Types].xml`.
6. **Repack** com `repack_document.py` → `/mnt/documents/aprovest-documento-norteador_v1.docx`.
7. **QA visual obrigatório:** converter para PDF com LibreOffice, gerar imagens de **todas as páginas** com `pdftoppm`, inspecionar cada uma (capa, sumário, todas as tabelas, paginação, figuras, margens). Corrigir e regerar até ficar limpo.

---

## Mapeamento de conteúdo (estrutura idêntica, texto novo)

| Seção | Conteúdo novo |
|---|---|
| **Capa** | "AproVest" no lugar de "CURIOSO MUNDO". Demais campos (instituição, RMs, autores, BARUERI ABRIL/2026) preservados. |
| **Sumário** | Mesma estrutura 1.1–1.13. Paginação reatualizada. |
| **1.1 Responsáveis** | Tabela 100% preservada (integrantes, RMs, funções). |
| **1.2 Introdução** | Cenário do vestibular no Brasil; problema (saturação do mercado de cursinho online, ausência de personalização real e feedback preditivo); objetivo (desenvolver AproVest, plataforma Web + Mobile com banca adaptativa, redação híbrida e simulado preditivo); estrutura do trabalho. |
| **1.3 Justificativa** | Relevância para o vestibulando (personalização por IA, correção qualificada de redação, percentil real por curso); valor para o cliente; agilidade no acesso ao estudo direcionado; experiência integrada Web + Mobile. |
| **1.4 Cenário Atual** | Panorama do mercado de edtech (Descomplica, Stoodi, Me Salva!, AprovaTotal); limitações (foco em videoaula, baixo uso de dado individual, redação mal corrigida); oportunidade para uma plataforma orientada a dado. |
| **1.5 Descrição dos problemas** | Mesma tabela. Problema: dispersão e ineficiência do estudo para vestibular sem personalização. Afeta: vestibulandos. Impacto: baixa aprovação, ansiedade, desperdício de horas. Solução: plataforma adaptativa Web + Mobile com IA. Ambiente: [x] Web [x] Mobile. |
| **1.6 Escopo do Projeto** | Ambiente Web e Mobile com módulos: Diagnóstico Inicial, Banca Adaptativa Diária, Redação com IA + Correção Humana (créditos), Simulado Preditivo com Percentil, Painel da Meta, Ranking e Bolsa por Mérito, Assinatura Pro, Administrativo. |
| **1.7 Regras de Negócio** | RN01 — limite diário do plano free (20 questões/dia); RN02 — correção humana exige créditos; RN03 — gestão de banco de questões restrita a Administrador; RN04 — toda questão pertence a disciplina + tópico; RN05 — exclusão de conta remove dados associados (LGPD). |
| **1.8 RF + RNF** | Mesmas tabelas. RFs novos: cadastro, login, diagnóstico, banca diária, envio de redação, feedback IA, correção humana, simulado, painel da meta, ranking, assinatura Pro, compra de créditos, perfil, recuperação de senha, notificações. RNFs novos: segurança/criptografia, LGPD, desempenho, escalabilidade, acessibilidade, manutenibilidade, sincronização Web↔Mobile. |
| **1.9 Caso de Uso** | Atores: Visitante, Aluno Free, Aluno Pro, Corretor, Administrador. Casos: Fazer Diagnóstico, Responder Banca, Enviar Redação, Comprar Créditos, Corrigir Redação, Ver Percentil, Assinar Pro, Gerenciar Banco de Questões. **Nova Figura 3** — diagrama de caso de uso. |
| **1.10 DER** | Entidades: `usuario`, `user_roles`, `disciplina`, `topico`, `questao`, `resposta`, `proficiencia`, `redacao`, `feedback_redacao`, `simulado`, `simulado_resultado`, `credito`, `assinatura`. **Nova Figura 4** — diagrama ER. |
| **1.11 Telas e Protótipo** | Lista de telas: Abertura, Login/Cadastro, Onboarding/Diagnóstico, Painel da Meta, Banca, Redação, Simulado, Relatório, Planos. **Nova Figura 1** — Tela de Abertura; **Nova Figura 2** — Tela de Login. (Demais telas referenciadas como "a serem detalhadas na prototipação".) |
| **1.12 Manual do Usuário** | Fluxos: 1) Autenticação (login/cadastro); 2) Diagnóstico Inicial; 3) Banca Diária; 4) Envio de Redação; 5) Simulado; 6) Assinatura Pro / compra de créditos. |
| **1.13 Quadro Resumo** | Mesma tabela; itens aplicáveis atualizados conforme o novo escopo. |

---

## Figuras a gerar
- **Figura 1** — Tela de Abertura do AproVest (mockup web, hero com proposta de valor).
- **Figura 2** — Tela de Login do AproVest (mockup web).
- **Figura 3** — Diagrama de Caso de Uso (atores e casos listados acima).
- **Figura 4** — DER (entidades e relacionamentos).

Estilo: limpo, profissional, paleta sóbria coerente com identidade acadêmica. Mockups com aparência realista (não cartunesca). Diagramas com notação UML padrão.

---

## Entrega
- `/mnt/documents/aprovest-documento-norteador_v1.docx` — documento final, pronto para download.
- Original (`Documento_Norteador_PRIT_Info_Belval-2Ano-Int_2026_1.docx`) e glossário antigo permanecem intactos.
- Após sua revisão, posso gerar `aprovest-glossario_v1.docx` atualizando o glossário com o novo nome e termos.

Aprovado este plano, é só dizer "pode gerar" no próximo turno que eu construo.

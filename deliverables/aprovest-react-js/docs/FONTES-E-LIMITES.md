# Fontes oficiais, cobertura e limites

Referências consultadas em **14 de outubro de 2026**. O catálogo completo com URLs está em `src/lib/official-resources.js` e na aba **Fontes oficiais** da biblioteca.

## O que foi incorporado nesta etapa

| Banca/fonte | Referência | Uso atual |
| --- | --- | --- |
| INEP | Matriz ENEM, cartilha de redação 2026 | Consulta externa às habilidades e critérios oficiais |
| INEP | Provas e gabaritos, microdados, guia da nota | Acesso ao acervo e documentação; sem importação ou calibração automática |
| FUVEST | Programa e guia de provas 2027, acervo | Consulta às disciplinas, estrutura, redação e provas antigas |
| Comvest | Programa 2027, diretrizes de redação, leituras e provas comentadas | Referência aos critérios próprios e raciocínio da banca |
| MEC | Portal de recursos educacionais digitais / MECRED | Fonte complementar gratuita; cada recurso exige avaliação de nível e licença |

ENEM 2026 é uma edição de exame; FUVEST e Unicamp 2027 indicam o ingresso universitário. Os programas não comprovam que todas as provas futuras já estão disponíveis. Foram vinculados documentos a partir dos portais oficiais; não reproduzimos PDFs, imagens nem obras protegidas. A identificação de fonte oficial não implica parceria institucional.

## Motor adaptativo inicial

As prioridades são calculadas localmente a partir de resultados reais da API autenticada. Só entram sessões concluídas da banca selecionada. Para cada disciplina, usamos a taxa de acertos mais recente, entre zero e um. A prioridade é `1 - taxa de acertos`; empates são ordenados alfabeticamente. Nenhuma ponderação de relevância da banca foi inventada. Leituras já concluídas são excluídas das sugestões.

Isso corrige a mistura de históricos entre vestibulares, mas **não é diagnóstico validado por habilidade individual**. O banco ainda agrupa os resultados por disciplina. Cada questão precisa de classificação pedagógica revisada antes de associar com segurança códigos de habilidade, pré-requisitos e recursos específicos. Não atribuir habilidades automaticamente apenas pelo nome da disciplina.

## IA e orçamento

Nenhuma API paga nova foi integrada e nenhum pacote pago foi contratado. A correção existente pelo serviço de IA usa saldo e só acontece por envio do aluno. Os testes desta etapa não solicitaram correções de IA. Não há promessa de uso ilimitado ou hospedagem gratuita permanente.

Um modelo local poderia evitar uma cobrança externa por chamada, mas exige hardware, instalação, licença adequada, segurança e validação com professores; não foi implantado. Não presumir que ele corrige redações com precisão apenas por ser gratuito. Verificações mecânicas de texto não substituem avaliação das competências.

## Próximas etapas que ainda não foram concluídas

1. Importação estruturada de provas oficiais além da API comunitária: identificar edição, aplicação, cor, idioma e gabarito retificado; revisar extração dos PDFs, imagens e direitos de uso antes da publicação.
2. Mapa de habilidades e pré-requisitos: classificar questões e conteúdos com revisão docente; manter autoria, versão e proveniência. A biblioteca de links não substitui esse acervo.
3. Correção de redações validada: obter redações anonimizadas e avaliações de professores com autorização, comparar notas por competência e investigar divergências. Nenhum conjunto humano de referência foi fornecido nesta etapa.
4. TRI: verificar o dicionário de cada conjunto INEP, disponibilidade de parâmetros, ligação exata entre itens e respostas, amostra e calibração. Microdados e acertos não bastam para reproduzir a nota oficial. Nenhuma nota TRI foi implementada nesta etapa.
5. Editais: revisão administrativa de prazos e mudanças nas páginas oficiais; não importar datas automaticamente como definitivas.

## API e VS Code

O cliente acadêmico não contém o servidor de IA e avaliação. `npm run dev` nesta pasta inicia apenas a interface. A API padrão agora usa o endereço hospedado estável, inclusive em localhost, mas o responsável precisa **publicar o projeto principal** para esse endereço funcionar. A verificação em 16/10/2026 encontrou API local respondendo e endereço hospedado retornando 404: o acesso externo ainda está indisponível. Para desenvolvimento do servidor local, configure explicitamente `VITE_ACADEMIC_API_URL=http://localhost:8080/api/public/academic`. Não cole chaves privadas no `.env` do navegador. No PowerShell, use `npm.cmd install` e `npm.cmd run dev` para evitar o bloqueio de `npm.ps1` sem alterar políticas do Windows. Hospedar a interface acadêmica é uma etapa distinta de publicar a API do projeto principal.

A sincronização GitHub atualiza arquivos, não publica a API. Conectar GitHub é uma ação do proprietário no editor Lovable; o procedimento está no README. A versão acadêmica continua React + JavaScript + Vite e o produto comercial não foi alterado.
## Alinhamento pedagógico às fontes oficiais (outubro de 2026)

- **ENEM**: banca de questões reais 2009–2023 via API pública enem.dev (acervo do INEP),
  com gabarito protegido no servidor. Complementada pelas questões autorais curadas.
  Não há API oficial do INEP para questões; os microdados e gabaritos oficiais estão em
  gov.br/inep. Não existe TRI pública oficial — o simulado preditivo é estimativa de treino.
- **FUVEST**: não existe API pública de questões. As referências oficiais (fuvest.br,
  manual do candidato, provas anteriores publicadas pela fundação) estão catalogadas em
  `src/lib/official-resources.js`. Os conteúdos FUVEST da plataforma são autorais e
  seguem as habilidades dos editais oficiais.
- **Unicamp**: idem — COMVEST (comvest.unicamp.br) publica provas e expectativas de
  resposta; não há API pública. Conteúdos Unicamp são autorais, alinhados aos editais.
- **Cursos**: o catálogo de cursos-alvo (`src/lib/courses.js`) é curado a partir dos
  catálogos oficiais das três instituições. Não há API pública gratuita com a oferta
  completa de cursos; a lista é revisada manualmente a cada edição dos vestibulares.
- **Regra de qualidade**: nenhum conteúdo é publicado sem revisão. Itens autorais passam
  pela avaliação de conteúdo da área docente antes de aparecer para os alunos.

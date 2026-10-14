# AproVest — entrega acadêmica web completa e SQL Server

## Escopo confirmado
- Desenvolver apenas a versão acadêmica React e JavaScript, preservando o visual e a organização atual das páginas. Não alterar o produto comercial.
- Usar o último documento norteador AproVest desta conversa como referência, incluindo RF01–RF19 e RN01–RN05. Priorizar ENEM, FUVEST e Unicamp.
- Entregar um arquivo SQL Server separado para a atividade e uma nova versão numerada do ZIP web, com código legível em múltiplas linhas.
- Incluir também no ZIP os scripts `.sql` do banco efetivamente usado pelo site: estrutura, relacionamentos, permissões, funções e dados pedagógicos iniciais, com instruções de instalação.
- O escopo desta entrega é web, utilizável também em telas pequenas; aplicativo mobile nativo não está incluído.

## Situação real
Hoje existem início, sobre, autenticação, cadastro da meta, diagnóstico fixo, painel e CRUD de redações. Ainda não existem correção por IA, banca adaptativa, simulados, biblioteca de conteúdos nem áreas de professor e administrador. Situação “Corrigida” não significa que já exista correção automática.

## 1. Banco SQL para a atividade
- Criar `AproVest_SQLServer_v1.sql` com tabelas, chaves, relacionamentos, índices, validações, dados pedagógicos de demonstração e exemplos de consultas CRUD, em T-SQL.
- Modelar alunos, papéis, metas, disciplinas, tópicos, bancas e edições, questões e alternativas, respostas e proficiência, materiais, redações e correções, simulados e resultados, planos de estudo, notificações, assinaturas e créditos.
- Incluir instruções de instalação e um roteiro de verificação de integridade. Nunca exportar usuários reais, redações reais, senhas ou chaves privadas.
- **Distinção explícita:** o site atual permanece conectado ao banco PostgreSQL do Lovable Cloud. O arquivo SQL Server é uma versão equivalente do modelo para a atividade, não um backup executável do banco atual nem uma migração automática do site. Conectar o site a um SQL Server exige hospedagem e uma camada de acesso próprias, fora desta configuração.
- **Duas entregas SQL:** `AproVest_SQLServer_v1.sql` para a atividade e scripts PostgreSQL do banco real do site dentro do ZIP. PostgreSQL também é um banco SQL. Ambos representam o mesmo modelo funcional, mas têm sintaxes próprias e instruções distintas. Os scripts do site dependem dos serviços de autenticação do Lovable Cloud e devem documentar essas dependências, sem afirmar instalação autônoma em qualquer PostgreSQL.
- O site continua usando PostgreSQL no Lovable Cloud; não será migrado para SQL Server apenas para fornecer arquivos `.sql`. Uma exigência adicional de que o site execute especificamente sobre SQL Server muda a infraestrutura e precisa ser confirmada antes dessa migração.
- Validar a sintaxe e as relações; declarar separadamente se não houver um SQL Server disponível para teste de execução.

## 2. Identidade, papéis e regras
- Completar login, recuperação de senha, perfil, universidade/curso-alvo e preferências.
- Separar papel de aluno, professor/corretor e administrador da assinatura Pro. O usuário não escolhe seu próprio privilégio.
- Professor acessa apenas alunos e redações atribuídos; administrador gerencia questões, tópicos, materiais, temas, simulados, atribuições e usuários. Preservar RN03: professor não publica questões sem autorização administrativa.
- Administrador inicial atribuído com autorização explícita, nunca por senha fixa ou seleção no cadastro.
- Aplicar e testar no servidor: gratuito até 20 questões da banca diária e um envio para IA por mês; crédito para correção humana e prazo de até 72 horas conforme documento. Não inventar preços que não foram aprovados.

## 3. Preparação do aluno
- Biblioteca por banca, edição, disciplina e tópico, com materiais de estudo e links oficiais, progresso e recomendações.
- Diagnóstico de aproximadamente 30 questões, resultados por tópico e meta de aprovação.
- Banca diária adaptativa com dificuldade ajustada ao desempenho, explicação das respostas e repetição espaçada para erros.
- Plano diário integrando questões, leitura e treino de redação, com histórico e painel de evolução.
- Simulados cronometrados semanais e mensais, retomada, encerramento e resultados persistidos.
- Percentil apenas sobre participantes reais comparáveis, mostrando tamanho da amostra. Com amostra insuficiente, informar indisponibilidade em vez de inventar comparação.
- Ranking mensal com critérios explícitos e bolsa de um mês Pro para os 100 primeiros, conforme RF12, sem expor dados pessoais sem consentimento.

## 4. Redação e automações de IA reais
- Completar o CRUD com envio para avaliação, versões, devolutiva por critério, trechos comentados, reescrita e histórico.
- ENEM: cinco competências, até 200 pontos cada. FUVEST e Unicamp: critérios próprios da edição e do gênero solicitado, sem aplicar automaticamente a rubrica ENEM.
- Correção híbrida: pedido de revisão humana, atribuição ao corretor, fila, prazo e devolutiva identificada como humana ou automatizada.
- IA também auxilia recomendações de estudo e sugere questões e temas para revisão administrativa. Material gerado não será rotulado como prova oficial.
- Executar chamadas reais, guardar resultados e apresentar erros e interrupções claramente; nunca simular notas para aparentar funcionamento.
- IA exige internet, serviço protegido e saldo de uso. A avaliação é pedagógica, não nota oficial nem garantia de aprovação.

## 5. Alinhamento às bancas
- Registrar origem, ano/edição, referência oficial, tópico, competência, gênero, gabarito e explicação de cada item.
- Separar itens oficiais, autorais e gerados com revisão. Importar apenas material cuja utilização seja permitida, respeitando direitos de textos e imagens.
- Conferir documentos oficiais da edição alvo antes de fixar critérios; não tratar guias antigos como regras atuais.
- A adaptação inicial pode usar Elo como estimativa pedagógica. Não chamar percentual de acertos ou Elo de TRI oficial do ENEM.
- Projeção de nota e aprovação somente com método e dados calibrados; quando inexistentes, mostrar desempenho de treino e limitações.

## 6. Demais páginas e funções do documento
- Completar início, sobre, autenticação, perfil, metas, biblioteca, banca, redações, simulados, histórico, notificações e áreas restritas, sem mudar a identidade visual.
- Incluir modo escuro, relatório de desempenho exportável em PDF, exportação dos dados pessoais e solicitação de exclusão com tratamento seguro dos vínculos.
- Planos, créditos e relatórios financeiros com dados reais do sistema. Pagamento recorrente e compra de créditos dependem da conexão autorizada com Stripe, cadastro do vendedor e definição de preços; enquanto isso, deixar indisponibilidade explícita, sem checkout fictício.
- Bolsa automática e notificações periódicas dependem de agendamento persistente e verificado; não depender de uma página aberta para executar.

## Detalhes técnicos
- Manter o front-end acadêmico isolado em `deliverables/aprovest-react-js`, configuração pública portátil, telas de erro e Rollup WASM.
- Para IA e operações privilegiadas, usar serviços protegidos no servidor. O front-end acadêmico consome esses serviços por uma API autenticada; apenas publicar essa camada de suporte no ambiente Lovable, sem mudanças nas telas comerciais.
- Validar identidade e permissões a cada chamada, limitar uso e impedir exposição de gabarito antes da resposta e gravação de notas pelo aluno.
- Alterações do banco ativo em migrações próprias com permissões mínimas. O T-SQL da atividade é mantido separado das migrações PostgreSQL.
- Guardar prompts e chaves privadas no servidor, nunca no ZIP do navegador. Registrar regras estruturais em `AGENTS.md`.

## Verificação e entrega
- Criar testes concretos de limites, permissões, correção, adaptação, créditos e acesso apenas aos próprios dados.
- Testar cada fluxo completo com contas autorizadas de aluno, professor e administrador, incluindo gravação e leitura após recarregar.
- Verificar chamadas reais de IA, estados de erro, telas pequenas e grandes, instalação limpa e dependências portáteis. Não afirmar teste em Windows sem executá-lo nesse sistema.
- Entregar SQL Server separado e incluir os scripts SQL PostgreSQL do banco efetivo na nova versão do ZIP, com documentação de instalação, sem dependências geradas ou segredos.
- Manter lista objetiva de funções concluídas, limitações pedagógicas e dependências externas pendentes. Disponibilidade de 99%, resposta de dois segundos e retenção de backup de 30 dias exigem medição/configuração da hospedagem, não apenas código.

## Ordem de execução
1. SQL Server e modelo pedagógico/permissões.
2. Biblioteca, diagnóstico, banca, plano e simulados.
3. IA, redação híbrida e áreas de professor/administrador.
4. Demais funções, integrações autorizadas, testes e pacote final.

Este é o plano da entrega completa; o site não deve ser apresentado como concluído antes de executar e validar todas as etapas.
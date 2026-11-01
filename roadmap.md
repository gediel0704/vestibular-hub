# Roadmap

## Documentação conforme modelo LogiPilot — 01/11/2026
- [x] Adaptar itens 1.9–1.13 em Word, com especificações de casos, DER, telas acadêmicas preservadas e manual
- [x] Entregar 42 tabelas editáveis e diagrama UML completo em uma única imagem PNG
- [x] Validar Word e conferir 68 páginas do complemento, 43 das tabelas e o diagrama; remover página vazia e corrigir condição da retomada de IA

## Documento norteador fiel ao site construído — 31/10/2026
- [x] Auditar funcionalidades e modelo SQL atuais e retirar promessas de recursos não construídos; 25 testes existentes aprovados
- [x] Adequar todas as seções, tabelas e diagramas ao escopo implementado, conservando 12 capturas acadêmicas e identificando dependências SQL reais
- [x] Gerar edição v3 Word/PDF, validar e conferir visualmente as 37 páginas; corrigir sumário e campos do DER

## Revisão do documento norteador — 28/10/2026
- [x] Conferir os itens 1.1–1.8 e distinguir requisitos previstos de funcionalidades comprovadas
- [x] Revisar tabelas, casos de uso, DER, navegação e manual dos itens 1.9–1.13
- [x] Capturar 13 telas reais da versão acadêmica, com dados pessoais ocultados; área docente acessada pelo administrador, sem homologação docente real
- [x] Entregar edição v2 DOCX/PDF e imagens, após validação do Word e revisão visual das 40 páginas

## Acervo oficial dentro do script do banco do site — 16/10/2026
- [x] Exportar as 627 questões oficiais (339 FUVEST, 288 Unicamp) para `database/postgresql/20261016_academic_items_official.sql`, com gabarito, explicação e fonte
- [x] Executar o script inteiro numa cópia temporária isolada: 627 inseridas, 627 com alternativas e gabarito, conferência por banca correta
- [x] Conferir reaplicação: repetir a mesma questão não duplica nem gera erro
- [ ] Incluir as 634 questões dependentes de imagem: depende das figuras oficiais das provas

## Menu acadêmico e nova cópia local — 16/10/2026
- [x] Corrigir corte e sobreposição dos menus; quatro menus verificados com CSS real em 1280px e 390px, sem corte nem bloqueio de clique
- [x] Orientar nova clonagem no VS Code sem desconectar o repositório do Lovable

## Áreas distintas e gestão financeira por perfil
- [x] Separar navegação e acesso por perfil, com autorização de ações no servidor e testes automatizados
- [x] Acrescentar pareceres de conteúdo à fila de correções docentes
- [x] Preparar relatório de remunerações registradas e distribuição bruta, sem inventar lucro líquido
- [x] Apresentar cadastros, vigência de acessos e exportações; distinguir bolsas de assinaturas pagas
- [x] Registrar decisão: preparar sem ativar cobrança; preços e repasse sugeridos não foram configurados
- [x] Atualizar scripts PostgreSQL e SQL Server; testar as três áreas com conta administrativa existente
- [ ] Concluir relatório de receitas reais, assinaturas pagas e pagamento de repasses: depende de ativação de cobrança autorizada e operações verificadas
- [ ] Validar parecer enviado e isolamento com identidade docente real: depende de professor autorizado; não conceder papéis só para testar
- [ ] Disponibilizar atualização da API hospedada: depende de publicação autorizada desta revisão

## Finalização acadêmica — 16/10/2026
- [x] Conferir o documento norteador e registrar lacunas reais, sem confundir implementação com validação
- [x] Validar instalação limpa e automatizar verificações de Node e conexão no fluxo npm
- [x] Corrigir e testar API e correção por IA com sessão real no serviço local
- [x] Abrir todas as páginas autenticadas e testar criação, IA e leitura do histórico de redação
- [x] Confirmar correção contínua publicada: avaliação ENEM 880/1000 retornada pela interface sem override local e histórico relido
- [ ] Validar correção com conta real de professor: depende de identidade docente autorizada
- [ ] Validar TRI e acervo por habilidades: depende de parâmetros e revisão pedagógica; não inventar notas oficiais
- [ ] Ativar pagamentos: depende de conta de recebimento e preços aprovados, preservando ausência de novos gastos
- [ ] Testar Windows real: depende de acesso a esse ambiente; PowerShell bloqueia npm antes do código do projeto

Lacunas verificadas do documento estão em `deliverables/aprovest-react-js/docs/VALIDACAO-ENTREGA.md`; os checkboxes históricos abaixo não comprovam conclusão integral.

## Conexão acadêmica em outras máquinas
- [x] Remover dependência automática da API em localhost e testar a seleção do endereço
- [x] Documentar execução pelo terminal sem scripts PowerShell nem novos downloads ZIP
- [ ] Publicar a API: depende da publicação autorizada pelo proprietário

- [x] Auditar o código React + JavaScript entregue
- [x] Pesquisar mercado, concorrentes, custos e obrigações em Barueri/SP
- [x] Revisar proposta de valor e diferenciais do AproVest
- [x] Estruturar arquitetura recomendada para o produto comercial
- [x] Elaborar plano operacional, administrativo e financeiro de 3 anos
- [x] Gerar e revisar DOCX e PDF
## Trabalho atual
- [x] Reformatar o código acadêmico para estruturas legíveis em múltiplas linhas
- [x] Implementar CRUD de redações na versão acadêmica
- [x] Validar funcionamento e empacotar nova versão do ZIP
- [x] Corrigir a inicialização local sem configuração e revisar o pacote acadêmico completo
- [x] Validar a versão configurada e a mensagem para configuração ausente
- [x] Gerar um novo ZIP acadêmico com o arquivo `.env` incluído
- [x] Tornar a configuração pública da versão acadêmica independente do arquivo `.env`
- [x] Validar a versão acadêmica sem `.env` em páginas públicas e autenticadas
- [x] Gerar e inspecionar um novo ZIP portátil
- [x] Eliminar a dependência nativa do Rollup na entrega acadêmica e testar instalação limpa
- [x] Gerar e inspecionar o ZIP acadêmico atualizado para a correção do Windows

## Entrega acadêmica completa solicitada
- [x] Confirmar documento de referência, formato SQL exigido e vestibulares prioritários
- [x] Entregar arquivo SQL separado, documentado e validado
- [x] Incluir no ZIP os scripts SQL do banco efetivamente utilizado pelo site, além do SQL Server separado da atividade
- [x] Completar funções de aluno, professor e administrador com permissões seguras
- [x] Completar banco de questões, conteúdos, diagnóstico e preparação alinhados às bancas
- [x] Integrar e validar correção de redações e demais automações de IA aprovadas
- [x] Completar e testar todas as páginas e os fluxos por perfil
- [x] Empacotar e inspecionar nova versão web acadêmica completa

## Revisão visual, login social e acervo ENEM

- [x] Auditar a API ENEM anexada, sua cobertura, licença e limitações
- [x] Integrar o acervo como fonte complementar sem expor gabaritos antecipadamente
- [x] Corrigir o redirecionamento Google e Apple no ambiente local
- [x] Aprimorar relevos, foco, cartões, formulários, navegação e modo escuro
- [x] Validar login social real, acervo ENEM e telas principais de ponta a ponta
- [x] Atualizar e inspecionar o ZIP acadêmico

## Fontes gratuitas e atualização pelo VS Code

- [x] Consultar e verificar programas, provas, matrizes e critérios oficiais gratuitos
- [x] Integrar referências oficiais à biblioteca acadêmica e ao plano de estudos
- [x] Tornar as prioridades adaptativas transparentes e testar as regras
- [x] Documentar limitações de TRI e custos da IA, sem contratar serviços adicionais
- [x] Documentar atualização pelo GitHub e execução acadêmica no VS Code
- [x] Validar a navegação e recomendações acadêmicas
- [x] Conectar GitHub: conexão concluída pelo proprietário, conforme informado na conversa
- [ ] Validar correções por competência: depende de redações autorizadas e avaliações docentes de referência

Escopo desta etapa: referências externas e prioridade por disciplina; não confundir com importação completa de provas, classificação docente por habilidade ou TRI calibrada. As lacunas e critérios de evolução estão documentados em `deliverables/aprovest-react-js/docs/FONTES-E-LIMITES.md`.

## Aprimoramentos acadêmicos — 16/10/2026 (noite)
- [x] Imagens reais de estudantes na página inicial e no login; estilos com relevos e seções visuais
- [x] Escolha de perfil (aluno/professor) no cadastro, gravada no servidor via ação choose_role
- [x] Correção do 404 no login social: arquivo _redirects para hospedagem estática (SPA fallback)
- [x] Seleção de 1 a 3 vestibulares-alvo no onboarding e nas configurações; painel por vestibular no dashboard
- [x] Diagnóstico e simulado sem revelar resposta; treino (banca diária) com relevo verde/vermelho, resposta correta e explicação
- [x] Menu de estudos agrupado com expansão ao passar o mouse
- [x] Página de configurações: perfil, vestibulares, curso, email e senha
- [x] Catálogo curado de cursos por vestibular (src/lib/courses.js) — sem API pública gratuita disponível
- [x] Documentado alinhamento com fontes oficiais em docs/FONTES-E-LIMITES.md
- [ ] Republicar a API (choose_role, target_exams, correct_key) — depende de publicação autorizada
- [ ] Validar login social no site hospedado após novo deploy do pacote estático

## Banca oficial FUVEST/Unicamp — 16/10/2026 (noite)
- [x] 626 questões oficiais FUVEST/Unicamp (2018–2024) importadas para o banco (origem "official")
- [x] Ação admin_import na API para importação em lote validada no servidor
- [x] Apuração de assuntos por vestibular em docs/ANALISE-ASSUNTOS.md
- [x] Script reproduzível scripts/importar-bluex.py
- [ ] ENEM 2024: aguardando publicação na API pública enem.dev (hoje vai até 2023)
- [ ] 634 questões com imagens das provas FUVEST/Unicamp aguardam revisão com figuras oficiais

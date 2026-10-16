# AproVest — React + JavaScript

Versão acadêmica web em React 19, JavaScript, Vite, React Router, Bootstrap Grid e Lovable Cloud.

## Executar o site (qualquer computador)

O projeto inclui inicializadores universais que verificam o ambiente, instalam as dependências e abrem o site, sem exigir comandos manuais:

- **Windows:** dê dois cliques em `iniciar-windows.cmd` (ou execute-o no Prompt de Comando). Ele funciona mesmo quando o PowerShell bloqueia scripts, pois não depende do PowerShell.
- **macOS e Linux:** execute `bash iniciar-mac-linux.sh` no terminal.

Os inicializadores avisam com mensagens claras se o Node.js estiver ausente ou desatualizado. Para verificar o ambiente sem iniciar o site, execute `npm run verificar`.

### Execução manual (alternativa)

1. Instale Node.js 20.19+ ou 22.12+ (LTS recomendado).
2. Clone o repositório GitHub e abra `deliverables/aprovest-react-js` no VS Code, ou extraia o ZIP em uma pasta nova.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Abra o endereço exibido no terminal.

A conexão pública com autenticação e banco já tem valores padrão no código. O `.env` não é obrigatório; `.env.example` documenta substituições opcionais. O login Google e Apple usa o serviço de autenticação hospedado do projeto mesmo quando a interface roda em localhost.

## API acadêmica e IA

Questões, limites, notas, papéis, gabaritos e IA passam pela API autenticada `/api/public/academic`, incluída no projeto Lovable que acompanha esta entrega. O cliente usa por padrão o endereço hospedado estável, inclusive em localhost: o responsável precisa publicar o projeto Lovable antes de a API estar disponível. Não é necessário iniciar um segundo servidor no computador do professor. Para desenvolvimento local completo, substitua `VITE_ACADEMIC_API_URL` por `http://localhost:8080/api/public/academic` e inicie também o servidor principal. A IA nunca funciona sem internet, API no servidor e saldo disponível.

### Windows: executar no próprio terminal, sem baixar inicializador

No PowerShell do VS Code, na pasta `deliverables/aprovest-react-js`, execute:

```powershell
npm.cmd install
npm.cmd run dev
```

`npm.cmd` evita o script `npm.ps1` bloqueado pelo PowerShell, sem alterar a política de segurança do Windows. Ainda exige Node.js compatível e internet para instalar dependências; nenhum código pode garantir ausência de conflitos em todas as máquinas. Se as dependências já estiverem instaladas e não tiverem mudado, basta o segundo comando.

O professor só precisa instalar dependências se for executar ou avaliar o código localmente. Para acesso somente pelo navegador, a interface acadêmica React/Vite deve ser hospedada também: publicar o projeto principal disponibiliza sua API, mas não transforma automaticamente a pasta acadêmica no site público. Para evitar novos ZIPs durante a revisão, conecte o GitHub e atualize a cópia local pelo Git.

O ZIP não contém chave privada de IA. A chave é administrada de modo protegido pelo Lovable. O código acadêmico do navegador não recebe gabaritos nem pode atribuir papéis ou notas.

## Funções implementadas

- início, sobre, cadastro, login Google/e-mail, recuperação e troca de senha;
- perfil, meta por curso/universidade/banca, modo escuro, exportação e pedido de exclusão;
- biblioteca autoral de fundamentos para ENEM, FUVEST e Unicamp, com referências oficiais;
- acervo complementar de questões oficiais do ENEM de 2009 a 2023, consultado pelo serviço externo enem.dev sem expor o gabarito antes da resposta;
- diagnóstico com 30 exercícios, banca diária adaptativa e repetição espaçada;
- plano de estudo, histórico, notificações e relatório imprimível em PDF;
- simulados cronometrados, retomada e percentil apenas com pelo menos 5 participantes comparáveis;
- redações com CRUD, versões preservadas na correção, IA por banca e fila de correção humana;
- professor acessa somente correções atribuídas; administrador gerencia materiais, questões, papéis e atribuições;
- limites do plano gratuito: 20 questões diárias e uma correção por IA no mês;
- ranking com consentimento e estrutura de bolsa mensal, além de telas claras para integrações ainda indisponíveis.

## Limitações explícitas

- os 30 exercícios por banca são autorais e introdutórios; não são questões oficiais completas nem substituem o programa oficial da edição;
- o acervo enem.dev depende de um serviço comunitário, possui limite de uso e não inclui TRI, conteúdos teóricos, redação, diagnóstico adaptativo nem edições posteriores a 2023;
- a adaptação usa estimativa Elo pedagógica, não TRI oficial do ENEM;
- correções e notas da IA são estimativas para treino, não resultados oficiais;
- pagamento recorrente e compra de créditos ficam indisponíveis até o responsável definir preços e conectar uma conta Stripe;
- a bolsa mensal possui regra segura no banco, mas sua execução automática depende da configuração do agendamento na hospedagem;
- disponibilidade de 99%, resposta em dois segundos e backups por 30 dias dependem da hospedagem e precisam ser medidos/configurados;
- esta entrega é web adaptável a celulares; não inclui aplicativo móvel nativo.

## Bancos SQL entregues

- `database/postgresql/`: migrações SQL que criam o banco real usado pelo site, com permissões, RLS, funções, limites e dados pedagógicos autorais. Dependem do Lovable Cloud e de seu serviço de autenticação.
- `database/sqlserver/AproVest_SQLServer_v1.sql`: modelo equivalente em T-SQL para a atividade de SQL Server, com 22 tabelas, relacionamentos, índices, triggers, dados fictícios e exemplos CRUD. Ele não conecta automaticamente o site ao SQL Server.
- `database/README.md`: ordem de execução, diferenças e roteiro de validação.

Nenhum script contém usuários, senhas, redações ou notas reais.

## Compatibilidade Windows

O Rollup do Vite é substituído oficialmente pela edição WebAssembly, evitando a falha do pacote nativo opcional no Windows. Não copie `node_modules` de outro computador. O pacote foi instalado e compilado em ambiente Linux; a execução final em Windows precisa ser confirmada na máquina da entrega.

### Se o PowerShell bloquear o npm

Em Windows, o PowerShell pode proibir scripts e exibir "a execução de scripts foi desabilitada neste sistema" ao digitar `npm install`. Isso é uma regra do Windows, não um erro do projeto. Três saídas:

1. **Recomendada:** use `iniciar-windows.cmd`, que não depende do PowerShell.
2. Use o Prompt de Comando (`cmd`) em vez do PowerShell: ele chama `npm.cmd` e não é afetado pela regra.
3. Ou libere scripts apenas para o seu usuário, no PowerShell: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` e confirme com `S`. Depois, `npm install` funciona normalmente.

Para liberar só na janela aberta, sem alterar nada no sistema: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.

## Estrutura principal

- `src/App.jsx`: rotas das páginas;
- `src/pages`: telas em JavaScript/JSX;
- `src/components`: interface reutilizável;
- `src/lib/api.js`: comunicação autenticada com a API;
- `src/lib/supabase.js`: autenticação e CRUD simples do próprio aluno;
- `database`: scripts PostgreSQL e SQL Server;
- `src/styles.css`: identidade visual preservada e adaptação a telas menores.

O código foi formatado em múltiplas linhas para facilitar a revisão.

## Atualizar pelo VS Code sem baixar ZIP

1. No editor Lovable, abra **+ → GitHub → Connect project**, autorize sua conta e crie o repositório. Essa etapa é feita pelo proprietário; o código não conecta a conta automaticamente.
2. Instale Git no computador. No VS Code, abra a paleta de comandos e escolha **Git: Clone**; cole a URL do repositório criado e abra a pasta clonada.
3. O repositório contém as duas versões. No terminal, execute `cd deliverables/aprovest-react-js`, `npm install` e `npm run dev` para trabalhar na versão acadêmica.
4. Para receber alterações feitas no Lovable, use **Controle do Código-Fonte → … → Pull**. Para enviar alterações locais, revise os arquivos, faça um commit e use **Push**. Essas ações são executadas por você no VS Code; não são automáticas no computador.
5. Se houver alterações locais pendentes, faça commit antes do Pull e resolva eventuais conflitos. Não edite o mesmo arquivo nos dois lugares simultaneamente. Nunca envie chaves privadas ou senhas ao GitHub.
6. Se o arquivo de dependências mudar, execute `npm install` novamente. O GitHub elimina downloads repetidos, mas não hospeda a API nem fornece saldo de IA.

## Fontes oficiais e preparação sem serviços novos pagos

A biblioteca tem um seletor entre materiais AproVest e fontes oficiais gratuitas, com filtros por banca e tipo. O catálogo `src/lib/official-resources.js` referencia matriz e cartilha ENEM 2026, programa e guia FUVEST 2027, programa e diretrizes Unicamp 2027, acervos, microdados e recursos do MEC. Os portais foram consultados em 14/10/2026. Consulte `docs/FONTES-E-LIMITES.md` para cobertura e pendências.

O plano considera exclusivamente avaliações concluídas da banca escolhida, usa o resultado mais recente de cada disciplina e ordena pela menor taxa de acertos. Recomenda até três leituras pendentes. Não usa chamadas de IA e não inventa diagnósticos quando não há resultados. O agrupamento disponível é por disciplina, ainda não por habilidade oficial individual.

Não foram contratadas APIs nem assinaturas adicionais. Fontes gratuitas não tornam a operação da IA gratuita: a correção atual consome o saldo disponível. O limite gratuito do aluno não representa gratuidade para o responsável pelo serviço. Para uma apresentação sem consumo adicional, use fontes, leituras, questões e recomendações determinísticas e não acione correção por IA. Não substituímos correção de redação por contagem de palavras ou regex.

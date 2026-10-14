# AproVest — React + JavaScript

Versão acadêmica web em React 19, JavaScript, Vite, React Router, Bootstrap Grid e Lovable Cloud.

## Executar o site

1. Instale Node.js 20.19+ ou 22.12+ (LTS recomendado).
2. Extraia o ZIP em uma pasta nova e abra essa pasta no VS Code.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Abra o endereço exibido no terminal.

A conexão pública com autenticação e banco já tem valores padrão no código. O `.env` não é obrigatório; `.env.example` documenta substituições opcionais.

## API acadêmica e IA

Questões, limites, notas, papéis, gabaritos e IA passam pela API autenticada `/api/public/academic`, incluída no projeto Lovable que acompanha esta entrega. No desenvolvimento local completo, ela roda em `http://localhost:8080`. Fora desse ambiente, publique a API junto ao projeto ou preencha `VITE_ACADEMIC_API_URL` com sua URL publicada. A IA nunca funciona sem internet, API no servidor e saldo disponível.

O ZIP não contém chave privada de IA. A chave é administrada de modo protegido pelo Lovable. O código acadêmico do navegador não recebe gabaritos nem pode atribuir papéis ou notas.

## Funções implementadas

- início, sobre, cadastro, login Google/e-mail, recuperação e troca de senha;
- perfil, meta por curso/universidade/banca, modo escuro, exportação e pedido de exclusão;
- biblioteca autoral de fundamentos para ENEM, FUVEST e Unicamp, com referências oficiais;
- diagnóstico com 30 exercícios, banca diária adaptativa e repetição espaçada;
- plano de estudo, histórico, notificações e relatório imprimível em PDF;
- simulados cronometrados, retomada e percentil apenas com pelo menos 5 participantes comparáveis;
- redações com CRUD, versões preservadas na correção, IA por banca e fila de correção humana;
- professor acessa somente correções atribuídas; administrador gerencia materiais, questões, papéis e atribuições;
- limites do plano gratuito: 20 questões diárias e uma correção por IA no mês;
- ranking com consentimento e estrutura de bolsa mensal, além de telas claras para integrações ainda indisponíveis.

## Limitações explícitas

- os 30 exercícios por banca são autorais e introdutórios; não são questões oficiais completas nem substituem o programa oficial da edição;
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

## Estrutura principal

- `src/App.jsx`: rotas das páginas;
- `src/pages`: telas em JavaScript/JSX;
- `src/components`: interface reutilizável;
- `src/lib/api.js`: comunicação autenticada com a API;
- `src/lib/supabase.js`: autenticação e CRUD simples do próprio aluno;
- `database`: scripts PostgreSQL e SQL Server;
- `src/styles.css`: identidade visual preservada e adaptação a telas menores.

O código foi formatado em múltiplas linhas para facilitar a revisão.

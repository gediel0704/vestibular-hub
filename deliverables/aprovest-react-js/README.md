# AproVest — React + JavaScript

Projeto acadêmico desenvolvido com React 19, JavaScript, Vite, React Router, Bootstrap Grid e Lovable Cloud.

## Executar

1. Instale o Node.js 20 ou superior.
2. Abra esta pasta no terminal.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Abra o endereço exibido no terminal.

O arquivo `.env` incluído conecta esta entrega acadêmica à base de dados do AproVest. Não apague, não renomeie e não deixe as duas linhas vazias. O Vite somente lê esse arquivo ao iniciar; portanto, reinicie `npm run dev` depois de qualquer alteração.

O `.env.example` serve apenas como modelo. Ele não substitui o `.env`.

Se a configuração estiver ausente, o projeto agora mostra instruções na própria página em vez de permanecer com a tela vazia.

## Funcionalidades

- Página inicial e página Sobre;
- Cadastro, login, login social e recuperação de senha;
- Perfil inicial do vestibulando;
- Diagnóstico com 20 questões reais;
- Resultado geral e por área salvo na conta;
- CRUD completo de redações: criar, consultar, editar e excluir;
- Busca, filtro por situação e contagem automática de palavras;
- Rotas privadas e logout.

## Estrutura principal

- `index.html`: documento HTML carregado pelo navegador;
- `src/main.jsx`: inicia o React e os provedores globais;
- `src/App.jsx`: define as páginas e os endereços da aplicação;
- `src/pages`: contém cada página em JavaScript com JSX;
- `src/components`: contém estruturas visuais reutilizáveis;
- `src/contexts`: controla informações compartilhadas, como o login;
- `src/lib`: concentra a conexão com o banco de dados;
- `src/styles.css`: reúne as regras visuais do projeto.

O código-fonte foi formatado com estruturas distribuídas em múltiplas linhas para facilitar leitura, revisão e manutenção.

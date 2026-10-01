# AproVest — React + JavaScript

Projeto acadêmico desenvolvido com React 19, JavaScript, Vite, React Router, Bootstrap Grid e Lovable Cloud.

## Executar

1. Instale o Node.js 20 ou superior.
2. Abra esta pasta no terminal.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Abra o endereço exibido no terminal.

O arquivo `.env` incluído conecta esta entrega à mesma base de dados do AproVest. O `.env.example` mostra o padrão de configuração.

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

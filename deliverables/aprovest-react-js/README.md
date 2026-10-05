# AproVest — React + JavaScript

Projeto acadêmico desenvolvido com React 19, JavaScript, Vite, React Router, Bootstrap Grid e Lovable Cloud.

## Executar

1. Instale o Node.js 20 ou superior.
2. Abra esta pasta no terminal.
3. Execute `npm install`.
4. Execute `npm run dev`.
5. Abra o endereço exibido no terminal.

O projeto já contém a configuração pública necessária para se conectar à base de dados do AproVest. Por isso, ele funciona sem criar, copiar ou editar um arquivo `.env`.

O `.env.example` é opcional e serve somente como modelo para quem desejar conectar uma base de dados diferente. Se variáveis personalizadas forem adicionadas, reinicie `npm run dev`.

O endereço local pertence ao computador onde o comando foi executado. Em outra máquina, execute novamente `npm install` e `npm run dev` dentro da pasta do projeto.

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

# Correção portátil da versão acadêmica

## Objetivo
Fazer o AproVest abrir em qualquer computador após `npm install` e `npm run dev`, sem depender de um arquivo `.env` criado pelo Windows.

## Alterações
- Incluir no próprio código uma configuração pública padrão para conectar a versão acadêmica ao Lovable Cloud.
- Manter variáveis de ambiente apenas como substituição opcional para quem precisar usar outro ambiente.
- Atualizar as instruções de execução para deixar claro que o `.env` não é obrigatório.
- Preservar a tela de erro para falhas reais de conexão ou inicialização.
- Gerar um novo ZIP versionado, sem sobrescrever as entregas anteriores.

## Validação
- Testar a aplicação em uma cópia sem nenhum arquivo `.env` e sem variáveis herdadas.
- Conferir páginas públicas, autenticação, painel e caderno de redações.
- Validar criação, edição e exclusão de uma redação.
- Executar as verificações de qualidade e inspecionar o conteúdo final do ZIP.

## Observação
O endereço `localhost` sempre representa o computador onde o projeto foi iniciado. A correção elimina a dependência de configuração da máquina; para abrir sem instalar ou executar nada, seria necessário publicar o site em um endereço público.

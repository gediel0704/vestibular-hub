# Verificação da entrega — 16/10/2026

## Verificado nesta revisão

- `npm install` em cópia limpa sem `.env`, sem dependências copiadas e usando o registro público: 85 pacotes instalados em Linux/Node 22.22.0.
- Verificações automáticas antes da instalação e antes da execução; teste de conectividade da API depois da instalação.
- API hospedada: `bootstrap` autenticado retornou 200 para a conta autorizada; chamadas sem sessão retornaram 401.
- Páginas autenticadas abertas: painel, biblioteca, plano, redações, professor, administrador, diagnóstico, banca, simulados, questões ENEM, histórico, notificações, perfil e planos. Abrir a página não equivale a concluir todo seu fluxo.
- Redação de teste criada pela interface, avaliação real ENEM retornando 840/1000 e cinco competências, comentários e próximos passos; histórico lido novamente após recarregar. Dados temporários removidos.
- Falha observada somente na correção hospedada: resposta de IA incompleta. O mesmo texto funcionou no serviço local. A atualização mantém a resposta ativa com eventos de progresso e resultado, sem repetir automaticamente chamadas faturadas.
- Após a publicação da atualização, a interface sem configuração local concluiu uma correção pela API hospedada: 880/1000, cinco competências e histórico relido após recarregar, sem alerta de erro. A variação da nota entre execuções reforça a necessidade de calibração docente. Redação temporária removida.
- Testes automatizados de regras, prioridades, versão de Node, endereço de API e fluxo de avaliação: 18 testes aprovados.
- Verificação de código acadêmico: zero erros e avisos. A execução em Windows real não foi realizada neste ambiente.

## Não declarar o documento integralmente concluído

O documento norteador contém 19 requisitos funcionais. Esta revisão não substitui testes completos e não autoriza marcar todos como concluídos.

| Requisito | Situação ainda necessária |
| --- | --- |
| RF03 / RF07 | A adaptação atual usa Elo pedagógico; não há TRI calibrada nem projeção oficial de nota. O painel não consolida todos os indicadores previstos. |
| RF05 | Existe fila, atribuição e devolutiva humana; faltam validação docente por competência, operação com corretores e garantia de prazo. |
| RF06 | Há cálculo de percentil no serviço para pelo menos cinco alunos comparáveis, não probabilidade de aprovação. Faltam validação de coorte real e calendário semanal/mensal. |
| RF08 | A exclusão administrativa atual arquiva questões; exclusão definitiva de itens com histórico exige política de conservação. |
| RF10 / RF11 | Cobrança recorrente e compra de créditos não estão conectadas. Dependem de conta de recebimento e preços aprovados; não criar checkout fictício nem ativar cobrança. |
| RF12 | A concessão por administrador existe; falta o agendamento automático mensal e a apresentação completa do ranking. |
| RF13 | Há notificações internas, mas nem todos os eventos previstos possuem emissão automática. |
| RF18 | Ainda não existe sugestão de temas e questões por IA na administração. |
| RN05 | Pedido de exclusão existe; falta execução administrativa completa da remoção/anonimização. |
| RNF | Disponibilidade, latência, backups, auditoria de acessibilidade e sincronização com aplicativo nativo não foram comprovados. |

Também faltam acervo completo revisado, classificação por habilidades oficiais e pré-requisitos, calibração com correções docentes e aplicativo móvel nativo. Referências externas não equivalem à importação das provas.

## Condições externas

- PowerShell pode bloquear `npm.ps1` antes de executar qualquer código do projeto. Nesse caso, `npm.cmd install` e `npm.cmd run dev` ou terminal CMD são necessários. O site não deve modificar políticas de segurança do professor.
- Node compatível e internet são necessários. IA real usa créditos existentes; nenhuma nova assinatura ou API paga foi contratada.
- A publicação solicitada atualiza o serviço acadêmico do projeto principal; não hospeda automaticamente a interface Vite isolada.
- Conexão GitHub requer autorização do proprietário; não é executada por um script do site.

## Próximos testes obrigatórios

1. Calibrar a avaliação de IA com redações autorizadas e avaliações docentes de referência.
2. Concluir avaliação de 30 questões, repetir leitura do resultado e testar os limites diários/mensais.
3. Validar atribuição e correção com conta real de professor, sem conceder papéis arbitrariamente.
4. Implementar os requisitos pendentes acima e somente então declarar conclusão integral.
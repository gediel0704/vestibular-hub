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

O cliente acadêmico não contém o servidor de IA e avaliação. `npm run dev` nesta pasta inicia apenas a interface. Em localhost, a API padrão espera um servidor do projeto principal em `http://localhost:8080`; se ele não existir, conteúdos dinâmicos e avaliações não funcionam. Outra opção é configurar `VITE_ACADEMIC_API_URL` com o endereço público da API hospedada **depois de publicar o projeto**. Não cole chaves privadas no `.env` do navegador. Publicação e disponibilidade externa não foram verificadas nesta etapa.

A sincronização GitHub atualiza arquivos, não publica a API. Conectar GitHub é uma ação do proprietário no editor Lovable; o procedimento está no README. A versão acadêmica continua React + JavaScript + Vite e o produto comercial não foi alterado.
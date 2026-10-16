# Banco de dados AproVest

## Banco real do site — PostgreSQL / Lovable Cloud

Execute em ordem cronológica os arquivos de `postgresql/`. Eles usam `auth.users`, `auth.uid()`, RLS, JSONB e PL/pgSQL da plataforma. Os arquivos `20261014_pedagogical_seed.sql` contêm apenas exercícios e materiais autorais; podem ser aplicados depois da estrutura. O arquivo `20261016_academic_items_official.sql` contém as 627 questões oficiais do FUVEST (339) e da Unicamp (288), de 2018 a 2024, com gabarito, alternativa correta, explicação e endereço da fonte; é reaplicável e ignora linhas já existentes. Em uma instalação gerenciada, use o mecanismo de migrações da plataforma, não cole chaves privadas no SQL.

Verificação sugerida:

```sql
SELECT kind, exam, count(*) FROM public.academic_items GROUP BY kind, exam;
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';
```

## Atividade — Microsoft SQL Server

1. Abra uma base nova e vazia no SQL Server Management Studio 19+ ou Azure Data Studio.
2. Selecione essa base; não execute no banco `master`.
3. Execute `sqlserver/AproVest_SQLServer_v1.sql` inteiro.
4. Confirme que a última consulta retorna 24 tabelas e os três papéis fictícios.
5. Os exemplos CRUD rodam dentro de uma transação revertida e não deixam a redação fictícia salva.

O arquivo usa recursos de SQL Server 2016 SP1+ (`CREATE OR ALTER`). Foi revisado estaticamente e não foi executado neste ambiente porque não há instância Microsoft SQL Server disponível.

## Diferença importante

Os dois conjuntos descrevem o mesmo domínio, mas não são intercambiáveis. O site continua utilizando PostgreSQL/Lovable Cloud. Para executá-lo sobre SQL Server seria necessário criar e hospedar uma API, autenticação e políticas equivalentes específicas desse banco.

## Pareceres e repasses por perfil

O script PostgreSQL `20261016_academic_staff_reviews_earnings.sql` adiciona pareceres pedagógicos com cópia do conteúdo avaliado e registros de remuneração por correção. Professores leem apenas seus pareceres e repasses; administradores leem todos. Escrita é exclusiva do serviço autenticado. Não há vendas nem remunerações fictícias pré-carregadas. O script SQL Server inclui as duas tabelas equivalentes; a autorização precisa ser aplicada pela API própria descrita acima.

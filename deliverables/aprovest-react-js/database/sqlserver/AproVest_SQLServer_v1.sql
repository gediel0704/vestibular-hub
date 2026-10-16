-- AproVest / atividade acadêmica / SQL Server 2016 SP1 ou superior.
-- T-SQL equivalente ao modelo funcional; NÃO é migração PostgreSQL.
-- Executar em base NOVA e vazia selecionada no SSMS. Não contém dados reais.
-- Senhas só podem ser preenchidas por serviço com hash seguro; NULL não habilita login.
-- A execução deste arquivo não conecta automaticamente o site ao SQL Server.
SET NOCOUNT ON;
SET XACT_ABORT ON;
GO
CREATE TABLE dbo.users (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    email nvarchar(255) NOT NULL UNIQUE,
    password_hash nvarchar(255) NULL,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.profiles (
    id uniqueidentifier NOT NULL PRIMARY KEY REFERENCES dbo.users(id),
    full_name nvarchar(100),
    target_course nvarchar(100),
    target_year int,
    target_university nvarchar(120),
    target_exam nvarchar(20) NOT NULL DEFAULT N'ENEM',
    school nvarchar(120),
    onboarding_completed bit NOT NULL DEFAULT 0,
    notifications_enabled bit NOT NULL DEFAULT 1,
    ranking_opt_in bit NOT NULL DEFAULT 0,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_profile_exam CHECK(target_exam IN (N'ENEM',N'FUVEST',N'Unicamp'))
);
GO

CREATE TABLE dbo.user_roles (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    role nvarchar(20) NOT NULL,
    CONSTRAINT UQ_roles UNIQUE(user_id,role),
    CONSTRAINT CK_roles CHECK(role IN (N'student',N'teacher',N'admin'))
);
GO

CREATE TABLE dbo.exam_boards (
    id int IDENTITY PRIMARY KEY,
    name nvarchar(30) NOT NULL UNIQUE,
    official_url nvarchar(500) NOT NULL
);
GO

CREATE TABLE dbo.exam_editions (
    id int IDENTITY PRIMARY KEY,
    board_id int NOT NULL REFERENCES dbo.exam_boards(id),
    edition_year int NOT NULL,
    program_url nvarchar(500),
    rubric_json nvarchar(max),
    verified_at datetime2,
    CONSTRAINT UQ_edition UNIQUE(board_id,edition_year),
    CONSTRAINT CK_rubric_json CHECK(rubric_json IS NULL OR ISJSON(rubric_json)=1)
);
GO

CREATE TABLE dbo.subjects (
    id int IDENTITY PRIMARY KEY,
    name nvarchar(100) NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.topics (
    id int IDENTITY PRIMARY KEY,
    subject_id int NOT NULL REFERENCES dbo.subjects(id),
    name nvarchar(100) NOT NULL,
    CONSTRAINT UQ_topic UNIQUE(subject_id,name)
);
GO

CREATE TABLE dbo.academic_items (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    kind nvarchar(20) NOT NULL,
    title nvarchar(180) NOT NULL,
    exam nvarchar(20) NOT NULL DEFAULT N'ENEM',
    subject nvarchar(100) NOT NULL,
    topic nvarchar(100) NOT NULL,
    difficulty int NOT NULL DEFAULT 3,
    statement nvarchar(max) NOT NULL DEFAULT N'',
    choices nvarchar(max) NOT NULL DEFAULT N'[]',
    correct_key nvarchar(5),
    explanation nvarchar(max) NOT NULL DEFAULT N'',
    source_url nvarchar(500) NOT NULL DEFAULT N'',
    source_year int,
    origin nvarchar(20) NOT NULL DEFAULT N'authorial',
    published bit NOT NULL DEFAULT 0,
    metadata nvarchar(max) NOT NULL DEFAULT N'{}',
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_item_kind CHECK(kind IN(N'question',N'content',N'theme',N'exam')),
    CONSTRAINT CK_item_exam CHECK(exam IN(N'ENEM',N'FUVEST',N'Unicamp')),
    CONSTRAINT CK_difficulty CHECK(difficulty BETWEEN 1 AND 5),
    CONSTRAINT CK_choices CHECK(ISJSON(choices)=1),
    CONSTRAINT CK_metadata CHECK(ISJSON(metadata)=1),
    CONSTRAINT CK_origin CHECK(origin IN(N'authorial',N'official',N'ai_review'))
);
GO

CREATE TABLE dbo.item_topics (
    item_id uniqueidentifier NOT NULL REFERENCES dbo.academic_items(id),
    topic_id int NOT NULL REFERENCES dbo.topics(id),
    PRIMARY KEY(item_id,topic_id)
);
GO

CREATE TABLE dbo.academic_sessions (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    mode nvarchar(20) NOT NULL,
    exam nvarchar(20) NOT NULL,
    current_index int NOT NULL DEFAULT 0,
    status nvarchar(20) NOT NULL DEFAULT N'in_progress',
    score decimal(8,5),
    score_by_topic nvarchar(max) NOT NULL DEFAULT N'{}',
    target_course nvarchar(100) NOT NULL DEFAULT N'',
    target_university nvarchar(120) NOT NULL DEFAULT N'',
    started_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    expires_at datetime2,
    completed_at datetime2,
    CONSTRAINT CK_mode CHECK(mode IN(N'daily',N'diagnostic',N'exam')),
    CONSTRAINT CK_session_status CHECK(status IN(N'in_progress',N'completed')),
    CONSTRAINT CK_session_score CHECK(score IS NULL OR score BETWEEN 0 AND 1),
    CONSTRAINT CK_session_json CHECK(ISJSON(score_by_topic)=1)
);
GO

CREATE TABLE dbo.session_items (
    session_id uniqueidentifier NOT NULL REFERENCES dbo.academic_sessions(id),
    item_id uniqueidentifier NOT NULL REFERENCES dbo.academic_items(id),
    position int NOT NULL,
    PRIMARY KEY(session_id,item_id),
    CONSTRAINT UQ_session_position UNIQUE(session_id,position)
);
GO

CREATE TABLE dbo.academic_responses (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    session_id uniqueidentifier NOT NULL REFERENCES dbo.academic_sessions(id),
    item_id uniqueidentifier NOT NULL REFERENCES dbo.academic_items(id),
    selected_key nvarchar(5) NOT NULL,
    is_correct bit NOT NULL,
    answered_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_response UNIQUE(session_id,item_id)
);
GO

CREATE TABLE dbo.academic_progress (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    item_id uniqueidentifier NOT NULL REFERENCES dbo.academic_items(id),
    completed bit NOT NULL DEFAULT 0,
    rating decimal(10,2) NOT NULL DEFAULT 1000,
    due_at datetime2,
    updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_progress UNIQUE(user_id,item_id)
);
GO

CREATE TABLE dbo.essays (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    title nvarchar(120) NOT NULL,
    theme nvarchar(180) NOT NULL,
    content nvarchar(max) NOT NULL,
    status nvarchar(20) NOT NULL DEFAULT N'draft',
    word_count int NOT NULL DEFAULT 0,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_essay_title CHECK(LEN(LTRIM(RTRIM(title))) BETWEEN 3 AND 120),
    CONSTRAINT CK_essay_theme CHECK(LEN(LTRIM(RTRIM(theme))) BETWEEN 3 AND 180),
    CONSTRAINT CK_essay_content CHECK(LEN(LTRIM(RTRIM(content))) BETWEEN 20 AND 12000),
    CONSTRAINT CK_essay_status CHECK(status IN(N'draft',N'submitted',N'corrected')),
    CONSTRAINT CK_essay_words CHECK(word_count BETWEEN 0 AND 2500)
);
GO

CREATE TABLE dbo.academic_evaluations (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    essay_id uniqueidentifier NOT NULL REFERENCES dbo.essays(id),
    exam nvarchar(20) NOT NULL,
    essay_snapshot nvarchar(max) NOT NULL,
    type nvarchar(10) NOT NULL DEFAULT N'ai',
    status nvarchar(20) NOT NULL DEFAULT N'queued',
    feedback nvarchar(max),
    error_message nvarchar(500),
    assigned_to uniqueidentifier REFERENCES dbo.users(id),
    due_at datetime2,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    completed_at datetime2,
    CONSTRAINT CK_evaluation_type CHECK(type IN(N'ai',N'human')),
    CONSTRAINT CK_evaluation_status CHECK(status IN(N'queued',N'running',N'completed',N'failed')),
    CONSTRAINT CK_snapshot CHECK(ISJSON(essay_snapshot)=1),
    CONSTRAINT CK_feedback CHECK(feedback IS NULL OR ISJSON(feedback)=1)
);
GO

CREATE TABLE dbo.academic_entitlements (
    user_id uniqueidentifier NOT NULL PRIMARY KEY REFERENCES dbo.users(id),
    pro_until datetime2,
    human_credits int NOT NULL DEFAULT 0,
    subscription_status nvarchar(30) NOT NULL DEFAULT N'free',
    CONSTRAINT CK_credits CHECK(human_credits>=0)
);
GO

CREATE TABLE dbo.academic_notifications (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    title nvarchar(180) NOT NULL,
    body nvarchar(max) NOT NULL DEFAULT N'',
    read_at datetime2,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.academic_requests (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    kind nvarchar(30) NOT NULL,
    status nvarchar(20) NOT NULL DEFAULT N'pending',
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_request_kind CHECK(kind IN(N'deletion',N'human_credit',N'subscription'))
);
GO

CREATE TABLE dbo.academic_ai_state (
    id nvarchar(30) NOT NULL PRIMARY KEY DEFAULT N'global',
    paused bit NOT NULL DEFAULT 0,
    reason nvarchar(500),
    updated_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.payment_transactions (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    provider_reference nvarchar(255) UNIQUE,
    amount_minor int NOT NULL,
    currency char(3) NOT NULL DEFAULT 'BRL',
    status nvarchar(30) NOT NULL,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_payment_amount CHECK(amount_minor>=0)
);
GO

CREATE TABLE dbo.credit_ledger (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    evaluation_id uniqueidentifier REFERENCES dbo.academic_evaluations(id),
    delta int NOT NULL,
    reason nvarchar(100) NOT NULL,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.academic_content_reviews (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    item_id uniqueidentifier NOT NULL REFERENCES dbo.academic_items(id),
    teacher_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    verdict nvarchar(30) NOT NULL,
    comments nvarchar(max) NOT NULL,
    item_snapshot nvarchar(max) NOT NULL DEFAULT N'{}',
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_review_verdict CHECK(verdict IN(N'approved',N'changes_requested')),
    CONSTRAINT CK_review_snapshot CHECK(ISJSON(item_snapshot)=1)
);
GO

CREATE TABLE dbo.academic_teacher_earnings (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    evaluation_id uniqueidentifier NOT NULL UNIQUE REFERENCES dbo.academic_evaluations(id),
    teacher_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    amount_minor int NOT NULL,
    teacher_share_bps int NOT NULL,
    teacher_amount_minor AS CONVERT(int, ROUND(CONVERT(decimal(18,4), amount_minor) * teacher_share_bps / 10000, 0)) PERSISTED,
    currency char(3) NOT NULL DEFAULT 'BRL',
    status nvarchar(20) NOT NULL DEFAULT N'pending',
    paid_at datetime2,
    created_at datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_earnings_amount CHECK(amount_minor>=0),
    CONSTRAINT CK_earnings_share CHECK(teacher_share_bps BETWEEN 0 AND 10000),
    CONSTRAINT CK_earnings_currency CHECK(currency='BRL'),
    CONSTRAINT CK_earnings_status CHECK(status IN(N'pending',N'paid',N'cancelled'))
);
GO

CREATE TABLE dbo.study_tasks (
    id uniqueidentifier NOT NULL DEFAULT NEWID() PRIMARY KEY,
    user_id uniqueidentifier NOT NULL REFERENCES dbo.users(id),
    item_id uniqueidentifier REFERENCES dbo.academic_items(id),
    planned_date date NOT NULL,
    completed_at datetime2,
    description nvarchar(255) NOT NULL
);
GO

CREATE INDEX IX_sessions_owner ON dbo.academic_sessions(user_id,started_at DESC);
CREATE INDEX IX_evaluations_owner ON dbo.academic_evaluations(user_id,created_at DESC);
CREATE INDEX IX_items_exam ON dbo.academic_items(exam,kind,published);
CREATE INDEX IX_responses_owner ON dbo.academic_responses(user_id,answered_at DESC);
GO
CREATE OR ALTER TRIGGER dbo.tr_essay_updated ON dbo.essays AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    IF TRIGGER_NESTLEVEL() > 1 RETURN;
    UPDATE e SET updated_at=SYSUTCDATETIME()
    FROM dbo.essays e JOIN inserted i ON e.id=i.id;
END;
GO
-- Validação de vínculos: uma resposta deve pertencer à conta e à sessão corretas.
CREATE OR ALTER TRIGGER dbo.tr_response_integrity ON dbo.academic_responses AFTER INSERT,UPDATE AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS(SELECT 1 FROM inserted i JOIN dbo.academic_sessions s ON s.id=i.session_id
      WHERE i.user_id<>s.user_id OR NOT EXISTS(SELECT 1 FROM dbo.session_items si WHERE si.session_id=i.session_id AND si.item_id=i.item_id))
      THROW 51001, N'Resposta sem vínculo válido com a sessão e seu proprietário.', 1;
END;
GO
-- Dados inteiramente fictícios para demonstrar relacionamentos e CRUD.
INSERT INTO dbo.users(id,email) VALUES
('11111111-1111-4111-8111-111111111111',N'aluno@example.invalid'),
('22222222-2222-4222-8222-222222222222',N'professor@example.invalid'),
('33333333-3333-4333-8333-333333333333',N'admin@example.invalid');
INSERT INTO dbo.profiles(id,full_name,target_course,target_year,target_university) VALUES
('11111111-1111-4111-8111-111111111111',N'Aluno de demonstração',N'Engenharia',2027,N'Universidade de demonstração'),
('22222222-2222-4222-8222-222222222222',N'Professor de demonstração',NULL,NULL,NULL),
('33333333-3333-4333-8333-333333333333',N'Administrador de demonstração',NULL,NULL,NULL);
INSERT INTO dbo.user_roles(user_id,role) VALUES
('11111111-1111-4111-8111-111111111111',N'student'),
('22222222-2222-4222-8222-222222222222',N'teacher'),
('33333333-3333-4333-8333-333333333333',N'admin');
INSERT INTO dbo.exam_boards(name,official_url) VALUES
(N'ENEM',N'https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem'),
(N'FUVEST',N'https://www.fuvest.br/'),
(N'Unicamp',N'https://www.comvest.unicamp.br/');
INSERT INTO dbo.subjects(name) VALUES(N'Matematica'),(N'Linguagens'),(N'Humanas'),(N'Natureza');
INSERT INTO dbo.topics(subject_id,name) SELECT id,N'Porcentagem' FROM dbo.subjects WHERE name=N'Matematica';
INSERT INTO dbo.academic_items(id,kind,title,exam,subject,topic,statement,choices,correct_key,explanation,published)
VALUES('44444444-4444-4444-8444-444444444444',N'question',N'Variação percentual',N'ENEM',N'Matematica',N'Porcentagem',N'Um consumo passou de 200 para 150. Qual a redução percentual?',N'[{"key":"A","text":"25%"},{"key":"B","text":"50%"}]',N'A',N'A redução foi 50/200 = 25%. Exercício autoral, não questão oficial.',1);
INSERT INTO dbo.item_topics(item_id,topic_id) SELECT '44444444-4444-4444-8444-444444444444',id FROM dbo.topics WHERE name=N'Porcentagem';
INSERT INTO dbo.academic_entitlements(user_id) VALUES('11111111-1111-4111-8111-111111111111');
GO
-- Exemplos de CRUD isolados e revertidos, preservando a base de demonstração.
BEGIN TRANSACTION;
DECLARE @EssayID uniqueidentifier=NEWID();
INSERT INTO dbo.essays(id,user_id,title,theme,content,word_count)
VALUES(@EssayID,'11111111-1111-4111-8111-111111111111',N'Leitura e cidadania',N'Acesso à leitura',N'A leitura contribui para a participação social e a formação crítica dos cidadãos.',14);
SELECT id,title,theme,content FROM dbo.essays WHERE id=@EssayID;
UPDATE dbo.essays SET title=N'Leitura e cidadania: revisão' WHERE id=@EssayID;
DELETE FROM dbo.essays WHERE id=@EssayID;
ROLLBACK TRANSACTION;
GO
-- Consultas de verificação.
SELECT b.name AS banca,COUNT(i.id) AS itens FROM dbo.exam_boards b LEFT JOIN dbo.academic_items i ON i.exam=b.name GROUP BY b.name;
SELECT p.full_name,r.role FROM dbo.profiles p JOIN dbo.user_roles r ON r.user_id=p.id;
SELECT COUNT(*) AS tabelas_aprovest FROM sys.tables WHERE schema_id=SCHEMA_ID(N'dbo');
GO
-- Segurança: a aplicação deve autenticar no servidor e usar acesso mínimo.
-- Não conceder escrita direta em notas, papéis, créditos ou gabaritos ao navegador.
-- RLS do PostgreSQL e auth.users são específicos da plataforma Cloud; não existem aqui.
-- Para operar com este banco, implementar API e autenticação próprias no SQL Server.


-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  target_course TEXT,
  target_year INT,
  school TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles: read own" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Profiles: insert own" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles: update own" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- DIAGNOSTIC QUESTIONS
-- =========================
CREATE TABLE public.diagnostic_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  area TEXT NOT NULL, -- Matematica, Linguagens, Humanas, Natureza
  subject TEXT NOT NULL,
  statement TEXT NOT NULL,
  choices JSONB NOT NULL, -- [{key:"A",text:"..."}]
  correct_key TEXT NOT NULL,
  difficulty INT NOT NULL DEFAULT 3, -- 1..5
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.diagnostic_questions TO authenticated;
GRANT ALL ON public.diagnostic_questions TO service_role;
ALTER TABLE public.diagnostic_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Questions: read by authenticated" ON public.diagnostic_questions
  FOR SELECT TO authenticated USING (true);

-- =========================
-- DIAGNOSTIC ATTEMPTS
-- =========================
CREATE TABLE public.diagnostic_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  score NUMERIC,
  score_by_area JSONB,
  status TEXT NOT NULL DEFAULT 'in_progress' -- in_progress | completed
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnostic_attempts TO authenticated;
GRANT ALL ON public.diagnostic_attempts TO service_role;
ALTER TABLE public.diagnostic_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Attempts: own" ON public.diagnostic_attempts
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================
-- DIAGNOSTIC ANSWERS
-- =========================
CREATE TABLE public.diagnostic_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES public.diagnostic_attempts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.diagnostic_questions(id) ON DELETE CASCADE,
  selected_key TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (attempt_id, question_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.diagnostic_answers TO authenticated;
GRANT ALL ON public.diagnostic_answers TO service_role;
ALTER TABLE public.diagnostic_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Answers: own" ON public.diagnostic_answers
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- =========================
-- SEED 20 QUESTIONS
-- =========================
INSERT INTO public.diagnostic_questions (area, subject, statement, choices, correct_key, difficulty, position) VALUES
('Matematica','Álgebra','Se 2x + 6 = 20, qual o valor de x?','[{"key":"A","text":"5"},{"key":"B","text":"6"},{"key":"C","text":"7"},{"key":"D","text":"8"}]','C',1,1),
('Matematica','Funções','O valor de f(3) para f(x) = x² - 2x + 1 é:','[{"key":"A","text":"2"},{"key":"B","text":"4"},{"key":"C","text":"5"},{"key":"D","text":"6"}]','B',2,2),
('Matematica','Geometria','A área de um círculo de raio 5 é aproximadamente:','[{"key":"A","text":"25π"},{"key":"B","text":"10π"},{"key":"C","text":"5π"},{"key":"D","text":"50π"}]','A',2,3),
('Matematica','Probabilidade','Ao lançar um dado, a probabilidade de sair um número par é:','[{"key":"A","text":"1/6"},{"key":"B","text":"1/3"},{"key":"C","text":"1/2"},{"key":"D","text":"2/3"}]','C',2,4),
('Matematica','Análise Combinatória','De quantas formas 4 pessoas podem se sentar em fila?','[{"key":"A","text":"12"},{"key":"B","text":"16"},{"key":"C","text":"24"},{"key":"D","text":"48"}]','C',3,5),
('Linguagens','Interpretação','Em "O tempo é o senhor da razão", a palavra ''tempo'' é:','[{"key":"A","text":"Verbo"},{"key":"B","text":"Adjetivo"},{"key":"C","text":"Substantivo"},{"key":"D","text":"Advérbio"}]','C',1,6),
('Linguagens','Gramática','Assinale a alternativa com crase corretamente empregada:','[{"key":"A","text":"Vou à escola"},{"key":"B","text":"Vou a escola"},{"key":"C","text":"Vou há escola"},{"key":"D","text":"Vou as escola"}]','A',2,7),
('Linguagens','Literatura','Machado de Assis é o principal autor do:','[{"key":"A","text":"Romantismo"},{"key":"B","text":"Realismo"},{"key":"C","text":"Modernismo"},{"key":"D","text":"Barroco"}]','B',2,8),
('Linguagens','Inglês','Choose the correct: "She ___ to school every day."','[{"key":"A","text":"go"},{"key":"B","text":"goes"},{"key":"C","text":"going"},{"key":"D","text":"gone"}]','B',1,9),
('Linguagens','Redação','Um bom texto dissertativo-argumentativo deve conter:','[{"key":"A","text":"Apenas opinião"},{"key":"B","text":"Tese, argumentos e conclusão"},{"key":"C","text":"Somente narração"},{"key":"D","text":"Rimas"}]','B',2,10),
('Humanas','História','A Independência do Brasil ocorreu em:','[{"key":"A","text":"1808"},{"key":"B","text":"1822"},{"key":"C","text":"1889"},{"key":"D","text":"1500"}]','B',1,11),
('Humanas','Geografia','A capital do estado do Amazonas é:','[{"key":"A","text":"Belém"},{"key":"B","text":"Manaus"},{"key":"C","text":"Porto Velho"},{"key":"D","text":"Boa Vista"}]','B',1,12),
('Humanas','Sociologia','O conceito de "fato social" foi desenvolvido por:','[{"key":"A","text":"Karl Marx"},{"key":"B","text":"Max Weber"},{"key":"C","text":"Émile Durkheim"},{"key":"D","text":"Auguste Comte"}]','C',3,13),
('Humanas','Filosofia','"Só sei que nada sei" é uma frase atribuída a:','[{"key":"A","text":"Platão"},{"key":"B","text":"Aristóteles"},{"key":"C","text":"Sócrates"},{"key":"D","text":"Descartes"}]','C',2,14),
('Humanas','História','A Revolução Industrial teve início na:','[{"key":"A","text":"França"},{"key":"B","text":"Inglaterra"},{"key":"C","text":"Alemanha"},{"key":"D","text":"Itália"}]','B',2,15),
('Natureza','Biologia','A unidade básica da vida é:','[{"key":"A","text":"O átomo"},{"key":"B","text":"A célula"},{"key":"C","text":"O tecido"},{"key":"D","text":"O órgão"}]','B',1,16),
('Natureza','Química','A fórmula da água é:','[{"key":"A","text":"CO2"},{"key":"B","text":"O2"},{"key":"C","text":"H2O"},{"key":"D","text":"NaCl"}]','C',1,17),
('Natureza','Física','A unidade de força no SI é:','[{"key":"A","text":"Joule"},{"key":"B","text":"Newton"},{"key":"C","text":"Watt"},{"key":"D","text":"Pascal"}]','B',2,18),
('Natureza','Física','Se um corpo cai livremente por 2s, sua velocidade final é aproximadamente (g=10):','[{"key":"A","text":"5 m/s"},{"key":"B","text":"10 m/s"},{"key":"C","text":"20 m/s"},{"key":"D","text":"40 m/s"}]','C',3,19),
('Natureza','Química','O pH de uma solução neutra a 25°C é:','[{"key":"A","text":"0"},{"key":"B","text":"7"},{"key":"C","text":"10"},{"key":"D","text":"14"}]','B',2,20);

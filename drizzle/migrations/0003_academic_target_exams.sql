ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS target_exams text[] NOT NULL DEFAULT ARRAY['ENEM']::text[];

UPDATE public.profiles
SET target_exams = ARRAY[target_exam]::text[]
WHERE target_exams IS NULL OR cardinality(target_exams) = 0;

COMMENT ON COLUMN public.profiles.target_exams IS 'Vestibulares-alvo escolhidos pelo estudante (1 a 3): ENEM, FUVEST, Unicamp.';
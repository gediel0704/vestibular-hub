CREATE TABLE public.essays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(btrim(title)) BETWEEN 3 AND 120),
  theme text NOT NULL CHECK (char_length(btrim(theme)) BETWEEN 3 AND 180),
  content text NOT NULL CHECK (char_length(btrim(content)) BETWEEN 20 AND 12000),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'corrected')),
  word_count integer NOT NULL DEFAULT 0 CHECK (word_count BETWEEN 0 AND 2500),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.essays TO authenticated;
GRANT ALL ON public.essays TO service_role;

ALTER TABLE public.essays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Essays: read own"
ON public.essays
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Essays: create own"
ON public.essays
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Essays: update own"
ON public.essays
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Essays: delete own"
ON public.essays
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER set_essays_updated_at
BEFORE UPDATE ON public.essays
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX essays_user_updated_idx
ON public.essays (user_id, updated_at DESC);
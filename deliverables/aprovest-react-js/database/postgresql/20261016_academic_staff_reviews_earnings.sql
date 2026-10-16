CREATE TABLE public.academic_content_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.academic_items(id),
  teacher_id uuid NOT NULL,
  verdict text NOT NULL CHECK (verdict IN ('approved','changes_requested')),
  comments text NOT NULL,
  item_snapshot jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academic_content_reviews TO authenticated;
GRANT ALL ON public.academic_content_reviews TO service_role;
ALTER TABLE public.academic_content_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY content_reviews_read ON public.academic_content_reviews FOR SELECT TO authenticated USING (teacher_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE INDEX academic_reviews_item ON public.academic_content_reviews(item_id,created_at DESC);

CREATE TABLE public.academic_teacher_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evaluation_id uuid NOT NULL UNIQUE REFERENCES public.academic_evaluations(id),
  teacher_id uuid NOT NULL,
  amount_minor integer NOT NULL CHECK (amount_minor >= 0),
  teacher_share_bps integer NOT NULL CHECK (teacher_share_bps BETWEEN 0 AND 10000),
  teacher_amount_minor integer GENERATED ALWAYS AS (round(amount_minor::numeric * teacher_share_bps / 10000)::integer) STORED,
  currency text NOT NULL DEFAULT 'BRL' CHECK (currency = 'BRL'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','cancelled')),
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.academic_teacher_earnings TO authenticated;
GRANT ALL ON public.academic_teacher_earnings TO service_role;
ALTER TABLE public.academic_teacher_earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY earnings_read ON public.academic_teacher_earnings FOR SELECT TO authenticated USING (teacher_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE INDEX academic_earnings_teacher ON public.academic_teacher_earnings(teacher_id,created_at DESC);
COMMENT ON TABLE public.academic_teacher_earnings IS 'Actual correction compensation records only; no automatic or fictional earnings before verified billing is connected. Gross basis is not net company profit.';
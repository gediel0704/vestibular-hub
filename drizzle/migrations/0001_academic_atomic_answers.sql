CREATE OR REPLACE FUNCTION public.academic_answer_session(p_user uuid,p_session uuid,p_item uuid,p_key text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE s public.academic_sessions; q public.academic_items; correct boolean; expired boolean; previous_rating numeric; answer_count integer; rating_new numeric; result jsonb; areas jsonb;
BEGIN
SELECT * INTO s FROM public.academic_sessions WHERE id=p_session AND user_id=p_user FOR UPDATE;
IF NOT FOUND OR s.status<>'in_progress' THEN RAISE EXCEPTION 'Avaliação indisponível ou já encerrada.'; END IF;
expired:=s.expires_at IS NOT NULL AND s.expires_at<=now();
IF NOT expired THEN
SELECT * INTO q FROM public.academic_items WHERE id=s.item_ids[s.current_index+1];
IF q.id IS DISTINCT FROM p_item THEN RAISE EXCEPTION 'A questão não corresponde à etapa atual.'; END IF;
IF NOT EXISTS(SELECT 1 FROM jsonb_array_elements(q.choices) choice WHERE choice->>'key'=p_key) THEN RAISE EXCEPTION 'Alternativa inválida.'; END IF;
correct:=q.correct_key=p_key;
INSERT INTO public.academic_responses(user_id,session_id,item_id,selected_key,is_correct) VALUES(p_user,p_session,p_item,p_key,correct);
SELECT rating INTO previous_rating FROM public.academic_progress WHERE user_id=p_user AND item_id=p_item;
previous_rating:=COALESCE(previous_rating,1000);
rating_new:=round(previous_rating+32*((CASE WHEN correct THEN 1 ELSE 0 END)-1/(1+power(10::numeric,(600+q.difficulty*160-previous_rating)/400))));
INSERT INTO public.academic_progress(user_id,item_id,completed,rating,due_at) VALUES(p_user,p_item,correct,rating_new,now()+CASE WHEN correct THEN interval '7 days' ELSE interval '1 day' END) ON CONFLICT(user_id,item_id) DO UPDATE SET completed=EXCLUDED.completed,rating=EXCLUDED.rating,due_at=EXCLUDED.due_at,updated_at=now();
s.current_index:=s.current_index+1;
IF s.current_index<cardinality(s.item_ids) THEN
UPDATE public.academic_sessions SET current_index=s.current_index WHERE id=s.id;
RETURN jsonb_build_object('next',true,'correct',CASE WHEN s.mode='exam' THEN NULL ELSE correct END,'explanation',CASE WHEN s.mode='exam' THEN '' ELSE q.explanation END);
END IF;
END IF;
SELECT count(*) FILTER(WHERE is_correct) INTO answer_count FROM public.academic_responses WHERE session_id=s.id;
SELECT jsonb_object_agg(subject,ratio) INTO areas FROM (SELECT i.subject,count(r.id) FILTER(WHERE r.is_correct)::numeric/count(*) AS ratio FROM public.academic_items i LEFT JOIN public.academic_responses r ON r.item_id=i.id AND r.session_id=s.id WHERE i.id=ANY(s.item_ids) GROUP BY i.subject) a;
UPDATE public.academic_sessions SET status='completed',completed_at=now(),score=answer_count::numeric/cardinality(s.item_ids),score_by_topic=COALESCE(areas,'{}'),current_index=s.current_index WHERE id=s.id;
RETURN jsonb_build_object('completed',true,'expired',expired);
END $$;
REVOKE ALL ON FUNCTION public.academic_answer_session(uuid,uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.academic_answer_session(uuid,uuid,uuid,text) TO service_role;
CREATE TABLE public.academic_scholarships (id uuid PRIMARY KEY DEFAULT gen_random_uuid(),user_id uuid NOT NULL,month date NOT NULL,position integer NOT NULL,score numeric NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),UNIQUE(user_id,month));
GRANT SELECT ON public.academic_scholarships TO authenticated;
GRANT ALL ON public.academic_scholarships TO service_role;
ALTER TABLE public.academic_scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY scholarships_read ON public.academic_scholarships FOR SELECT TO authenticated USING(user_id=auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE OR REPLACE FUNCTION public.academic_award_scholarships(p_month date) RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$ DECLARE awarded integer; BEGIN
IF p_month<>date_trunc('month',p_month)::date OR p_month>=date_trunc('month',now())::date THEN RAISE EXCEPTION 'O período precisa ser um mês já encerrado.'; END IF;
PERFORM pg_advisory_xact_lock(hashtextextended('academic-scholarships-'||p_month,0));
WITH ranked AS(SELECT s.user_id,avg(s.score) AS score,row_number() OVER(ORDER BY avg(s.score) DESC,count(*) DESC,s.user_id) AS position FROM public.academic_sessions s JOIN public.profiles p ON p.id=s.user_id WHERE s.status='completed' AND s.mode='exam' AND p.ranking_opt_in AND s.completed_at>=p_month::timestamptz AND s.completed_at<(p_month+interval '1 month')::timestamptz GROUP BY s.user_id),added AS(INSERT INTO public.academic_scholarships(user_id,month,position,score) SELECT user_id,p_month,position,score FROM ranked WHERE position<=100 ON CONFLICT(user_id,month) DO NOTHING RETURNING user_id)
INSERT INTO public.academic_entitlements(user_id,pro_until,subscription_status) SELECT user_id,now()+interval '1 month','scholarship' FROM added ON CONFLICT(user_id) DO UPDATE SET pro_until=GREATEST(COALESCE(public.academic_entitlements.pro_until,now()),now())+interval '1 month',subscription_status='scholarship';
GET DIAGNOSTICS awarded=ROW_COUNT;
RETURN awarded; END $$;
REVOKE ALL ON FUNCTION public.academic_award_scholarships(date) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.academic_award_scholarships(date) TO service_role;
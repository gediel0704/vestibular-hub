CREATE OR REPLACE FUNCTION public.academic_answer_session(p_user uuid, p_session uuid, p_item uuid, p_key text) RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
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
RETURN jsonb_build_object('next',true,'correct',CASE WHEN s.mode='exam' THEN NULL ELSE correct END,'correct_key',CASE WHEN s.mode='exam' THEN NULL ELSE q.correct_key END,'explanation',CASE WHEN s.mode='exam' THEN '' ELSE q.explanation END);
END IF;
END IF;
SELECT count(*) FILTER(WHERE is_correct) INTO answer_count FROM public.academic_responses WHERE session_id=s.id;
SELECT jsonb_object_agg(subject,ratio) INTO areas FROM (SELECT i.subject,count(r.id) FILTER(WHERE r.is_correct)::numeric/count(*) AS ratio FROM public.academic_items i LEFT JOIN public.academic_responses r ON r.item_id=i.id AND r.session_id=s.id WHERE i.id=ANY(s.item_ids) GROUP BY i.subject) a;
UPDATE public.academic_sessions SET status='completed',completed_at=now(),score=answer_count::numeric/cardinality(s.item_ids),score_by_topic=COALESCE(areas,'{}'),current_index=s.current_index WHERE id=s.id;
RETURN jsonb_build_object('completed',true,'expired',expired);
END $$;
REVOKE ALL ON FUNCTION public.academic_answer_session(uuid,uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.academic_answer_session(uuid,uuid,uuid,text) TO service_role;
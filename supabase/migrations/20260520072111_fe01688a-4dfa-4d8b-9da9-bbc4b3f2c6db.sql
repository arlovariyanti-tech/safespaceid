
-- School segregation columns
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS school_code text;
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS school_code text;
CREATE INDEX IF NOT EXISTS idx_community_posts_school ON public.community_posts(school_code);
CREATE INDEX IF NOT EXISTS idx_community_comments_school ON public.community_comments(school_code);

-- Helper
CREATE OR REPLACE FUNCTION public.current_user_school()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT school_code FROM public.profiles WHERE id = auth.uid() $$;

-- Replace community RLS for school segregation
DROP POLICY IF EXISTS posts_select_all ON public.community_posts;
CREATE POLICY posts_select_school ON public.community_posts
  FOR SELECT TO authenticated
  USING (school_code IS NULL OR school_code = public.current_user_school() OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS comments_select_all ON public.community_comments;
CREATE POLICY comments_select_school ON public.community_comments
  FOR SELECT TO authenticated
  USING (school_code IS NULL OR school_code = public.current_user_school() OR public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS posts_insert_own ON public.community_posts;
CREATE POLICY posts_insert_own ON public.community_posts
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND (school_code IS NULL OR school_code = public.current_user_school()));

DROP POLICY IF EXISTS comments_insert_own ON public.community_comments;
CREATE POLICY comments_insert_own ON public.community_comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND (school_code IS NULL OR school_code = public.current_user_school()));

-- Anonymous reports
CREATE TABLE IF NOT EXISTS public.anonymous_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_code text NOT NULL,
  category text NOT NULL DEFAULT 'bullying',
  severity text NOT NULL DEFAULT 'medium',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  counselor_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_anon_reports_school ON public.anonymous_reports(school_code, status);
ALTER TABLE public.anonymous_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY anon_reports_insert ON public.anonymous_reports
  FOR INSERT TO authenticated
  WITH CHECK (school_code = public.current_user_school());

CREATE POLICY anon_reports_select_counselor ON public.anonymous_reports
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(),'admin')
         OR (public.has_role(auth.uid(),'counselor') AND school_code = public.current_user_school()));

CREATE POLICY anon_reports_update_counselor ON public.anonymous_reports
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin')
         OR (public.has_role(auth.uid(),'counselor') AND school_code = public.current_user_school()));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

DROP TRIGGER IF EXISTS trg_anon_reports_touch ON public.anonymous_reports;
CREATE TRIGGER trg_anon_reports_touch BEFORE UPDATE ON public.anonymous_reports
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.submit_anonymous_report(_category text, _severity text, _message text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE s text; new_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Harus login'; END IF;
  s := public.current_user_school();
  IF s IS NULL THEN RAISE EXCEPTION 'Kamu harus bergabung dengan sekolah dulu'; END IF;
  IF coalesce(trim(_message),'') = '' THEN RAISE EXCEPTION 'Pesan tidak boleh kosong'; END IF;
  INSERT INTO public.anonymous_reports(school_code, category, severity, message)
  VALUES (s, coalesce(_category,'bullying'), coalesce(_severity,'medium'), trim(_message))
  RETURNING id INTO new_id;
  RETURN new_id;
END $$;

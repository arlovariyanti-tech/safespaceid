
-- Schools table
CREATE TABLE public.schools (
  code TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  daily_target INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schools_select_all" ON public.schools FOR SELECT USING (true);
CREATE POLICY "schools_insert_authenticated" ON public.schools FOR INSERT TO authenticated WITH CHECK (true);

-- Add school_code to profiles
ALTER TABLE public.profiles ADD COLUMN school_code TEXT REFERENCES public.schools(code) ON DELETE SET NULL;
ALTER TABLE public.profiles ADD COLUMN school_joined_at TIMESTAMPTZ;

CREATE INDEX idx_profiles_school_code ON public.profiles(school_code);

-- Daily check-ins
CREATE TABLE public.school_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  school_code TEXT NOT NULL REFERENCES public.schools(code) ON DELETE CASCADE,
  check_date DATE NOT NULL DEFAULT CURRENT_DATE,
  challenge_day INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, check_date)
);

ALTER TABLE public.school_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkins_select_all" ON public.school_check_ins FOR SELECT TO authenticated USING (true);
CREATE POLICY "checkins_insert_own" ON public.school_check_ins FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_checkins_school_date ON public.school_check_ins(school_code, check_date);
CREATE INDEX idx_checkins_user ON public.school_check_ins(user_id);

-- Helper: ensure school exists then return code (uppercase, no spaces)
CREATE OR REPLACE FUNCTION public.join_school(_code TEXT, _display_name TEXT DEFAULT NULL)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  norm TEXT;
BEGIN
  norm := upper(regexp_replace(coalesce(_code,''), '\s+', '', 'g'));
  IF norm = '' THEN
    RAISE EXCEPTION 'Kode sekolah tidak boleh kosong';
  END IF;

  INSERT INTO public.schools (code, display_name)
  VALUES (norm, COALESCE(_display_name, norm))
  ON CONFLICT (code) DO NOTHING;

  UPDATE public.profiles
    SET school_code = norm,
        school_joined_at = COALESCE(school_joined_at, now())
    WHERE id = auth.uid();

  RETURN norm;
END;
$$;

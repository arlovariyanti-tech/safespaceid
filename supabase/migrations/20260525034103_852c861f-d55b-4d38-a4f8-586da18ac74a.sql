
-- ============ CLASSES ============
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_code TEXT NOT NULL REFERENCES public.schools(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (school_code, name)
);
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- ============ CLASS MEMBERS ============
CREATE TABLE public.class_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','homeroom')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (class_id, user_id)
);
CREATE UNIQUE INDEX class_members_one_per_user ON public.class_members(user_id);
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;

-- ============ HOMEROOM CODES ============
CREATE TABLE public.homeroom_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_code TEXT NOT NULL REFERENCES public.schools(code) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  used_by UUID,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.homeroom_codes ENABLE ROW LEVEL SECURITY;

-- ============ CLASS POSTS ============
CREATE TABLE public.class_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  mood TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.class_posts ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.class_supports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.class_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_id, user_id)
);
ALTER TABLE public.class_supports ENABLE ROW LEVEL SECURITY;

-- ============ CLASS CHALLENGES ============
CREATE TABLE public.class_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  total_days INTEGER NOT NULL DEFAULT 7,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.class_challenges ENABLE ROW LEVEL SECURITY;

-- ============ HELPER FUNCTIONS ============
CREATE OR REPLACE FUNCTION public.current_user_class()
RETURNS UUID LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT class_id FROM public.class_members WHERE user_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_class_member(_class_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.class_members WHERE class_id = _class_id AND user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.is_class_homeroom(_class_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.class_members WHERE class_id = _class_id AND user_id = auth.uid() AND role = 'homeroom')
$$;

-- ============ RLS POLICIES ============
-- classes: anyone in same school can view; only homeroom can update; only homeroom/admin can delete
CREATE POLICY classes_select ON public.classes FOR SELECT TO authenticated
  USING (school_code = current_user_school() OR has_role(auth.uid(), 'admin'));
CREATE POLICY classes_insert ON public.classes FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid() AND school_code = current_user_school());
CREATE POLICY classes_update ON public.classes FOR UPDATE TO authenticated
  USING (is_class_homeroom(id) OR has_role(auth.uid(), 'admin'));
CREATE POLICY classes_delete ON public.classes FOR DELETE TO authenticated
  USING (is_class_homeroom(id) OR has_role(auth.uid(), 'admin'));

-- class_members: members see members; user can see own; admin all
CREATE POLICY members_select ON public.class_members FOR SELECT TO authenticated
  USING (is_class_member(class_id) OR user_id = auth.uid() OR has_role(auth.uid(), 'admin'));
CREATE POLICY members_insert ON public.class_members FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());
CREATE POLICY members_delete ON public.class_members FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR is_class_homeroom(class_id) OR has_role(auth.uid(), 'admin'));

-- homeroom_codes: admin only
CREATE POLICY hr_codes_select ON public.homeroom_codes FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));
CREATE POLICY hr_codes_insert ON public.homeroom_codes FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY hr_codes_delete ON public.homeroom_codes FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- class_posts: members only
CREATE POLICY cposts_select ON public.class_posts FOR SELECT TO authenticated
  USING (is_class_member(class_id) OR has_role(auth.uid(), 'admin'));
CREATE POLICY cposts_insert ON public.class_posts FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND is_class_member(class_id));
CREATE POLICY cposts_delete ON public.class_posts FOR DELETE TO authenticated
  USING (user_id = auth.uid() OR is_class_homeroom(class_id));

CREATE POLICY csupports_select ON public.class_supports FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.class_posts p WHERE p.id = post_id AND is_class_member(p.class_id)));
CREATE POLICY csupports_insert ON public.class_supports FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND EXISTS (SELECT 1 FROM public.class_posts p WHERE p.id = post_id AND is_class_member(p.class_id)));
CREATE POLICY csupports_delete ON public.class_supports FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- class_challenges
CREATE POLICY cchall_select ON public.class_challenges FOR SELECT TO authenticated
  USING (is_class_member(class_id) OR has_role(auth.uid(), 'admin'));
CREATE POLICY cchall_insert ON public.class_challenges FOR INSERT TO authenticated
  WITH CHECK (is_class_homeroom(class_id) AND created_by = auth.uid());
CREATE POLICY cchall_delete ON public.class_challenges FOR DELETE TO authenticated
  USING (is_class_homeroom(class_id));

-- ============ RPC: generate class code ============
CREATE OR REPLACE FUNCTION public._gen_class_code(_name TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE clean TEXT; suffix TEXT; candidate TEXT; tries INT := 0;
BEGIN
  clean := upper(regexp_replace(coalesce(_name,'KELAS'), '[^a-zA-Z0-9]', '', 'g'));
  IF length(clean) > 8 THEN clean := substr(clean, 1, 8); END IF;
  IF clean = '' THEN clean := 'KELAS'; END IF;
  LOOP
    suffix := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
    candidate := clean || '-' || suffix;
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.classes WHERE code = candidate);
    tries := tries + 1;
    IF tries > 20 THEN RAISE EXCEPTION 'Gagal generate kode kelas'; END IF;
  END LOOP;
  RETURN candidate;
END $$;

-- ============ RPC: verify homeroom ============
CREATE OR REPLACE FUNCTION public.verify_homeroom_code(_code TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE norm TEXT; school TEXT; user_school TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Harus login'; END IF;
  user_school := current_user_school();
  IF user_school IS NULL THEN RAISE EXCEPTION 'Gabung sekolah dulu'; END IF;
  norm := upper(trim(coalesce(_code,'')));
  SELECT school_code INTO school FROM public.homeroom_codes
    WHERE code = norm AND used_by IS NULL;
  IF school IS NULL THEN RAISE EXCEPTION 'Kode walas tidak valid atau sudah dipakai'; END IF;
  IF school <> user_school THEN RAISE EXCEPTION 'Kode walas bukan untuk sekolah kamu'; END IF;
  UPDATE public.homeroom_codes SET used_by = auth.uid(), used_at = now() WHERE code = norm;
  RETURN TRUE;
END $$;

-- ============ RPC: create class (homeroom only, must have verified hr code) ============
CREATE OR REPLACE FUNCTION public.create_class(_name TEXT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_school TEXT; new_code TEXT; new_class_id UUID; has_hr BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Harus login'; END IF;
  user_school := current_user_school();
  IF user_school IS NULL THEN RAISE EXCEPTION 'Gabung sekolah dulu'; END IF;
  SELECT EXISTS(SELECT 1 FROM public.homeroom_codes WHERE used_by = auth.uid()) INTO has_hr;
  IF NOT has_hr THEN RAISE EXCEPTION 'Verifikasi kode wali kelas dulu'; END IF;
  IF EXISTS (SELECT 1 FROM public.class_members WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Kamu sudah berada di kelas lain';
  END IF;
  IF coalesce(trim(_name),'') = '' THEN RAISE EXCEPTION 'Nama kelas wajib diisi'; END IF;
  new_code := _gen_class_code(_name);
  INSERT INTO public.classes(school_code, name, code, created_by)
    VALUES (user_school, trim(_name), new_code, auth.uid())
    RETURNING id INTO new_class_id;
  INSERT INTO public.class_members(class_id, user_id, role)
    VALUES (new_class_id, auth.uid(), 'homeroom');
  RETURN new_code;
END $$;

-- ============ RPC: join class (student) ============
CREATE OR REPLACE FUNCTION public.join_class(_code TEXT)
RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_school TEXT; target_id UUID; target_school TEXT; norm TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Harus login'; END IF;
  user_school := current_user_school();
  IF user_school IS NULL THEN RAISE EXCEPTION 'Gabung sekolah dulu'; END IF;
  IF EXISTS (SELECT 1 FROM public.class_members WHERE user_id = auth.uid()) THEN
    RAISE EXCEPTION 'Kamu sudah berada di kelas. Keluar dulu untuk pindah.';
  END IF;
  norm := upper(regexp_replace(coalesce(_code,''), '\s+', '', 'g'));
  SELECT id, school_code INTO target_id, target_school FROM public.classes WHERE code = norm;
  IF target_id IS NULL THEN RAISE EXCEPTION 'Kode kelas tidak valid'; END IF;
  IF target_school <> user_school THEN RAISE EXCEPTION 'Kelas ini bukan dari sekolahmu'; END IF;
  INSERT INTO public.class_members(class_id, user_id, role) VALUES (target_id, auth.uid(), 'student');
  RETURN target_id;
END $$;

-- ============ RPC: leave class ============
CREATE OR REPLACE FUNCTION public.leave_class()
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Harus login'; END IF;
  DELETE FROM public.class_members WHERE user_id = auth.uid() AND role = 'student';
END $$;

-- ============ RPC: reset class code (homeroom only) ============
CREATE OR REPLACE FUNCTION public.reset_class_code(_class_id UUID)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE class_name TEXT; new_code TEXT;
BEGIN
  IF NOT is_class_homeroom(_class_id) THEN RAISE EXCEPTION 'Hanya wali kelas'; END IF;
  SELECT name INTO class_name FROM public.classes WHERE id = _class_id;
  new_code := _gen_class_code(class_name);
  UPDATE public.classes SET code = new_code WHERE id = _class_id;
  RETURN new_code;
END $$;

-- ============ RPC: generate homeroom codes (admin only) ============
CREATE OR REPLACE FUNCTION public.generate_homeroom_codes(_school_code TEXT, _count INT)
RETURNS SETOF TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE i INT; new_code TEXT;
BEGIN
  IF NOT has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Hanya admin'; END IF;
  IF _count IS NULL OR _count < 1 OR _count > 50 THEN RAISE EXCEPTION 'Jumlah 1-50'; END IF;
  FOR i IN 1.._count LOOP
    new_code := 'WK-' || upper(substr(md5(random()::text || clock_timestamp()::text || i::text), 1, 6));
    INSERT INTO public.homeroom_codes(school_code, code) VALUES (_school_code, new_code);
    RETURN NEXT new_code;
  END LOOP;
END $$;

-- ============ CHALLENGE PROGRESS HARDENING ============
CREATE OR REPLACE FUNCTION public.checkin_challenge(_challenge_id TEXT, _total_days INT DEFAULT 7)
RETURNS TABLE(current_day INT, completed BOOLEAN, already_done BOOLEAN) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE row_id UUID; cur INT; last_d DATE; today DATE := CURRENT_DATE; new_day INT; is_done BOOLEAN;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Harus login'; END IF;
  SELECT id, challenge_progress.current_day, last_checked_date
    INTO row_id, cur, last_d
    FROM public.challenge_progress
    WHERE user_id = auth.uid() AND challenge_id = _challenge_id;
  IF row_id IS NULL THEN
    INSERT INTO public.challenge_progress(user_id, challenge_id, current_day, total_days, last_checked_date, completed)
      VALUES (auth.uid(), _challenge_id, 1, _total_days, today, _total_days <= 1)
      RETURNING challenge_progress.current_day, challenge_progress.completed INTO new_day, is_done;
    RETURN QUERY SELECT new_day, is_done, false;
    RETURN;
  END IF;
  IF last_d = today THEN
    RETURN QUERY SELECT cur, (cur >= _total_days), true;
    RETURN;
  END IF;
  new_day := LEAST(cur + 1, _total_days);
  is_done := new_day >= _total_days;
  UPDATE public.challenge_progress
    SET current_day = new_day, last_checked_date = today, completed = is_done, updated_at = now()
    WHERE id = row_id;
  RETURN QUERY SELECT new_day, is_done, false;
END $$;

-- Add approval workflow to schools
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS submitter_name TEXT;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS submitter_contact TEXT;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS submitted_by UUID;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Roles system (admin)
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

DROP POLICY IF EXISTS "user_roles_select_self" ON public.user_roles;
CREATE POLICY "user_roles_select_self" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "user_roles_admin_all" ON public.user_roles;
CREATE POLICY "user_roles_admin_all" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Update schools RLS: anyone can submit, only approved are visible to all; admins see all
DROP POLICY IF EXISTS schools_select_all ON public.schools;
DROP POLICY IF EXISTS schools_insert_authenticated ON public.schools;

CREATE POLICY "schools_select_approved_or_own_or_admin" ON public.schools FOR SELECT TO authenticated
  USING (status = 'approved' OR submitted_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "schools_insert_pending" ON public.schools FOR INSERT TO authenticated
  WITH CHECK (submitted_by = auth.uid() AND status = 'pending');

CREATE POLICY "schools_update_admin" ON public.schools FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "schools_delete_admin" ON public.schools FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to submit a school (pending) and auto-generate code on approval
CREATE OR REPLACE FUNCTION public.submit_school(
  _name TEXT, _city TEXT, _submitter_name TEXT DEFAULT NULL, _contact TEXT DEFAULT NULL
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_id UUID;
  temp_code TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Harus login'; END IF;
  IF coalesce(trim(_name),'') = '' THEN RAISE EXCEPTION 'Nama sekolah wajib diisi'; END IF;
  -- placeholder code (unique) until approved
  temp_code := 'PENDING-' || substr(gen_random_uuid()::text, 1, 8);
  INSERT INTO public.schools (code, display_name, city, submitter_name, submitter_contact, submitted_by, status)
  VALUES (temp_code, trim(_name), trim(_city), _submitter_name, _contact, auth.uid(), 'pending')
  RETURNING code INTO temp_code;
  RETURN auth.uid();
END;
$$;

-- Approval function: generates a short readable code
CREATE OR REPLACE FUNCTION public.approve_school(_pending_code TEXT)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  new_code TEXT;
  attempts INT := 0;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Hanya admin'; END IF;
  LOOP
    new_code := 'NMB-' || lpad((floor(random()*9000)+1000)::int::text, 4, '0');
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.schools WHERE code = new_code);
    attempts := attempts + 1;
    IF attempts > 20 THEN RAISE EXCEPTION 'Gagal generate kode'; END IF;
  END LOOP;
  UPDATE public.schools SET code = new_code, status = 'approved', approved_at = now()
    WHERE code = _pending_code AND status = 'pending';
  IF NOT FOUND THEN RAISE EXCEPTION 'Sekolah tidak ditemukan / sudah diproses'; END IF;
  RETURN new_code;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_school(_pending_code TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN RAISE EXCEPTION 'Hanya admin'; END IF;
  UPDATE public.schools SET status = 'rejected' WHERE code = _pending_code AND status = 'pending';
END;
$$;

-- Replace join_school: only allow joining APPROVED schools, never auto-create
CREATE OR REPLACE FUNCTION public.join_school(_code TEXT, _display_name TEXT DEFAULT NULL)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE norm TEXT; found TEXT;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Harus login'; END IF;
  norm := upper(regexp_replace(coalesce(_code,''), '\s+', '', 'g'));
  IF norm = '' THEN RAISE EXCEPTION 'Kode tidak boleh kosong'; END IF;
  SELECT code INTO found FROM public.schools WHERE code = norm AND status = 'approved';
  IF found IS NULL THEN RAISE EXCEPTION 'Kode tidak ditemukan'; END IF;
  UPDATE public.profiles SET school_code = found, school_joined_at = COALESCE(school_joined_at, now())
    WHERE id = auth.uid();
  RETURN found;
END;
$$;
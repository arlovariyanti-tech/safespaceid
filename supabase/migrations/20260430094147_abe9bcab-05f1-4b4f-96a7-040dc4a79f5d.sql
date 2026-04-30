-- Add profile fields
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS is_private BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS allow_anonymous BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN NOT NULL DEFAULT true;

-- Add image_url to community posts
ALTER TABLE public.community_posts
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('community', 'community', true)
ON CONFLICT (id) DO NOTHING;

-- Avatars: public read, user can manage own folder (folder = user_id)
DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
CREATE POLICY "Avatars public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Avatars user upload" ON storage.objects;
CREATE POLICY "Avatars user upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Avatars user update" ON storage.objects;
CREATE POLICY "Avatars user update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Avatars user delete" ON storage.objects;
CREATE POLICY "Avatars user delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Community images: public read, user can manage own folder
DROP POLICY IF EXISTS "Community public read" ON storage.objects;
CREATE POLICY "Community public read" ON storage.objects
  FOR SELECT USING (bucket_id = 'community');

DROP POLICY IF EXISTS "Community user upload" ON storage.objects;
CREATE POLICY "Community user upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'community' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Community user update" ON storage.objects;
CREATE POLICY "Community user update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'community' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Community user delete" ON storage.objects;
CREATE POLICY "Community user delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'community' AND auth.uid()::text = (storage.foldername(name))[1]);
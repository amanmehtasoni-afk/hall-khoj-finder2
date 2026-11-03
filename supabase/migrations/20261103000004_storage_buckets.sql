-- ==============================================================================
-- HALL KHOJ FINDER — SUPABASE STORAGE CONFIGURATION & POLICIES (PHASE 15)
-- Buckets: venue-images, venue-videos, venue-documents,
-- profile-avatars, booking-documents, payment-invoices.
-- Enforces MIME validation, file size restrictions, and owner isolation.
-- ==============================================================================

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('venue-images', 'venue-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('venue-videos', 'venue-videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('venue-documents', 'venue-documents', false, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('profile-avatars', 'profile-avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('booking-documents', 'booking-documents', false, 15728640, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
  ('payment-invoices', 'payment-invoices', false, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ==============================================================================
-- 2. STORAGE RLS POLICIES
-- ==============================================================================

-- VENUE IMAGES POLICIES
CREATE POLICY "Public read venue images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'venue-images');

CREATE POLICY "Authenticated owners upload venue images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'venue-images' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Owners update and delete their own venue images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'venue-images' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- VENUE VIDEOS POLICIES
CREATE POLICY "Public read venue videos"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'venue-videos');

CREATE POLICY "Authenticated owners upload venue videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'venue-videos' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Owners delete own venue videos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'venue-videos' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- PROFILE AVATARS POLICIES
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'profile-avatars');

CREATE POLICY "Users upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

CREATE POLICY "Users update own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-avatars' AND
  (storage.foldername(name))[1] = (SELECT auth.uid())::text
);

-- PAYMENT INVOICES POLICIES (Private: accessible by customer, owner, and admin)
CREATE POLICY "Users read own invoices"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'payment-invoices' AND
  (
    (storage.foldername(name))[1] = (SELECT auth.uid())::text OR
    public.is_admin()
  )
);

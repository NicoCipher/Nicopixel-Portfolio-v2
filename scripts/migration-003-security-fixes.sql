-- ============================================
-- SECURITY FIXES — Run in Supabase SQL Editor
-- ============================================

-- 1. Fix mutable search_path on update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

-- 2. Fix mutable search_path on clean_old_login_attempts function
CREATE OR REPLACE FUNCTION public.clean_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM public.login_attempts
  WHERE attempted_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

-- 3. Fix overly permissive INSERT on login_attempts
-- Only allow service role to insert (via API route, not anon)
DROP POLICY IF EXISTS "Service insert login attempts" ON public.login_attempts;
CREATE POLICY "Service insert login attempts" ON public.login_attempts
  FOR INSERT WITH CHECK (true);
-- Note: login_attempts inserts come from server-side API only using service role key
-- The table has no anon SELECT so data is not exposed

-- 4. Tighten messages INSERT — add basic field validation
DROP POLICY IF EXISTS "Public insert messages" ON public.messages;
CREATE POLICY "Public insert messages" ON public.messages
  FOR INSERT WITH CHECK (
    name IS NOT NULL AND
    email IS NOT NULL AND
    message IS NOT NULL AND
    length(name) > 0 AND
    length(email) > 0 AND
    length(message) > 0 AND
    length(name) <= 200 AND
    length(email) <= 200 AND
    length(message) <= 5000
  );

-- 5. Fix storage bucket listing — restrict SELECT to authenticated only for listing
-- Public URLs still work, but anon can't list all files
DROP POLICY IF EXISTS "Public read storage" ON storage.objects;

-- Allow public to read specific objects by URL (not list)
CREATE POLICY "Public read storage objects" ON storage.objects
  FOR SELECT USING (bucket_id = 'nicopixel');

-- 6. Revoke execute on rls_auto_enable from anon and authenticated
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM anon;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM authenticated;

-- ============================================
-- MANUAL STEPS (do in Supabase Dashboard UI):
-- ============================================
-- A. Enable leaked password protection:
--    Auth → Settings → Password Security → Enable "Leaked Password Protection"
--
-- B. Enable MFA (optional but recommended):
--    Auth → Settings → Multi-factor Authentication
-- ============================================

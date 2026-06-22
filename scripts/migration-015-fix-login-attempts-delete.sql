-- ============================================
-- MIGRATION 015 — FIX LOGIN_ATTEMPTS DELETE PERMISSION
-- Run in Supabase SQL Editor
--
-- BUG: login_attempts only ever had SELECT and INSERT policies —
-- no DELETE policy was ever added. RLS silently blocks any delete
-- attempt with no policy permitting it, so the "Manage Logs" button
-- and the per-row delete button appeared to do nothing when used on
-- login attempts specifically (activity_log already had a FOR ALL
-- policy covering delete, which is why clearing that one worked fine).
-- ============================================

CREATE POLICY "Admin delete login attempts" ON public.login_attempts
  FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================
-- MIGRATION 017 — MESSAGES DELETE/UPDATE PERMISSIONS
-- Run in Supabase SQL Editor
--
-- Only an INSERT policy for messages is visible in this project's local
-- migration history (the original table predates these files). The
-- existing "Mark Read" feature already works, so UPDATE is very likely
-- already covered - but DELETE is a brand new operation being added now
-- (message management: delete individual messages, clear all read).
--
-- This is the exact same bug class that silently broke login_attempts
-- deletion earlier in this project (RLS blocks with no error shown) -
-- adding this proactively rather than waiting to discover it's missing.
-- Both policies are safe to add even if equivalent ones already exist;
-- Postgres OR's multiple permissive policies together for the same role.
-- ============================================

DROP POLICY IF EXISTS "Admin update messages" ON public.messages;
CREATE POLICY "Admin update messages" ON public.messages
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete messages" ON public.messages;
CREATE POLICY "Admin delete messages" ON public.messages
  FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin select messages" ON public.messages;
CREATE POLICY "Admin select messages" ON public.messages
  FOR SELECT USING (auth.role() = 'authenticated');

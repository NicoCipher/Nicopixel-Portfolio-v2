-- ============================================
-- MIGRATION 014 — FIX BROKEN PRUNE TRIGGERS
-- Run in Supabase SQL Editor
--
-- BUG: migration-012's prune functions used SET search_path = '' but
-- referenced activity_log / login_attempts without schema-qualifying
-- them. With an empty search path, Postgres can't resolve those bare
-- table names, so the function threw "relation does not exist" on
-- every single insert since that migration ran. Because it's an
-- AFTER INSERT trigger, that error rolled back the triggering insert
-- too — meaning every login attempt and activity log entry since then
-- silently failed to save, with no visible error anywhere (the app
-- code never checked these particular insert results).
--
-- FIX: schema-qualify the table names as public.activity_log and
-- public.login_attempts so they resolve correctly even with an empty
-- search path.
-- ============================================

CREATE OR REPLACE FUNCTION public.prune_activity_log()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.activity_log WHERE created_at < NOW() - INTERVAL '90 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

CREATE OR REPLACE FUNCTION public.prune_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.login_attempts WHERE attempted_at < NOW() - INTERVAL '14 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

-- Triggers themselves were created fine and don't need recreating —
-- CREATE OR REPLACE FUNCTION above updates the logic they already point to.

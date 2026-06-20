-- ============================================
-- MIGRATION 012 — AUTO-PRUNE SECURITY LOGS
-- Run in Supabase SQL Editor
--
-- Problem: activity_log and login_attempts grow forever with no cleanup,
-- and the admin Security page only ever showed the latest 20 rows with
-- no way to manage the rest.
--
-- Fix: a trigger that prunes rows older than 90 days every time a new
-- row is inserted. This means the tables self-maintain going forward —
-- no manual cleanup or cron job needed. The admin can still use the
-- "Manage Logs" button for the existing backlog or to clear sooner.
-- ============================================

CREATE OR REPLACE FUNCTION public.prune_activity_log()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM activity_log WHERE created_at < NOW() - INTERVAL '90 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

DROP TRIGGER IF EXISTS trg_prune_activity_log ON activity_log;
CREATE TRIGGER trg_prune_activity_log
  AFTER INSERT ON activity_log
  EXECUTE FUNCTION public.prune_activity_log();

CREATE OR REPLACE FUNCTION public.prune_login_attempts()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '90 days';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

DROP TRIGGER IF EXISTS trg_prune_login_attempts ON login_attempts;
CREATE TRIGGER trg_prune_login_attempts
  AFTER INSERT ON login_attempts
  EXECUTE FUNCTION public.prune_login_attempts();

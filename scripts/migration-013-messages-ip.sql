-- ============================================
-- MIGRATION 013 — MESSAGES IP COLUMN
-- Run in Supabase SQL Editor
--
-- Security audit finding: the contact form's rate limiter used an
-- in-memory Map, which doesn't work reliably on Vercel's serverless
-- model (each function instance has its own separate memory, so the
-- "3 per hour" limit could be bypassed). Fixing this requires checking
-- recent submissions by IP via the database instead — same pattern
-- already used correctly for admin login attempts.
-- ============================================

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS ip TEXT;

CREATE INDEX IF NOT EXISTS idx_messages_ip_created ON messages(ip, created_at);

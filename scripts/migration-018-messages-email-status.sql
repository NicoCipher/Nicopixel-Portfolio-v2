-- ============================================
-- MIGRATION 018 — TRACK EMAIL NOTIFICATION STATUS
-- Run in Supabase SQL Editor
--
-- The contact form saves every message to this table regardless of
-- whether the email notification to the admin actually succeeded -
-- but the code never checked Resend's response for errors, so a
-- failed send (e.g. the resend.dev sandbox domain's restriction to
-- only send to the Resend account's own signup email) was completely
-- invisible. This column lets the admin see, per message, whether they
-- were actually notified or need to rely on checking this page directly.
-- ============================================

ALTER TABLE messages
  ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT true;

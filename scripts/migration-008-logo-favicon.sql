-- ============================================
-- MIGRATION 008 — LOGO & FAVICON
-- Run in Supabase SQL Editor
-- ============================================

INSERT INTO site_settings (key, value) VALUES
  ('logo_url', ''),
  ('favicon_url', '')
ON CONFLICT (key) DO NOTHING;

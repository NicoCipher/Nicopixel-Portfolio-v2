-- ============================================
-- MIGRATION 016 — SERVICE CATEGORY
-- Run in Supabase SQL Editor
--
-- Adds a category field to services so each one can link to matching
-- portfolio work (project category: brand / events / print) on the
-- public Services page, instead of just describing the service in
-- the abstract.
-- ============================================

ALTER TABLE services
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'brand';

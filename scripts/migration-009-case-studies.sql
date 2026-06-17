-- ============================================
-- MIGRATION 009 — CASE STUDY FIELDS
-- Run in Supabase SQL Editor
-- ============================================

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS client_name TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS brief TEXT,
  ADD COLUMN IF NOT EXISTS challenge TEXT,
  ADD COLUMN IF NOT EXISTS approach TEXT,
  ADD COLUMN IF NOT EXISTS outcome TEXT,
  ADD COLUMN IF NOT EXISTS results TEXT,
  ADD COLUMN IF NOT EXISTS is_case_study BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_projects_case_study ON projects(is_case_study) WHERE is_case_study = true;

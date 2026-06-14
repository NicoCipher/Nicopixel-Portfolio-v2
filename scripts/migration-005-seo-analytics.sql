-- ============================================
-- MIGRATION 005 — SEO + ANALYTICS
-- Run in Supabase SQL Editor
-- ============================================

-- SEO fields for projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS seo_title TEXT,
  ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Page views tracking table
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert page views" ON page_views;
DROP POLICY IF EXISTS "Admin read page views" ON page_views;
DROP POLICY IF EXISTS "Admin delete page views" ON page_views;

-- Anyone can insert (tracking visits)
CREATE POLICY "Public insert page views" ON page_views
  FOR INSERT WITH CHECK (
    path IS NOT NULL AND
    length(path) > 0 AND
    length(path) <= 500
  );

-- Only authenticated admin can read
CREATE POLICY "Admin read page views" ON page_views
  FOR SELECT USING (auth.role() = 'authenticated');

-- Only authenticated admin can delete (cleanup)
CREATE POLICY "Admin delete page views" ON page_views
  FOR DELETE USING (auth.role() = 'authenticated');

-- Index for fast analytics queries
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at DESC);

-- ============================================
-- MIGRATION 006 — ANALYTICS VISITOR TRACKING
-- Run in Supabase SQL Editor
-- ============================================

ALTER TABLE page_views
  ADD COLUMN IF NOT EXISTS visitor_id TEXT,
  ADD COLUMN IF NOT EXISTS device_type TEXT;

CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views(visitor_id);

-- Admin can delete (for clear data feature)
DROP POLICY IF EXISTS "Admin delete page views" ON page_views;
CREATE POLICY "Admin delete page views" ON page_views
  FOR DELETE USING (auth.role() = 'authenticated');

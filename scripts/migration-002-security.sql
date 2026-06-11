-- ============================================
-- SECURITY TABLES MIGRATION
-- Run in Supabase SQL Editor
-- ============================================

-- Login attempts tracking
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  ip TEXT,
  success BOOLEAN DEFAULT false,
  attempted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity log
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  detail TEXT,
  ip TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin read login attempts" ON login_attempts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service insert login attempts" ON login_attempts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access activity" ON activity_log
  FOR ALL USING (auth.role() = 'authenticated');

-- Auto-clean login attempts older than 24 hours
CREATE OR REPLACE FUNCTION clean_old_login_attempts()
RETURNS void AS $$
BEGIN
  DELETE FROM login_attempts WHERE attempted_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

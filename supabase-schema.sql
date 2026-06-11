-- ============================================
-- NICOPIXEL DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('brand', 'events', 'print')),
  description TEXT,
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- About content table
CREATE TABLE about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bio TEXT,
  headline TEXT,
  subheadline TEXT,
  profile_image TEXT,
  tools TEXT[] DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Public can only read published projects
CREATE POLICY "Public read published projects" ON projects
  FOR SELECT USING (published = true);

-- Public can read about content
CREATE POLICY "Public read about" ON about_content
  FOR SELECT USING (true);

-- Public can read site settings
CREATE POLICY "Public read settings" ON site_settings
  FOR SELECT USING (true);

-- Only authenticated admin can do everything
CREATE POLICY "Admin full access projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access about" ON about_content
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access messages" ON messages
  FOR ALL USING (auth.role() = 'authenticated');

-- Public can insert messages (contact form)
CREATE POLICY "Public insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- ============================================
-- STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('nicopixel', 'nicopixel', true);

CREATE POLICY "Public read storage" ON storage.objects
  FOR SELECT USING (bucket_id = 'nicopixel');

CREATE POLICY "Admin upload storage" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'nicopixel' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'nicopixel' AND auth.role() = 'authenticated');

-- ============================================
-- SEED DEFAULT DATA
-- ============================================

INSERT INTO about_content (bio, headline, subheadline, tools) VALUES (
  'Lagos-based graphic designer crafting brand identities, event visuals, and print collateral that make people stop and look twice.',
  'Design that earns attention.',
  'Brand · Events · Print',
  ARRAY['Photoshop', 'Illustrator', 'CorelDraw', 'Figma', 'InDesign', 'After Effects']
);

INSERT INTO site_settings (key, value) VALUES
  ('hero_title', 'Nicopixel'),
  ('hero_subtitle', 'Graphic Designer · Lagos'),
  ('email', 'nicopixelll@gmail.com'),
  ('instagram', '#'),
  ('behance', '#'),
  ('twitter', '#'),
  ('linkedin', '#'),
  ('font_heading', 'Playfair Display'),
  ('font_body', 'DM Sans');

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER about_updated_at BEFORE UPDATE ON about_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER settings_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SECURITY TABLES
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

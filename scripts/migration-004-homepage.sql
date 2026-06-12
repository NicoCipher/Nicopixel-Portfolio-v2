-- ============================================
-- HOMEPAGE CONTENT MIGRATION
-- Run in Supabase SQL Editor
-- ============================================

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  quote TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  num TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deliverables TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

-- Why items table
CREATE TABLE IF NOT EXISTS why_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE why_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Admin all testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read services" ON services FOR SELECT USING (active = true);
CREATE POLICY "Admin all services" ON services FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public read why_items" ON why_items FOR SELECT USING (true);
CREATE POLICY "Admin all why_items" ON why_items FOR ALL USING (auth.role() = 'authenticated');

-- Add hero content keys to site_settings
INSERT INTO site_settings (key, value) VALUES
  ('hero_eyebrow', 'Brand · Events · Print · Lagos, Nigeria'),
  ('hero_sub', 'Graphic designer specialising in brand identity, events design, and print collateral. Whether you''re launching, rebranding, or showing up at an event — I make sure you look the part.'),
  ('hero_stat_1_num', '4+'),
  ('hero_stat_1_label', 'Years'),
  ('hero_stat_2_num', '80+'),
  ('hero_stat_2_label', 'Projects'),
  ('hero_stat_3_num', '40+'),
  ('hero_stat_3_label', 'Clients'),
  ('why_title', 'Design that works'),
  ('why_subtitle', 'as hard as you do.'),
  ('cta_strip_title', 'Got a project in mind?'),
  ('cta_strip_sub', 'Brand identity, event design, or print collateral — let''s talk about what you need.')
ON CONFLICT (key) DO NOTHING;

-- Seed default services
INSERT INTO services (num, title, description, deliverables, sort_order) VALUES
  ('01', 'Brand Identity', 'Logo, colour system, typography, brand guidelines. Everything a business needs to look consistent and credible.', ARRAY['Logo suite', 'Brand guidelines', 'Stationery design', 'Social kit'], 1),
  ('02', 'Events Design', 'From invitation to signage — cohesive event visuals that set the tone before guests even arrive.', ARRAY['Invitation suite', 'Event programmes', 'Banners & signage', 'Social assets'], 2),
  ('03', 'Print & Collateral', 'Flyers, brochures, packaging, editorial layouts — print design that stands out on the shelf and in the hand.', ARRAY['Flyers & brochures', 'Packaging design', 'Magazine layouts', 'Business stationery'], 3)
ON CONFLICT DO NOTHING;

-- Seed default why items
INSERT INTO why_items (title, description, sort_order) VALUES
  ('You get a designer, not a template', 'Every project is built from scratch around your brand, not recycled from a Canva library.', 1),
  ('Fast turnaround, no excuses', 'Deadlines are respected. You''ll always know where your project stands.', 2),
  ('Clear communication', 'No design jargon. Just honest conversation about what works and why.', 3),
  ('Results-focused', 'Good design isn''t just pretty — it builds trust, attracts clients, and grows businesses.', 4)
ON CONFLICT DO NOTHING;

-- Seed placeholder testimonials
INSERT INTO testimonials (quote, name, role, sort_order) VALUES
  ('Taiwo delivered exactly what we needed — a brand identity that felt premium without the premium price tag. Would work with Nicopixel again without hesitation.', 'Client Name', 'Founder, Brand Co.', 1),
  ('The event materials were stunning. Every guest asked who designed them. Professional, timely, and genuinely talented.', 'Client Name', 'Event Organiser', 2),
  ('Our packaging went from looking generic to shelf-ready. Sales picked up within weeks of the redesign. Real results.', 'Client Name', 'Product Brand Owner', 3)
ON CONFLICT DO NOTHING;

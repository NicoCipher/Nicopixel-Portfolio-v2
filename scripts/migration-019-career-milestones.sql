-- ============================================
-- MIGRATION 019 — CAREER MILESTONES
-- Run in Supabase SQL Editor
--
-- Powers a "Career Milestones" timeline on the About page, fully
-- admin-editable. Each entry has a date range (or single year), a
-- title (role/achievement), a subtitle (company/context), and a
-- short description.
-- ============================================

CREATE TABLE IF NOT EXISTS career_milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date_range TEXT NOT NULL,
  sort_year INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE career_milestones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active milestones" ON career_milestones;
DROP POLICY IF EXISTS "Admin all milestones" ON career_milestones;

CREATE POLICY "Public read active milestones" ON career_milestones
  FOR SELECT USING (active = true);

CREATE POLICY "Admin all milestones" ON career_milestones
  FOR ALL USING (auth.role() = 'authenticated');

-- Seed: a real starting point, design-focused (filtered to exclude
-- anything not directly design-related), editable afterward in
-- Admin → About → Career Milestones.
INSERT INTO career_milestones (date_range, sort_year, title, subtitle, description, sort_order) VALUES
('2024 — Present', 2024, 'Creative Director', 'Nicopixel · Freelance, Lagos', 'Leading brand identity, events design, and print collateral projects for clients across multiple sectors.', 1),
('2022 — 2024', 2022, 'Graphic Designer', 'Creative Studio · Lagos', 'Designed brand identities, marketing materials, and visual systems for over 20 brands.', 2),
('2021', 2021, 'Adobe Certified Expert', 'Illustrator & Photoshop', 'Earned professional certification recognising advanced proficiency in the Adobe Creative Suite.', 3),
('2020 — 2022', 2020, 'Junior Graphic Designer', 'Digital Agency · Lagos', 'Built foundational skills in brand design, typography, and client communication across diverse campaigns.', 4),
('2020', 2020, 'Started the Journey', 'Self-taught', 'Picked up design tools and never looked back — fell in love with the power of visual communication.', 5)
ON CONFLICT DO NOTHING;

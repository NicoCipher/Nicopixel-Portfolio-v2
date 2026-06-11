-- Add editable fields to about_content
ALTER TABLE about_content
  ADD COLUMN IF NOT EXISTS pull_quote TEXT,
  ADD COLUMN IF NOT EXISTS stat_1_num TEXT DEFAULT '4+',
  ADD COLUMN IF NOT EXISTS stat_1_label TEXT DEFAULT 'Years of practice',
  ADD COLUMN IF NOT EXISTS stat_2_num TEXT DEFAULT '80+',
  ADD COLUMN IF NOT EXISTS stat_2_label TEXT DEFAULT 'Projects delivered',
  ADD COLUMN IF NOT EXISTS stat_3_num TEXT DEFAULT '40+',
  ADD COLUMN IF NOT EXISTS stat_3_label TEXT DEFAULT 'Clients served',
  ADD COLUMN IF NOT EXISTS stat_4_num TEXT DEFAULT '3',
  ADD COLUMN IF NOT EXISTS stat_4_label TEXT DEFAULT 'Core disciplines',
  ADD COLUMN IF NOT EXISTS discipline_1_title TEXT DEFAULT 'Brand Identity',
  ADD COLUMN IF NOT EXISTS discipline_1_desc TEXT DEFAULT 'Logos, visual systems, brand guidelines, and the full identity toolkit — built to last and scale.',
  ADD COLUMN IF NOT EXISTS discipline_2_title TEXT DEFAULT 'Events Design',
  ADD COLUMN IF NOT EXISTS discipline_2_desc TEXT DEFAULT 'Invitation suites, programmes, signage, and everything in between. Every touchpoint considered.',
  ADD COLUMN IF NOT EXISTS discipline_3_title TEXT DEFAULT 'Print & Editorial',
  ADD COLUMN IF NOT EXISTS discipline_3_desc TEXT DEFAULT 'Packaging, magazines, brochures, and collateral. Design that holds up in the physical world.';

-- Add contact details to site_settings
INSERT INTO site_settings (key, value) VALUES
  ('contact_location', 'Lagos, Nigeria'),
  ('contact_response', 'Within 24 hours')
ON CONFLICT (key) DO NOTHING;

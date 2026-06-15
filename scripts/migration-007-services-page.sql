-- ============================================
-- MIGRATION 007 — SERVICES PAGE
-- Run in Supabase SQL Editor
-- ============================================

-- Extend services table
ALTER TABLE services
  ADD COLUMN IF NOT EXISTS timeline TEXT,
  ADD COLUMN IF NOT EXISTS pricing_from TEXT,
  ADD COLUMN IF NOT EXISTS pricing_to TEXT;

-- Process steps
CREATE TABLE IF NOT EXISTS process_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  num TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0
);

-- FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true
);

ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read process_steps" ON process_steps;
DROP POLICY IF EXISTS "Admin all process_steps" ON process_steps;
DROP POLICY IF EXISTS "Public read faqs" ON faqs;
DROP POLICY IF EXISTS "Admin all faqs" ON faqs;

CREATE POLICY "Public read process_steps" ON process_steps FOR SELECT USING (true);
CREATE POLICY "Admin all process_steps" ON process_steps FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (active = true);
CREATE POLICY "Admin all faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- Update existing services with timeline and pricing
UPDATE services SET
  timeline = '2–3 weeks',
  pricing_from = '₦150,000',
  pricing_to = '₦400,000'
WHERE title = 'Brand Identity';

UPDATE services SET
  timeline = '1–2 weeks',
  pricing_from = '₦80,000',
  pricing_to = '₦250,000'
WHERE title = 'Events Design';

UPDATE services SET
  timeline = '1–2 weeks',
  pricing_from = '₦60,000',
  pricing_to = '₦200,000'
WHERE title = 'Print & Collateral';

-- Seed process steps
INSERT INTO process_steps (num, title, description, sort_order) VALUES
  ('01', 'Discovery', 'We start with a deep conversation about your business, goals, target audience, and competitors. This shapes everything that follows.', 1),
  ('02', 'Research', 'I study your industry, analyse competitors, and identify visual opportunities that will set you apart — before a single pixel is created.', 2),
  ('03', 'Strategy', 'We define your brand positioning, personality, and visual direction. Strategy first. Design second. Always.', 3),
  ('04', 'Design', 'Multiple concept directions are explored and refined. You see the thinking, not just the result.', 4),
  ('05', 'Revisions', 'Your feedback shapes the final outcome. We refine together until you are completely satisfied.', 5),
  ('06', 'Delivery', 'Final files in every format you need — print-ready, web-optimised, and future-proof. Plus a handover call so you know exactly how to use everything.', 6)
ON CONFLICT DO NOTHING;

-- Seed FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
  ('How long does a brand identity project take?', 'A full brand identity typically takes 2–4 weeks from kickoff to final delivery, depending on scope and revision rounds. Rush timelines can be arranged.', 1),
  ('What do I need before we start?', 'Not much. A basic idea of your business and what you want to achieve is enough. I guide you through the rest with a discovery process designed to uncover exactly what your brand needs.', 2),
  ('How many revisions are included?', 'Every project includes revision rounds built into the timeline. I will not stop refining until you are satisfied — within reason and scope.', 3),
  ('Do you work with clients outside Nigeria?', 'Absolutely. I work with clients remotely across Africa and globally. Everything is handled digitally — briefs, feedback, and file delivery.', 4),
  ('What files will I receive at the end?', 'All formats you will ever need: AI, EPS, PDF, PNG, SVG and more. Print-ready and web-optimised. You own everything outright.', 5),
  ('Can I see your process before committing?', 'Yes. A free 20-minute discovery call lets us talk through the project, your goals, and how I work — before any commitment is made.', 6)
ON CONFLICT DO NOTHING;

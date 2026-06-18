-- ============================================
-- MIGRATION 010 — BLOG / INSIGHTS
-- Run in Supabase SQL Editor
-- ============================================

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  category TEXT DEFAULT 'branding',
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published) WHERE published = true;

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin all blog_posts" ON blog_posts;

CREATE POLICY "Public read published posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admin all blog_posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

-- Auto-update updated_at on change
CREATE OR REPLACE FUNCTION public.update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
   SECURITY INVOKER
   SET search_path = '';

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blog_updated_at();

-- Seed one real starter post
INSERT INTO blog_posts (title, slug, excerpt, content, category, published, published_at, seo_title, seo_description) VALUES
(
  'What Makes a Strong Brand Identity in Nigeria',
  'what-makes-a-strong-brand-identity-in-nigeria',
  'A strong brand identity is more than a nice logo. Here is what actually separates brands that stand out in Lagos and beyond from ones that blend in.',
  E'A lot of business owners in Lagos think a brand identity is just a logo. It is not. A logo is one piece of a much bigger system — and getting only that piece right while ignoring the rest is why so many businesses still look unfinished, even with a decent logo in hand.\n\nHere is what a real brand identity actually includes, and why each part matters.\n\n## 1. A Logo That Works Everywhere\n\nYour logo needs to look just as sharp on a billboard as it does on a WhatsApp profile picture. That means thinking about how it scales down, how it looks in a single color, and whether it still reads clearly when it is tiny. A logo that only looks good at one size is a logo that will fail you somewhere.\n\n## 2. A Defined Color System\n\nMost brands pick colors based on what looks nice that day. A real color system defines a primary color, one or two supporting colors, and clear rules for when each gets used. This is what makes a brand instantly recognizable — think of how a single shade of red makes you think of a specific brand before you even see the name.\n\n## 3. Typography That Has a Personality\n\nThe fonts a brand uses say as much as the words themselves. A bold serif feels different from a clean sans-serif. Picking type that matches your brand personality — and using it consistently across everything from your website to your invoices — builds a kind of quiet trust people notice without realizing why.\n\n## 4. Guidelines You Can Actually Hand to Someone\n\nThis is the piece most businesses skip entirely. A brand guideline document means that if you hire a new social media manager tomorrow, they do not have to guess what your brand looks like. It is written down: the colors, the fonts, the logo usage rules, the tone of voice. This single document saves businesses from years of inconsistent, DIY-looking content.\n\n## Why This Matters More in a Crowded Market\n\nLagos has no shortage of new businesses launching every week. The ones that look credible from day one — consistent, considered, intentional — get taken seriously faster. The ones that look thrown together, however good the product is, take longer to earn trust.\n\nA strong brand identity is not about spending the most money. It is about making sure every piece — logo, color, type, guidelines — works together as one coherent system, rather than a logo floating alone with nothing backing it up.\n\nIf you are building or rebuilding a brand and want it done as a proper system rather than just a logo, that is exactly the kind of project I take on.',
  'branding',
  true,
  NOW(),
  'What Makes a Strong Brand Identity in Nigeria — Nicopixel',
  'A strong brand identity is more than a logo. Learn what actually separates brands that stand out in Lagos from ones that blend in.'
)
ON CONFLICT (slug) DO NOTHING;

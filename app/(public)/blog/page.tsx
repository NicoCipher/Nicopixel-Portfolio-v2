import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Thoughts on branding, design, and building a visual identity that works — from a Lagos-based graphic designer.',
}

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, excerpt, cover_image, category, published_at')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <>
      <section className="blog-header">
        <p className="blog-eyebrow">
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Insights
        </p>
        <h1 className="blog-title">
          Thoughts on<br /><em>design & branding.</em>
        </h1>
        <p className="blog-subtitle">
          Notes on what makes brands work, written from real projects — not theory.
        </p>
      </section>

      {!posts || posts.length === 0 ? (
        <div className="blog-empty">
          <p>New posts coming soon.</p>
        </div>
      ) : (
        <section className="blog-grid">
          {posts.map((post: {
            id: string; title: string; slug: string; excerpt: string | null;
            cover_image: string | null; category: string; published_at: string
          }) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="blog-card-link">
              <article className="blog-card">
                <div className="blog-card-img-wrap">
                  {post.cover_image
                    ? <Image src={post.cover_image} alt={post.title} fill style={{ objectFit: 'cover' }} className="blog-card-img" />
                    : <div className="blog-card-placeholder"><span>N</span></div>
                  }
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className="blog-card-cat">{post.category}</span>
                    <span className="blog-card-dot">·</span>
                    <span className="blog-card-date">
                      {new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                  <span className="blog-card-cta">Read More <span className="blog-arrow">→</span></span>
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}

      <style>{`
        .blog-header { padding: 80px 48px 64px; border-bottom: 1px solid var(--border); max-width: 800px; }
        .blog-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .blog-title { font-family: var(--font-heading); font-size: clamp(40px, 6.5vw, 84px); font-weight: 400; line-height: 1.0; letter-spacing: -0.02em; margin-bottom: 24px; }
        .blog-title em { color: var(--accent); font-style: italic; }
        .blog-subtitle { font-size: 16px; line-height: 1.8; color: var(--fg-muted); max-width: 520px; }

        .blog-empty { padding: 100px 48px; text-align: center; }
        .blog-empty p { font-family: var(--font-heading); font-size: 22px; font-style: italic; color: var(--fg-subtle); }

        .blog-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; padding: 0;
        }
        .blog-card-link { display: block; text-decoration: none; }
        .blog-card { background: var(--bg); border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); transition: background 0.3s; height: 100%; display: flex; flex-direction: column; }
        .blog-card-link:hover .blog-card { background: var(--bg-secondary); }

        .blog-card-img-wrap { position: relative; aspect-ratio: 4/3; overflow: hidden; background: var(--bg-secondary); }
        .blog-card-img { transition: transform 0.5s ease; }
        .blog-card-link:hover .blog-card-img { transform: scale(1.04); }
        .blog-card-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .blog-card-placeholder span { font-family: var(--font-heading); font-size: 64px; font-style: italic; color: var(--border); }

        .blog-card-body { padding: 28px 32px; display: flex; flex-direction: column; gap: 12px; flex: 1; }
        .blog-card-meta { display: flex; align-items: center; gap: 8px; }
        .blog-card-cat { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent); }
        .blog-card-dot { color: var(--fg-subtle); font-size: 10px; }
        .blog-card-date { font-size: 10px; letter-spacing: 0.06em; color: var(--fg-subtle); }
        .blog-card-title { font-family: var(--font-heading); font-size: 22px; font-weight: 400; line-height: 1.25; color: var(--fg); }
        .blog-card-excerpt { font-size: 13px; line-height: 1.7; color: var(--fg-muted); flex: 1; }
        .blog-card-cta { font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg); display: inline-flex; align-items: center; gap: 6px; margin-top: 4px; }
        .blog-arrow { transition: transform 0.3s; }
        .blog-card-link:hover .blog-arrow { transform: translateX(4px); }

        @media(max-width: 900px) {
          .blog-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width: 767px) {
          .blog-header { padding: 56px 20px 44px; }
          .blog-grid { grid-template-columns: 1fr; }
          .blog-card-body { padding: 24px 20px; }
        }
      `}</style>
    </>
  )
}

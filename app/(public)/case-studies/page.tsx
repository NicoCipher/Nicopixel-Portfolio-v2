import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'In-depth breakdowns of brand identity, events, and print projects — the brief, the challenge, the approach, and the outcome.',
}

export default async function CaseStudiesPage() {
  const supabase = await createClient()
  const { data: studies } = await supabase
    .from('projects')
    .select('id, title, slug, category, cover_image, client_name, industry, brief')
    .eq('published', true)
    .eq('is_case_study', true)
    .order('sort_order', { ascending: true })

  return (
    <>
      <section className="cs-header px-page">
        <p className="cs-eyebrow">
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          Case Studies
        </p>
        <h1 className="cs-title">
          The thinking<br /><em>behind the work.</em>
        </h1>
        <p className="cs-subtitle">
          Every project starts with a problem. Here is how each one was approached, solved, and delivered — brief to outcome.
        </p>
      </section>

      {!studies || studies.length === 0 ? (
        <div className="cs-empty">
          <p>Case studies coming soon.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
            <Link href="/work" className="cs-empty-link">See all work →</Link>
            <Link href="/contact" className="cs-empty-link">Start a project →</Link>
          </div>
        </div>
      ) : (
        <section className="cs-list px-page">
          {studies.map((study: {
            id: string; title: string; slug: string; category: string;
            cover_image: string | null; client_name: string | null;
            industry: string | null; brief: string | null
          }, i: number) => (
            <Link key={study.id} href={`/work/${study.slug}`} className="cs-card-link">
              <article className="cs-card">
                <div className="cs-card-img-wrap">
                  {study.cover_image
                    ? <Image src={study.cover_image} alt={`${study.title} case study — ${study.category} design by Nicopixel`} fill className="cs-card-img" style={{ objectFit: 'cover' }} />
                    : <div className="cs-card-placeholder"><span>{study.category}</span></div>
                  }
                  <div className="cs-card-overlay" />
                </div>
                <div className="cs-card-body">
                  <span className="cs-card-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="cs-card-meta">
                    <span className="cs-card-cat">{study.category}</span>
                    {study.industry && <><span className="cs-card-dot">·</span><span className="cs-card-industry">{study.industry}</span></>}
                  </div>
                  <h2 className="cs-card-title">{study.title}</h2>
                  {study.brief && <p className="cs-card-brief">{study.brief}</p>}
                  <span className="cs-card-cta">Read Case Study <span className="cs-arrow">→</span></span>
                </div>
              </article>
            </Link>
          ))}
        </section>
      )}

      <section className="cs-cta">
        <div className="cs-cta-inner">
          <h2 className="cs-cta-title">Want results like these?</h2>
          <div className="cs-cta-btns">
            <Link href="/contact" className="cs-cta-btn">Start a Project →</Link>
            <Link href="/contact?mode=call" className="cs-cta-btn-ghost">Book a Free Call</Link>
          </div>
        </div>
      </section>

      <style>{`
        .cs-header { padding-top: 80px; padding-bottom: 64px; border-bottom: 1px solid var(--border); }
        .cs-eyebrow { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; display: flex; align-items: center; gap: 12px; }
        .cs-title { font-family: var(--font-heading); font-size: clamp(40px, 6.5vw, 88px); font-weight: 400; line-height: 1.0; letter-spacing: -0.02em; margin-bottom: 24px; }
        .cs-title em { color: var(--accent); font-style: italic; }
        .cs-subtitle { font-size: 16px; line-height: 1.8; color: var(--fg-muted); max-width: 540px; }

        .cs-empty { padding: 100px 48px; text-align: center; }
        .cs-empty p { font-family: var(--font-heading); font-size: 22px; font-style: italic; color: var(--fg-subtle); margin-bottom: 20px; }
        .cs-empty-link { font-size: 12px; color: var(--accent); text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase; }

        .cs-list { display: flex; flex-direction: column; }
        .cs-card-link { display: block; text-decoration: none; border-bottom: 1px solid var(--border); }
        .cs-card-link:last-child { border-bottom: none; }
        .cs-card { display: grid; grid-template-columns: 1fr 1fr; min-height: 420px; transition: background 0.3s; }
        .cs-card-link:hover .cs-card { background: var(--bg-secondary); }
        .cs-card-link:nth-child(even) .cs-card { direction: rtl; }
        .cs-card-link:nth-child(even) .cs-card-img-wrap,
        .cs-card-link:nth-child(even) .cs-card-body { direction: ltr; }

        .cs-card-img-wrap { position: relative; overflow: hidden; background: var(--bg-secondary); }
        .cs-card-img { transition: transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94); }
        .cs-card-link:hover .cs-card-img { transform: scale(1.04); }
        .cs-card-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .cs-card-placeholder span { font-family: var(--font-heading); font-size: 32px; font-style: italic; color: var(--fg-subtle); text-transform: capitalize; }
        .cs-card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); transition: background 0.3s; }
        .cs-card-link:hover .cs-card-overlay { background: rgba(0,0,0,0.08); }

        .cs-card-body { padding: 56px 56px; display: flex; flex-direction: column; justify-content: center; gap: 16px; }
        .cs-card-num { font-family: var(--font-heading); font-size: 13px; color: var(--accent); letter-spacing: 0.18em; }
        .cs-card-meta { display: flex; align-items: center; gap: 8px; }
        .cs-card-cat { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-subtle); }
        .cs-card-dot { color: var(--fg-subtle); font-size: 11px; }
        .cs-card-industry { font-size: 11px; letter-spacing: 0.08em; color: var(--fg-subtle); }
        .cs-card-title { font-family: var(--font-heading); font-size: clamp(26px, 3.2vw, 38px); font-weight: 500; line-height: 1.15; color: var(--fg); }
        .cs-card-brief { font-size: 15px; line-height: 1.8; color: var(--fg-muted); }
        .cs-card-cta { font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg); display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; }
        .cs-arrow { transition: transform 0.3s; display: inline-block; }
        .cs-card-link:hover .cs-arrow { transform: translateX(4px); }

        .cs-cta { padding: 88px 48px; text-align: center; }
        .cs-cta-inner { display: flex; flex-direction: column; align-items: center; gap: 28px; }
        .cs-cta-title { font-family: var(--font-heading); font-size: clamp(28px, 4vw, 52px); font-weight: 400; }
        .cs-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .cs-cta-btn { display: inline-block; padding: 14px 36px; background: var(--accent); color: white; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s; }
        .cs-cta-btn:hover { background: #a01830; }
        .cs-cta-btn-ghost { display: inline-block; padding: 14px 28px; border: 1px solid var(--border); color: var(--fg-muted); font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .cs-cta-btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

        @media(max-width: 900px) {
          .cs-card { grid-template-columns: 1fr; min-height: auto; }
          .cs-card-link:nth-child(even) .cs-card { direction: ltr; }
          .cs-card-img-wrap { aspect-ratio: 4/3; }
          .cs-card-body { padding: 40px 32px; }
        }
        @media(max-width: 767px) {
          .cs-header { padding: 56px 20px 44px; }
          .cs-card-body { padding: 32px 20px; }
          .cs-cta { padding: 64px 20px; }
        }
      `}</style>
    </>
  )
}

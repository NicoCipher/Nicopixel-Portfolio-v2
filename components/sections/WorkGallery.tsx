'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project, Category } from '@/types'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'brand', label: 'Brand' },
  { key: 'events', label: 'Events' },
  { key: 'print', label: 'Print' },
]

export function WorkGallery({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<'all' | Category>('all')
  const [visible, setVisible] = useState<Project[]>(projects)
  const [animating, setAnimating] = useState(false)

  const filtered = active === 'all' ? projects : projects.filter(p => p.category === active)

  useEffect(() => {
    const t1 = setTimeout(() => setAnimating(true), 0)
    const t2 = setTimeout(() => { setVisible(filtered); setAnimating(false) }, 200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  const featured = visible[0]
  const rest = visible.slice(1)

  return (
    <div>
      {/* ── FILTER BAR ── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 64, zIndex: 10,
        background: 'var(--bg)',
        overflowX: 'auto', scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
      }}>
        <div style={{ display: 'flex', padding: '0 48px', minWidth: 'max-content', alignItems: 'center' }}>
          {CATEGORIES.map(cat => {
            const count = cat.key === 'all' ? projects.length : projects.filter(p => p.category === cat.key).length
            const isActive = active === cat.key
            return (
              <button key={cat.key} onClick={() => setActive(cat.key as 'all' | Category)} style={{
                position: 'relative',
                padding: '18px 28px',
                background: 'none', border: 'none',
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: isActive ? 'var(--fg)' : 'var(--fg-subtle)',
                display: 'flex', alignItems: 'center', gap: 8,
                whiteSpace: 'nowrap', flexShrink: 0,
                transition: 'color 0.2s',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1,
              }}>
                {cat.label}
                <span style={{ fontSize: 9, color: isActive ? 'var(--accent)' : 'var(--fg-subtle)', letterSpacing: '0.08em' }}>{count}</span>
              </button>
            )
          })}
          <div style={{ marginLeft: 'auto', paddingLeft: 24, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-subtle)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div style={{
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(6px)' : 'translateY(0)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}>
        {visible.length === 0 ? (
          <div style={{ padding: '100px 0', textAlign: 'center', fontFamily: 'var(--font-heading)', fontSize: 22, fontStyle: 'italic', color: 'var(--fg-subtle)' }}>
            No projects in this category yet.
          </div>
        ) : (
          <div className="gallery-wrap">

            {/* ── FEATURED ── */}
            {featured && (
              <Link href={`/work/${featured.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 3 }}>
                <article className="featured-card">
                  {/* Category — top left, always visible */}
                  <div className="card-cat-tag">{featured.category}</div>
                  <div className="card-index">01</div>

                  <div style={{ position: 'absolute', inset: 0 }}>
                    {featured.cover_image
                      ? <Image src={featured.cover_image} alt={featured.title} fill className="gallery-img" style={{ objectFit: 'cover' }} priority />
                      : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 60, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{featured.category}</span>
                        </div>
                    }
                  </div>

                  <div className="featured-overlay">
                    <div className="featured-info">
                      <h2 className="featured-title">{featured.title}</h2>
                      {featured.description && <p className="featured-desc">{featured.description}</p>}
                      <span className="featured-cta">View Project →</span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* ── GRID ── */}
            {rest.length > 0 && (
              <div className="projects-masonry">
                {rest.map((project: Project, i: number) => (
                  <Link key={project.id} href={`/work/${project.slug}`}
                    style={{ textDecoration: 'none', display: 'block' }}
                    className={`proj-slot proj-size-${(i % 5) + 1}`}
                  >
                    <article className="proj-card">
                      {/* Category — top left, always visible */}
                      <div className="card-cat-tag">{project.category}</div>
                      <div className="proj-index">0{i + 2}</div>

                      <div style={{ position: 'absolute', inset: 0 }}>
                        {project.cover_image
                          ? <Image src={project.cover_image} alt={project.title} fill className="gallery-img" style={{ objectFit: 'cover' }} />
                          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{project.category}</span>
                            </div>
                        }
                      </div>

                      <div className="proj-overlay">
                        <div className="proj-info">
                          <h3 className="proj-title">{project.title}</h3>
                          <span className="proj-view">View →</span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        /* ── GALLERY WRAP ── */
        .gallery-wrap {
          padding: 32px 48px 80px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* ── CATEGORY TAG — always visible top-left ── */
        .card-cat-tag {
          position: absolute; top: 14px; left: 16px;
          z-index: 3;
          font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(6px);
          padding: 4px 10px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 2px;
          pointer-events: none;
        }
        .card-index {
          position: absolute; top: 14px; right: 16px;
          z-index: 3;
          font-family: var(--font-heading); font-size: 10px;
          letter-spacing: 0.2em; color: rgba(255,255,255,0.2);
          pointer-events: none;
        }
        .proj-index {
          position: absolute; top: 14px; right: 16px;
          z-index: 3;
          font-family: var(--font-heading); font-size: 10px;
          letter-spacing: 0.2em; color: rgba(255,255,255,0.15);
          pointer-events: none;
        }

        /* ── FEATURED ── */
        .featured-card {
          position: relative; overflow: hidden;
          aspect-ratio: 21/9;
          background: var(--bg-secondary);
          /* Cap width so 900/1080px images stay sharp */
          max-height: 620px;
        }
        .gallery-img { transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; }
        .featured-card:hover .gallery-img { transform: scale(1.03); }
        .featured-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 50%, transparent 75%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 36px 40px;
          transition: background 0.4s;
        }
        .featured-card:hover .featured-overlay { background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.08) 100%); }
        .featured-info { display: flex; flex-direction: column; gap: 10px; }
        .featured-title {
          font-family: var(--font-heading);
          font-size: clamp(24px, 3.5vw, 48px);
          font-weight: 400; color: white; line-height: 1.05; margin: 0;
          transform: translateY(6px); transition: transform 0.4s ease;
        }
        .featured-card:hover .featured-title { transform: translateY(0); }
        .featured-desc {
          font-size: 14px; color: rgba(255,255,255,0.55); max-width: 480px; line-height: 1.6;
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.4s 0.06s ease, transform 0.4s 0.06s ease;
        }
        .featured-card:hover .featured-desc { opacity: 1; transform: translateY(0); }
        .featured-cta {
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: white;
          opacity: 0; transition: opacity 0.4s 0.1s ease;
        }
        .featured-card:hover .featured-cta { opacity: 1; }

        /* ── MASONRY GRID ── */
        .projects-masonry {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: 56px;
          gap: 3px; margin-top: 3px;
        }

        /* Size variants */
        .proj-slot { display: block; }
        .proj-size-1 { grid-column: span 7; grid-row: span 6; }
        .proj-size-2 { grid-column: span 5; grid-row: span 6; }
        .proj-size-3 { grid-column: span 4; grid-row: span 6; }
        .proj-size-4 { grid-column: span 5; grid-row: span 6; }
        .proj-size-5 { grid-column: span 3; grid-row: span 6; }

        /* ── PROJECT CARD ── */
        .proj-card {
          position: relative; overflow: hidden;
          height: 100%; background: var(--bg-secondary);
          /* Prevent upscaling beyond source image size */
          max-height: 600px;
        }
        .proj-card:hover .gallery-img { transform: scale(1.05); }
        .proj-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.4s ease;
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .proj-card:hover .proj-overlay { background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 50%, transparent 80%); }
        .proj-info {
          padding: 18px 20px;
          transform: translateY(10px);
          transition: transform 0.35s ease;
          display: flex; flex-direction: column; gap: 5px;
        }
        .proj-card:hover .proj-info { transform: translateY(0); }
        .proj-title {
          font-family: var(--font-heading);
          font-size: clamp(14px, 1.8vw, 20px);
          font-weight: 400; color: white; margin: 0; line-height: 1.2;
          opacity: 0; transition: opacity 0.3s 0.04s ease;
        }
        .proj-card:hover .proj-title { opacity: 1; }
        .proj-view {
          font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          opacity: 0; transition: opacity 0.3s 0.08s ease;
        }
        .proj-card:hover .proj-view { opacity: 1; }

        /* ── LARGE SCREENS — constrain grid so images don't upscale ── */
        @media(min-width: 1400px) {
          .gallery-wrap { padding: 32px 64px 80px; }
          .projects-masonry { grid-auto-rows: 60px; }
        }

        /* ── RESPONSIVE ── */
        @media(max-width: 1024px) {
          .proj-size-1 { grid-column: span 8; grid-row: span 6; }
          .proj-size-2 { grid-column: span 4; grid-row: span 6; }
          .proj-size-3 { grid-column: span 6; grid-row: span 6; }
          .proj-size-4 { grid-column: span 6; grid-row: span 6; }
          .proj-size-5 { grid-column: span 4; grid-row: span 6; }
        }

        @media(max-width: 767px) {
          .gallery-wrap { padding: 16px 16px 60px; }
          .featured-card { aspect-ratio: 4/3; max-height: none; }
          .featured-overlay { padding: 20px 20px; }
          .featured-desc { display: none; }
          .featured-cta { opacity: 1 !important; }
          .featured-title { transform: none !important; }

          .projects-masonry {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: auto;
            gap: 8px; margin-top: 8px;
          }
          .proj-size-1, .proj-size-2, .proj-size-3, .proj-size-4 {
            grid-column: span 1; grid-row: span 1;
          }
          .proj-size-5 { grid-column: span 2; grid-row: span 1; }
          .proj-slot { aspect-ratio: 1/1; }
          .proj-card { max-height: none; }

          /* Always show title on mobile — no hover */
          .proj-overlay { background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%) !important; }
          .proj-info { transform: translateY(0) !important; }
          .proj-title { opacity: 1 !important; font-size: 13px; }
          .proj-view { display: none; }

          /* Filter bar */
          div[style*="padding: 0 48px"] { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  )
}

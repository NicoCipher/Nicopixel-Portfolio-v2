'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import type { Project, Category } from '@/types'

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'brand', label: 'Brand' },
  { key: 'events', label: 'Events' },
  { key: 'print', label: 'Print' },
]

const BREAKPOINTS = { default: 3, 1024: 2, 480: 1 }

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

  return (
    <div>
      {/* ── FILTER BAR ── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 64, zIndex: 10,
        background: 'var(--bg)',
        overflowX: 'auto', scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
      }}>
        <div style={{ display: 'flex', padding: '0 48px', minWidth: 'max-content', alignItems: 'center', maxWidth: 1320, margin: '0 auto' }}>
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
                cursor: 'pointer',
              }}>
                {cat.label}
                <span style={{ fontSize: 11, color: isActive ? 'var(--accent)' : 'var(--fg-subtle)', letterSpacing: '0.04em' }}>{count}</span>
              </button>
            )
          })}
          <div style={{ marginLeft: 'auto', paddingLeft: 24, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-subtle)', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── MASONRY GALLERY — each image keeps its own natural proportions,
          like a real showcase wall, not a uniform app-icon grid. ── */}
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
            <Masonry breakpointCols={BREAKPOINTS} className="masonry-grid" columnClassName="masonry-col">
              {visible.map(project => (
                <Link key={project.id} href={`/work/${project.slug}`} className="proj-slot">
                  <article className="proj-card">
                    <div className="card-cat-tag">{project.category}</div>

                    {project.cover_image
                      ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={project.cover_image}
                          alt={`${project.title} — ${project.category} design by Nicopixel`}
                          className="gallery-img"
                          loading="lazy"
                        />
                      )
                      : <div className="proj-card-placeholder"><span>{project.category}</span></div>
                    }

                    <div className="proj-overlay">
                      <div className="proj-info">
                        <h3 className="proj-title">{project.title}</h3>
                        <span className="proj-view">View Project →</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </Masonry>
          </div>
        )}
      </div>

      <style>{`
        .gallery-wrap {
          padding: 32px 48px 80px;
          max-width: 1320px;
          margin: 0 auto;
        }

        .masonry-grid { display: flex; margin-left: -10px; width: auto; }
        .masonry-col { padding-left: 10px; background-clip: padding-box; }
        .masonry-col > a { display: block; margin-bottom: 10px; }

        .card-cat-tag {
          position: absolute; top: 14px; left: 14px;
          z-index: 3;
          font-size: 10px; letter-spacing: 0.12em;
          font-weight: 500;
          text-transform: uppercase;
          color: rgba(255,255,255,0.95);
          background: rgba(0,0,0,0.55);
          backdrop-filter: blur(6px);
          padding: 5px 11px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 2px;
          pointer-events: none;
        }

        .proj-slot { display: block; text-decoration: none; }
        .proj-card {
          position: relative; overflow: hidden;
          background: var(--bg-secondary);
          border-radius: 3px;
        }
        .gallery-img {
          display: block; width: 100%; height: auto;
          /* Sane bounds — varied like Pinterest, but never absurdly tall/short */
          max-height: 640px; min-height: 160px;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .proj-card:hover .gallery-img { transform: scale(1.04); }
        .proj-card-placeholder {
          aspect-ratio: 4/3; display: flex; align-items: center; justify-content: center;
        }
        .proj-card-placeholder span { font-family: var(--font-heading); font-size: 26px; font-style: italic; color: var(--fg-subtle); text-transform: capitalize; }

        .proj-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.35s ease;
          display: flex; flex-direction: column; justify-content: flex-end;
        }
        .proj-card:hover .proj-overlay { background: linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.15) 55%, transparent 85%); }
        .proj-info {
          padding: 20px;
          transform: translateY(10px);
          transition: transform 0.3s ease;
          display: flex; flex-direction: column; gap: 5px;
        }
        .proj-card:hover .proj-info { transform: translateY(0); }
        .proj-title {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 400; color: white; margin: 0; line-height: 1.25;
          opacity: 0; transition: opacity 0.3s ease;
        }
        .proj-card:hover .proj-title { opacity: 1; }
        .proj-view {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          opacity: 0; transition: opacity 0.3s 0.05s ease;
        }
        .proj-card:hover .proj-view { opacity: 1; }

        @media(max-width: 767px) {
          .gallery-wrap { padding: 16px 16px 60px; }
          .masonry-grid { margin-left: -6px; }
          .masonry-col { padding-left: 6px; }
          .masonry-col > a { margin-bottom: 6px; }
          .gallery-img { max-height: 420px; }

          /* Always show title on mobile — no hover available */
          .proj-overlay { background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%) !important; }
          .proj-info { transform: translateY(0) !important; padding: 14px; }
          .proj-title { opacity: 1 !important; font-size: 14px; }
          .proj-view { display: none; }

          div[style*="padding: 0 48px"] { padding: 0 16px !important; }
        }
      `}</style>
    </div>
  )
}

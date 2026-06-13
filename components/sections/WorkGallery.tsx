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
  const [visible, setVisible] = useState<Project[]>([])
  const [animating, setAnimating] = useState(false)

  const filtered = active === 'all' ? projects : projects.filter(p => p.category === active)

  useEffect(() => {
    const t1 = setTimeout(() => setAnimating(true), 0)
    const t2 = setTimeout(() => { setVisible(filtered); setAnimating(false) }, 180)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { setTimeout(() => setVisible(projects), 0) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const featured = visible[0]
  const rest = visible.slice(1)

  return (
    <div>
      {/* ── FILTER BAR ── */}
      <div className="filter-bar">
        <div className="filter-inner">
          {CATEGORIES.map(cat => {
            const count = cat.key === 'all' ? projects.length : projects.filter(p => p.category === cat.key).length
            const isActive = active === cat.key
            return (
              <button key={cat.key} onClick={() => setActive(cat.key as 'all' | Category)} className={`filter-btn ${isActive ? 'filter-btn-active' : ''}`}>
                <span className="filter-label">{cat.label}</span>
                <span className="filter-count">{count}</span>
                {isActive && <span className="filter-underline" />}
              </button>
            )
          })}
          <div className="filter-total">
            <span>{filtered.length} project{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* ── GALLERY ── */}
      <div className={`gallery-body ${animating ? 'gallery-fade-out' : 'gallery-fade-in'}`}>
        {visible.length === 0 ? (
          <div className="gallery-empty">
            <p>No projects in this category yet.</p>
          </div>
        ) : (
          <div className="gallery-layout">
            {/* ── FEATURED ── */}
            {featured && (
              <Link href={`/work/${featured.slug}`} className="featured-link">
                <article className="featured-card">
                  <div className="featured-img-wrap">
                    {featured.cover_image
                      ? <Image src={featured.cover_image} alt={featured.title} fill className="gallery-img" style={{ objectFit: 'cover' }} priority />
                      : <div className="img-placeholder"><span>{featured.category}</span></div>
                    }
                  </div>
                  <div className="featured-overlay">
                    <div className="featured-meta">
                      <span className="proj-cat-tag">{featured.category}</span>
                    </div>
                    <div className="featured-info">
                      <h2 className="featured-title">{featured.title}</h2>
                      {featured.description && <p className="featured-desc">{featured.description}</p>}
                      <span className="featured-cta">View Project <span className="arrow-icon">→</span></span>
                    </div>
                  </div>
                  <div className="featured-index">01</div>
                </article>
              </Link>
            )}

            {/* ── GRID ── */}
            {rest.length > 0 && (
              <div className="projects-masonry">
                {rest.map((project: Project, i: number) => (
                  <Link key={project.id} href={`/work/${project.slug}`} className={`proj-link proj-size-${(i % 5) + 1}`}>
                    <article className="proj-card">
                      <div className="proj-img-wrap">
                        {project.cover_image
                          ? <Image src={project.cover_image} alt={project.title} fill className="gallery-img" style={{ objectFit: 'cover' }} />
                          : <div className="img-placeholder"><span>{project.category}</span></div>
                        }
                      </div>
                      <div className="proj-overlay">
                        <div className="proj-overlay-content">
                          <span className="proj-cat-tag">{project.category}</span>
                          <h3 className="proj-title">{project.title}</h3>
                          <span className="proj-view">View →</span>
                        </div>
                      </div>
                      <div className="proj-index">0{i + 2}</div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        /* ── FILTER BAR ── */
        .filter-bar {
          border-bottom: 1px solid var(--border);
          position: sticky; top: 64px; z-index: 10;
          background: var(--bg);
          backdrop-filter: blur(12px);
        }
        .filter-inner {
          display: flex; align-items: center;
          padding: 0 48px; gap: 0;
          overflow-x: auto; scrollbar-width: none;
        }
        .filter-inner::-webkit-scrollbar { display: none; }
        .filter-btn {
          position: relative;
          padding: 18px 28px;
          background: none; border: none;
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--fg-subtle);
          transition: color 0.2s;
          display: flex; align-items: center; gap: 8px;
          white-space: nowrap; flex-shrink: 0;
        }
        .filter-btn:hover { color: var(--fg); }
        .filter-btn-active { color: var(--fg); }
        .filter-label { position: relative; z-index: 1; }
        .filter-count {
          font-size: 9px; font-weight: 400;
          color: var(--fg-subtle); letter-spacing: 0.08em;
        }
        .filter-btn-active .filter-count { color: var(--accent); }
        .filter-underline {
          position: absolute; bottom: -1px; left: 0; right: 0;
          height: 2px; background: var(--accent);
        }
        .filter-total {
          margin-left: auto; padding-left: 24px;
          font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--fg-subtle);
          white-space: nowrap; flex-shrink: 0;
        }

        /* ── TRANSITIONS ── */
        .gallery-fade-out { opacity: 0; transform: translateY(8px); transition: opacity 0.18s ease, transform 0.18s ease; }
        .gallery-fade-in { opacity: 1; transform: translateY(0); transition: opacity 0.3s ease, transform 0.3s ease; }

        /* ── LAYOUT ── */
        .gallery-body { padding: 48px 48px 80px; }
        .gallery-layout { display: flex; flex-direction: column; gap: 3px; }
        .gallery-empty { padding: 100px 0; text-align: center; font-family: var(--font-heading); font-size: 22px; font-style: italic; color: var(--fg-subtle); }

        /* ── FEATURED ── */
        .featured-link { display: block; text-decoration: none; }
        .featured-card {
          position: relative; overflow: hidden;
          aspect-ratio: 21/9;
          background: var(--bg-secondary);
          cursor: pointer;
        }
        .featured-img-wrap { position: absolute; inset: 0; }
        .featured-card:hover .gallery-img { transform: scale(1.03); }
        .gallery-img { transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important; }
        .featured-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 45%, transparent 70%);
          display: flex; flex-direction: column;
          justify-content: space-between;
          padding: 36px 44px;
          transition: background 0.4s;
        }
        .featured-card:hover .featured-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%);
        }
        .featured-meta { display: flex; align-items: flex-start; }
        .featured-info { display: flex; flex-direction: column; gap: 12px; }
        .featured-title {
          font-family: var(--font-heading);
          font-size: clamp(28px, 4vw, 56px);
          font-weight: 400; color: white; line-height: 1.05;
          margin: 0;
          transform: translateY(8px);
          transition: transform 0.4s ease;
        }
        .featured-card:hover .featured-title { transform: translateY(0); }
        .featured-desc {
          font-size: 14px; color: rgba(255,255,255,0.6);
          max-width: 480px; line-height: 1.6;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.4s 0.05s ease, transform 0.4s 0.05s ease;
        }
        .featured-card:hover .featured-desc { opacity: 1; transform: translateY(0); }
        .featured-cta {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: white;
          opacity: 0; transform: translateY(4px);
          transition: opacity 0.4s 0.1s ease, transform 0.4s 0.1s ease;
          width: fit-content;
        }
        .featured-card:hover .featured-cta { opacity: 1; transform: translateY(0); }
        .arrow-icon { transition: transform 0.3s; }
        .featured-card:hover .arrow-icon { transform: translateX(4px); }
        .featured-index {
          position: absolute; top: 28px; right: 36px;
          font-family: var(--font-heading); font-size: 11px;
          letter-spacing: 0.2em; color: rgba(255,255,255,0.2);
        }

        /* ── CATEGORY TAG ── */
        .proj-cat-tag {
          display: inline-block;
          padding: 4px 12px;
          border: 1px solid rgba(255,255,255,0.2);
          font-size: 9px; letter-spacing: 0.2em;
          text-transform: uppercase; color: rgba(255,255,255,0.6);
          backdrop-filter: blur(4px);
          background: rgba(0,0,0,0.2);
        }

        /* ── MASONRY GRID ── */
        .projects-masonry {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-auto-rows: 60px;
          gap: 3px;
          margin-top: 3px;
        }
        .proj-link { display: block; text-decoration: none; }

        /* Size variants — creates editorial rhythm */
        .proj-size-1 { grid-column: span 7; grid-row: span 6; }
        .proj-size-2 { grid-column: span 5; grid-row: span 6; }
        .proj-size-3 { grid-column: span 4; grid-row: span 6; }
        .proj-size-4 { grid-column: span 5; grid-row: span 6; }
        .proj-size-5 { grid-column: span 3; grid-row: span 6; }

        /* ── PROJECT CARD ── */
        .proj-card {
          position: relative; overflow: hidden;
          height: 100%; background: var(--bg-secondary);
          cursor: pointer;
        }
        .proj-img-wrap { position: absolute; inset: 0; }
        .proj-card:hover .gallery-img { transform: scale(1.06); }
        .proj-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.4s ease;
          display: flex; flex-direction: column;
          justify-content: flex-end;
        }
        .proj-card:hover .proj-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, transparent 80%);
        }
        .proj-overlay-content {
          padding: 20px 24px;
          transform: translateY(12px);
          transition: transform 0.4s ease;
          display: flex; flex-direction: column; gap: 6px;
        }
        .proj-card:hover .proj-overlay-content { transform: translateY(0); }
        .proj-title {
          font-family: var(--font-heading);
          font-size: clamp(15px, 2vw, 22px);
          font-weight: 400; color: white;
          margin: 0; line-height: 1.2;
          opacity: 0; transition: opacity 0.3s 0.05s ease;
        }
        .proj-card:hover .proj-title { opacity: 1; }
        .proj-view {
          font-size: 10px; letter-spacing: 0.14em;
          text-transform: uppercase; color: rgba(255,255,255,0.5);
          opacity: 0; transition: opacity 0.3s 0.1s ease;
        }
        .proj-card:hover .proj-view { opacity: 1; }
        .proj-index {
          position: absolute; top: 14px; left: 18px;
          font-family: var(--font-heading); font-size: 10px;
          letter-spacing: 0.2em; color: rgba(255,255,255,0.15);
        }

        /* ── IMAGE PLACEHOLDER ── */
        .img-placeholder {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-secondary);
        }
        .img-placeholder span {
          font-family: var(--font-heading); font-size: 28px;
          font-style: italic; color: var(--fg-subtle);
          text-transform: capitalize;
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
          .filter-inner { padding: 0 16px; }
          .filter-btn { padding: 16px 16px; }
          .filter-total { display: none; }
          .gallery-body { padding: 16px 16px 60px; }
          .featured-card { aspect-ratio: 4/3; }
          .featured-overlay { padding: 20px 24px; }
          .projects-masonry {
            grid-template-columns: 1fr 1fr;
            grid-auto-rows: auto;
          }
          .proj-size-1, .proj-size-2, .proj-size-3, .proj-size-4 { grid-column: span 1; grid-row: span 1; }
          .proj-size-5 { grid-column: span 2; grid-row: span 1; }
          .proj-link { aspect-ratio: 1/1; }
          .proj-card { position: absolute; inset: 0; }
          .proj-link { position: relative; }

          /* Always show info on mobile */
          .proj-overlay {
            background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%) !important;
          }
          .proj-overlay-content { transform: translateY(0) !important; }
          .proj-title { opacity: 1 !important; font-size: 14px; }
          .proj-view { opacity: 0; }
          .proj-cat-tag { display: none; }

          /* Featured always visible info on mobile */
          .featured-desc { display: none; }
          .featured-cta { opacity: 1 !important; transform: none !important; }
          .featured-title { transform: none !important; }
        }
      `}</style>
    </div>
  )
}

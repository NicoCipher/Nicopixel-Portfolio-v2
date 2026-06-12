'use client'
import { useState } from 'react'
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

  const filtered = active === 'all' ? projects : projects.filter(p => p.category === active)
  const featured = filtered.find(p => p.featured) || filtered[0]
  const rest = filtered.filter(p => p.id !== featured?.id)

  return (
    <div>
      {/* Filter bar — horizontally scrollable on mobile */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
        scrollbarWidth: 'none' as React.CSSProperties['scrollbarWidth'],
      }}>
        <div style={{
          display: 'flex',
          padding: '0 48px',
          minWidth: 'max-content',
        }}>
          {CATEGORIES.map(cat => {
            const count = cat.key === 'all' ? projects.length : projects.filter(p => p.category === cat.key).length
            const isActive = active === cat.key
            return (
              <button key={cat.key} onClick={() => setActive(cat.key as 'all' | Category)} style={{
                padding: '16px 24px',
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                background: 'none', border: 'none',
                color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1, whiteSpace: 'nowrap',
                transition: 'color 0.2s, border-color 0.2s',
              }}>
                {cat.label}
                <span style={{ marginLeft: 6, fontSize: 10, color: isActive ? 'var(--accent)' : 'var(--fg-subtle)' }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '80px 24px', textAlign: 'center', color: 'var(--fg-muted)' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 22, fontStyle: 'italic' }}>No projects yet.</p>
        </div>
      ) : (
        <div className="gallery-wrap">
          {/* Featured hero */}
          {featured && (
            <Link href={`/work/${featured.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 2 }}>
              <div className="featured-card" style={{
                position: 'relative', overflow: 'hidden',
                background: 'var(--bg-secondary)',
              }}>
                {featured.cover_image
                  ? <Image src={featured.cover_image} alt={featured.title} fill style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }} className="gallery-img" />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 60, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{featured.category}</span>
                    </div>
                }
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', padding: '32px 32px',
                }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', display: 'block', marginBottom: 8 }}>{featured.category}</span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 4vw, 48px)', fontWeight: 400, color: 'white', lineHeight: 1.1, margin: 0 }}>{featured.title}</h2>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', flexShrink: 0, marginLeft: 16 }}>View →</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Grid */}
          {rest.length > 0 && (
            <div className="projects-grid">
              {rest.map((project: Project) => (
                <Link key={project.id} href={`/work/${project.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="project-card-wrap" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                    {project.cover_image
                      ? <Image src={project.cover_image} alt={project.title} fill style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} className="gallery-img" />
                      : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{project.category}</span>
                        </div>
                    }
                    {/* Always visible gradient + info — no hover dependency */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-end', padding: '16px 20px',
                    }}>
                      <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>{project.category}</span>
                      <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 400, color: 'white', margin: 0, lineHeight: 1.2 }}>{project.title}</h4>
                    </div>
                    {/* Desktop hover scale */}
                    <div className="card-hover-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.3s' }} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .gallery-wrap { padding: 24px 48px 64px; }

        .featured-card { aspect-ratio: 16/8; }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          margin-top: 2px;
        }

        .project-card-wrap { aspect-ratio: 4/3; }

        .project-card-wrap:hover .gallery-img { transform: scale(1.04); }
        .project-card-wrap:hover .card-hover-overlay { background: rgba(0,0,0,0.15) !important; }

        /* filter bar scrollbar hidden */
        div::-webkit-scrollbar { display: none; }

        @media (max-width: 767px) {
          .gallery-wrap { padding: 16px 16px 48px; }
          .featured-card { aspect-ratio: 4/3; }
          .projects-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 8px;
          }
          .project-card-wrap { aspect-ratio: 1/1; border-radius: 4px; }
          div[style*="padding: 0 48px"] { padding: 0 20px !important; }
        }

        @media (max-width: 400px) {
          .projects-grid { grid-template-columns: 1fr; }
          .project-card-wrap { aspect-ratio: 4/3; }
        }
      `}</style>
    </div>
  )
}

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
      {/* Filter bar */}
      <div style={{
        display: 'flex', gap: 0,
        borderBottom: '1px solid var(--border)',
        padding: '0 48px',
        overflowX: 'auto',
      }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActive(cat.key as 'all' | Category)}
            style={{
              padding: '16px 28px',
              fontSize: 11, fontWeight: 500,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              background: 'none', border: 'none',
              color: active === cat.key ? 'var(--fg)' : 'var(--fg-muted)',
              borderBottom: active === cat.key ? '2px solid var(--accent)' : '2px solid transparent',
              marginBottom: -1,
              transition: 'color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label}
            <span style={{ marginLeft: 8, fontSize: 10, color: 'var(--fg-subtle)' }}>
              {cat.key === 'all' ? projects.length : projects.filter(p => p.category === cat.key).length}
            </span>
          </button>
        ))}
        <style>{`@media(max-width:767px){ div[style*="padding: 0px 48px"] { padding: 0 24px !important; } }`}</style>
      </div>

      {filtered.length === 0 ? (
        <div style={{ padding: '120px 48px', textAlign: 'center', color: 'var(--fg-muted)' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontStyle: 'italic' }}>No projects yet.</p>
        </div>
      ) : (
        <div style={{ padding: '48px 48px' }}>

          {/* Featured hero */}
          {featured && (
            <Link href={`/work/${featured.slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 2 }}>
              <div
                style={{
                  position: 'relative', overflow: 'hidden',
                  aspectRatio: '16/8',
                  background: 'var(--bg-secondary)',
                }}
                data-hover
              >
                {featured.cover_image
                  ? <Image src={featured.cover_image} alt={featured.title} fill
                      style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                      className="gallery-img"
                    />
                  : <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-heading)', fontSize: 80,
                        fontStyle: 'italic', color: 'var(--fg-subtle)',
                        textTransform: 'capitalize',
                      }}>{featured.category}</span>
                    </div>
                }
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
                  display: 'flex', flexDirection: 'column',
                  justifyContent: 'flex-end', padding: '40px 48px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <span style={{
                        fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 10,
                      }}>{featured.category}</span>
                      <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(28px, 4vw, 52px)',
                        fontWeight: 400, color: 'white', lineHeight: 1.1,
                      }}>{featured.title}</h2>
                    </div>
                    <span style={{
                      fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.6)', flexShrink: 0, marginLeft: 24,
                    }}>View →</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Dense grid */}
          {rest.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 2, marginTop: 2,
            }}>
              {rest.map((project, i) => (
                <Link key={project.id} href={`/work/${project.slug}`}
                  style={{ display: 'block', textDecoration: 'none' }}
                  data-hover
                >
                  <div
                    style={{
                      position: 'relative', overflow: 'hidden',
                      aspectRatio: i % 5 === 0 ? '3/4' : '4/3',
                      background: 'var(--bg-secondary)',
                    }}
                    className="project-tile"
                  >
                    {project.cover_image
                      ? <Image src={project.cover_image} alt={project.title} fill
                          style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                          className="gallery-img"
                        />
                      : <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{
                            fontFamily: 'var(--font-heading)', fontSize: 32,
                            fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize',
                          }}>{project.category}</span>
                        </div>
                    }
                    {/* Overlay */}
                    <div className="tile-overlay" style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0)',
                      transition: 'background 0.4s',
                      display: 'flex', flexDirection: 'column',
                      justifyContent: 'flex-end', padding: 24,
                    }}>
                      <span style={{
                        fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
                        color: 'rgba(255,255,255,0)', transition: 'color 0.3s',
                        display: 'block', marginBottom: 6,
                      }} className="tile-cat">{project.category}</span>
                      <h4 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 17, fontWeight: 400,
                        color: 'rgba(255,255,255,0)', transition: 'color 0.3s',
                        lineHeight: 1.2,
                      }} className="tile-title">{project.title}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        .project-tile:hover .tile-overlay { background: rgba(0,0,0,0.6) !important; }
        .project-tile:hover .tile-cat { color: rgba(255,255,255,0.55) !important; }
        .project-tile:hover .tile-title { color: white !important; }
        .project-tile:hover .gallery-img { transform: scale(1.04); }
        @media(max-width:767px){
          div[style*="padding: 48px 48px"] { padding: 32px 24px !important; }
          div[style*="minmax(300px"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:480px){
          div[style*="minmax(300px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

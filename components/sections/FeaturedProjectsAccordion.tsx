'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

export function FeaturedProjectsAccordion({ projects }: { projects: Project[] }) {
  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null)

  return (
    <div className="fpa-list">
      {projects.map((project, i) => {
        const isOpen = openId === project.id
        return (
          <div key={project.id} className={`fpa-row ${isOpen ? 'fpa-row-open' : ''}`}>
            <button
              onClick={() => setOpenId(isOpen ? null : project.id)}
              className="fpa-header"
              aria-expanded={isOpen}
            >
              <span className="fpa-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="fpa-header-title">{project.title}</span>
              <span className="fpa-header-cat">{project.category}</span>
              <span className="fpa-toggle">{isOpen ? '−' : '+'}</span>
            </button>

            <div className="fpa-panel" style={{ maxHeight: isOpen ? 600 : 0 }}>
              <div className="fpa-panel-inner">
                <div className="fpa-panel-img">
                  {project.cover_image
                    ? (
                      <Image
                        src={project.cover_image}
                        alt={`${project.title} — ${project.category} design by Nicopixel`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 767px) 100vw, 480px"
                      />
                    )
                    : <div className="fpa-panel-placeholder"><span>{project.category}</span></div>
                  }
                </div>
                <div className="fpa-panel-content">
                  <span className="fpa-overview-meta">
                    {project.category} · {new Date(project.created_at).getFullYear()}
                  </span>
                  <h3 className="fpa-overview-title">{project.title}</h3>
                  {project.description && (
                    <p className="fpa-overview-desc">{project.description}</p>
                  )}
                  <Link href={`/work/${project.slug}`} className="fpa-overview-link">
                    View Case Study <span className="fpa-arrow">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}

      <style>{`
        .fpa-list { border-top: 1px solid var(--border); }
        .fpa-row { border-bottom: 1px solid var(--border); }

        .fpa-header {
          width: 100%;
          display: flex; align-items: center; gap: 24px;
          padding: 28px 4px;
          background: none; border: none; cursor: pointer;
          text-align: left; font-family: inherit;
          transition: background 0.2s;
        }
        .fpa-header:hover { background: var(--bg-secondary); }

        .fpa-num {
          font-family: var(--font-heading); font-size: 14px; font-style: italic;
          color: var(--accent-text); letter-spacing: 0.06em; flex-shrink: 0; width: 32px;
        }
        .fpa-header-title {
          flex: 1;
          font-family: var(--font-heading); font-size: clamp(20px, 2.6vw, 32px);
          font-weight: 400; color: var(--fg); line-height: 1.1;
          transition: color 0.2s;
        }
        .fpa-row-open .fpa-header-title { color: var(--accent-text); }
        .fpa-header-cat {
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--fg-subtle); flex-shrink: 0; display: none;
        }
        .fpa-toggle {
          width: 30px; height: 30px; flex-shrink: 0;
          border: 1px solid var(--border); border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; color: var(--fg-muted); line-height: 1;
          transition: border-color 0.2s, color 0.2s;
        }
        .fpa-row-open .fpa-toggle { border-color: var(--accent); color: var(--accent-text); }

        .fpa-panel { overflow: hidden; transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .fpa-panel-inner { display: grid; grid-template-columns: 280px 1fr; gap: 40px; padding: 0 4px 40px; align-items: start; }

        .fpa-panel-img { position: relative; aspect-ratio: 4/3; background: var(--bg-secondary); overflow: hidden; }
        .fpa-panel-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .fpa-panel-placeholder span { font-family: var(--font-heading); font-size: 22px; font-style: italic; color: var(--fg-subtle); text-transform: capitalize; }

        .fpa-panel-content { display: flex; flex-direction: column; gap: 14px; padding-top: 4px; }
        .fpa-overview-meta { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-text); }
        .fpa-overview-title { font-family: var(--font-heading); font-size: clamp(22px, 2.8vw, 30px); font-weight: 400; color: var(--fg); line-height: 1.2; }
        .fpa-overview-desc { font-size: 14.5px; line-height: 1.8; color: var(--fg-muted); max-width: 480px; }
        .fpa-overview-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--fg); text-decoration: none; margin-top: 6px; width: fit-content;
        }
        .fpa-arrow { transition: transform 0.25s; }
        .fpa-overview-link:hover .fpa-arrow { transform: translateX(4px); }

        @media(min-width: 640px) {
          .fpa-header-cat { display: block; }
        }
        @media(max-width: 639px) {
          .fpa-header { padding: 20px 0; gap: 14px; }
          .fpa-num { width: 24px; font-size: 12px; }
          .fpa-panel-inner { grid-template-columns: 1fr; padding: 0 0 28px; gap: 20px; }
          .fpa-panel-img { aspect-ratio: 16/10; }
        }
      `}</style>
    </div>
  )
}

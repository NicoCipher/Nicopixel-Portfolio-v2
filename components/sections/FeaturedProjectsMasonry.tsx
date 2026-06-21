'use client'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import type { Project } from '@/types'

export function FeaturedProjectsMasonry({ projects }: { projects: Project[] }) {
  return (
    <Masonry breakpointCols={{ default: 4, 900: 2, 600: 2 }} className="projects-subgrid" columnClassName="projects-subgrid-col">
      {projects.map((project, i) => (
        <Link key={project.id} href={`/work/${project.slug}`} style={{ display: 'block', textDecoration: 'none', animationDelay: `${i * 80}ms` }} className="scroll-reveal sub-card-link">
          <div className="sub-card" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
            {project.cover_image
              ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.cover_image} alt={`${project.title} — ${project.category} design by Nicopixel`} className="sub-card-img" loading="lazy" />
              )
              : <div className="sub-card-placeholder"><span>{project.category}</span></div>
            }
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 20px' }}>
              <span style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'capitalize', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 6 }}>{project.category}</span>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 400, color: 'white', margin: 0 }}>{project.title}</h4>
            </div>
          </div>
        </Link>
      ))}
    </Masonry>
  )
}

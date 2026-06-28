'use client'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

// Note: despite the filename, this is intentionally a clean uniform grid,
// not masonry. A curated 6-item homepage preview looks confident and
// consistent at fixed aspect ratio - natural-ratio masonry (used on the
// full /work gallery, where it has enough items to read as intentional
// variety) looked lopsided and uneven with so few items per column.
export function FeaturedProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="featured-grid">
      {projects.map((project, i) => (
        <Link key={project.id} href={`/work/${project.slug}`} style={{ animationDelay: `${i * 80}ms` }} className="scroll-reveal featured-card-link">
          <article className="featured-card">
            {project.cover_image
              ? (
                <Image
                  src={project.cover_image}
                  alt={`${project.title} — ${project.category} design by Nicopixel`}
                  fill
                  className="featured-card-img"
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 400px"
                />
              )
              : <div className="featured-card-placeholder"><span>{project.category}</span></div>
            }
            <div className="featured-card-overlay">
              <span className="featured-card-cat">{project.category}</span>
              <h4 className="featured-card-title">{project.title}</h4>
            </div>
          </article>
        </Link>
      ))}

      <style>{`
        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3px;
        }
        .featured-card-link { display: block; text-decoration: none; }
        .featured-card {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: var(--bg-secondary);
        }
        .featured-card-img { transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .featured-card-link:hover .featured-card-img { transform: scale(1.06); }
        .featured-card-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .featured-card-placeholder span { font-family: var(--font-heading); font-size: 24px; font-style: italic; color: var(--fg-subtle); text-transform: capitalize; }
        .featured-card-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.1) 55%, transparent 80%);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 20px;
        }
        .featured-card-cat { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.65); display: block; margin-bottom: 6px; }
        .featured-card-title { font-family: var(--font-heading); font-size: 19px; font-weight: 400; color: white; margin: 0; line-height: 1.25; }

        @media(max-width: 900px) {
          .featured-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media(max-width: 767px) {
          .featured-grid { gap: 2px; }
          .featured-card-overlay { padding: 14px; }
          .featured-card-title { font-size: 15px; }
        }
      `}</style>
    </div>
  )
}

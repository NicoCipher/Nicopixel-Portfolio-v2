import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ProjectGalleryLightbox } from '@/components/sections/ProjectGalleryLightbox'

const BASE_URL = 'https://nicopixel.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects').select('title, description, cover_image, seo_title, seo_description, category, is_case_study, client_name, results')
    .eq('slug', slug).eq('published', true).single()

  if (!project) return { title: 'Project Not Found' }

  const title = project.seo_title || `${project.title} — Nicopixel`
  const description = project.seo_description || project.description || `${project.category} design project by Nicopixel.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/work/${slug}`,
      images: project.cover_image ? [{ url: project.cover_image, width: 1200, height: 630 }] : [],
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `${BASE_URL}/work/${slug}` },
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project } = await supabase
    .from('projects').select('*')
    .eq('slug', slug).eq('published', true)
    .single()

  if (!project) notFound()

  const { data: related } = await supabase
    .from('projects').select('id, title, slug, cover_image, category')
    .eq('published', true).eq('category', project.category)
    .neq('id', project.id).limit(3)

  // JSON-LD for this specific project
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.cover_image,
    url: `${BASE_URL}/work/${slug}`,
    creator: { '@type': 'Person', name: 'Taiwo Olumide', url: BASE_URL },
    genre: project.category,
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/8', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
        {project.cover_image
          ? <Image src={project.cover_image} alt={project.title} fill style={{ objectFit: 'cover' }} priority />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 80, fontStyle: 'italic', color: 'var(--fg-subtle)' }}>{project.category}</span>
            </div>
        }
      </div>

      {/* Meta */}
      <div className="proj-meta">
        <Link href="/work" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>← Back to Work</Link>
        <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>{project.category}</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 400, lineHeight: 1.1, marginBottom: 24 }}>{project.title}</h1>
        {project.description && (
          <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--fg-muted)', maxWidth: 600 }}>{project.description}</p>
        )}
      </div>

      {/* Case Study Breakdown */}
      {project.is_case_study && (project.brief || project.challenge || project.approach || project.outcome) && (
        <div className="case-study-section">
          <div className="case-study-meta-row">
            {project.client_name && (
              <div className="cs-meta-item">
                <span className="cs-meta-label">Client</span>
                <span className="cs-meta-value">{project.client_name}</span>
              </div>
            )}
            {project.industry && (
              <div className="cs-meta-item">
                <span className="cs-meta-label">Industry</span>
                <span className="cs-meta-value">{project.industry}</span>
              </div>
            )}
            <div className="cs-meta-item">
              <span className="cs-meta-label">Services</span>
              <span className="cs-meta-value" style={{ textTransform: 'capitalize' }}>{project.category}</span>
            </div>
          </div>

          <div className="case-study-grid">
            {project.brief && (
              <div className="cs-block">
                <span className="cs-block-num">01</span>
                <h3 className="cs-block-title">The Brief</h3>
                <p className="cs-block-text">{project.brief}</p>
              </div>
            )}
            {project.challenge && (
              <div className="cs-block">
                <span className="cs-block-num">02</span>
                <h3 className="cs-block-title">The Challenge</h3>
                <p className="cs-block-text">{project.challenge}</p>
              </div>
            )}
            {project.approach && (
              <div className="cs-block">
                <span className="cs-block-num">03</span>
                <h3 className="cs-block-title">The Approach</h3>
                <p className="cs-block-text">{project.approach}</p>
              </div>
            )}
            {project.outcome && (
              <div className="cs-block">
                <span className="cs-block-num">04</span>
                <h3 className="cs-block-title">The Outcome</h3>
                <p className="cs-block-text">{project.outcome}</p>
              </div>
            )}
          </div>

          {project.results && (
            <div className="cs-results">
              <span className="cs-results-label">Results</span>
              <p className="cs-results-text">{project.results}</p>
            </div>
          )}
        </div>
      )}
      {project.images && project.images.length > 0 && (
        <div className="proj-gallery">
          <ProjectGalleryLightbox images={project.images} title={project.title} />
        </div>
      )}

      {/* Related */}
      {related && related.length > 0 && (
        <div className="proj-related">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 400, marginBottom: 32, textTransform: 'capitalize' }}>
            More {project.category} work
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {related.map((p: typeof project) => (
              <Link key={p.id} href={`/work/${p.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  {p.cover_image && <Image src={p.cover_image} alt={p.title} fill style={{ objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20 }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 400, color: 'white', margin: 0 }}>{p.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .proj-meta { padding: 60px 48px; border-bottom: 1px solid var(--border); }

        .case-study-section { border-bottom: 1px solid var(--border); padding: 56px 48px 64px; background: var(--bg-secondary); }
        .case-study-meta-row { display: flex; gap: 48px; margin-bottom: 48px; flex-wrap: wrap; }
        .cs-meta-item { display: flex; flex-direction: column; gap: 5px; }
        .cs-meta-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--fg-subtle); }
        .cs-meta-value { font-size: 15px; font-weight: 600; color: var(--fg); font-family: var(--font-heading); }
        .case-study-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; border-top: 1px solid var(--border); }
        .cs-block { padding: 40px 40px 40px 0; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .cs-block:nth-child(2n) { border-right: none; padding-right: 0; padding-left: 40px; }
        .cs-block:nth-child(3), .cs-block:nth-child(4) { border-bottom: none; }
        .cs-block-num { display: block; font-family: var(--font-heading); font-size: 11px; color: var(--accent); letter-spacing: 0.18em; margin-bottom: 14px; }
        .cs-block-title { font-family: var(--font-heading); font-size: 20px; font-weight: 400; color: var(--fg); margin-bottom: 12px; }
        .cs-block-text { font-size: 14px; line-height: 1.85; color: var(--fg-muted); }
        .cs-results { margin-top: 40px; padding: 28px 32px; background: var(--accent); display: flex; flex-direction: column; gap: 8px; }
        .cs-results-label { font-size: 9px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255,255,255,0.7); }
        .cs-results-text { font-family: var(--font-heading); font-size: 18px; font-style: italic; color: white; line-height: 1.5; }

        .proj-gallery { padding: 48px 48px; border-bottom: 1px solid var(--border); }
        .proj-gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .proj-related { padding: 60px 48px; }
        @media(max-width: 767px) {
          .proj-meta { padding: 40px 20px; }
          .case-study-section { padding: 40px 20px 48px; }
          .case-study-meta-row { gap: 28px; margin-bottom: 36px; }
          .case-study-grid { grid-template-columns: 1fr; }
          .cs-block { border-right: none !important; padding-left: 0 !important; padding-right: 0 !important; }
          .cs-block:nth-child(3), .cs-block:nth-child(4) { border-bottom: 1px solid var(--border); }
          .cs-block:last-child { border-bottom: none !important; }
          .cs-results { padding: 22px 24px; }
          .proj-gallery { padding: 24px 20px; }
          .proj-gallery-grid { grid-template-columns: 1fr; }
          .proj-gallery-grid > div { grid-column: span 1 !important; aspect-ratio: 4/3 !important; }
          .proj-related { padding: 40px 20px; }
          .proj-related div[style*="repeat(3"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </article>
  )
}

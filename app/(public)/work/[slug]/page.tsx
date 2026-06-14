import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

const BASE_URL = 'https://nicopixel.vercel.app'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects').select('title, description, cover_image, seo_title, seo_description, category')
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

      {/* Gallery */}
      {project.images && project.images.length > 0 && (
        <div className="proj-gallery">
          <div className="proj-gallery-grid">
            {project.images.map((img: string, i: number) => (
              <div key={i} style={{
                position: 'relative', overflow: 'hidden',
                aspectRatio: i === 0 ? '16/9' : '4/3',
                gridColumn: i === 0 ? 'span 2' : 'span 1',
                background: 'var(--bg-secondary)',
              }}>
                <Image src={img} alt={`${project.title} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
              </div>
            ))}
          </div>
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
        .proj-gallery { padding: 48px 48px; border-bottom: 1px solid var(--border); }
        .proj-gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .proj-related { padding: 60px 48px; }
        @media(max-width: 767px) {
          .proj-meta { padding: 40px 20px; }
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

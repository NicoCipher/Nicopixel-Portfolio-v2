import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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

  return (
    <article>
      {/* Hero image */}
      <div style={{
        position: 'relative', width: '100%',
        aspectRatio: '16/8', background: 'var(--bg-secondary)',
        overflow: 'hidden',
      }}>
        {project.cover_image
          ? <Image src={project.cover_image} alt={project.title} fill style={{ objectFit: 'cover' }} priority />
          : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: 80, fontStyle: 'italic', color: 'var(--fg-subtle)' }}>{project.category}</span>
            </div>
        }
      </div>

      {/* Meta */}
      <div style={{
        padding: '60px 48px',
        borderBottom: '1px solid var(--border)',
        display: 'grid', gridTemplateColumns: '1fr auto',
        gap: 48, alignItems: 'start',
      }}>
        <div>
          <Link href="/work" style={{
            fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--fg-muted)', textDecoration: 'none', display: 'inline-block', marginBottom: 20,
          }}>← Back to Work</Link>
          <span style={{
            display: 'block', fontSize: 9, letterSpacing: '0.24em',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12,
          }}>{project.category}</span>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px, 5vw, 64px)',
            fontWeight: 400, lineHeight: 1.1, marginBottom: 24,
          }}>{project.title}</h1>
          {project.description && (
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--fg-muted)', maxWidth: 600 }}>
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Image gallery */}
      {project.images && project.images.length > 0 && (
        <div style={{ padding: '48px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
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
        <div style={{ padding: '60px 48px', borderTop: '1px solid var(--border)' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: 28,
            fontWeight: 400, marginBottom: 32,
          }}>More {project.category} work</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {related.map((p: typeof project) => (
              <Link key={p.id} href={`/work/${p.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                  {p.cover_image && <Image src={p.cover_image} alt={p.title} fill style={{ objectFit: 'cover' }} />}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20 }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 400, color: 'white' }}>{p.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <style>{`@media(max-width:767px){ article div[style*="padding: 60px 48px"], article div[style*="padding: 48px 48px"] { padding: 40px 24px !important; } article div[style*="gridTemplateColumns: repeat(3"] { grid-template-columns: 1fr 1fr !important; } article div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; } }`}</style>
    </article>
  )
}

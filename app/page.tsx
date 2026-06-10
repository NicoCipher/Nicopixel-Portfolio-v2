import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: projects } = await supabase
    .from('projects').select('*')
    .eq('published', true).eq('featured', true)
    .order('sort_order', { ascending: true }).limit(4)

  const { data: settingsRows } = await supabase.from('site_settings').select('key, value')
  const settings: Record<string, string | null> = {}
  settingsRows?.forEach((r: { key: string; value: string | null }) => { settings[r.key] = r.value })

  return (
    <>
      <section style={{
        minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', padding: '80px 48px',
        borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
      }}>
        <span style={{
          position: 'absolute', top: '50%', right: 48, transform: 'translateY(-50%)',
          fontFamily: 'var(--font-heading)', fontSize: 'clamp(200px, 28vw, 380px)',
          fontWeight: 700, fontStyle: 'italic', color: 'var(--border)',
          lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
        }}>N</span>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'var(--accent)', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ display: 'inline-block', width: 32, height: 1, background: 'var(--accent)' }} />
            Lagos, Nigeria · Available
          </p>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(52px, 8vw, 120px)',
            fontWeight: 400, lineHeight: 0.95,
            letterSpacing: '-0.02em', marginBottom: 40,
          }}>
            {settings.hero_title || 'Nicopixel'}<br />
            <em style={{ color: 'var(--fg-muted)' }}>{settings.hero_subtitle || 'Graphic Designer'}</em>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <Link href="/work" style={{
              display: 'inline-block', padding: '14px 36px',
              background: 'var(--fg)', color: 'var(--bg)',
              fontSize: 11, fontWeight: 600, letterSpacing: '0.14em',
              textTransform: 'uppercase', textDecoration: 'none',
            }}>View Work</Link>
            <Link href="/contact" style={{
              fontSize: 11, fontWeight: 500, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--fg-muted)', textDecoration: 'none',
            }}>Get In Touch →</Link>
          </div>
        </div>
      </section>

      {projects && projects.length > 0 && (
        <section style={{ padding: '80px 48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 400 }}>Selected Work</h2>
            <Link href="/work" style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--fg-muted)', textDecoration: 'none' }}>All Projects →</Link>
          </div>
          {projects[0] && (
            <Link href={`/work/${projects[0].slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 2 }}>
              <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/7', background: 'var(--bg-secondary)' }}>
                {projects[0].cover_image
                  ? <Image src={projects[0].cover_image} alt={projects[0].title} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 80, fontStyle: 'italic', color: 'var(--fg-subtle)' }}>{projects[0].category}</span>
                    </div>
                }
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 40,
                }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>{projects[0].category}</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 400, color: 'white' }}>{projects[0].title}</h3>
                </div>
              </div>
            </Link>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginTop: 2 }}>
            {(projects as Project[]).slice(1).map((project) => (
              <Link key={project.id} href={`/work/${project.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--bg-secondary)' }}>
                  {project.cover_image
                    ? <Image src={project.cover_image} alt={project.title} fill style={{ objectFit: 'cover' }} />
                    : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 32, fontStyle: 'italic', color: 'var(--fg-subtle)' }}>{project.category}</span>
                      </div>
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 20 }}>
                    <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{project.category}</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 400, color: 'white' }}>{project.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', padding: '16px 0' }}>
        <div style={{ display: 'flex', animation: 'marquee 18s linear infinite', whiteSpace: 'nowrap' }}>
          {Array(12).fill(['Brand Identity', 'Events Design', 'Print']).flat().map((item: string, i: number) => (
            <span key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontStyle: 'italic', color: 'var(--fg-subtle)', padding: '0 32px', display: 'inline-flex', alignItems: 'center', gap: 32 }}>
              {item}<span style={{ color: 'var(--accent)', fontSize: 5 }}>●</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media(max-width:767px){ section { padding: 60px 24px !important; } }
      `}</style>
    </>
  )
}

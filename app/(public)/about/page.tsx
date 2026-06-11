import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'About — Nicopixel' }

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: about } = await supabase.from('about_content').select('*').single()

  return (
    <section style={{ padding: '80px 48px', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <p style={{
          fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--accent)', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
          About
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 80, alignItems: 'start', marginTop: 60,
        }}>
          {/* Left — image */}
          <div>
            <div style={{
              position: 'relative', aspectRatio: '3/4',
              background: 'var(--bg-secondary)', overflow: 'hidden',
            }}>
              {about?.profile_image
                ? <Image src={about.profile_image} alt="Nicopixel" fill style={{ objectFit: 'cover' }} />
                : <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-heading)', fontSize: 96,
                      fontStyle: 'italic', color: 'var(--fg-subtle)',
                    }}>N</span>
                  </div>
              }
            </div>
          </div>

          {/* Right — text */}
          <div style={{ paddingTop: 8 }}>
            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(36px, 4vw, 56px)',
              fontWeight: 400, lineHeight: 1.05,
              marginBottom: 32,
            }}>
              {about?.headline || 'Design that earns attention.'}
            </h1>

            {about?.subheadline && (
              <p style={{
                fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
                color: 'var(--accent)', marginBottom: 28,
              }}>{about.subheadline}</p>
            )}

            <p style={{
              fontSize: 16, lineHeight: 1.9,
              color: 'var(--fg-muted)', marginBottom: 40,
            }}>
              {about?.bio || 'Lagos-based graphic designer crafting brand identities, event visuals, and print collateral that make people stop and look twice.'}
            </p>

            {/* Tools */}
            {about?.tools && about.tools.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <p style={{
                  fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
                  color: 'var(--fg-subtle)', marginBottom: 16,
                }}>Tools</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {about.tools.map((tool: string) => (
                    <span key={tool} style={{
                      padding: '6px 16px',
                      border: '1px solid var(--border)',
                      fontSize: 11, letterSpacing: '0.08em',
                      color: 'var(--fg-muted)',
                    }}>{tool}</span>
                  ))}
                </div>
              </div>
            )}

            <Link href="/contact" style={{
              display: 'inline-block', padding: '14px 36px',
              background: 'var(--fg)', color: 'var(--bg)',
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Work With Me
            </Link>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:767px){ section { padding: 60px 24px !important; } div[style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 40px !important; } }`}</style>
    </section>
  )
}

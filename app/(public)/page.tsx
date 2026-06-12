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
      {/* HERO */}
      <section className="hero-section">
        <span className="hero-bg-letter">N</span>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p className="hero-eyebrow">
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
            Lagos, Nigeria · Available
          </p>
          <h1 className="hero-title">
            {settings.hero_title || 'Nicopixel'}<br />
            <em style={{ color: 'var(--fg-muted)' }}>{settings.hero_subtitle || 'Graphic Designer'}</em>
          </h1>
          <div className="hero-cta">
            <Link href="/work" className="btn-primary">View Work</Link>
            <Link href="/contact" className="btn-ghost">Get In Touch →</Link>
          </div>
        </div>
      </section>

      {/* FEATURED WORK */}
      {projects && projects.length > 0 && (
        <section className="featured-section">
          <div className="featured-header">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(24px, 4vw, 48px)', fontWeight: 400 }}>
              Selected Work
            </h2>
            <Link href="/work" className="link-muted">All Projects →</Link>
          </div>

          {/* Hero project */}
          {projects[0] && (
            <Link href={`/work/${projects[0].slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 2 }}>
              <div className="hero-project" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                {projects[0].cover_image
                  ? <Image src={projects[0].cover_image} alt={projects[0].title} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 60, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{projects[0].category}</span>
                    </div>
                }
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(20px, 4vw, 40px)',
                }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block' }}>{projects[0].category}</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(20px, 3vw, 40px)', fontWeight: 400, color: 'white', margin: 0 }}>{projects[0].title}</h3>
                </div>
              </div>
            </Link>
          )}

          {/* Sub grid */}
          <div className="projects-subgrid">
            {(projects as Project[]).slice(1).map((project) => (
              <Link key={project.id} href={`/work/${project.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div className="sub-card" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                  {project.cover_image
                    ? <Image src={project.cover_image} alt={project.title} fill style={{ objectFit: 'cover' }} />
                    : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{project.category}</span>
                      </div>
                  }
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 20px',
                  }}>
                    <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>{project.category}</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 15, fontWeight: 400, color: 'white', margin: 0 }}>{project.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* MARQUEE */}
      <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', padding: '14px 0' }}>
        <div style={{ display: 'flex', animation: 'marquee 18s linear infinite', whiteSpace: 'nowrap' }}>
          {Array(12).fill(['Brand Identity', 'Events Design', 'Print']).flat().map((item: string, i: number) => (
            <span key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontStyle: 'italic', color: 'var(--fg-subtle)', padding: '0 28px', display: 'inline-flex', alignItems: 'center', gap: 28 }}>
              {item}<span style={{ color: 'var(--accent)', fontSize: 5 }}>●</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        .hero-section {
          min-height: calc(100vh - 64px);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 80px 48px;
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .hero-bg-letter {
          position: absolute; top: 50%; right: 40px; transform: translateY(-50%);
          font-family: var(--font-heading); font-style: italic; font-weight: 700;
          font-size: clamp(160px, 28vw, 380px);
          color: var(--border); line-height: 1;
          user-select: none; pointer-events: none;
        }
        .hero-eyebrow {
          font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 20px;
          display: flex; align-items: center; gap: 12px;
        }
        .hero-title {
          font-family: var(--font-heading);
          font-size: clamp(44px, 8vw, 120px);
          font-weight: 400; line-height: 0.95;
          letter-spacing: -0.02em; margin-bottom: 36px;
        }
        .hero-cta { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }

        .btn-primary {
          display: inline-block; padding: 14px 32px;
          background: var(--fg); color: var(--bg);
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; text-decoration: none;
          transition: background 0.2s;
        }
        .btn-primary:hover { background: var(--accent); }

        .btn-ghost {
          font-size: 11px; font-weight: 500; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--fg-muted); text-decoration: none;
          transition: color 0.2s;
        }
        .btn-ghost:hover { color: var(--accent); }

        .link-muted {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--fg-muted); text-decoration: none; transition: color 0.2s;
        }
        .link-muted:hover { color: var(--fg); }

        .featured-section { padding: 60px 48px; }
        .featured-header {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-bottom: 32px;
        }

        .hero-project { aspect-ratio: 16/7; }

        .projects-subgrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px; margin-top: 2px;
        }
        .sub-card { aspect-ratio: 4/3; }

        @media(max-width: 767px) {
          .hero-section { padding: 60px 20px 48px; min-height: calc(100svh - 64px); }
          .hero-bg-letter { right: -20px; opacity: 0.5; }
          .hero-title { margin-bottom: 28px; }
          .btn-primary { padding: 14px 28px; }
          .featured-section { padding: 40px 20px; }
          .hero-project { aspect-ratio: 4/3; }
          .projects-subgrid { grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
          .sub-card { aspect-ratio: 1/1; border-radius: 4px; }
        }
      `}</style>
    </>
  )
}

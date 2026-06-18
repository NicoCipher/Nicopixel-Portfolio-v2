import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'
import { AnimatedStat } from '@/components/ui/AnimatedStat'

export default async function HomePage() {
  const supabase = await createClient()

  const [
    { data: projects },
    { data: settingsRows },
    { data: services },
    { data: whyItems },
    { data: testimonials },
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('published', true).eq('featured', true).order('sort_order').limit(10),
    supabase.from('site_settings').select('key, value'),
    supabase.from('services').select('*').eq('active', true).order('sort_order'),
    supabase.from('why_items').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').eq('active', true).order('sort_order'),
  ])

  const s: Record<string, string> = {}
  settingsRows?.forEach((r: { key: string; value: string | null }) => { s[r.key] = r.value ?? '' })

  const stats = [
    { num: s.hero_stat_1_num || '4+', label: s.hero_stat_1_label || 'Years' },
    { num: s.hero_stat_2_num || '80+', label: s.hero_stat_2_label || 'Projects' },
    { num: s.hero_stat_3_num || '40+', label: s.hero_stat_3_label || 'Clients' },
  ]

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-section">
        <span className="hero-bg-letter">N</span>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <p className="hero-eyebrow">
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
            {s.hero_eyebrow || 'Brand · Events · Print · Lagos, Nigeria'}
          </p>
          <h1 className="hero-title">
            {s.hero_title || 'Nicopixel'}<br />
            <em>{s.hero_subtitle || 'Graphic Designer'}</em>
          </h1>
          <p className="hero-sub">{s.hero_sub || 'Graphic designer specialising in brand identity, events design, and print collateral.'}</p>
          <div className="hero-cta">
            <Link href="/contact" className="btn-accent">Start a Project →</Link>
            <Link href="/work" className="btn-ghost">See My Work</Link>
          </div>
          <div className="hero-stats">
            {stats.map((stat, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                {i > 0 && <div className="h-stat-divider" />}
                <div className="h-stat">
                  <AnimatedStat value={stat.num} label={stat.label} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      {services && services.length > 0 && (
        <section className="services-section">
          <div className="services-label">What I Do</div>
          <div className="services-grid">
            {services.map((svc: { id: string; num: string; title: string; description: string | null; deliverables: string[] }) => (
              <div key={svc.id} className="service-card">
                <span className="service-num">{svc.num}</span>
                <h3 className="service-title">{svc.title}</h3>
                <p className="service-desc">{svc.description}</p>
                {svc.deliverables?.length > 0 && (
                  <ul className="service-list">
                    {svc.deliverables.map((d: string) => (
                      <li key={d}><span style={{ color: 'var(--accent)', marginRight: 8 }}>—</span>{d}</li>
                    ))}
                  </ul>
                )}
                <Link href="/contact" className="service-cta">Get a quote →</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FEATURED WORK ── */}
      {projects && projects.length > 0 && (
        <section className="featured-section">
          <div className="featured-header">
            <div>
              <p className="section-eyebrow">Selected Work</p>
              <h2 className="section-title">Recent Projects</h2>
            </div>
            <Link href="/work" className="link-muted">View All →</Link>
          </div>
          {projects[0] && (
            <Link href={`/work/${projects[0].slug}`} style={{ display: 'block', textDecoration: 'none', marginBottom: 2 }}>
              <div className="hero-project" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                {projects[0].cover_image
                  ? <Image src={projects[0].cover_image} alt={`${projects[0].title} — ${projects[0].category} design by Nicopixel, Lagos`} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'var(--font-heading)', fontSize: 60, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{projects[0].category}</span></div>
                }
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(20px, 4vw, 40px)' }}>
                  <span style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block' }}>{projects[0].category}</span>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(22px, 3vw, 42px)', fontWeight: 400, color: 'white', margin: 0 }}>{projects[0].title}</h3>
                </div>
              </div>
            </Link>
          )}
          <div className="projects-subgrid">
            {(projects as Project[]).slice(1).map((project) => (
              <Link key={project.id} href={`/work/${project.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                <div className="sub-card" style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                  {project.cover_image
                    ? <Image src={project.cover_image} alt={`${project.title} — ${project.category} design by Nicopixel`} fill style={{ objectFit: 'cover' }} />
                    : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{project.category}</span></div>
                  }
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 20px' }}>
                    <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>{project.category}</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 400, color: 'white', margin: 0 }}>{project.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── MID CTA STRIP ── */}
      <section className="cta-strip">
        <div className="cta-strip-inner">
          <h2 className="cta-strip-title">{s.cta_strip_title || 'Got a project in mind?'}</h2>
          <p className="cta-strip-sub">{s.cta_strip_sub || 'Brand identity, event design, or print collateral — let\'s talk about what you need.'}</p>
          <div className="cta-strip-btns">
            <Link href="/contact" className="cta-strip-btn">Start a Project →</Link>
            <Link href="/contact?mode=call" className="cta-strip-btn-ghost">Book a Free Call</Link>
          </div>
        </div>
      </section>

      {/* ── WHY NICOPIXEL ── */}
      {whyItems && whyItems.length > 0 && (
        <section className="why-section">
          <div className="why-header">
            <p className="section-eyebrow">Why Nicopixel</p>
            <h2 className="why-headline">
              {s.why_title || 'Design that works'}<br />
              <em>{s.why_subtitle || 'as hard as you do.'}</em>
            </h2>
          </div>
          <div className="why-grid">
            {whyItems.map((w: { id: string; title: string; description: string | null }, i: number) => (
              <div key={w.id} className="why-card">
                <div className="why-card-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="why-card-body">
                  <h4 className="why-card-title">{w.title}</h4>
                  <p className="why-card-desc">{w.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="why-cta-row">
            <Link href="/contact" className="btn-accent">Start a Project →</Link>
            <span className="why-cta-note">No commitments. Just a conversation.</span>
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {testimonials && testimonials.length > 0 && (
        <section className="testimonials-section">
          <div className="testimonials-inner">
            <div className="testimonials-label">
              <p className="section-eyebrow">Client Results</p>
              <h2 className="testimonials-headline">Words from<br /><em>the work.</em></h2>
            </div>
            <div className="testimonials-list">
              {testimonials.map((t: { id: string; quote: string; name: string; role: string | null }, i: number) => (
                <div key={t.id} className={`testimonial-item ${i === 0 ? 'testimonial-featured' : ''}`}>
                  <div className="testimonial-quote-wrap">
                    <span className="tq-mark">&ldquo;</span>
                    <p className="tq-text">{t.quote}</p>
                  </div>
                  <div className="tq-author">
                    <div className="tq-avatar">{t.name.charAt(0)}</div>
                    <div>
                      <span className="tq-name">{t.name}</span>
                      {t.role && <span className="tq-role">{t.role}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: '1px solid var(--border)', overflow: 'hidden', padding: '14px 0' }}>
        <div style={{ display: 'flex', animation: 'marquee 18s linear infinite', whiteSpace: 'nowrap' }}>
          {Array(12).fill(['Brand Identity', 'Events Design', 'Print Collateral']).flat().map((item: string, i: number) => (
            <span key={i} style={{ fontFamily: 'var(--font-heading)', fontSize: 13, fontStyle: 'italic', color: 'var(--fg-subtle)', padding: '0 28px', display: 'inline-flex', alignItems: 'center', gap: 28 }}>
              {item}<span style={{ color: 'var(--accent)', fontSize: 5 }}>●</span>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .hero-section { min-height: calc(100svh - 64px); display: flex; flex-direction: column; justify-content: flex-end; padding: 80px 48px 64px; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
        .hero-bg-letter { position: absolute; bottom: -60px; right: -20px; font-family: var(--font-heading); font-style: italic; font-weight: 700; font-size: clamp(200px, 35vw, 500px); color: var(--border); line-height: 1; user-select: none; pointer-events: none; }
        .hero-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 24px; display: flex; align-items: center; gap: 12px; }
        .hero-title { font-family: var(--font-heading); font-size: clamp(42px, 7vw, 108px); font-weight: 400; line-height: 1.0; letter-spacing: -0.02em; margin-bottom: 24px; }
        .hero-title em { color: var(--accent); font-style: italic; }
        .hero-sub { font-size: clamp(14px, 1.5vw, 16px); line-height: 1.8; color: var(--fg-muted); max-width: 520px; margin-bottom: 40px; }
        .hero-cta { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 48px; }
        .hero-stats { display: flex; align-items: center; gap: 0; }
        .h-stat { display: flex; flex-direction: column; gap: 2px; }
        .h-stat-num { font-family: var(--font-heading); font-size: 28px; font-weight: 400; color: var(--fg); line-height: 1; }
        .h-stat-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-subtle); }
        .h-stat-divider { width: 1px; height: 32px; background: var(--border); margin: 0 24px; }
        .btn-accent { display: inline-block; padding: 14px 32px; background: var(--accent); color: white; font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s, transform 0.2s; }
        .btn-accent:hover { background: #a01830; transform: translateY(-1px); }
        .btn-primary { display: inline-block; padding: 14px 32px; background: var(--fg); color: var(--bg); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s; }
        .btn-primary:hover { background: var(--accent); }
        .btn-ghost { font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-muted); text-decoration: none; transition: color 0.2s; border-bottom: 1px solid var(--border); padding-bottom: 2px; }
        .btn-ghost:hover { color: var(--fg); border-color: var(--fg); }
        .link-muted { font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-muted); text-decoration: none; transition: color 0.2s; }
        .link-muted:hover { color: var(--fg); }
        .services-section { padding: 80px 48px; border-bottom: 1px solid var(--border); }
        .services-label { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 48px; display: flex; align-items: center; gap: 12px; }
        .services-label::before { content: ''; display: inline-block; width: 20px; height: 1px; background: var(--accent); }
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        .service-card { padding: 40px 36px 40px 0; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 16px; }
        .service-card:last-child { border-right: none; padding-right: 0; }
        .service-card:not(:first-child) { padding-left: 36px; }
        .service-num { font-family: var(--font-heading); font-size: 11px; color: var(--accent); letter-spacing: 0.16em; }
        .service-title { font-family: var(--font-heading); font-size: 22px; font-weight: 400; color: var(--fg); line-height: 1.2; }
        .service-desc { font-size: 14px; line-height: 1.8; color: var(--fg-muted); flex: 1; }
        .service-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .service-list li { font-size: 12px; color: var(--fg-muted); display: flex; align-items: center; }
        .service-cta { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); text-decoration: none; font-weight: 600; transition: letter-spacing 0.2s; margin-top: 4px; }
        .service-cta:hover { letter-spacing: 0.18em; }
        .featured-section { padding: 80px 48px; border-bottom: 1px solid var(--border); }
        .featured-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .section-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
        .section-eyebrow::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--accent); }
        .section-title { font-family: var(--font-heading); font-size: clamp(28px, 4vw, 48px); font-weight: 400; }
        .section-title em { font-style: italic; color: var(--accent); }
        .hero-project { aspect-ratio: 16/7; }
        .projects-subgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 2px; } .projects-subgrid .sub-card-wrap:nth-child(3n+1):last-child { grid-column: span 3; }
        .sub-card { aspect-ratio: 4/3; }
        .cta-strip { background: var(--accent); padding: 72px 48px; }
        .cta-strip-inner { max-width: 700px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .cta-strip-title { font-family: var(--font-heading); font-size: clamp(28px, 4vw, 52px); font-weight: 400; color: white; }
        .cta-strip-sub { font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.7; }
        .cta-strip-btns { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
        .cta-strip-btn { display: inline-block; padding: 14px 36px; background: white; color: var(--accent); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s; }
        .cta-strip-btn:hover { background: rgba(255,255,255,0.9); }
        .cta-strip-btn-ghost { display: inline-block; padding: 14px 28px; border: 1px solid rgba(255,255,255,0.4); color: white; font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: border-color 0.2s, background 0.2s; }
        .cta-strip-btn-ghost:hover { border-color: white; background: rgba(255,255,255,0.1); }
        /* ── WHY ── */
        .why-section { border-bottom: 1px solid var(--border); overflow: hidden; }
        .why-header { padding: 80px 48px 0; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid var(--border); padding-bottom: 48px; }
        .why-headline { font-family: var(--font-heading); font-size: clamp(36px, 5vw, 72px); font-weight: 400; line-height: 1.0; }
        .why-headline em { font-style: italic; color: var(--accent); }
        .why-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
        .why-card {
          padding: 48px;
          border-right: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 20px;
          position: relative; overflow: hidden;
          transition: background 0.3s;
        }
        .why-card:nth-child(even) { border-right: none; }
        .why-card:nth-last-child(-n+2) { border-bottom: none; }
        .why-card:hover { background: var(--bg-secondary); }
        .why-card-num {
          font-family: var(--font-heading);
          font-size: 80px; font-weight: 400; font-style: italic;
          color: var(--border); line-height: 1;
          position: absolute; top: -10px; right: 24px;
          transition: color 0.3s;
          user-select: none;
        }
        .why-card:hover .why-card-num { color: var(--accent); opacity: 0.15; }
        .why-card-body { position: relative; z-index: 1; }
        .why-card-title { font-family: var(--font-heading); font-size: 20px; font-weight: 400; color: var(--fg); margin-bottom: 10px; line-height: 1.3; }
        .why-card-desc { font-size: 14px; line-height: 1.8; color: var(--fg-muted); }
        .why-cta-row { padding: 40px 48px; display: flex; align-items: center; gap: 24px; background: var(--bg-secondary); }
        .why-cta-note { font-size: 12px; color: var(--fg-subtle); letter-spacing: 0.06em; font-style: italic; }

        /* ── TESTIMONIALS ── */
        .testimonials-section { background: var(--test-bg); border-bottom: 1px solid var(--border); transition: background 0.3s; }
        .testimonials-inner { display: grid; grid-template-columns: 280px 1fr; gap: 0; }
        .testimonials-label { padding: 64px 48px; border-right: 1px solid var(--test-label-border); display: flex; flex-direction: column; justify-content: flex-end; gap: 16px; background: var(--test-bg); }
        .testimonials-label .section-eyebrow { color: var(--accent); }
        .testimonials-label .section-eyebrow::before { background: var(--accent); }
        .testimonials-headline { font-family: var(--font-heading); font-size: clamp(28px, 3vw, 44px); font-weight: 400; color: var(--test-heading); line-height: 1.1; }
        .testimonials-headline em { font-style: italic; color: var(--test-heading-em); }
        .testimonials-list { display: flex; flex-direction: column; gap: 0; }
        .testimonial-item { padding: 40px 48px; border-bottom: 1px solid var(--test-border); display: flex; flex-direction: column; gap: 20px; transition: background 0.3s; background: var(--test-bg); }
        .testimonial-item:last-child { border-bottom: none; }
        .testimonial-item:hover { background: var(--test-bg-hover); }
        .testimonial-featured { padding: 48px; }
        .testimonial-quote-wrap { display: flex; flex-direction: column; gap: 8px; }
        .tq-mark { font-family: var(--font-heading); font-size: 36px; color: var(--accent); line-height: 0.8; opacity: 0.6; }
        .tq-text { font-family: var(--font-heading); font-size: clamp(14px, 1.5vw, 18px); font-style: italic; font-weight: 400; line-height: 1.6; color: var(--test-text); }
        .testimonial-featured .tq-text { font-size: clamp(16px, 2vw, 22px); color: var(--test-text-featured); }
        .tq-author { display: flex; align-items: center; gap: 14px; }
        .tq-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 16px; color: white; flex-shrink: 0; }
        .tq-name { display: block; font-size: 13px; font-weight: 600; color: var(--test-name); margin-bottom: 2px; }
        .tq-role { display: block; font-size: 11px; color: var(--test-role); letter-spacing: 0.06em; }
        @media(max-width: 900px) {
          .services-grid { grid-template-columns: 1fr; }
          .service-card { padding: 32px 0 !important; border-right: none !important; border-bottom: 1px solid var(--border); }
          .service-card:last-child { border-bottom: none; }
          .why-inner { grid-template-columns: 1fr; gap: 48px; }
          .testimonials-grid { grid-template-columns: 1fr 1fr; }
        }
        @media(max-width: 767px) {
          .hero-section { padding: 24px 20px 48px; min-height: calc(100svh - 64px); }
          .hero-bg-letter { opacity: 0.3; }
          .services-section, .featured-section, .cta-strip { padding: 56px 20px; }
          .why-header { padding: 48px 20px !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .why-card { padding: 32px 20px !important; border-right: none !important; }
          .why-card:nth-last-child(-n+2) { border-bottom: 1px solid var(--border) !important; }
          .why-card:last-child { border-bottom: none !important; }
          .why-cta-row { padding: 32px 20px !important; flex-direction: column; align-items: flex-start; gap: 12px; }
          .testimonials-inner { grid-template-columns: 1fr !important; }
          .testimonials-label { padding: 48px 20px 32px !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); }
          .testimonial-item { padding: 32px 20px !important; }
          .testimonial-featured { padding: 36px 20px !important; }
          .hero-project { aspect-ratio: 4/3; }
          .projects-subgrid { grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
          .sub-card { aspect-ratio: 1/1; border-radius: 4px; }
          .featured-header { flex-direction: column; align-items: flex-start; gap: 12px; }
          .testimonials-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  )
}

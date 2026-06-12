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
      {/* ── HERO ── */}
      <section className="hero-section">
        <span className="hero-bg-letter">N</span>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
          <p className="hero-eyebrow">
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
            Brand · Events · Print · Lagos, Nigeria
          </p>
          <h1 className="hero-title">
            I make your<br />
            <em>brand impossible</em><br />
            to ignore.
          </h1>
          <p className="hero-sub">
            Graphic designer specialising in brand identity, events design, and print collateral. Whether you&apos;re launching, rebranding, or showing up at an event — I make sure you look the part.
          </p>
          <div className="hero-cta">
            <Link href="/contact" className="btn-accent">Start a Project →</Link>
            <Link href="/work" className="btn-ghost">See My Work</Link>
          </div>
          <div className="hero-stats">
            <div className="h-stat"><span className="h-stat-num">4+</span><span className="h-stat-label">Years</span></div>
            <div className="h-stat-divider" />
            <div className="h-stat"><span className="h-stat-num">80+</span><span className="h-stat-label">Projects</span></div>
            <div className="h-stat-divider" />
            <div className="h-stat"><span className="h-stat-num">40+</span><span className="h-stat-label">Clients</span></div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="services-section">
        <div className="services-label">What I Do</div>
        <div className="services-grid">
          {[
            {
              num: '01', title: 'Brand Identity',
              desc: 'Logo, colour system, typography, brand guidelines. Everything a business needs to look consistent and credible.',
              deliverables: ['Logo suite', 'Brand guidelines', 'Stationery design', 'Social kit'],
            },
            {
              num: '02', title: 'Events Design',
              desc: 'From invitation to signage — cohesive event visuals that set the tone before guests even arrive.',
              deliverables: ['Invitation suite', 'Event programmes', 'Banners & signage', 'Social assets'],
            },
            {
              num: '03', title: 'Print & Collateral',
              desc: 'Flyers, brochures, packaging, editorial layouts — print design that stands out on the shelf and in the hand.',
              deliverables: ['Flyers & brochures', 'Packaging design', 'Magazine layouts', 'Business stationery'],
            },
          ].map(s => (
            <div key={s.num} className="service-card">
              <span className="service-num">{s.num}</span>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <ul className="service-list">
                {s.deliverables.map(d => (
                  <li key={d}><span style={{ color: 'var(--accent)', marginRight: 8 }}>—</span>{d}</li>
                ))}
              </ul>
              <Link href="/contact" className="service-cta">Get a quote →</Link>
            </div>
          ))}
        </div>
      </section>

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
                  ? <Image src={projects[0].cover_image} alt={projects[0].title} fill style={{ objectFit: 'cover' }} />
                  : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 60, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{projects[0].category}</span>
                    </div>
                }
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: 'clamp(20px, 4vw, 40px)',
                }}>
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
                    ? <Image src={project.cover_image} alt={project.title} fill style={{ objectFit: 'cover' }} />
                    : <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontStyle: 'italic', color: 'var(--fg-subtle)', textTransform: 'capitalize' }}>{project.category}</span>
                      </div>
                  }
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px 20px',
                  }}>
                    <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 4 }}>{project.category}</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 400, color: 'white', margin: 0 }}>{project.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── MID-PAGE CTA ── */}
      <section className="cta-strip">
        <div className="cta-strip-inner">
          <h2 className="cta-strip-title">Got a project in mind?</h2>
          <p className="cta-strip-sub">Brand identity, event design, or print collateral — let&apos;s talk about what you need.</p>
          <Link href="/contact" className="btn-accent">Start a Project →</Link>
        </div>
      </section>

      {/* ── WHY NICOPIXEL ── */}
      <section className="why-section">
        <div className="why-inner">
          <div className="why-left">
            <p className="section-eyebrow">Why Nicopixel</p>
            <h2 className="section-title">Design that works<br /><em>as hard as you do.</em></h2>
            <Link href="/contact" className="btn-primary" style={{ marginTop: 32, display: 'inline-block' }}>Let&apos;s Work Together</Link>
          </div>
          <div className="why-right">
            {[
              { title: 'You get a designer, not a template', desc: 'Every project is built from scratch around your brand, not recycled from a Canva library.' },
              { title: 'Fast turnaround, no excuses', desc: 'Deadlines are respected. You\'ll always know where your project stands.' },
              { title: 'Clear communication', desc: 'No design jargon. Just honest conversation about what works and why.' },
              { title: 'Results-focused', desc: 'Good design isn\'t just pretty — it builds trust, attracts clients, and grows businesses.' },
            ].map((w, i) => (
              <div key={i} className="why-item">
                <span className="why-num">0{i + 1}</span>
                <div>
                  <h4 className="why-title">{w.title}</h4>
                  <p className="why-desc">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <p className="section-eyebrow" style={{ textAlign: 'center', marginBottom: 48 }}>What Clients Say</p>
        <div className="testimonials-grid">
          {[
            { quote: 'Taiwo delivered exactly what we needed — a brand identity that felt premium without the premium price tag. Would work with Nicopixel again without hesitation.', name: 'Client Name', role: 'Founder, Brand Co.' },
            { quote: 'The event materials were stunning. Every guest asked who designed them. Professional, timely, and genuinely talented.', name: 'Client Name', role: 'Event Organiser' },
            { quote: 'Our packaging went from looking generic to shelf-ready. Sales picked up within weeks of the redesign. Real results.', name: 'Client Name', role: 'Product Brand Owner' },
          ].map((t, i) => (
            <div key={i} className="testimonial-card">
              <span className="testimonial-quote-mark">&ldquo;</span>
              <p className="testimonial-text">{t.quote}</p>
              <div className="testimonial-author">
                <span className="testimonial-name">{t.name}</span>
                <span className="testimonial-role">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

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

        /* HERO */
        .hero-section {
          min-height: calc(100svh - 64px);
          display: flex; flex-direction: column; justify-content: flex-end;
          padding: 80px 48px 64px;
          border-bottom: 1px solid var(--border);
          position: relative; overflow: hidden;
        }
        .hero-bg-letter {
          position: absolute; bottom: -60px; right: -20px;
          font-family: var(--font-heading); font-style: italic; font-weight: 700;
          font-size: clamp(200px, 35vw, 500px);
          color: var(--border); line-height: 1;
          user-select: none; pointer-events: none;
        }
        .hero-eyebrow {
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 24px;
          display: flex; align-items: center; gap: 12px;
        }
        .hero-title {
          font-family: var(--font-heading);
          font-size: clamp(42px, 7vw, 108px);
          font-weight: 400; line-height: 1.0;
          letter-spacing: -0.02em; margin-bottom: 24px;
        }
        .hero-title em { color: var(--accent); font-style: italic; }
        .hero-sub {
          font-size: clamp(14px, 1.5vw, 16px);
          line-height: 1.8; color: var(--fg-muted);
          max-width: 520px; margin-bottom: 40px;
        }
        .hero-cta { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-bottom: 48px; }
        .hero-stats { display: flex; align-items: center; gap: 24px; }
        .h-stat { display: flex; flex-direction: column; gap: 2px; }
        .h-stat-num { font-family: var(--font-heading); font-size: 28px; font-weight: 400; color: var(--fg); line-height: 1; }
        .h-stat-label { font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-subtle); }
        .h-stat-divider { width: 1px; height: 32px; background: var(--border); }

        /* BUTTONS */
        .btn-accent {
          display: inline-block; padding: 14px 32px;
          background: var(--accent); color: white;
          font-size: 11px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; text-decoration: none;
          transition: background 0.2s, transform 0.2s;
        }
        .btn-accent:hover { background: #a01830; transform: translateY(-1px); }
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
          transition: color 0.2s; border-bottom: 1px solid var(--border); padding-bottom: 2px;
        }
        .btn-ghost:hover { color: var(--fg); border-color: var(--fg); }
        .link-muted {
          font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--fg-muted); text-decoration: none; transition: color 0.2s;
        }
        .link-muted:hover { color: var(--fg); }

        /* SERVICES */
        .services-section { padding: 80px 48px; border-bottom: 1px solid var(--border); }
        .services-label {
          font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
          color: var(--accent); margin-bottom: 48px;
          display: flex; align-items: center; gap: 12px;
        }
        .services-label::before { content: ''; display: inline-block; width: 20px; height: 1px; background: var(--accent); }
        .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        .service-card {
          padding: 40px 36px 40px 0;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column; gap: 16px;
        }
        .service-card:last-child { border-right: none; padding-right: 0; }
        .service-card:not(:first-child) { padding-left: 36px; }
        .service-num { font-family: var(--font-heading); font-size: 11px; color: var(--accent); letter-spacing: 0.16em; }
        .service-title { font-family: var(--font-heading); font-size: 22px; font-weight: 400; color: var(--fg); line-height: 1.2; }
        .service-desc { font-size: 14px; line-height: 1.8; color: var(--fg-muted); flex: 1; }
        .service-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
        .service-list li { font-size: 12px; color: var(--fg-muted); display: flex; align-items: center; }
        .service-cta { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); text-decoration: none; font-weight: 600; transition: letter-spacing 0.2s; margin-top: 4px; }
        .service-cta:hover { letter-spacing: 0.18em; }

        /* FEATURED */
        .featured-section { padding: 80px 48px; border-bottom: 1px solid var(--border); }
        .featured-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .section-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 8px; display: flex; align-items: center; gap: 10px; }
        .section-eyebrow::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--accent); }
        .section-title { font-family: var(--font-heading); font-size: clamp(28px, 4vw, 48px); font-weight: 400; }
        .section-title em { font-style: italic; color: var(--accent); }
        .hero-project { aspect-ratio: 16/7; }
        .projects-subgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 2px; }
        .sub-card { aspect-ratio: 4/3; }

        /* MID CTA STRIP */
        .cta-strip { background: var(--accent); padding: 72px 48px; }
        .cta-strip-inner { max-width: 700px; margin: 0 auto; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .cta-strip-title { font-family: var(--font-heading); font-size: clamp(28px, 4vw, 52px); font-weight: 400; color: white; }
        .cta-strip-sub { font-size: 15px; color: rgba(255,255,255,0.75); line-height: 1.7; }
        .cta-strip .btn-accent { background: white; color: var(--accent); }
        .cta-strip .btn-accent:hover { background: rgba(255,255,255,0.9); }

        /* WHY */
        .why-section { padding: 80px 48px; border-bottom: 1px solid var(--border); }
        .why-inner { display: grid; grid-template-columns: 1fr 1.6fr; gap: 80px; align-items: start; }
        .why-right { display: flex; flex-direction: column; gap: 0; }
        .why-item { display: flex; gap: 24px; padding: 28px 0; border-bottom: 1px solid var(--border); }
        .why-item:first-child { padding-top: 0; }
        .why-item:last-child { border-bottom: none; }
        .why-num { font-family: var(--font-heading); font-size: 13px; color: var(--accent); letter-spacing: 0.12em; flex-shrink: 0; padding-top: 4px; }
        .why-title { font-family: var(--font-heading); font-size: 17px; font-weight: 400; color: var(--fg); margin-bottom: 6px; }
        .why-desc { font-size: 13px; line-height: 1.75; color: var(--fg-muted); }

        /* TESTIMONIALS */
        .testimonials-section { padding: 80px 48px; border-bottom: 1px solid var(--border); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .testimonial-card { background: var(--bg-secondary); padding: 36px 32px; display: flex; flex-direction: column; gap: 20px; }
        .testimonial-quote-mark { font-family: var(--font-heading); font-size: 48px; color: var(--accent); line-height: 0.8; opacity: 0.5; }
        .testimonial-text { font-size: 14px; line-height: 1.8; color: var(--fg-muted); flex: 1; font-style: italic; }
        .testimonial-author { display: flex; flex-direction: column; gap: 2px; padding-top: 8px; border-top: 1px solid var(--border); }
        .testimonial-name { font-size: 13px; font-weight: 600; color: var(--fg); }
        .testimonial-role { font-size: 11px; color: var(--fg-subtle); letter-spacing: 0.06em; }

        /* RESPONSIVE */
        @media(max-width: 900px) {
          .services-grid { grid-template-columns: 1fr; }
          .service-card { padding: 32px 0 !important; border-right: none !important; border-bottom: 1px solid var(--border); }
          .service-card:last-child { border-bottom: none; }
          .why-inner { grid-template-columns: 1fr; gap: 48px; }
          .testimonials-grid { grid-template-columns: 1fr; gap: 2px; }
        }

        @media(max-width: 767px) {
          .hero-section { padding: 60px 20px 48px; }
          .hero-bg-letter { opacity: 0.3; }
          .hero-stats { gap: 16px; }
          .services-section { padding: 56px 20px; }
          .featured-section { padding: 56px 20px; }
          .hero-project { aspect-ratio: 4/3; }
          .projects-subgrid { grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
          .sub-card { aspect-ratio: 1/1; border-radius: 4px; }
          .cta-strip { padding: 56px 20px; }
          .why-section { padding: 56px 20px; }
          .testimonials-section { padding: 56px 20px; }
          .testimonials-grid { grid-template-columns: 1fr; }
          .featured-header { flex-direction: column; align-items: flex-start; gap: 12px; }
        }
      `}</style>
    </>
  )
}

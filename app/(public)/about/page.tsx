import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedStat } from '@/components/ui/AnimatedStat'

export const metadata = { title: 'About — Nicopixel' }

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: about } = await supabase.from('about_content').select('*').single()
  const { data: settingsRows } = await supabase.from('site_settings').select('key, value')
  const settings: Record<string, string> = {}
  settingsRows?.forEach((r: { key: string; value: string | null }) => { settings[r.key] = r.value ?? '' })

  // Stats pulled from site_settings — same source as homepage so they always match
  const stats = [
    { num: settings.hero_stat_1_num || '4+', label: settings.hero_stat_1_label || 'Years of practice' },
    { num: settings.hero_stat_2_num || '80+', label: settings.hero_stat_2_label || 'Projects delivered' },
    { num: settings.hero_stat_3_num || '40+', label: settings.hero_stat_3_label || 'Clients served' },
    { num: '3', label: 'Core disciplines' },
  ]

  const disciplines = [
    { num: '01', title: about?.discipline_1_title || 'Brand Identity', desc: about?.discipline_1_desc || 'Logos, visual systems, brand guidelines, and the full identity toolkit — built to last and scale.' },
    { num: '02', title: about?.discipline_2_title || 'Events Design', desc: about?.discipline_2_desc || 'Invitation suites, programmes, signage, and everything in between. Every touchpoint considered.' },
    { num: '03', title: about?.discipline_3_title || 'Print & Editorial', desc: about?.discipline_3_desc || 'Packaging, magazines, brochures, and collateral. Design that holds up in the physical world.' },
  ]

  return (
    <>
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-hero-text">
            <p className="about-eyebrow">
              <span className="about-eyebrow-line" />About
            </p>
            <h1 className="about-title">{about?.headline || 'Design that\nearns attention.'}</h1>
          </div>
          <div className="about-hero-image">
            {about?.profile_image
              ? <Image src={about.profile_image} alt="Nicopixel" fill style={{ objectFit: 'cover', objectPosition: 'top' }} priority />
              : <div className="about-image-placeholder"><span>N</span></div>
            }
          </div>
        </div>
      </section>

      <section className="about-intro">
        <div className="about-intro-inner">
          <div className="about-quote">
            <span className="about-quote-mark">&ldquo;</span>
            <p>{about?.pull_quote || 'Every brand has a story worth telling well. I make sure it gets told.'}</p>
          </div>
          <div className="about-bio">
            <p>{about?.bio || 'Lagos-based graphic designer crafting brand identities, event visuals, and print collateral that make people stop and look twice.'}</p>
            <div className="about-meta">
              <span>{settings.contact_location || 'Lagos, Nigeria'}</span>
              <span className="about-meta-dot">·</span>
              <span>Available for projects</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        {stats.map(s => (
          <div key={s.label} className="about-stat">
            <AnimatedStat value={s.num} label={s.label} numClass="about-stat-num" labelClass="about-stat-label" />
          </div>
        ))}
      </section>

      <section className="about-disciplines">
        <div className="about-disciplines-inner">
          <p className="about-section-label">What I do</p>
          <div className="about-disciplines-grid">
            {disciplines.map(d => (
              <div key={d.num} className="about-discipline">
                <span className="about-discipline-num">{d.num}</span>
                <h3 className="about-discipline-title">{d.title}</h3>
                <p className="about-discipline-desc">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {about?.tools && about.tools.length > 0 && (
        <section className="about-tools">
          <div className="about-tools-inner">
            <p className="about-section-label">Tools</p>
            <div className="about-tools-list">
              {about.tools.map((tool: string) => (
                <span key={tool} className="about-tool">{tool}</span>
              ))}
            </div>
          </div>
        </section>
      )}



      <style>{`
        .about-hero { border-bottom: 1px solid var(--border); overflow: hidden; }
        .about-hero-inner { display: grid; grid-template-columns: 1fr 420px; min-height: 80vh; }
        .about-hero-text { padding: 100px 60px 80px 48px; display: flex; flex-direction: column; justify-content: flex-end; border-right: 1px solid var(--border); }
        .about-eyebrow { display: flex; align-items: center; gap: 12px; font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 32px; }
        .about-eyebrow-line { display: inline-block; width: 24px; height: 1px; background: var(--accent); }
        .about-title { font-family: var(--font-heading); font-size: clamp(42px, 6vw, 88px); font-weight: 400; line-height: 1.0; letter-spacing: -0.02em; white-space: pre-line; }
        .about-hero-image { position: relative; background: var(--bg-secondary); min-height: 500px; }
        .about-image-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .about-image-placeholder span { font-family: var(--font-heading); font-size: 180px; font-style: italic; color: var(--border); line-height: 1; user-select: none; }
        .about-intro { border-bottom: 1px solid var(--border); }
        .about-intro-inner { display: grid; grid-template-columns: 1fr 1fr; }
        .about-quote { padding: 72px 60px 72px 48px; border-right: 1px solid var(--border); display: flex; flex-direction: column; justify-content: center; }
        .about-quote-mark { font-family: var(--font-heading); font-size: 120px; line-height: 0.6; color: var(--accent); display: block; margin-bottom: 20px; opacity: 0.4; }
        .about-quote p { font-family: var(--font-heading); font-size: clamp(22px, 3vw, 36px); font-weight: 400; font-style: italic; line-height: 1.3; color: var(--fg); }
        .about-bio { padding: 72px 48px 72px 60px; display: flex; flex-direction: column; justify-content: center; gap: 24px; }
        .about-bio p { font-size: 16px; line-height: 1.9; color: var(--fg-muted); }
        .about-meta { display: flex; align-items: center; gap: 12px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-subtle); }
        .about-meta-dot { color: var(--accent); }
        .about-stats { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--border); }
        .about-stat { padding: 48px 40px; border-right: 1px solid var(--border); display: flex; flex-direction: column; gap: 8px; }
        .about-stat:last-child { border-right: none; }
        .about-stat-num { font-family: var(--font-heading); font-size: clamp(40px, 5vw, 64px); font-weight: 400; line-height: 1; color: var(--fg); }
        .about-stat-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--fg-subtle); }
        .about-disciplines { border-bottom: 1px solid var(--border); }
        .about-disciplines-inner { padding: 72px 48px; }
        .about-section-label { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent); margin-bottom: 48px; display: flex; align-items: center; gap: 12px; }
        .about-section-label::before { content: ''; display: inline-block; width: 20px; height: 1px; background: var(--accent); }
        .about-disciplines-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
        .about-discipline { padding: 40px 40px 40px 0; border-right: 1px solid var(--border); }
        .about-discipline:last-child { border-right: none; padding-right: 0; }
        .about-discipline:not(:first-child) { padding-left: 40px; }
        .about-discipline-num { font-family: var(--font-heading); font-size: 11px; color: var(--accent); letter-spacing: 0.16em; display: block; margin-bottom: 16px; }
        .about-discipline-title { font-family: var(--font-heading); font-size: 22px; font-weight: 400; color: var(--fg); margin-bottom: 12px; line-height: 1.2; }
        .about-discipline-desc { font-size: 14px; line-height: 1.8; color: var(--fg-muted); }
        .about-tools { border-bottom: 1px solid var(--border); }
        .about-tools-inner { padding: 60px 48px; }
        .about-tools-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .about-tool { padding: 8px 20px; border: 1px solid var(--border); font-size: 12px; letter-spacing: 0.08em; color: var(--fg-muted); transition: border-color 0.2s, color 0.2s; }
        .about-tool:hover { border-color: var(--fg); color: var(--fg); }

        @media (max-width: 900px) {
          .about-hero-inner { grid-template-columns: 1fr; min-height: auto; }
          .about-hero-text { padding: 80px 24px 48px; border-right: none; border-bottom: 1px solid var(--border); }
          .about-hero-image { min-height: 380px; }
          .about-intro-inner { grid-template-columns: 1fr; }
          .about-quote { padding: 52px 24px; border-right: none; border-bottom: 1px solid var(--border); }
          .about-quote-mark { font-size: 80px; }
          .about-bio { padding: 48px 24px; }
          .about-stats { grid-template-columns: 1fr 1fr; }
          .about-stat { padding: 36px 24px; }
          .about-stat:nth-child(2) { border-right: none; }
          .about-stat:nth-child(3) { border-top: 1px solid var(--border); }
          .about-stat:nth-child(4) { border-top: 1px solid var(--border); border-right: none; }
          .about-disciplines-inner { padding: 52px 24px; }
          .about-disciplines-grid { grid-template-columns: 1fr; }
          .about-discipline { padding: 32px 0 !important; border-right: none !important; border-bottom: 1px solid var(--border); }
          .about-discipline:last-child { border-bottom: none; }
          .about-tools-inner { padding: 48px 24px; }
        }
      `}</style>
    </>
  )
}

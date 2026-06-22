'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Footer({ settings }: { settings?: Record<string, string | null> }) {
  const year = new Date().getFullYear()
  const pathname = usePathname()
  const hideCTA = pathname === '/contact'

  const ALL_SOCIALS = [
    { key: 'behance', label: 'Behance' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'linkedin', label: 'LinkedIn' },
    { key: 'twitter', label: 'Twitter / X' },
  ]
  const socials = ALL_SOCIALS
    .filter(s => {
      const url = settings?.[s.key]
      const enabled = settings?.[`${s.key}_enabled`]
      // A saved URL with no explicit enabled flag yet defaults to shown
      // (keeps existing configured links working after this update).
      return !!url && enabled !== 'false'
    })
    .map(s => ({ label: s.label, href: settings?.[s.key] as string }))

  return (
    <footer>
      {/* Footer CTA — hidden on contact page */}
      {!hideCTA && (
        <div className="footer-cta">
          <div className="footer-cta-inner">
            <h2 className="footer-cta-title">Ready to start?</h2>
            <p className="footer-cta-sub">Brand identity · Events design · Print collateral</p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link href="/contact" className="footer-cta-btn-primary">Start a Project</Link>
              <Link href="/work" className="footer-cta-btn-ghost">View Work →</Link>
            </div>
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <div className="footer-bar">
        <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: 'var(--fg-muted)', textDecoration: 'none' }}>
          © {year} Nicopixel
        </Link>
        <div className="footer-bar-right">
          <div className="footer-legal-links">
            <Link href="/privacy-policy" className="footer-link" style={{ fontSize: 11, letterSpacing: '0.06em', color: 'var(--fg-subtle)', textDecoration: 'none', transition: 'color 0.2s' }}>Privacy Policy</Link>
            <Link href="/terms-of-service" className="footer-link" style={{ fontSize: 11, letterSpacing: '0.06em', color: 'var(--fg-subtle)', textDecoration: 'none', transition: 'color 0.2s' }}>Terms of Service</Link>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="footer-link"
                style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', textDecoration: 'none', transition: 'color 0.2s' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-bar-right { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }
        .footer-legal-links { display: flex; gap: 16px; flex-wrap: wrap; }
        .footer-cta { background: var(--bg-secondary); border-top: 1px solid var(--border); padding: 72px 48px; text-align: center; }
        .footer-cta-inner { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .footer-cta-title { font-family: var(--font-heading); font-size: clamp(28px, 4vw, 52px); font-weight: 400; }
        .footer-cta-sub { font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-subtle); }
        .footer-cta-btn-primary { display: inline-block; padding: 14px 32px; background: var(--fg); color: var(--bg); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; text-decoration: none; transition: background 0.2s; }
        .footer-cta-btn-primary:hover { background: var(--accent); }
        .footer-cta-btn-ghost { display: inline-block; padding: 14px 24px; border: 1px solid var(--border); font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--fg-muted); text-decoration: none; transition: border-color 0.2s, color 0.2s; }
        .footer-cta-btn-ghost:hover { border-color: var(--fg); color: var(--fg); }
        .footer-bar { border-top: 1px solid var(--border); padding: 28px 48px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
        .footer-link:hover { color: var(--accent) !important; }
        @media(max-width: 767px) {
          .footer-cta { padding: 52px 20px; }
          .footer-bar { padding: 24px 20px; flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  )
}

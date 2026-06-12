'use client'
import Link from 'next/link'

export function Footer({ settings }: { settings?: Record<string, string | null> }) {
  const year = new Date().getFullYear()
  const socials = [
    { label: 'Behance', href: settings?.behance || '#' },
    { label: 'Instagram', href: settings?.instagram || '#' },
    { label: 'LinkedIn', href: settings?.linkedin || '#' },
  ].filter(s => s.href !== '#')

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '40px 48px',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', flexWrap: 'wrap', gap: 24,
      }}>
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)', fontSize: 14,
          color: 'var(--fg-muted)', textDecoration: 'none',
        }}>
          © {year} Nicopixel
        </Link>

        {socials.length > 0 && (
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {socials.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="footer-link"
                style={{
                  fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--fg-muted)', textDecoration: 'none', transition: 'color 0.2s',
                }}>
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .footer-link:hover { color: var(--accent) !important; }
        @media(max-width: 767px) {
          footer { padding: 32px 20px !important; }
          footer > div { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>
    </footer>
  )
}

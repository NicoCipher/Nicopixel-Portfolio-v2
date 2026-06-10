'use client'
import Link from 'next/link'

export function Footer({ settings }: { settings?: Record<string, string | null> }) {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '40px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 20,
    }}>
      <Link href="/" style={{ fontFamily: 'var(--font-heading)', fontSize: 14, color: 'var(--fg-muted)', textDecoration: 'none' }}>
        © {year} Nicopixel
      </Link>
      <div style={{ display: 'flex', gap: 24 }}>
        {[
          { label: 'Behance', href: settings?.behance || '#' },
          { label: 'Instagram', href: settings?.instagram || '#' },
          { label: 'LinkedIn', href: settings?.linkedin || '#' },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
            className="footer-link"
            style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--fg-muted)', textDecoration: 'none' }}
          >
            {s.label}
          </a>
        ))}
      </div>
      <style>{`
        .footer-link:hover { color: var(--accent) !important; }
        @media(max-width:767px){ footer { padding: 32px 24px !important; } }
      `}</style>
    </footer>
  )
}

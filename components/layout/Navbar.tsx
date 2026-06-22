'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const links = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/services', label: 'Services' },
  { href: '/blog', label: 'Insights' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navbar({ settings }: { settings?: Record<string, string | null> }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { const t = setTimeout(() => setMenuOpen(false), 0); return () => clearTimeout(t) }, [pathname])

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled || menuOpen ? 'var(--bg)' : 'transparent',
        borderBottom: scrolled || menuOpen ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 101 }}>
          {settings?.logo_url
            ? <div style={{ position: 'relative', height: 32, width: 120 }}>
                <Image src={settings.logo_url} alt="Nicopixel" fill style={{ objectFit: 'contain', objectPosition: 'left' }} />
              </div>
            : <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600, color: 'var(--fg)', letterSpacing: '0.02em' }}>Nicopixel</span>
          }
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="nav-desktop">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: 11, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: pathname === l.href ? 'var(--fg)' : 'var(--fg-muted)',
              textDecoration: 'none',
              borderBottom: pathname === l.href ? '1px solid var(--accent)' : '1px solid transparent',
              paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s',
              whiteSpace: 'nowrap',
            }}>{l.label}</Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }} className="nav-mobile">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-burger"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`burger-line burger-line-1 ${menuOpen ? 'burger-open' : ''}`} />
            <span className={`burger-line burger-line-2 ${menuOpen ? 'burger-open' : ''}`} />
            <span className={`burger-line burger-line-3 ${menuOpen ? 'burger-open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`nav-backdrop ${menuOpen ? 'nav-backdrop-open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile menu drawer */}
      <div className={`nav-drawer ${menuOpen ? 'nav-drawer-open' : ''}`}>
        <div className="nav-drawer-links">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-drawer-link"
              style={{
                color: pathname === l.href ? 'var(--accent)' : 'var(--fg)',
                transitionDelay: menuOpen ? `${i * 0.04 + 0.1}s` : '0s',
              }}
            >
              <span className="nav-drawer-link-num">{String(i + 1).padStart(2, '0')}</span>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="nav-drawer-footer" style={{ transitionDelay: menuOpen ? `${links.length * 0.04 + 0.15}s` : '0s' }}>
          <div className="nav-drawer-divider" />
          <div className="nav-drawer-socials">
            {[
              { key: 'behance', label: 'Behance' },
              { key: 'instagram', label: 'Instagram' },
              { key: 'tiktok', label: 'TikTok' },
              { key: 'linkedin', label: 'LinkedIn' },
              { key: 'twitter', label: 'Twitter / X' },
            ]
              .filter(s => {
                const url = settings?.[s.key]
                const enabled = settings?.[`${s.key}_enabled`]
                return !!url && enabled !== 'false'
              })
              .map(s => (
                <a key={s.key} href={settings?.[s.key] as string} target="_blank" rel="noopener noreferrer" className="nav-drawer-social">{s.label}</a>
              ))}
          </div>
          <span className="nav-drawer-location">Lagos, Nigeria · Available for projects</span>
        </div>
      </div>

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }

        .nav-burger {
          position: relative; z-index: 101;
          width: 28px; height: 28px;
          background: none; border: none; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 5px; padding: 0;
        }
        .burger-line {
          display: block; width: 18px; height: 1.5px;
          background: var(--fg);
          border-radius: 1px;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .burger-line-1.burger-open { transform: translateY(6.5px) rotate(45deg); }
        .burger-line-2.burger-open { opacity: 0; }
        .burger-line-3.burger-open { transform: translateY(-6.5px) rotate(-45deg); }

        .nav-backdrop {
          position: fixed; inset: 0; z-index: 98;
          background: rgba(0,0,0,0.4);
          opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
          backdrop-filter: blur(2px);
        }
        .nav-backdrop-open { opacity: 1; pointer-events: auto; }

        .nav-drawer {
          position: fixed; top: 0; right: 0; bottom: 0; z-index: 99;
          width: min(100%, 420px);
          background: var(--bg);
          border-left: 1px solid var(--border);
          padding: 100px 40px 40px;
          display: flex; flex-direction: column; justify-content: space-between;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          overflow-y: auto;
        }
        .nav-drawer-open { transform: translateX(0); }

        .nav-drawer-links { display: flex; flex-direction: column; gap: 2px; }
        .nav-drawer-link {
          display: flex; align-items: baseline; gap: 16px;
          padding: 16px 0;
          font-family: var(--font-heading);
          font-size: clamp(24px, 6vw, 32px);
          font-weight: 400;
          text-decoration: none;
          border-bottom: 1px solid var(--border);
          opacity: 0; transform: translateX(16px);
          transition: opacity 0.4s ease, transform 0.4s ease, color 0.2s;
        }
        .nav-drawer-open .nav-drawer-link { opacity: 1; transform: translateX(0); }
        .nav-drawer-link-num {
          font-size: 11px; font-family: var(--font-body);
          color: var(--fg-subtle); letter-spacing: 0.1em;
          flex-shrink: 0;
        }

        .nav-drawer-footer {
          display: flex; flex-direction: column; gap: 20px;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .nav-drawer-open .nav-drawer-footer { opacity: 1; transform: translateY(0); }
        .nav-drawer-divider { height: 1px; background: var(--border); }
        .nav-drawer-socials { display: flex; gap: 20px; flex-wrap: wrap; }
        .nav-drawer-social {
          font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--fg-muted); text-decoration: none;
          transition: color 0.2s;
        }
        .nav-drawer-social:hover { color: var(--accent); }
        .nav-drawer-location {
          font-size: 11px; color: var(--fg-subtle); letter-spacing: 0.02em;
        }

        @media(max-width: 1100px) {
          .nav-desktop { gap: 22px !important; }
        }
        @media(max-width: 950px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          nav { padding: 0 20px !important; }
        }
        @media(max-width: 480px) {
          .nav-drawer { padding: 88px 28px 32px; width: 100%; border-left: none; }
          .nav-drawer-link { font-size: 26px; padding: 14px 0; }
        }
      `}</style>
    </>
  )
}

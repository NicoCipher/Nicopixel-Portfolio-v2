'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const links = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
  { href: '/services', label: 'Services' },
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
        <Link href="/" style={{
          fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 600,
          color: 'var(--fg)', textDecoration: 'none', letterSpacing: '0.02em',
        }}>
          Nicopixel
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="nav-desktop">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              fontSize: 11, fontWeight: 500,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: pathname === l.href ? 'var(--fg)' : 'var(--fg-muted)',
              textDecoration: 'none',
              borderBottom: pathname === l.href ? '1px solid var(--accent)' : '1px solid transparent',
              paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s',
            }}>{l.label}</Link>
          ))}
          <ThemeToggle />
        </div>

        {/* Mobile nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="nav-mobile">
          <ThemeToggle />
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', color: 'var(--fg)',
            padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }} aria-label="Menu">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {menuOpen
                ? <><line x1="3" y1="3" x2="15" y2="15"/><line x1="15" y1="3" x2="3" y2="15"/></>
                : <><line x1="2" y1="5" x2="16" y2="5"/><line x1="2" y1="9" x2="16" y2="9"/><line x1="2" y1="13" x2="16" y2="13"/></>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0,
          background: 'var(--bg)', borderBottom: '1px solid var(--border)',
          padding: '24px 24px 32px', zIndex: 99,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: '14px 0',
              borderBottom: '1px solid var(--border)',
              fontFamily: 'var(--font-heading)',
              fontSize: 24, fontWeight: 400,
              color: pathname === l.href ? 'var(--accent)' : 'var(--fg)',
              textDecoration: 'none',
              display: 'block',
            }}>{l.label}</Link>
          ))}
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex !important; }
        .nav-mobile { display: none !important; }
        @media(max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
          nav { padding: 0 20px !important; }
        }
      `}</style>
    </>
  )
}

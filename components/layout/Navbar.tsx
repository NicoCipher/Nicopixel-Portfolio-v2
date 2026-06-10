'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const links = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Work' },
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

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 48px',
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'var(--bg)' : 'transparent',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'background 0.4s, border-color 0.4s',
    }}>
      {/* Logo */}
      <Link href="/" style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 18, fontWeight: 600,
        color: 'var(--fg)', textDecoration: 'none',
        letterSpacing: '0.02em',
      }}>
        Nicopixel
      </Link>

      {/* Desktop links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="hidden-mobile">
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontSize: 12, fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: pathname === l.href ? 'var(--fg)' : 'var(--fg-muted)',
            textDecoration: 'none',
            borderBottom: pathname === l.href ? '1px solid var(--accent)' : '1px solid transparent',
            paddingBottom: 2,
            transition: 'color 0.2s, border-color 0.2s',
          }}>
            {l.label}
          </Link>
        ))}
        <ThemeToggle />
      </div>

      {/* Mobile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="show-mobile">
        <ThemeToggle />
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: 'var(--fg)', padding: 4 }}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen
              ? <><line x1="4" y1="4" x2="16" y2="16"/><line x1="16" y1="4" x2="4" y2="16"/></>
              : <><line x1="2" y1="6" x2="18" y2="6"/><line x1="2" y1="10" x2="18" y2="10"/><line x1="2" y1="14" x2="18" y2="14"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          padding: '24px 48px',
          display: 'flex', flexDirection: 'column', gap: 20,
        }}>
          {links.map(l => (
            <Link key={l.href} href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 14, fontWeight: 500,
                color: pathname === l.href ? 'var(--accent)' : 'var(--fg)',
                textDecoration: 'none',
              }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) { .hidden-mobile { display: flex !important; } .show-mobile { display: none !important; } }
        @media (max-width: 767px) { .hidden-mobile { display: none !important; } .show-mobile { display: flex !important; } nav { padding: 0 24px !important; } }
      `}</style>
    </nav>
  )
}

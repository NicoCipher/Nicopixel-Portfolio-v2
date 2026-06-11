'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/messages', label: 'Messages' },
  { href: '/admin/about', label: 'About' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/security', label: 'Security' },
]

const sidebarStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column',
  background: '#0A0A0A', height: '100%',
}

function SidebarLinks({ pathname, onClose, onLogout }: { pathname: string; onClose: () => void; onLogout: () => void }) {
  return (
    <div style={sidebarStyle}>
      <div style={{ padding: '28px 24px', borderBottom: '1px solid #1F1F1F' }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: '#FAFAF9' }}>Nicopixel</span>
        <span style={{ display: 'block', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555', marginTop: 4 }}>Admin Panel</span>
      </div>
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {navItems.map(item => {
          const isActive = pathname === item.href || (item.href === '/admin/projects' && pathname.startsWith('/admin/projects'))
          return (
            <Link key={item.href} href={item.href} onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 6,
              fontSize: 13, fontWeight: 500,
              color: isActive ? '#FAFAF9' : '#666',
              background: isActive ? '#1F1F1F' : 'transparent',
              textDecoration: 'none',
              borderLeft: isActive ? '2px solid #C41E3A' : '2px solid transparent',
              transition: 'all 0.2s',
            }}>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '16px 12px', borderTop: '1px solid #1F1F1F', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Link href="/" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 6, fontSize: 13, color: '#555', textDecoration: 'none' }} className="s-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View Site
        </Link>
        <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 6, fontSize: 13, color: '#555', background: 'none', border: 'none', textAlign: 'left', width: '100%', fontFamily: 'inherit' }} className="s-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign Out
        </button>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <>
      {/* Desktop */}
      <aside className="admin-desk" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 240,
        background: '#0A0A0A', borderRight: '1px solid #1F1F1F', zIndex: 50,
      }}>
        <SidebarLinks pathname={pathname} onClose={() => {}} onLogout={handleLogout} />
      </aside>

      {/* Mobile topbar */}
      <div className="admin-mob" style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 56,
        background: '#0A0A0A', borderBottom: '1px solid #1F1F1F',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', zIndex: 50,
      }}>
        <span style={{ fontFamily: 'Georgia, serif', fontSize: 16, fontWeight: 600, color: '#FAFAF9' }}>Nicopixel Admin</span>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#FAFAF9', padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen
              ? <><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 56, left: 0, right: 0, bottom: 0,
          background: '#0A0A0A', zIndex: 49, overflowY: 'auto',
        }}>
          <SidebarLinks pathname={pathname} onClose={() => setMobileOpen(false)} onLogout={handleLogout} />
        </div>
      )}

      <style>{`
        .s-link:hover { color: #FAFAF9 !important; background: #1A1A1A !important; }
        .admin-desk { display: flex !important; }
        .admin-mob { display: none !important; }
        @media(max-width: 900px) {
          .admin-desk { display: none !important; }
          .admin-mob { display: flex !important; }
        }
      `}</style>
    </>
  )
}

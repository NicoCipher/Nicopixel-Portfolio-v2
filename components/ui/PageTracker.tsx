'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

function getVisitorId(): string {
  try {
    let id = localStorage.getItem('np_visitor_id')
    if (!id) {
      id = `v_${Date.now()}_${Math.random().toString(36).slice(2)}`
      localStorage.setItem('np_visitor_id', id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

export function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith('/admin')) return

    const track = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
            visitor_id: getVisitorId(),
          }),
        })
      } catch { /* silent */ }
    }

    const t = setTimeout(track, 2000)
    return () => clearTimeout(t)
  }, [pathname])

  return null
}

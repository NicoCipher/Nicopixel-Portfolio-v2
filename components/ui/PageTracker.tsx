'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin routes
    if (pathname.startsWith('/admin')) return

    const track = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || null,
          }),
        })
      } catch {
        // Silently fail — tracking should never break UX
      }
    }

    // Small delay to avoid counting bots that leave immediately
    const t = setTimeout(track, 2000)
    return () => clearTimeout(t)
  }, [pathname])

  return null
}

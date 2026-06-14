'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const SESSION_KEY = 'np_admin_login_time'
const ACTIVITY_KEY = 'np_admin_last_active'
const TIMEOUT_MS = 30 * 60 * 1000   // 30 min inactivity
const MAX_SESSION_MS = 8 * 60 * 60 * 1000  // 8 hr absolute max

async function forceSignOut(router: ReturnType<typeof useRouter>, reason: string) {
  const supabase = createClient()
  await supabase.auth.signOut()
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(ACTIVITY_KEY)
  router.replace(`/admin/login?reason=${reason}`)
}

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    // Record login time if not already recorded
    if (!localStorage.getItem(SESSION_KEY)) {
      localStorage.setItem(SESSION_KEY, String(Date.now()))
    }

    const checkSession = () => {
      const loginTime = parseInt(localStorage.getItem(SESSION_KEY) || '0')
      const lastActive = parseInt(localStorage.getItem(ACTIVITY_KEY) || String(Date.now()))
      const now = Date.now()

      // Absolute session max (8 hours) — regardless of activity
      if (loginTime && now - loginTime > MAX_SESSION_MS) {
        forceSignOut(router, 'timeout')
        return
      }

      // Inactivity timeout (30 min)
      if (now - lastActive > TIMEOUT_MS) {
        forceSignOut(router, 'timeout')
        return
      }
    }

    // Check immediately on mount — catches returning after long absence
    checkSession()

    // Check every 60 seconds
    timerRef.current = setInterval(checkSession, 60000)

    // Track activity
    const updateActivity = () => {
      localStorage.setItem(ACTIVITY_KEY, String(Date.now()))
    }
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click']
    events.forEach(e => window.addEventListener(e, updateActivity, { passive: true }))
    updateActivity()

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      events.forEach(e => window.removeEventListener(e, updateActivity))
    }
  }, [router])

  return <>{children}</>
}

export function LoginTimeoutBanner() {
  const params = useSearchParams()
  const [show, setShow] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) return
    mounted.current = true
    const t = setTimeout(() => {
      if (params.get('reason') === 'timeout') setShow(true)
    }, 0)
    return () => clearTimeout(t)
  }, [params])

  if (!show) return null

  return (
    <div style={{
      background: '#1A0A0A', border: '1px solid #C41E3A',
      padding: '12px 20px', marginBottom: 24,
      fontSize: 13, color: '#C41E3A',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span>Session expired. Please sign in again.</span>
      <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', color: '#C41E3A', fontSize: 18, cursor: 'pointer' }}>×</button>
    </div>
  )
}

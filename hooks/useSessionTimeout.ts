'use client'
import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes
const WARNING_MS = 25 * 60 * 1000 // warn at 25 minutes

export function useSessionTimeout() {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const warningRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const warningShownRef = useRef(false)

  const resetTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    warningShownRef.current = false

    warningRef.current = setTimeout(() => {
      if (!warningShownRef.current) {
        warningShownRef.current = true
        const extend = window.confirm('Your session will expire in 5 minutes due to inactivity. Click OK to stay signed in.')
        if (extend) resetTimers()
      }
    }, WARNING_MS)

    timeoutRef.current = setTimeout(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login?reason=timeout')
    }, TIMEOUT_MS)
  }, [router])

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    const handleActivity = () => resetTimers()

    events.forEach(e => window.addEventListener(e, handleActivity, { passive: true }))
    resetTimers()

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
    }
  }, [resetTimers])
}

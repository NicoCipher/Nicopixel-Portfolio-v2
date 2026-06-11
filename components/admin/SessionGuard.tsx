'use client'
import { useSessionTimeout } from '@/hooks/useSessionTimeout'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function SessionGuard({ children }: { children: React.ReactNode }) {
  useSessionTimeout()
  return <>{children}</>
}

export function LoginTimeoutBanner() {
  const params = useSearchParams()
  const [show, setShow] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const reason = params.get('reason')
    if (reason === 'timeout') {
      setTimeout(() => setShow(true), 0)
    }
  }, [params])

  if (!show) return null

  return (
    <div style={{
      background: '#1A0A0A', border: '1px solid #C41E3A',
      padding: '12px 20px', marginBottom: 24,
      fontSize: 13, color: '#C41E3A',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span>Session expired due to inactivity. Please sign in again.</span>
      <button onClick={() => setShow(false)} style={{ background: 'none', border: 'none', color: '#C41E3A', fontSize: 18, cursor: 'pointer' }}>×</button>
    </div>
  )
}

'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function ClearSecurityLogsButton() {
  const [open, setOpen] = useState(false)
  const [clearing, setClearing] = useState(false)
  const router = useRouter()

  const handleClear = async (period: '30days' | '90days' | 'all') => {
    const label = period === 'all' ? 'ALL security logs' : `logs older than ${period === '30days' ? '30' : '90'} days`
    if (!confirm(`Clear ${label}? This cannot be undone.`)) return
    setClearing(true)
    const supabase = createClient()

    const now = new Date()
    const cutoffs: Record<string, string | null> = {
      '30days': new Date(now.getTime() - 30 * 86400000).toISOString(),
      '90days': new Date(now.getTime() - 90 * 86400000).toISOString(),
      all: null,
    }
    const cutoff = cutoffs[period]

    if (cutoff) {
      const { error: e1 } = await supabase.from('activity_log').delete().lt('created_at', cutoff)
      const { error: e2 } = await supabase.from('login_attempts').delete().lt('attempted_at', cutoff)
      if (e1 || e2) alert(`Some logs couldn't be cleared: ${e1?.message || e2?.message}`)
    } else {
      const { error: e1 } = await supabase.from('activity_log').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      const { error: e2 } = await supabase.from('login_attempts').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      if (e1 || e2) alert(`Some logs couldn't be cleared: ${e1?.message || e2?.message}`)
    }

    setClearing(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        padding: '10px 20px',
        background: 'transparent',
        border: '1px solid #333',
        color: '#666',
        fontSize: 11, fontWeight: 600,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s, color 0.2s',
        cursor: 'pointer',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C41E3A'; e.currentTarget.style.color = '#C41E3A' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666' }}
      >
        Manage Logs ↓
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 4,
            background: '#0A0A0A', border: '1px solid #2A2A2A',
            zIndex: 50, minWidth: 220,
          }}>
            {[
              { key: '30days', label: 'Clear logs older than 30 days' },
              { key: '90days', label: 'Clear logs older than 90 days' },
              { key: 'all', label: 'Clear everything', danger: true },
            ].map(opt => (
              <button key={opt.key} onClick={() => handleClear(opt.key as '30days' | '90days' | 'all')}
                disabled={clearing}
                style={{
                  display: 'block', width: '100%',
                  padding: '12px 16px',
                  background: 'none', border: 'none',
                  textAlign: 'left', fontSize: 12,
                  color: opt.danger ? '#C41E3A' : '#999',
                  fontFamily: 'inherit',
                  borderBottom: '1px solid #1A1A1A',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#111')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                {clearing ? 'Clearing...' : opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

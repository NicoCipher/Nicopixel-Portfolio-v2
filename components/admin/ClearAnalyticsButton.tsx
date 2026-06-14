'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function ClearAnalyticsButton() {
  const [open, setOpen] = useState(false)
  const [clearing, setClearing] = useState(false)
  const router = useRouter()

  const handleClear = async (period: 'today' | '7days' | '30days' | 'all') => {
    if (!confirm(`Clear ${period === 'all' ? 'ALL' : period} analytics data? This cannot be undone.`)) return
    setClearing(true)
    const supabase = createClient()

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString()

    const cutoffs: Record<string, string | null> = {
      today: todayStart,
      '7days': sevenDaysAgo,
      '30days': thirtyDaysAgo,
      all: null,
    }

    const cutoff = cutoffs[period]
    if (cutoff) {
      await supabase.from('page_views').delete().gte('created_at', cutoff)
    } else {
      await supabase.from('page_views').delete().neq('id', '00000000-0000-0000-0000-000000000000')
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
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C41E3A'; e.currentTarget.style.color = '#C41E3A' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#333'; e.currentTarget.style.color = '#666' }}
      >
        Clear Data ↓
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 4,
            background: '#0A0A0A', border: '1px solid #2A2A2A',
            zIndex: 50, minWidth: 180,
          }}>
            {[
              { key: 'today', label: 'Clear today' },
              { key: '7days', label: 'Clear last 7 days' },
              { key: '30days', label: 'Clear last 30 days' },
              { key: 'all', label: 'Clear everything', danger: true },
            ].map(opt => (
              <button key={opt.key} onClick={() => handleClear(opt.key as 'today' | '7days' | '30days' | 'all')}
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

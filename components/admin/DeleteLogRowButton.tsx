'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function DeleteLogRowButton({ table, id }: { table: 'activity_log' | 'login_attempts'; id: string }) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from(table).delete().eq('id', id)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      aria-label="Delete entry"
      style={{
        background: 'none', border: 'none', color: '#444',
        fontSize: 14, cursor: 'pointer', padding: '0 4px',
        lineHeight: 1, fontFamily: 'inherit', flexShrink: 0,
        transition: 'color 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = '#C41E3A')}
      onMouseLeave={e => (e.currentTarget.style.color = '#444')}
    >
      {deleting ? '…' : '×'}
    </button>
  )
}

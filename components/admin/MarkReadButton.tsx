'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function MarkReadButton({ id }: { id: string }) {
  const router = useRouter()
  const handleMarkRead = async () => {
    const supabase = createClient()
    const { error } = await supabase.from('messages').update({ read: true }).eq('id', id)
    if (error) { alert(`Couldn't update: ${error.message}`); return }
    router.refresh()
  }

  return (
    <button onClick={handleMarkRead} style={{
      fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
      color: '#555', background: 'none', border: '1px solid #333',
      padding: '4px 10px', fontFamily: 'inherit',
      transition: 'color 0.2s, border-color 0.2s',
    }}>
      Mark Read
    </button>
  )
}

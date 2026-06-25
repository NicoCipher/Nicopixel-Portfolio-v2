import { createClient } from '@/lib/supabase/server'
import { MessagesManager } from '@/components/admin/MessagesManager'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('messages').select('*')
    .order('created_at', { ascending: false })

  const unread = messages?.filter(m => !m.read).length ?? 0

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Messages</h1>
        <p style={{ fontSize: 13, color: '#555' }}>
          {unread > 0 ? <span style={{ color: '#C41E3A' }}>{unread} unread</span> : 'All read'} · {messages?.length ?? 0} total
        </p>
      </div>

      <MessagesManager initialMessages={messages ?? []} />

      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } }`}</style>
    </div>
  )
}

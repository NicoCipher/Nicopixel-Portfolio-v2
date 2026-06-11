import { createClient } from '@/lib/supabase/server'
import { MarkReadButton } from '@/components/admin/MarkReadButton'

export default async function MessagesPage() {
  const supabase = await createClient()
  const { data: messages } = await supabase
    .from('messages').select('*')
    .order('created_at', { ascending: false })

  const unread = messages?.filter(m => !m.read).length ?? 0

  return (
    <div style={{ padding: '40px 48px' }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 400, color: '#FAFAF9', marginBottom: 4 }}>Messages</h1>
        <p style={{ fontSize: 13, color: '#555' }}>
          {unread > 0 ? <span style={{ color: '#C41E3A' }}>{unread} unread</span> : 'All read'} · {messages?.length ?? 0} total
        </p>
      </div>

      {!messages?.length ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontStyle: 'italic', color: '#444' }}>No messages yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {messages.map((m: {
            id: string; name: string; email: string;
            subject: string | null; message: string;
            read: boolean; created_at: string
          }) => (
            <div key={m.id} style={{
              background: m.read ? '#0A0A0A' : '#0F0A0A',
              border: `1px solid ${m.read ? '#1F1F1F' : '#2A1A1A'}`,
              padding: '24px',
              marginBottom: 1,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {!m.read && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C41E3A', flexShrink: 0 }} />}
                  <div>
                    <span style={{ fontSize: 15, fontWeight: m.read ? 400 : 600, color: '#FAFAF9' }}>{m.name}</span>
                    <a href={`mailto:${m.email}`} style={{ fontSize: 12, color: '#555', marginLeft: 10, textDecoration: 'none' }}>{m.email}</a>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 11, color: '#444' }}>
                    {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  {!m.read && <MarkReadButton id={m.id} />}
                </div>
              </div>
              {m.subject && (
                <p style={{ fontSize: 12, letterSpacing: '0.06em', color: '#666', marginBottom: 8 }}>{m.subject}</p>
              )}
              <p style={{ fontSize: 14, color: '#999', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{m.message}</p>
            </div>
          ))}
        </div>
      )}
      <style>{`@media(max-width:900px){ div[style*="padding: 40px 48px"] { padding: 24px !important; } }`}</style>
    </div>
  )
}
